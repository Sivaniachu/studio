// src/components/sections/HomeSection.tsx
"use client";

import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { Search } from "lucide-react";

export default function HomeSection() {
  return (
    <div className="flex flex-col h-full items-center justify-center p-4 text-center">
      <h1 className="text-5xl font-bold mb-4 text-gradient-flow">
        Welcome to TermAI
      </h1>

      <div className="relative w-full max-w-md mt-8 input-gradient-glow-wrapper">
        <Input
          type="text"
          placeholder="Ask me anything..."
          className={cn(
            "w-full pl-4 pr-10 py-2", // Use default theme bg/text. Rounded-md is part of base Input style.
            "focus:outline-none focus:ring-0" 
          )}
        />
        <Search
          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground pointer-events-none"
          size={20}
        />
      </div>
    </div>
  );
}
