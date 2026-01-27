"use client";
import { useState, useEffect } from "react";

export default function DefaultLoader({
  loadingMessages,
}: {
  loadingMessages: string[];
}) {
  const [messageIndex, setMessageIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setMessageIndex((prev) => (prev + 1) % loadingMessages.length);
    }, 1000);

    return () => clearInterval(interval);
  }, [loadingMessages.length]);

  return (
    <div className="fixed inset-0 bg-base-100 flex items-center justify-center z-50">
      <div className="text-center space-y-4">
        <div className="loading loading-spinner loading-lg text-primary"></div>
        <p className="text-base-content/70">{loadingMessages[messageIndex]}</p>
      </div>
    </div>
  );
}
