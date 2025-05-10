// src/components/sections/HomeSection.tsx
"use client";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { BrainCircuit } from "lucide-react"; 

export default function HomeSection() {
  return (
    <div className="flex flex-col h-full items-center justify-center p-4 text-center">
      <h1 className="text-5xl font-bold mb-4 text-gradient-flow">
        Welcome to TermAI
      </h1>

      <div className="relative w-full max-w-md mt-40 input-gradient-glow-wrapper rounded-full">
        <Button
          variant="ghost"
          size="icon"
          className={cn(
            "group absolute right-2 top-1/2 transform -translate-y-1/2 h-8 w-8 p-1.5 z-10", // Added 'group', moved to right
            "hover:bg-transparent", // No background change on hover for the button
            "focus-visible:ring-0 focus-visible:ring-offset-0" // Minimal focus styling for icon button
          )}
          aria-label="AI Search"
        >
          <BrainCircuit
            size={20}
            className={cn(
              "text-gradient-flow", // Base "glitter" (animated gradient) effect
              // On button hover, change to a static red-blue gradient and stop animation
              "group-hover:bg-gradient-to-r group-hover:from-blue-500 group-hover:to-red-500 group-hover:animate-none"
            )}
            data-ai-hint="artificial intelligence"
          />
        </Button>
        <Input
          type="text"
          placeholder="Ask me anything..."
          className={cn(
            "w-full pl-4 pr-12 py-3 text-base md:text-sm", // Adjusted padding: pr-12 for icon on right, pl-4 for consistency
            "focus:outline-none focus:ring-0" // Input already has minimal focus styling
          )}
        />
      </div>
    </div>
  );
}
