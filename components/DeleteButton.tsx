// components/DeleteButton.tsx
'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function DeleteButton({ ideaId }: { ideaId: number }) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleDelete = async () => {
    // Show a confirmation dialog before deleting
    const confirmed = window.confirm('Are you sure you want to delete this idea?');
    if (!confirmed) {
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const response = await fetch('/api/delete-idea', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ideaId }),
      });

      if (!response.ok) {
        const result = await response.json();
        throw new Error(result.error || 'Failed to delete');
      }

      // Refresh the page to show the idea is gone
      router.refresh();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <button
        onClick={handleDelete}
        disabled={isLoading}
        className="text-sm text-red-500 hover:text-red-700 disabled:text-gray-400"
      >
        {isLoading ? 'Deleting...' : 'Delete'}
      </button>
      {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
    </div>
  );
}