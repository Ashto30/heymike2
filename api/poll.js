// Poll for assistant response from local connector
import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = 'https://uyaepyidfwkypjvsxzae.supabase.co'
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InV5YWVweWlkZndreXBqdnN4emFlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzY2MDYxODYsImV4cCI6MjA5MjE4MjE4Nn0.i1qnxJeYDB9ON_7cGT7NDm2dOAysCDQL0bM1r__EPKA'
const SESSION_ID = 'heymike-demo-session'

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const supabase = createClient(SUPABASE_URL, SUPABASE_KEY)

  try {
    // Get latest assistant response
    const { data, error } = await supabase
      .from('demo_messages')
      .select('*')
      .eq('session_id', SESSION_ID)
      .eq('sender', 'assistant')
      .order('created_at', { ascending: false })
      .limit(1)

    if (error) throw error

    if (data && data.length > 0) {
      // Delete the response after sending
      await supabase
        .from('demo_messages')
        .delete()
        .eq('id', data[0].id)

      return res.status(200).json({
        hasResponse: true,
        response: data[0].content
      })
    }

    return res.status(200).json({ hasResponse: false })
  } catch (error) {
    console.error('Poll error:', error)
    return res.status(500).json({ error: error.message })
  }
}