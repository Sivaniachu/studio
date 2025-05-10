"use client";

import { suggestCommand, type SuggestCommandInput, type SuggestCommandOutput } from "@/ai/flows/suggest-command";
import Cursor from "@/components/cmd-web/Cursor";
import { useSettings } from "@/context/SettingsContext";
import { cn } from "@/lib/utils";
import React, { useState, useEffect, useRef, useCallback } from "react";

const APP_VERSION = "1.0.0.2024"; // Static version for 'ver' command

interface Line {
  id: string;
  content: React.ReactNode;
  type: "input" | "output" | "error" | "info";
}

let lineIdCounter = 0;
const generateLineId = () => `line-${lineIdCounter++}`;

export default function TerminalView() {
  const { promptName } = useSettings();
  const currentPromptString = `${promptName}>`;

  const initialLines: Line[] = [
    { id: generateLineId(), content: `CmdWeb [Version ${APP_VERSION}] (Prompt: ${promptName})`, type: "info" },
    { id: generateLineId(), content: "(c) Firebase Studio. All rights reserved.", type: "info" },
    { id: generateLineId(), content: <>&nbsp;</>, type: "info" },
  ];

  const [lines, setLines] = useState<Line[]>(initialLines);
  const [currentInput, setCurrentInput] = useState("");
  const [commandHistory, setCommandHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [activeSuggestionIndex, setActiveSuggestionIndex] = useState(-1);
  const [loadingSuggestions, setLoadingSuggestions] = useState(false);

  const terminalEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Update initial lines if promptName changes
  useEffect(() => {
    setLines([
      { id: generateLineId(), content: `CmdWeb [Version ${APP_VERSION}] (Prompt: ${promptName})`, type: "info" },
      { id: generateLineId(), content: "(c) Firebase Studio. All rights reserved.", type: "info" },
      { id: generateLineId(), content: <>&nbsp;</>, type: "info" },
    ]);
    lineIdCounter = 3; // Reset counter considering initial lines
  }, [promptName]);


  const scrollToBottom = () => {
    terminalEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [lines, currentInput]);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const addLine = (content: React.ReactNode, type: Line["type"]) => {
    setLines((prevLines) => [...prevLines, { id: generateLineId(), content, type }]);
  };

  const fetchSuggestions = useCallback(async (prefix: string) => {
    if (!prefix.trim() || prefix.includes(" ")) {
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
  }, []);

  const debouncedFetchSuggestions = useCallback(
    debounce(fetchSuggestions, 300),
    [fetchSuggestions]
  );

  useEffect(() => {
    if (currentInput) {
      debouncedFetchSuggestions(currentInput);
    } else {
      setSuggestions([]);
      setActiveSuggestionIndex(-1);
    }
  }, [currentInput, debouncedFetchSuggestions]);

  const processCommand = (commandStr: string) => {
    const [command, ...args] = commandStr.trim().split(/\s+/);
    const fullArg = args.join(" ");

    switch (command.toLowerCase()) {
      case "cls":
        setLines([
          { id: generateLineId(), content: `CmdWeb [Version ${APP_VERSION}] (Prompt: ${promptName})`, type: "info" },
          { id: generateLineId(), content: "(c) Firebase Studio. All rights reserved.", type: "info" },
          { id: generateLineId(), content: <>&nbsp;</>, type: "info" },
        ]);
        break;
      case "echo":
        addLine(fullArg || <>&nbsp;</>, "output");
        break;
      case "help":
        addLine("Available commands:", "output");
        addLine("  CLS          - Clears the screen.", "output");
        addLine("  ECHO [text]  - Displays messages.", "output");
        addLine("  DATE         - Displays the current date.", "output");
        addLine("  TIME         - Displays the current time.", "output");
        addLine("  VER          - Displays the CmdWeb version.", "output");
        addLine("  HELP         - Provides Help information for commands.", "output");
        addLine("  EXIT         - Exits the CmdWeb (simulated).", "output");
        break;
      case "date":
        addLine(new Date().toDateString(), "output");
        break;
      case "time":
        addLine(new Date().toLocaleTimeString(), "output");
        break;
      case "ver":
        addLine(`CmdWeb [Version ${APP_VERSION}] (Prompt: ${promptName})`, "output");
        break;
      case "exit":
        addLine("Exiting CmdWeb... (This is a simulation)", "info");
        break;
      case "":
        break;
      default:
        addLine(
          `'${command}' is not recognized as an internal or external command, operable program or batch file.`,
          "error"
        );
        break;
    }
  };

  const handleSubmit = () => {
    const commandToProcess = currentInput.trim();
    const displayInput = (
      <>
        <span className="text-prompt-gradient">{promptName}</span>
        <span className="text-cmd-prompt">&gt;</span>
        {currentInput}
      </>
    );
    addLine(displayInput, "input");

    if (commandToProcess) {
      processCommand(commandToProcess);
      if (commandHistory[commandHistory.length - 1] !== commandToProcess) {
        setCommandHistory((prev) => [...prev, commandToProcess]);
      }
    }
    
    setCurrentInput("");
    setHistoryIndex(commandHistory.length);
    setSuggestions([]);
    setActiveSuggestionIndex(-1);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCurrentInput(e.target.value);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSubmit();
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
              "text-cmd-output": line.type === "output",
              "text-cmd-error": line.type === "error",
              "text-cmd-info": line.type === "info",
            })}
          >
            {/* Special rendering for input lines to handle prompt styling */}
            {line.type === 'input' && typeof line.content === 'object' && React.isValidElement(line.content) ? (
              line.content
            ) : (
              line.type === 'input' && typeof line.content === 'string' && line.content.startsWith(currentPromptString) ? (
                <>
                  <span className="text-prompt-gradient">{promptName}</span>
                  <span className="text-cmd-prompt">&gt;</span>
                  {line.content.substring(currentPromptString.length)}
                </>
              ) : (
                line.content
              )
            )}
          </div>
        ))}
        <div className="flex items-center">
          <span className="text-prompt-gradient">{promptName}</span>
          <span className="text-cmd-prompt">&gt;</span>
          <span className="break-all">{currentInput.replace(/ /g, '\u00A0')}</span>
          <Cursor />
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
      />

      {suggestions.length > 0 && (
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
      <div className="text-xs text-muted-foreground mt-1 shrink-0">
        Type 'help' for a list of commands. Use Up/Down arrows for history. Tab for suggestions.
      </div>
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

