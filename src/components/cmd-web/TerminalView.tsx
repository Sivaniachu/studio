
"use client";

import Cursor from "@/components/cmd-web/Cursor";
import TypingText from "@/components/cmd-web/TypingText";
import { useSettings } from "@/context/SettingsContext";
import { useCommand } from "@/context/CommandContext";
import { cn } from "@/lib/utils";
import React, { useState, useEffect, useRef, useCallback } from "react";

const APP_VERSION = "1.0.0.2024";

interface Line {
  id: string;
  content: React.ReactNode | React.ReactNode[];
  type: "input" | "output" | "error" | "info" | "ai-response" | "ai-loading";
}

let lineIdCounter = 0;
const generateLineId = () => `line-${lineIdCounter++}`;

const fetchWithTimeout = (url: string, options: RequestInit, timeout = 15000): Promise<Response> => {
  return Promise.race([
    fetch(url, options),
    new Promise<Response>((_, reject) =>
      setTimeout(() => reject(new Error('Request timed out')), timeout)
    )
  ]);
};

const renderAiResponseContent = (responseText: string, lineKey: string): React.ReactNode[] => {
  const parts = responseText.split(/(```(?:[a-zA-Z0-9_.-]+)?\n[\s\S]*?\n```)/g);
  let partKey = 0;

  return parts.map((part) => {
    partKey++;
    const codeBlockMatch = part.match(/```(?:[a-zA-Z0-9_.-]+)?\n([\s\S]*?)\n```/);
    if (codeBlockMatch && codeBlockMatch[1] !== undefined) {
      const code = codeBlockMatch[1];
      return (
        <pre key={`${lineKey}-code-${partKey}`} className="bg-muted/30 p-3 rounded-md overflow-x-auto my-1 text-sm text-cmd-output block">
          <code>{code}</code>
        </pre>
      );
    } else if (part.trim()) {
      return <TypingText key={`${lineKey}-text-${partKey}`} text={part.trim()} />;
    }
    return null;
  }).filter(Boolean) as React.ReactNode[];
};


export default function TerminalView() {
  const { promptName } = useSettings();
  const { commandToExecute, setCommandToExecute } = useCommand();

  const createInitialLines = useCallback((pName: string) => {
    lineIdCounter = 0;
    return [
      { id: generateLineId(), content: `TermAI [Version ${APP_VERSION}] (Prompt: ${pName})`, type: "info" as const },
      { id: generateLineId(), content: "© TermAI CLI. All rights reserved.", type: "info" as const },
      { id: generateLineId(), content: <>&nbsp;</>, type: "info" as const },
    ];
  }, []);

  const [lines, setLines] = useState<Line[]>(() => createInitialLines(promptName));
  const [currentInput, setCurrentInput] = useState("");
  const [commandHistory, setCommandHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [isGenerating, setIsGenerating] = useState(false);

  const terminalEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setLines(createInitialLines(promptName));
  }, [promptName, createInitialLines]);

  const scrollToBottom = () => {
    terminalEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [lines, currentInput, isGenerating]);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const addLine = useCallback((content: React.ReactNode | React.ReactNode[], type: Line["type"]) => {
    setLines((prevLines) => [...prevLines, { id: generateLineId(), content, type }]);
  }, []);

  const processCommand = useCallback(async (commandStr: string) => {
    const [command, ...args] = commandStr.trim().split(/\s+/);
    const fullArg = args.join(" ");

    const internalCommands: { [key: string]: () => void } = {
      cls: () => setLines(createInitialLines(promptName)),
      echo: () => addLine(fullArg || <>&nbsp;</>, "output"),
      help: () => {
        addLine("Available commands:", "output");
        addLine("  CLS          - Clears the screen.", "output");
        addLine("  ECHO [text]  - Displays messages.", "output");
        addLine("  DATE         - Displays the current date.", "output");
        addLine("  TIME         - Displays the current time.", "output");
        addLine("  VER          - Displays the TermAI version.", "output");
        addLine("  HELP         - Provides Help information for commands.", "output");
        addLine("  EXIT         - Exits TermAI (simulated).", "output");
        addLine("  Any other command will be sent for processing.", "info");
      },
      date: () => addLine(new Date().toDateString(), "output"),
      time: () => addLine(new Date().toLocaleTimeString(), "output"),
      ver: () => addLine(`TermAI [Version ${APP_VERSION}] (Prompt: ${promptName})`, "output"),
      exit: () => addLine("Exiting TermAI... (This is a simulation)", "info"),
    };

    if (command.toLowerCase() in internalCommands) {
      internalCommands[command.toLowerCase()]();
    } else if (commandStr.trim() === "") {
      // Do nothing for empty command
    } else {
      setIsGenerating(true);
      const thinkingLineKey = generateLineId();
      addLine(<TypingText key={thinkingLineKey} text="Processing..." speed={30} />, "ai-loading");

      let successfulResult = false;

      // This promise represents the API call and its immediate processing.
      // It will resolve regardless of success or failure of the API call itself.
      const apiCallPromise = (async () => {
        try {
          const response = await fetchWithTimeout('/api/generate', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ query: commandStr.trim() }),
          }, 15000); // fetchWithTimeout has its own 15s timeout for the fetch operation

          if (response.ok) {
            const result = await response.json();
            if (result.responseText && !result.error) {
              // Only consider it successful if responseText is present and no explicit error
              setLines(prev => prev.filter(l => l.id !== thinkingLineKey)); // Remove "Processing..."
              const renderedContent = renderAiResponseContent(result.responseText, generateLineId());
              addLine(renderedContent, "ai-response");
              successfulResult = true; // Mark as successful
            }
            // If result.responseText is missing or result.error is present, it's not a "successfulResult"
            // The generic "Some error occurred" will be shown after the 15s overall timeout logic.
          }
          // If !response.ok, it's also not a "successfulResult". Error handled by overall timeout.
        } catch (error) {
          // Catch errors from fetchWithTimeout (like its own timeout) or network errors.
          // These are also not "successfulResult". Error handled by overall timeout.
          // console.error("API call error:", error); // Optional: for debugging
        }
      })();

      // This promise ensures "Processing..." is shown for at least 15 seconds,
      // unless apiCallPromise finishes first AND sets successfulResult.
      const overallTimeoutPromise = new Promise<void>(resolve => setTimeout(resolve, 15000));

      // Wait for either the API call to attempt completion or the 15-second overall timeout.
      await Promise.race([apiCallPromise, overallTimeoutPromise]);
      
      // If overallTimeoutPromise resolved (meaning 15s passed) or apiCallPromise resolved without setting successfulResult:
      if (!successfulResult) {
        setLines(prev => prev.filter(l => l.id !== thinkingLineKey)); // Ensure "Processing..." is removed
        const errorLineKey = generateLineId();
        addLine(<TypingText key={errorLineKey} text="Some error occurred" speed={30} />, "error");
      }
      
      setIsGenerating(false);
      inputRef.current?.focus();
    }
  }, [addLine, promptName, createInitialLines]);

  const submitCommand = useCallback(async (commandToProcess: string) => {
    const trimmedCommand = commandToProcess.trim();
    const displayInput = (
      <>
        <span className="text-prompt-gradient">{promptName}</span>
        <span className="text-cmd-prompt">&gt;</span>
        {commandToProcess.replace(/ /g, '\u00A0')}
      </>
    );
    addLine(displayInput, "input");

    await processCommand(trimmedCommand);

    if (trimmedCommand) {
      setCommandHistory(prevCmdHistory => {
        const newHistory = [...prevCmdHistory, trimmedCommand];
        return newHistory;
      });
    }
  }, [promptName, processCommand, addLine]);


  const handleInternalSubmit = useCallback(async () => {
    if (isGenerating) return;

    const commandSubmitted = currentInput;
    setCurrentInput(""); 

    await submitCommand(commandSubmitted); 

    const trimmedSubmittedCommand = commandSubmitted.trim();
    if (trimmedSubmittedCommand) {
      setHistoryIndex(commandHistory.length); 
    } else {
      setHistoryIndex(commandHistory.length);
    }

    inputRef.current?.focus();
  }, [currentInput, submitCommand, isGenerating, commandHistory.length]);


  useEffect(() => {
    const executeCmd = async () => {
        if (commandToExecute && !isGenerating) {
            setCurrentInput(commandToExecute);
        }
    };
    executeCmd();
  }, [commandToExecute, isGenerating]);

  useEffect(() => {
    const triggerSubmitForProgrammatic = async () => {
        if (commandToExecute && currentInput === commandToExecute && !isGenerating) {
            await handleInternalSubmit();
            setCommandToExecute(null);
        }
    };
    triggerSubmitForProgrammatic();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentInput, commandToExecute, handleInternalSubmit, isGenerating, setCommandToExecute]);


  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCurrentInput(e.target.value);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (isGenerating && e.key !== 'Escape') {
        e.preventDefault();
        return;
    }
    if (e.key === "Enter") {
      e.preventDefault();
      if (!isGenerating) {
        handleInternalSubmit();
      }
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      if (commandHistory.length > 0) {
        const newIndex = historyIndex <= 0 ? 0 : historyIndex - 1;
        setHistoryIndex(newIndex);
        setCurrentInput(commandHistory[newIndex] || "");
      }
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      if (commandHistory.length > 0) {
        const newIndex = historyIndex >= commandHistory.length -1 ? commandHistory.length : historyIndex + 1;
        setHistoryIndex(newIndex);
        setCurrentInput(commandHistory[newIndex] || "");
         if (newIndex === commandHistory.length) setCurrentInput("");
      }
    }
  };

  return (
    <div
      className="flex-grow flex flex-col focus:outline-none w-full h-full overflow-hidden"
      onClick={() => inputRef.current?.focus()}
      tabIndex={-1}
    >
      <div className="flex-grow overflow-y-auto pr-2">
        {lines.map((line) => (
          <div
            key={line.id}
            className={cn("whitespace-pre-wrap break-words", {
              "text-cmd-input": line.type === "input",
              "text-cmd-output": line.type === "output" || line.type === "ai-response",
              "text-cmd-error": line.type === "error",
              "text-cmd-info": line.type === "info",
              "text-cmd-output": line.type === "ai-loading", 
            })}
          >
            {Array.isArray(line.content)
              ? line.content.map((node, idx) => <React.Fragment key={idx}>{node}</React.Fragment>)
              : line.content}
          </div>
        ))}
        {!isGenerating && (
          <div className="flex items-center">
            <span className="text-prompt-gradient">{promptName}</span>
            <span className="text-cmd-prompt">&gt;</span>
            <span className="break-all text-cmd-input">{currentInput.replace(/ /g, '\u00A0')}</span>
            <Cursor />
          </div>
        )}
        <div ref={terminalEndRef} />
      </div>

      <input
        ref={inputRef}
        type="text"
        value={currentInput}
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
        className="opacity-0 w-0 h-0 absolute -top-96 -left-96"
        aria-label="Command input"
        autoCapitalize="none"
        autoCorrect="off"
        spellCheck="false"
        disabled={isGenerating}
      />
    </div>
  );
}

