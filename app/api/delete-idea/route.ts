// app/api/delete-idea/route.ts
import { createClient } from '@/utils/supabase/server';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { ideaId } = await req.json();

  if (!ideaId) {
    return NextResponse.json({ error: 'Idea ID is required' }, { status: 400 });
  }

  // The .eq('user_id', user.id) is crucial.
  // It ensures users can ONLY delete their OWN ideas.
  const { error } = await supabase
    .from('ideas')
    .delete()
    .eq('id', ideaId)
    .eq('user_id', user.id);

  if (error) {
    console.error('Error deleting idea:', error);
    return NextResponse.json({ error: 'Failed to delete idea' }, { status: 500 });
  }

  return NextResponse.json({ message: 'Idea deleted successfully' });
}