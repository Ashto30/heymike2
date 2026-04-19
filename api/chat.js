import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.VITE_SUPABASE_URL || 'https://uyaepyidfwkypjvsxzae.supabase.co';
const SUPABASE_KEY = process.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InV5YWVweWlkZndreXBqdnN4emFlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzY2MDYxODYsImV4cCI6MjA5MjE4MjE4Nn0.i1qnxJeYDB9ON_7cGT7NDm2dOAysCDQL0bM1r__EPKA';

const SESSION_ID = 'heymike-demo-session';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { message } = req.body;

  if (!message) {
    return res.status(400).json({ error: 'Message required' });
  }

  const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

  try {
    // Save user message to Supabase
    const { error: insertError } = await supabase
      .from('demo_messages')
      .insert({
        session_id: SESSION_ID,
        sender: 'user',
        content: message,
        processed: false
      });

    if (insertError) throw insertError;

    // Wait for response (poll for up to 15 seconds)
    let attempts = 0;
    const maxAttempts = 30;

    while (attempts < maxAttempts) {
      await new Promise(r => setTimeout(r, 500));

      const { data: responses, error: selectError } = await supabase
        .from('demo_messages')
        .select('*')
        .eq('session_id', SESSION_ID)
        .eq('sender', 'assistant')
        .order('created_at', { ascending: false })
        .limit(1);

      if (selectError) throw selectError;

      if (responses && responses.length > 0) {
        const response = responses[0];

        // Delete the response
        await supabase
          .from('demo_messages')
          .delete()
          .eq('id', response.id);

        return res.status(200).json({
          success: true,
          response: response.content
        });
      }

      attempts++;
    }

    return res.status(200).json({
      success: true,
      response: "I'm thinking... The local connector might not be running. Check the terminal."
    });

  } catch (error) {
    console.error('Chat error:', error);
    return res.status(500).json({ error: error.message });
  }
}