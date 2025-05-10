// src/components/cmd-web/Cursor.tsx
"use client";

import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";

const Cursor = () => {
  const [visible, setVisible] = useState(true);

  // This useEffect is to ensure the blinking starts correctly after hydration
  // and to avoid server/client mismatch on the initial visibility state if it were random.
  useEffect(() => {
    const intervalId = setInterval(() => {
      setVisible(v => !v);
    }, 500); // Standard cursor blink rate
    return () => clearInterval(intervalId);
  }, []);

  return (
    <span
      className={cn(
        "inline-block bg-cmd-prompt w-[8px] h-[1.1em] align-middle -mb-[0.1em]", // Adjusted for better vertical alignment
        visible ? "opacity-100" : "opacity-0"
      )}
      aria-hidden="true"
    />
  );
};

export default Cursor;
