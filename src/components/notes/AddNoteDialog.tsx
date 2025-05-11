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
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

interface AddNoteDialogProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  onSave: (note: { title: string; content: string }) => void;
}

export default function AddNoteDialog({ isOpen, onOpenChange, onSave }: AddNoteDialogProps) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      // Reset fields when dialog opens
      setTitle("");
      setContent("");
      setError(null);
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

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[480px] bg-card">
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
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="col-span-3"
              placeholder="Enter note title"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="content" className="text-right text-foreground  self-start pt-2">
              Note
            </Label>
            <Textarea
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="col-span-3 min-h-[120px]"
              placeholder="Write your note here..."
            />
          </div>
          {error && (
            <p className="col-span-4 text-sm text-destructive text-center">{error}</p>
          )}
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button type="button" variant="outline">
              Cancel
            </Button>
          </DialogClose>
          <Button type="button" onClick={handleSave}>
            Save Note
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
