// app/dashboard/page.tsx
import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import DeleteButton from '@/components/DeleteButton';

export default async function DashboardPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  const { data: ideas, error } = await supabase
    .from('ideas')
    .select(`*, upvotes(count)`)
    .eq('user_id', user.id)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching user ideas:', error);
  }

  return (
    <div className="container mx-auto p-4 pt-24 max-w-4xl">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-anton uppercase tracking-wider text-white">
          Your Ideas
        </h1>
        <Link href="/submit" className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded-lg transition-colors">
          Submit New Idea
        </Link>
      </div>

      {ideas && ideas.length > 0 ? (
        <div className="space-y-4">
          {ideas.map((idea) => (
            // This is the updated card with the glass effect
            <div key={idea.id} className="bg-white/5 border border-white/10 backdrop-blur-lg rounded-xl shadow-lg flex justify-between items-center p-6 transition-all duration-300 hover:border-purple-400">
              <div className="flex-grow">
                <Link href={`/idea/${idea.id}`}>
                  <h2 className="text-xl font-semibold text-white transition-colors hover:text-purple-400">{idea.title}</h2>
                </Link>
                <p className="text-sm text-gray-400">
                  Posted on {new Date(idea.created_at).toLocaleDateString()}
                </p>
              </div>
              <div className="text-center px-6">
                {/* @ts-ignore */}
                <p className="text-2xl font-bold text-white">{idea.upvotes[0]?.count || 0}</p>
                <p className="text-sm text-gray-400">Upvotes</p>
              </div>
              <DeleteButton ideaId={idea.id} />
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12 px-6 bg-white/5 border border-white/10 backdrop-blur-lg rounded-xl">
          <h2 className="text-xl font-semibold text-white">You haven't posted any ideas yet.</h2>
          <p className="text-gray-300 mt-2">Ready to share your brilliant thoughts with the world?</p>
          <Link href="/submit" className="mt-6 inline-block bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded-lg transition-colors">
            Post Your First Idea
          </Link>
        </div>
      )}
    </div>
  );
}