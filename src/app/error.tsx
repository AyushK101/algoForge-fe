'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface ErrorProp {
  error: Error;
  reset: () => void;
}

const Error: React.FC<ErrorProp> = ({ error, reset }) => {
  const router = useRouter();

  useEffect(() => {
    // Optional: send error to an error tracking service (e.g., Sentry)
    console.error('Caught error:', error);
  }, [error]);

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-red-50 px-4 text-center">
      <h1 className="text-4xl font-bold text-red-600 mb-4">Something went wrong 😢</h1>

      <p className="text-gray-700 text-lg mb-6">
        {error.message || 'Unexpected error occurred.'}
      </p>

      <div className="flex space-x-4">
        <button
          onClick={reset}
          className="px-5 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
        >
          🔄 Try Again
        </button>
        <button
          onClick={() => router.push('/')}
          className="px-5 py-2 bg-gray-300 text-black rounded-md hover:bg-gray-400"
        >
          🏠 Go to Home
        </button>
      </div>

      <details className="mt-8 bg-white p-4 rounded shadow-md w-full max-w-xl text-left">
        <summary className="cursor-pointer font-semibold text-gray-600">Error Details (for dev)</summary>
        <pre className="mt-2 text-sm text-red-900 whitespace-pre-wrap">
          {error.stack || JSON.stringify(error)}
        </pre>
      </details>
    </div>
  );
};

export default Error;
