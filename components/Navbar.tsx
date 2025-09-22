// components/Navbar.tsx
import Link from 'next/link';
import { createClient } from '@/utils/supabase/server';
import LogoutButton from './LogoutButton';

export default async function Navbar() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  return (
    <nav className="sticky top-0 z-10 bg-black/30 backdrop-blur-md text-white p-4">
      {/* This div now stacks items on mobile and puts them in a row on medium screens and up */}
      <div className="container mx-auto flex flex-col md:flex-row md:justify-between md:items-center">
        <Link href="/" className="text-3xl font-anton uppercase tracking-wider">
          IdeaHub
        </Link>
        <div className="flex items-center space-x-4 mt-4 md:mt-0">
          {user ? (
            <>
              <Link href="/submit" className="bg-indigo-600 hover:bg-purple-600 text-white font-bold py-2 px-4 rounded-lg text-sm transition-colors">
                Post Idea
              </Link>
              <Link href="/dashboard" className="text-sm hover:text-purple-300 transition-colors">Dashboard</Link>
              {/* Hide the full email on small screens for cleanliness */}
              <span className="text-sm text-gray-300 hidden sm:inline-block">{user.email}</span>
              <LogoutButton />
            </>
          ) : (
            <Link href="/login" className="bg-indigo-600 hover:bg-purple-600 text-white font-bold py-2 px-4 rounded-lg text-sm transition-colors">
              Login
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}