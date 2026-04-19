// HeyMike MCP Relay Server
// This bridges the dashboard (cloud) with Mike Ops (local)
// Deploy this to Render.com (free tier)

// Environment variables:
// - SUPABASE_URL
// - SUPABASE_ANON_KEY  
// - GATEWAY_TOKEN (auth for the bridge)

const express = require('express');
const { createClient } = require('@supabase/supabase-js');
const cors = require('cors');
const crypto = require('crypto');

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3002;

// Supabase client
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

// In-memory WebSocket connections (for real-time responses)
// In production, use Redis or a proper message broker
const pendingResponses = new Map();

// Generate message ID
const generateId = () => crypto.randomBytes(16).toString('hex');

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', service: 'heymike-mcp-relay' });
});

// Send message to Mike Ops (via local gateway polling)
app.post('/send', async (req, res) => {
  try {
    const { message, userId, sessionId } = req.body;
    
    if (!message || !userId) {
      return res.status(400).json({ error: 'message and userId required' });
    }

    console.log('New message from user:', userId);
    console.log('Session:', sessionId);

    // Store message in Supabase
    const { data, error } = await supabase
      .from('messages')
      .insert({
        user_id: userId,
        content: message,
        sender: 'user',
        session_id: sessionId || generateId()
      })
      .select()
      .single();

    if (error) throw error;

    // Return the message ID so frontend can poll for response
    res.json({ 
      success: true, 
      messageId: data.id,
      sessionId: data.session_id 
    });

  } catch (error) {
    console.error('Send error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Get responses (polling endpoint)
app.get('/poll/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const { since } = req.query; // ISO timestamp

    // Get new messages for this user
    let query = supabase
      .from('messages')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: true });

    if (since) {
      query = query.gt('created_at', since);
    }

    const { data, error } = await query;

    if (error) throw error;

    res.json({ messages: data || [] });

  } catch (error) {
    console.error('Poll error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Simulate HeyMike response (placeholder until MCP connection)
app.post('/simulate-response', async (req, res) => {
  try {
    const { userId, response } = req.body;

    // Store the AI response
    const { data, error } = await supabase
      .from('messages')
      .insert({
        user_id: userId,
        content: response,
        sender: 'assistant'
      })
      .select()
      .single();

    if (error) throw error;

    res.json({ success: true, message: data });

  } catch (error) {
    console.error('Simulate error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`HeyMike MCP Relay running on port ${PORT}`);
  console.log(`Supabase: ${supabaseUrl ? 'connected' : 'NOT CONNECTED'}`);
});

module.exports = app;