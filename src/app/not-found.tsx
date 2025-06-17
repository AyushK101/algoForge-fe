'use client';

import { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';

export default function NotFoundPage() {
  const pathname = usePathname();
  const router = useRouter();
  const [canGoBack, setCanGoBack] = useState(false);

  useEffect(() => {
    // Check if there's history to go back
    console.log(window.history)
    setCanGoBack(window.history.length > 1);
  }, []);

  const handleBack = () => {
    if (canGoBack) {
      router.back();
    } else {
      router.push('/');
    }
  };

  return (
    <div style={{ padding: '4rem', textAlign: 'center' }}>
      <h1>🚫 404 - Page Not Found</h1>
      <p>You tried visiting: <strong>{pathname}</strong></p>
      <br />
      <button
        onClick={handleBack}
        style={{
          padding: '0.5rem 1.5rem',
          fontSize: '1rem',
          cursor: 'pointer',
          borderRadius: '8px',
          background: '#0070f3',
          color: '#fff',
          border: 'none',
        }}
      >
        {canGoBack ? 'Go Back' : 'Go to Home'}
      </button>
    </div>
  );
}
