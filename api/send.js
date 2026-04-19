// Save user message to Supabase
import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = 'https://uyaepyidfwkypjvsxzae.supabase.co'
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InV5YWVweWlkZndreXBqdnN4emFlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzY2MDYxODYsImV4cCI6MjA5MjE4MjE4Nn0.i1qnxJeYDB9ON_7cGT7NDm2dOAysCDQL0bM1r__EPKA'
const SESSION_ID = 'heymike-demo-session'

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const { message } = req.body
  if (!message) {
    return res.status(400).json({ error: 'Message required' })
  }

  const supabase = createClient(SUPABASE_URL, SUPABASE_KEY)

  try {
    const { error } = await supabase
      .from('demo_messages')
      .insert({
        session_id: SESSION_ID,
        sender: 'user',
        content: message,
        processed: false
      })

    if (error) throw error

    return res.status(200).json({ success: true })
  } catch (error) {
    console.error('Send error:', error)
    return res.status(500).json({ error: error.message })
  }
}