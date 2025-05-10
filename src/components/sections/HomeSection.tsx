
"use client";

import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

export default function HomeSection() {
  return (
    <div className="flex flex-col h-full items-center justify-center p-4 text-center relative">
      {/* Welcome Text - uses flex-grow to push input to bottom */}
      <div className="flex-grow flex flex-col items-center justify-center">
        <h1 className={cn(
            "text-5xl sm:text-6xl md:text-7xl font-bold text-gradient-flow mb-8"
          )}
          data-ai-hint="welcome abstract"
          >
          Welcome to TermAI
        </h1>
      </div>

      {/* Input Bar at the bottom middle */}
      <div className="w-full max-w-2xl mx-auto mb-4 sm:mb-8">
        <div className="input-gradient-glow-wrapper rounded-lg">
          <Input
            type="text"
            placeholder="Ask me anything ->"
            className={cn(
              "w-full h-14 sm:h-16 text-md sm:text-lg pl-4 pr-12 py-2", 
              "bg-card text-foreground placeholder-muted-foreground",
              "border-0 ring-0 shadow-none", 
              "focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:border-0"
            )}
          />
          {/* Optional: Add a send/submit icon inside the input area if needed */}
        </div>
      </div>
    </div>
  );
}

