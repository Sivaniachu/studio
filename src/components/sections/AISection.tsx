"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function AISection() {
  return (
    <div className="p-4 h-full flex flex-col items-center justify-center">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>AI Section</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            AI features will be available here. This section is currently under development.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
