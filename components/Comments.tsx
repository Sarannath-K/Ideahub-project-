// components/Comments.tsx
import { createClient } from '@/utils/supabase/server';
import CommentForm from './CommentForm';

export default async function Comments({ ideaId }: { ideaId: number }) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const { data: comments } = await supabase
    .from('comments')
    .select(`*, profiles ( username )`)
    .eq('idea_id', ideaId)
    .order('created_at', { ascending: true });

  return (
    // This is the updated container with the glass effect
    <div className="bg-white/5 border border-white/10 backdrop-blur-lg rounded-xl shadow-lg p-8 transition-colors duration-300 hover:border-purple-400">
      <h3 className="text-2xl font-bold mb-6 text-white">Discussion</h3>
      
      {user && <CommentForm ideaId={ideaId} userId={user.id} />}

      <div className="space-y-6 mt-6">
        {comments?.map((comment) => (
          // Added a lighter border between comments
          <div key={comment.id} className="border-t border-white/10 pt-6">
            <p className="text-gray-200 whitespace-pre-wrap">{comment.content}</p>
            <div className="text-xs text-gray-400 mt-2">
              {/* @ts-ignore */}
              <span>{comment.profiles?.username || 'Anonymous'}</span>
              {' · '}
              <span>{new Date(comment.created_at).toLocaleDateString()}</span>
            </div>
          </div>
        ))}
        {comments?.length === 0 && <p className="text-gray-400">No comments yet. Be the first to share your thoughts!</p>}
      </div>
    </div>
  );
}