
// src/components/cmd-web/TypingText.tsx
"use client";

import React, { useState, useEffect } from 'react';

interface TypingTextProps {
  text: string;
  speed?: number; // Characters per second
  onFinished?: () => void;
}

const TypingText: React.FC<TypingTextProps> = ({ text, speed = 50, onFinished }) => {
  const [displayedText, setDisplayedText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (!text) {
      if (onFinished) onFinished();
      return;
    }
    setDisplayedText('');
    setCurrentIndex(0);
  }, [text, onFinished]);

  useEffect(() => {
    if (!text || currentIndex >= text.length) {
      if (onFinished && text && currentIndex >= text.length) {
        onFinished();
      }
      return;
    }

    const timeoutId = setTimeout(() => {
      setDisplayedText((prev) => prev + text[currentIndex]);
      setCurrentIndex((prev) => prev + 1);
    }, 1000 / speed);

    return () => clearTimeout(timeoutId);
  }, [text, currentIndex, speed, onFinished]);

  // Render a non-breaking space if displayedText is empty to maintain line height
  return <span className="whitespace-pre-wrap break-words">{displayedText || (text ? '' : <>&nbsp;</>)}</span>;
};

export default TypingText;
