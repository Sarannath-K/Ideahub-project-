// app/idea/[id]/page.tsx
import { createClient } from '@/utils/supabase/server';
import { notFound } from 'next/navigation';
import Comments from '@/components/Comments';

export const revalidate = 0;

export default async function IdeaPage({ params }: { params: { id: string } }) {
  const supabase = createClient();

  const { data: idea, error } = await supabase
    .from('ideas')
    .select(`*, profiles ( username ), ai_feedback`)
    .eq('id', params.id)
    .single();

  if (error || !idea) {
    notFound();
  }
 
  return (
    <div className="container mx-auto p-4 pt-24 max-w-3xl">
      {/* Main idea container with hover effect and better text colors */}
      <div className="bg-white/5 border border-white/10 backdrop-blur-lg rounded-xl shadow-lg p-8 mb-6 transition-colors duration-300 hover:border-purple-400">
        <h1 className="text-3xl font-bold text-white">{idea.title}</h1>
        <div className="text-sm text-gray-300 my-2">
          {/* @ts-ignore */}
          <span>by {idea.profiles?.username || 'Anonymous'}</span>
          {' · '}
          <span>{new Date(idea.created_at).toLocaleDateString()}</span>
        </div>
        <p className="text-gray-200 my-4 whitespace-pre-wrap">{idea.description}</p>
        <div className="flex flex-wrap gap-2">
          {idea.tags?.map((tag: string) => (
            <span key={tag} className="bg-gray-700 text-gray-200 text-xs font-semibold px-2.5 py-0.5 rounded-full">
              {tag}
            </span>
          ))}
        </div>
      </div>

      {/* AI Analysis box now uses the purple theme */}
      {idea.ai_feedback && (
        <div className="bg-purple-500/10 p-6 rounded-xl border border-purple-400/20 shadow-lg mb-6">
          <h3 className="text-xl font-bold mb-2 text-purple-300">🤖 AI Analysis</h3>
          <p className="text-gray-200 whitespace-pre-wrap">{idea.ai_feedback}</p>
        </div>
      )}
      
      <Comments ideaId={idea.id} />
    </div>
  );
}