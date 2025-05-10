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

      <div className="relative w-full max-w-md mt-16 input-gradient-glow-wrapper rounded-full"> {/* Increased mt from 8 to 16 */}
        <Input
          type="text"
          placeholder="Ask me anything..."
          className={cn(
            "w-full pl-4 pr-10 py-3 text-base md:text-sm", // Adjusted padding for better text visibility
            "focus:outline-none focus:ring-0"
          )}
        />
        <Search
          className="absolute right-4 top-1/2 transform -translate-y-1/2 text-muted-foreground pointer-events-none" // Adjusted right padding for icon
          size={20}
        />
      </div>
    </div>
  );
}

