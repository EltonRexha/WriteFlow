"use client";

import { useEffect } from "react";
import { TriangleAlert } from "lucide-react";
import Link from "next/link";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-screen bg-base-100 flex items-center justify-center">
      <div className="text-center space-y-6 max-w-md mx-auto px-4">
        {/* Error Icon */}
        <div className="flex justify-center">
          <div className="w-16 h-16 bg-error/10 rounded-full flex items-center justify-center">
            <TriangleAlert className="w-8 h-8 text-error" />
          </div>
        </div>

        {/* Error Title */}
        <h1 className="text-2xl font-bold text-base-content">
          Oops! Something went wrong
        </h1>

        {/* Error Message */}
        <p className="text-base-content/70">
          We encountered an unexpected error. This has been logged and we&apos;ll look into it.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={reset}
            className="btn btn-primary btn-soft"
          >
            Try Again
          </button>
          
          <Link href="/" className="btn btn-outline">
            Go Home
          </Link>
        </div>

        {/* Additional Help */}
        <p className="text-sm text-base-content/50">
          If the problem persists, please contact support.
        </p>
      </div>
    </div>
  );
}
