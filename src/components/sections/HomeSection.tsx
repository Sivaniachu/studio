// src/components/sections/HomeSection.tsx
"use client";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Sparkles } from "lucide-react"; // Import Sparkles icon

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
            "group absolute right-2 top-1/2 transform -translate-y-1/2 h-8 w-8 p-1.5 z-10",
            "hover:bg-transparent", // No background change on hover
            "focus-visible:ring-0 focus-visible:ring-offset-0"
          )}
          aria-label="AI Search"
        >
          <Sparkles
            className="w-5 h-5 transition-colors group-hover:icon-hover-gradient"
            aria-hidden="true" 
          />
        </Button>
        <Input
          type="text"
          placeholder="Ask me anything..."
          className={cn(
            "w-full pl-4 pr-12 py-3 text-base md:text-sm rounded-full", // Ensure rounded-full is applied
            "focus:outline-none focus:ring-0" // Remove focus ring as glow effect is used
          )}
        />
      </div>
    </div>
  );
}
