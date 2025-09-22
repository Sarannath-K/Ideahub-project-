// app/page.tsx
'use client'; 

import { useEffect, useState } from 'react'; 
import { motion, AnimatePresence } from 'framer-motion';
import { createClient } from '@/utils/supabase/client';
import Link from 'next/link';
import UpvoteButton from '@/components/UpvoteButton';
import type { User } from '@supabase/supabase-js';

// 1. UPDATED TYPE: 'profiles' is now an array
type Idea = {
  id: number;
  title: string;
  description: string;
  tags: string[];
  created_at: string;
  profiles: { username: string }[];
  upvotes: { user_id: string }[];
};

export default function HomePage() {
  const [ideas, setIdeas] = useState<Idea[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSplash(false);
    }, 3000); 

    return () => clearTimeout(timer);
  }, []);
  
  useEffect(() => {
    const supabase = createClient();
    
    const getIdeas = async () => {
      const { data } = await supabase
        .from('ideas')
        .select(`id, title, description, tags, created_at, profiles ( username ), upvotes ( user_id )`)
        .order('created_at', { ascending: false });
      if (data) setIdeas(data as Idea[]);
    };
    
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
    }

    if (!showSplash) {
      getIdeas();
      getUser();
    }
  }, [showSplash]);

  return (
    <div className="relative min-h-screen">
      <AnimatePresence>
        {showSplash && (
          <motion.div
            key="splash"
            exit="exit"
            className="absolute inset-0 flex flex-col items-center justify-center text-center p-4 z-20"
          >
            {/* ... splash screen content ... */}
          </motion.div>
        )}
      </AnimatePresence>

      {!showSplash && (
        <motion.div
          key="content"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.0 }}
          className="container mx-auto p-4 pt-24"
        >
          <h2 className="text-4xl font-bold mb-12 text-center text-white">Latest Ideas</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {ideas.map((idea, index) => (
              <motion.div
                key={idea.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <div className="bg-white/5 border border-white/10 backdrop-blur-lg rounded-xl shadow-lg flex flex-col p-6 h-full transition-all duration-300 hover:border-purple-400 hover:scale-[1.02]">
                  <Link href={`/idea/${idea.id}`} className="flex-grow">
                    <h2 className="text-2xl font-semibold text-white transition-colors hover:text-purple-400">{idea.title}</h2>
                    <div className="text-sm text-gray-400 my-2">
                      {/* 2. UPDATED JSX: Access the first element of the array */}
                      <span>by {idea.profiles[0]?.username || 'Anonymous'}</span>
                      {' · '}
                      <span>{new Date(idea.created_at).toLocaleDateString()}</span>
                    </div>
                    <p className="text-gray-300 my-4 line-clamp-3">{idea.description}</p>
                  </Link>
                  <div className="mt-auto pt-4 border-t border-gray-700 flex justify-between items-center">
                    <div className="flex flex-wrap gap-2">
                      {idea.tags?.map((tag) => (
                        <span key={tag} className="bg-gray-700 text-gray-200 text-xs font-semibold px-2.5 py-0.5 rounded-full">{tag}</span>
                      ))}
                    </div>
                    <UpvoteButton idea={idea} user={user} />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  );
}