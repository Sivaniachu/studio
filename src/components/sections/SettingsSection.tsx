"use client";

import { useSettings } from '@/context/SettingsContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from '@/components/ui/button';
import { useState } from 'react';

export default function SettingsSection() {
  const { promptName, setPromptName } = useSettings();
  const [localPromptName, setLocalPromptName] = useState(promptName);

  const handleSave = () => {
    setPromptName(localPromptName);
    // Optionally, add a toast notification for success
  };

  return (
    <div className="p-4 h-full flex flex-col items-center justify-center">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Settings</CardTitle>
          <CardDescription>Customize your CmdWeb experience.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="promptName">Prompt Prefix</Label>
            <Input
              id="promptName"
              value={localPromptName}
              onChange={(e) => setLocalPromptName(e.target.value)}
              placeholder="Enter prompt prefix (e.g., MyCLI)"
            />
            <p className="text-xs text-muted-foreground">
              This is the text that appears before the `&gt;` in the command line.
            </p>
          </div>
          <Button onClick={handleSave} className="w-full">
            Save Settings
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
