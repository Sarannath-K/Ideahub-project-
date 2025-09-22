// components/UpvoteButton.tsx
'use client';
import { ArrowBigUp } from 'lucide-react';
import { useState, useEffect } from 'react';
import { createClient } from '@/utils/supabase/client';
import { useRouter } from 'next/navigation';
import type { User } from '@supabase/supabase-js';

// Define a more specific type for our idea object
type Idea = {
  id: number;
  upvotes: { user_id: string }[];
};

export default function UpvoteButton({ idea, user }: { idea: Idea, user: User | null }) {
  const router = useRouter();
  const supabase = createClient();

  const [upvoteCount, setUpvoteCount] = useState(idea.upvotes.length);
  const [isUpvoted, setIsUpvoted] = useState(
    user ? idea.upvotes.some(upvote => upvote.user_id === user.id) : false
  );

  const handleUpvote = async () => {
    if (!user) {
      return router.push('/login'); // Redirect to login if not signed in
    }

    if (isUpvoted) {
      // User is removing their upvote
      setIsUpvoted(false);
      setUpvoteCount(prev => prev - 1);
      await supabase.from('upvotes').delete().match({ user_id: user.id, idea_id: idea.id });
    } else {
      // User is adding an upvote
      setIsUpvoted(true);
      setUpvoteCount(prev => prev + 1);
      await supabase.from('upvotes').insert({ user_id: user.id, idea_id: idea.id });
    }
    // We don't need router.refresh() here for a better user experience
  };

  return (
    <button
      onClick={handleUpvote}
      className={`flex items-center space-x-2 px-4 py-2 rounded-full border transition-colors duration-300
        ${isUpvoted 
          ? 'border-purple-500 bg-purple-500/20 text-white' 
          : 'border-gray-600 bg-gray-800/50 text-gray-300 hover:border-gray-400 hover:text-white'
        }`}
    >
      <ArrowBigUp size={20} />
      <span>{upvoteCount}</span>
    </button>
  );
}