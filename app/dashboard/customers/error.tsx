'use client';

import { useEffect } from 'react';

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
    <main className="flex h-full flex-col items-center justify-center">
      <h2 className="text-center text-lg font-semibold">Something went wrong!</h2>
      <p className="mt-2 text-center text-sm text-gray-500">
        {error.message || 'An unexpected error occurred while loading customers.'}
      </p>
      <button
        className="mt-4 rounded-md bg-blue-600 px-4 py-2 text-sm text-white transition-colors hover:bg-blue-500"
        onClick={reset}
      >
        Try again
      </button>
    </main>
  );
}
