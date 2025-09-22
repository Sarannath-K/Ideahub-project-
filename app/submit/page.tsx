// app/submit/page.tsx
import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';
import IdeaForm from '@/components/IdeaForm';

export default async function SubmitPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  return (
    // This div now centers the form vertically and horizontally
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        <h1 className="text-4xl font-anton uppercase tracking-wider text-center mb-8 text-white">
          Share Your Idea
        </h1>
        {/* We will apply the glass effect to the form component itself */}
        <IdeaForm />
      </div>
    </div>
  );
}