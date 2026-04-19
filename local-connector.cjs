// HeyMike Local Connector
// Runs on YOUR machine, bridges dashboard to Mike Ops
// 
// SETUP:
// 1. Run this SQL in Supabase SQL Editor first:
//    CREATE TABLE public.demo_messages (
//      id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
//      session_id TEXT NOT NULL,
//      content TEXT NOT NULL,
//      sender TEXT DEFAULT 'user',
//      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
//      processed BOOLEAN DEFAULT FALSE
//    );
//    ALTER TABLE public.demo_messages ENABLE ROW LEVEL SECURITY;
//    CREATE POLICY "Allow all access" ON public.demo_messages FOR ALL USING (true) WITH CHECK (true);
//
// 2. Then run: npm install
// 3. Then: node local-connector.js
//
// Keep this running while you use HeyMike dashboard

const { createClient } = require('@supabase/supabase-js');
const WebSocket = require('ws');

// Config - same Supabase as dashboard
const SUPABASE_URL = 'https://uyaepyidfwkypjvsxzae.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InV5YWVweWlkZndreXBqdnN4emFlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzY2MDYxODYsImV4cCI6MjA5MjE4MjE4Nn0.i1qnxJeYDB9ON_7cGT7NDm2dOAysCDQL0bM1r__EPKA';

// Mike Ops gateway
const GATEWAY_WS = 'ws://127.0.0.1:18789';
const GATEWAY_TOKEN = 'c44ab285ccbfe292e660a65029766dd74966aad5f9f43361';

// Session ID for demo (in real app, this would be per-user)
const SESSION_ID = 'heymike-demo-session';

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

let isProcessing = false;

console.log('╔══════════════════════════════════════════╗');
console.log('║     HeyMike Local Connector             ║');
console.log('║  Connect dashboard to Mike Ops         ║');
console.log('╚══════════════════════════════════════════╝\n');

// Check gateway connection
function checkGateway() {
  return new Promise((resolve) => {
    try {
      const ws = new WebSocket(GATEWAY_WS, {
        headers: { 'Authorization': `Bearer ${GATEWAY_TOKEN}` }
      });
      
      const timeout = setTimeout(() => {
        ws.terminate();
        resolve(false);
      }, 3000);
      
      ws.on('open', () => {
        clearTimeout(timeout);
        ws.close();
        resolve(true);
      });
      
      ws.on('error', () => {
        clearTimeout(timeout);
        resolve(false);
      });
    } catch (e) {
      resolve(false);
    }
  });
}

// Send message to Mike Ops via gateway
function sendToMikeOps(message) {
  return new Promise((resolve, reject) => {
    try {
      const ws = new WebSocket(GATEWAY_WS, {
        headers: { 'Authorization': `Bearer ${GATEWAY_TOKEN}` }
      });
      
      const requestId = require('crypto').randomBytes(16).toString('hex');
      let responseData = '';
      
      const timeout = setTimeout(() => {
        ws.close();
        reject(new Error('Gateway timeout (30s)'));
      }, 30000);
      
      ws.on('open', () => {
        const toolCall = JSON.stringify({
          jsonrpc: '2.0',
          id: requestId,
          method: 'tools/call',
          params: {
            name: 'anthropic_messages_create',
            arguments: {
              model: 'minimax-portal/MiniMax-M2.7',
              max_tokens: 2048,
              messages: [{ role: 'user', content: message }]
            }
          }
        });
        ws.send(toolCall);
      });
      
      ws.on('message', (data) => {
        responseData += data.toString();
        try {
          const response = JSON.parse(responseData);
          if (response.id === requestId) {
            clearTimeout(timeout);
            ws.close();
            const text = response.result?.content?.[0]?.text || 'Processed';
            resolve(text);
          }
        } catch (e) {
          // Wait for more data
        }
      });
      
      ws.on('error', (err) => {
        clearTimeout(timeout);
        reject(err);
      });
      
    } catch (e) {
      reject(e);
    }
  });
}

// Poll for new messages
async function pollMessages() {
  if (isProcessing) return;
  
  try {
    const { data: messages, error } = await supabase
      .from('demo_messages')
      .select('*')
      .eq('session_id', SESSION_ID)
      .eq('sender', 'user')
      .eq('processed', false)
      .order('created_at', { ascending: true })
      .limit(1);
    
    if (error) throw error;
    
    if (messages && messages.length > 0) {
      isProcessing = true;
      const msg = messages[0];
      
      console.log('\n📨 New message received');
      console.log(`   "${msg.content.substring(0, 80)}${msg.content.length > 80 ? '...' : ''}"`);
      
      try {
        console.log('🤖 Sending to Mike Ops...');
        const response = await sendToMikeOps(msg.content);
        
        console.log('✅ Response received');
        console.log(`   "${response.substring(0, 80)}${response.length > 80 ? '...' : ''}"`);
        
        // Save response to Supabase
        await supabase.from('demo_messages').insert({
          session_id: SESSION_ID,
          sender: 'assistant',
          content: response,
          processed: true
        });
        
        // Mark original as processed
        await supabase.from('demo_messages').update({ processed: true }).eq('id', msg.id);
        
        console.log('💾 Response saved to Supabase');
        
      } catch (err) {
        console.error('❌ Mike Ops error:', err.message);
        
        await supabase.from('demo_messages').insert({
          session_id: SESSION_ID,
          sender: 'assistant',
          content: `Error: ${err.message}. Is Mike Ops gateway running?`,
          processed: true
        });
        
        await supabase.from('demo_messages').update({ processed: true }).eq('id', msg.id);
      }
      
      isProcessing = false;
    }
    
  } catch (error) {
    console.error('Poll error:', error.message);
  }
}

// Main
async function main() {
  // Check gateway
  const gatewayOk = await checkGateway();
  
  if (gatewayOk) {
    console.log('✅ Mike Ops gateway connected');
  } else {
    console.log('⚠️  Mike Ops gateway not reachable');
    console.log('   Start OpenClaw: openclaw gateway start');
  }
  
  console.log('\n📡 Polling Supabase for messages...');
  console.log('   (Polls every 2 seconds)\n');
  console.log('Press Ctrl+C to stop\n');
  
  // Start polling
  setInterval(pollMessages, 2000);
  pollMessages();
}

main().catch(console.error);