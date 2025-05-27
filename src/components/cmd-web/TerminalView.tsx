
"use client";

import { suggestCommand, type SuggestCommandInput, type SuggestCommandOutput } from "@/ai/flows/suggest-command";
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
  
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [activeSuggestionIndex, setActiveSuggestionIndex] = useState(-1);
  const [loadingSuggestions, setLoadingSuggestions] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  const terminalEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setLines(createInitialLines(promptName));
  }, [promptName, createInitialLines]);

  const scrollToBottom = () => {
    terminalEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [lines, currentInput]);

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
        addLine("  Any other command will be sent to the AI.", "info");
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
      addLine(<TypingText key={thinkingLineKey} text="AI is thinking..." speed={30} />, "ai-loading");
      
      try {
        const response = await fetchWithTimeout('/api/generate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ query: commandStr.trim() }),
        }, 15000);

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({error: `HTTP error! status: ${response.status}`}));
          throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
        }
        
        const result = await response.json();
        if (result.error) {
          throw new Error(result.error);
        }

        setLines(prev => prev.filter(l => l.type !== 'ai-loading'));
        const renderedContent = renderAiResponseContent(result.responseText, generateLineId());
        addLine(renderedContent, "ai-response");

      } catch (error) {
         setLines(prev => prev.filter(l => l.type !== 'ai-loading'));
        const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";
        const errorLineKey = generateLineId();
        addLine(<TypingText key={errorLineKey} text={`Error: ${errorMessage}`} speed={30} />, "error");
      } finally {
        setIsGenerating(false);
      }
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
        if (prevCmdHistory.length === 0 || prevCmdHistory[prevCmdHistory.length - 1] !== trimmedCommand) {
          return [...prevCmdHistory, trimmedCommand];
        }
        return prevCmdHistory;
      });
    }
  }, [promptName, processCommand, addLine]);

  const handleInternalSubmit = useCallback(async () => {
    if (isGenerating) return; 
    
    const commandSubmitted = currentInput; // Capture current input
    await submitCommand(commandSubmitted); // submitCommand now awaits processCommand

    setCurrentInput(""); 
    
    // Update historyIndex based on the latest commandHistory state
    // This ensures it points correctly after a command might have been added.
    const trimmedSubmittedCommand = commandSubmitted.trim();
    if (trimmedSubmittedCommand) {
      // If a non-empty command was submitted, history was potentially updated.
      // Use functional update for setHistoryIndex to get the latest commandHistory.
      setHistoryIndex(ch => ch.length);
    } else {
      // If an empty command was submitted, history was not changed by this command.
      setHistoryIndex(commandHistory.length); // Point to the current end of history.
    }
    
    setSuggestions([]);
    setActiveSuggestionIndex(-1);
    inputRef.current?.focus(); // Ensure focus is returned after processing
  }, [currentInput, submitCommand, commandHistory, isGenerating]);


  useEffect(() => {
    const executeCmd = async () => {
        if (commandToExecute && !isGenerating) {
            setCurrentInput(commandToExecute);
            // This effect will re-run due to currentInput change if commandToExecute was set.
            // The next effect below will pick it up.
        }
    };
    executeCmd();
  }, [commandToExecute, isGenerating]);
  
  useEffect(() => {
    const triggerSubmitForProgrammatic = async () => {
        // Check if currentInput was set by commandToExecute and is ready for submission
        if (commandToExecute && currentInput === commandToExecute && !isGenerating) {
            await handleInternalSubmit(); // handleInternalSubmit uses the latest currentInput
            setCommandToExecute(null);    // Clear the trigger for programmatic execution
        }
    };
    triggerSubmitForProgrammatic();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentInput, commandToExecute, handleInternalSubmit, isGenerating, setCommandToExecute]);


  const fetchSuggestions = useCallback(async (prefix: string) => {
    if (!prefix.trim() || prefix.includes(" ") || isGenerating) {
      setSuggestions([]);
      return;
    }
    setLoadingSuggestions(true);
    try {
      const result: SuggestCommandOutput = await suggestCommand({ commandPrefix: prefix });
      setSuggestions(result.suggestions || []);
      setActiveSuggestionIndex(-1);
    } catch (error) {
      console.error("Error fetching suggestions:", error);
      setSuggestions([]);
    }
    setLoadingSuggestions(false);
  }, [isGenerating]);

  const debouncedFetchSuggestions = useCallback(
    debounce(fetchSuggestions, 300),
    [fetchSuggestions]
  );

  useEffect(() => {
    if (currentInput && !isGenerating) {
      debouncedFetchSuggestions(currentInput);
    } else {
      setSuggestions([]);
      setActiveSuggestionIndex(-1);
    }
  }, [currentInput, debouncedFetchSuggestions, isGenerating]);

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
      handleInternalSubmit();
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      if (suggestions.length > 0 && activeSuggestionIndex !== -1) {
         setActiveSuggestionIndex(prev => (prev <= 0 ? suggestions.length - 1 : prev - 1));
      } else if (suggestions.length > 0 && activeSuggestionIndex === -1) {
        setActiveSuggestionIndex(suggestions.length -1);
      }
       else if (commandHistory.length > 0) {
        const newIndex = historyIndex <= 0 ? 0 : historyIndex - 1;
        setHistoryIndex(newIndex);
        setCurrentInput(commandHistory[newIndex] || "");
      }
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      if (suggestions.length > 0 && activeSuggestionIndex !== -1) {
        setActiveSuggestionIndex(prev => (prev >= suggestions.length - 1 ? 0 : prev + 1));
      } else if (suggestions.length > 0 && activeSuggestionIndex === -1){
         setActiveSuggestionIndex(0);
      }
      else if (commandHistory.length > 0) {
        const newIndex = historyIndex >= commandHistory.length -1 ? commandHistory.length : historyIndex + 1;
        setHistoryIndex(newIndex);
        setCurrentInput(commandHistory[newIndex] || "");
         if (newIndex === commandHistory.length) setCurrentInput("");
      }
    } else if (e.key === "Tab") {
      e.preventDefault();
      if (suggestions.length > 0) {
        const suggestionToApply = suggestions[activeSuggestionIndex !== -1 ? activeSuggestionIndex : 0];
        if (suggestionToApply) {
          setCurrentInput(suggestionToApply + " ");
          setSuggestions([]);
          setActiveSuggestionIndex(-1);
        }
      }
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    setCurrentInput(suggestion + " ");
    setSuggestions([]);
    setActiveSuggestionIndex(-1);
    inputRef.current?.focus();
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
              "text-cmd-output": line.type === "output" || line.type === "ai-response" || line.type === "ai-loading",
              "text-cmd-error": line.type === "error",
              "text-cmd-info": line.type === "info",
            })}
          >
            {Array.isArray(line.content) 
              ? line.content.map((node, idx) => <React.Fragment key={idx}>{node}</React.Fragment>) 
              : line.content}
          </div>
        ))}
        <div className="flex items-center">
          <span className="text-prompt-gradient">{promptName}</span>
          <span className="text-cmd-prompt">&gt;</span>
          <span className="break-all text-cmd-input">{currentInput.replace(/ /g, '\u00A0')}</span>
          {!isGenerating && <Cursor />}
        </div>
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

      {suggestions.length > 0 && !isGenerating && (
        <div className="mt-1 p-1 bg-cmd-suggestion rounded-sm shadow-md max-w-md">
          <ul className="text-cmd-suggestion-foreground">
            {suggestions.map((s, idx) => (
              <li
                key={idx}
                onClick={() => handleSuggestionClick(s)}
                className={cn(
                  "px-2 py-1 cursor-pointer hover:bg-cmd-suggestion-hover hover:text-cmd-suggestion-hover-foreground",
                  idx === activeSuggestionIndex && "bg-cmd-suggestion-active text-cmd-suggestion-active-foreground"
                )}
              >
                {s}
              </li>
            ))}
          </ul>
          {loadingSuggestions && <div className="text-xs text-muted-foreground p-1">Loading...</div>}
        </div>
      )}
    </div>
  );
}

function debounce<F extends (...args: any[]) => any>(func: F, waitFor: number) {
  let timeout: ReturnType<typeof setTimeout> | null = null;

  return (...args: Parameters<F>): Promise<ReturnType<F>> =>
    new Promise(resolve => {
      if (timeout) {
        clearTimeout(timeout);
      }
      timeout = setTimeout(() => resolve(func(...args)), waitFor);
    });
}
