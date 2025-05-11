// src/components/notes/AddNoteDialog.tsx
"use client";

import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input"; // Standard ShadCN Input
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

interface AddNoteDialogProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  onSave: (note: { title: string; content: string }) => void;
}

export default function AddNoteDialog({ isOpen, onOpenChange, onSave }: AddNoteDialogProps) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSummarizing, setIsSummarizing] = useState(false);

  useEffect(() => {
    if (isOpen) {
      // Reset fields when dialog opens
      setTitle("");
      setContent("");
      setError(null);
      setIsSummarizing(false);
    }
  }, [isOpen]);

  const handleSave = () => {
    if (!title.trim()) {
      setError("Title cannot be empty.");
      return;
    }
    if (!content.trim()) {
      setError("Note content cannot be empty.");
      return;
    }
    onSave({ title, content });
    // onOpenChange(false); // Dialog will be closed by parent or DialogClose
  };

  const handleSummarizeClick = () => {
    setIsSummarizing(true);
    // Placeholder for actual summarization logic
    // Simulate processing for demo
    setTimeout(() => {
      setIsSummarizing(false);
      // console.log("Summarize action triggered for content:", content);
      // Potentially update content or show summarized version
    }, 2500); // Corresponds to animation duration
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[520px] bg-card">
        <DialogHeader>
          <DialogTitle className="text-foreground">Add New Note</DialogTitle>
          <DialogDescription className="text-muted-foreground">
            Fill in the details for your new note.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="title" className="text-right text-foreground">
              Title
            </Label>
            {/* Standard Input, no glow wrapper, ensure it does not use .input-gradient-glow-wrapper by default */}
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="col-span-3 h-10 bg-input text-foreground placeholder:text-muted-foreground focus-visible:ring-ring border-border" 
              placeholder="Enter note title"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="content" className="text-right text-foreground self-start pt-2">
              Note
            </Label>
            <div className="col-span-3 relative">
              <Textarea
                id="content"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="min-h-[120px] w-full pr-12 bg-input text-foreground placeholder:text-muted-foreground focus-visible:ring-ring border-border"
                placeholder="Write your note here..."
              />
              <Button
                variant="ghost"
                size="icon"
                onClick={handleSummarizeClick}
                className={cn(
                  "group absolute right-2 top-2 h-8 w-8 p-1.5 z-10", 
                  "hover:bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0"
                )}
                aria-label="Summarize Note"
                disabled={isSummarizing}
              >
                <Sparkles
                  className={cn(
                    "w-5 h-5", 
                    isSummarizing && "animate-processing-icon",
                    !isSummarizing && "transition-colors group-hover:icon-hover-gradient"
                  )}
                  aria-hidden="true"
                />
              </Button>
            </div>
          </div>
          {error && (
            <p className="col-span-4 text-sm text-destructive text-center">{error}</p>
          )}
        </div>
        <DialogFooter className="sm:justify-between">
          <DialogClose asChild>
            <Button type="button" variant="outline">
              Cancel
            </Button>
          </DialogClose>
          <div className="button-pseudo-gradient-border rounded-full">
            <Button
              type="button"
              onClick={handleSave}
              className={cn(
                 "w-auto rounded-full bg-background px-6 h-10 text-sm font-medium text-foreground", // Adjusted size
                 "focus-visible:ring-0 focus-visible:ring-offset-0"
              )}
            >
              Save Note
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
