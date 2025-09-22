// components/CommentForm.tsx
'use client';

import { useState } from 'react';
import { createClient } from '@/utils/supabase/client';
import { useRouter } from 'next/navigation';

export default function CommentForm({ ideaId, userId }: { ideaId: number, userId: string }) {
  const [content, setContent] = useState('');
  const router = useRouter();
  const supabase = createClient();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;

    await supabase.from('comments').insert({
      content,
      idea_id: ideaId,
      user_id: userId,
    });

    setContent('');
    router.refresh(); 
  };

  return (
    <form onSubmit={handleSubmit} className="mb-6">
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Add to the discussion..."
        rows={3}
        required
        // Updated styles for the textarea
        className="w-full p-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors"
      ></textarea>
      <button type="submit" className="mt-2 px-4 py-2 bg-indigo-600 text-white font-bold rounded-lg hover:bg-indigo-700 transition-colors">
        Post Comment
      </button>
    </form>
  );
}