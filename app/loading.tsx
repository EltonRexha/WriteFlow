"use client";

import { useState, useEffect } from "react";

const loadingMessages = [
  "Fetching your data",
  "Loading amazing content",
  "Preparing your workspace",
  "Almost there",
  "Setting things up",
  "Getting everything ready",
];

export default function Loading() {
  const [messageIndex, setMessageIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setMessageIndex((prev) => (prev + 1) % loadingMessages.length);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-base-100 flex items-center justify-center">
      <div className="text-center space-y-4">
        <div className="loading loading-spinner loading-lg text-primary"></div>
        <p className="text-base-content/70">{loadingMessages[messageIndex]}</p>
      </div>
    </div>
  );
}
