// src/components/sections/HomeSection.tsx
"use client";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { BrainCircuit } from "lucide-react"; // Changed from Search to BrainCircuit for AI context

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
          className="absolute left-2 top-1/2 transform -translate-y-1/2 h-8 w-8 p-1.5 text-muted-foreground hover:text-primary z-10"
          aria-label="AI Search"
        >
          <BrainCircuit size={20} />
        </Button>
        <Input
          type="text"
          placeholder="Ask me anything..."
          className={cn(
            "w-full pl-12 pr-4 py-3 text-base md:text-sm", // Increased pl for the icon
            "focus:outline-none focus:ring-0"
          )}
        />
      </div>
    </div>
  );
}
