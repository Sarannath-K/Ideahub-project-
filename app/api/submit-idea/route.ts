// app/api/submit-idea/route.ts
import { createClient } from '@/utils/supabase/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { createClient as createAdminClient } from '@supabase/supabase-js';

export async function POST(req: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
  }

  const { title, description, tags } = await req.json();
  if (!title || !description) {
    return new Response(JSON.stringify({ error: 'Title and description are required' }), { status: 400 });
  }

  try {
    // 1. Get AI Feedback
    const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY!);
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

    const prompt = `Analyze the following business idea. Provide a short, constructive paragraph of feedback focusing on its potential, potential challenges, and a suggested first step. Be encouraging and realistic.

    Idea Title: ${title}
    Idea Description: ${description}`;

    const result = await model.generateContent(prompt);
    const ai_feedback = result.response.text();

    // 2. Save to Database using the Admin client
    // This is necessary to bypass RLS from a secure server environment
    const supabaseAdmin = createAdminClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!,
    );

    const tagsArray = tags.split(',').map((tag: string) => tag.trim()).filter((tag: string) => tag);

    const { data, error: dbError } = await supabaseAdmin.from('ideas').insert({
      title,
      description,
      tags: tagsArray,
      ai_feedback, // Save the AI feedback
      user_id: user.id,
    }).select().single();

    if (dbError) throw dbError;

    // 3. Return a success response
    return new Response(JSON.stringify({ message: 'Idea submitted successfully!', idea: data }), { status: 200 });

  } catch (error) {
    console.error('Error processing idea:', error);
    return new Response(JSON.stringify({ error: 'Failed to process idea' }), { status: 500 });
  }
}