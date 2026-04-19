// HeyMike Local Connector v6
// Uses direct CLI to send messages to Mike Ops
// Explicitly sets config path to Mike Ops config
//
// Keep this running while you use HeyMike dashboard

const { createClient } = require('@supabase/supabase-js');
const { spawn } = require('child_process');

// Config
const SUPABASE_URL = 'https://uyaepyidfwkypjvsxzae.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InV5YWVweWlkZndreXBqdnN4emFlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzY2MDYxODYsImV4cCI6MjA5MjE4MjE4Nn0.i1qnxJeYDB9ON_7cGT7NDm2dOAysCDQL0bM1r__EPKA';
const SESSION_ID = 'heymike-demo-session';

// Mike Ops specific config
const MIKE_CONFIG = '/Users/ash/.openclaw/openclaw-mike.json';

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

let isProcessing = false;

console.log('╔══════════════════════════════════════════╗');
console.log('║  HeyMike Local Connector v6            ║');
console.log('║  Explicitly using Mike Ops config     ║');
console.log('╚══════════════════════════════════════════╝\n');

// Send to Mike Ops via CLI
function sendToMikeOps(message) {
  return new Promise((resolve, reject) => {
    console.log('🤖 Sending to Mike Ops via CLI...');
    
    // Create clean env with explicit config path
    const env = {
      HOME: process.env.HOME,
      USER: process.env.USER,
      PATH: process.env.PATH,
      OPENCLAW_CONFIG_PATH: MIKE_CONFIG,
      OPENCLAW_GATEWAY_PORT: '18790'
    };
    
    const proc = spawn('openclaw', [
      'agent',
      '--agent', 'main',
      '--message', message
    ], {
      env: env,
      timeout: 30000
    });

    let stdout = '';
    let stderr = '';

    proc.stdout.on('data', (data) => {
      stdout += data.toString();
    });

    proc.stderr.on('data', (data) => {
      stderr += data.toString();
    });

    proc.on('close', (code) => {
      if (code === 0) {
        // Extract just the response part (after the --- separator if present)
        let response = stdout.trim();
        if (response.includes('---')) {
          const parts = response.split('---');
          response = parts[parts.length - 1].trim();
        }
        resolve(response);
      } else {
        reject(new Error(stderr || `Exit code: ${code}`));
      }
    });

    proc.on('error', (err) => {
      reject(err);
    });

    // Timeout after 30 seconds
    setTimeout(() => {
      proc.kill();
      reject(new Error('Timeout (30s)'));
    }, 30000);
  });
}

// Poll for new messages from dashboard
async function pollMessages() {
  if (isProcessing) return;
  
  try {
    const { data: messages, error } = await supabase
      .from('demo_messages')
      .select('*')
      .eq('session_id', SESSION_ID)
      .eq('sender', 'user')
      .not('processed', 'eq', true)
      .order('created_at', { ascending: true })
      .limit(1);

    if (error) throw error;

    if (messages && messages.length > 0) {
      isProcessing = true;
      const msg = messages[0];
      
      console.log('\n📨 Message from dashboard:');
      console.log(`   "${msg.content.substring(0, 80)}${msg.content.length > 80 ? '...' : ''}"`);
      
      try {
        const response = await sendToMikeOps(msg.content);
        
        console.log('✅ Response received');
        console.log(`   "${response.substring(0, 80)}${response.length > 80 ? '...' : ''}"`);
        
        // Save response to Supabase
        await supabase.from('demo_messages').insert({
          session_id: SESSION_ID,
          sender: 'assistant',
          content: response,
          processed: false
        });
        
        console.log('💾 Response saved to Supabase');
        
      } catch (err) {
        console.error('❌ Mike Ops error:', err.message);
        
        await supabase.from('demo_messages').insert({
          session_id: SESSION_ID,
          sender: 'assistant',
          content: `Error: ${err.message}. Is Mike Ops running?`,
          processed: false
        });
      }
      
      // Mark original as processed
      await supabase.from('demo_messages').update({ processed: true }).eq('id', msg.id);
      
      isProcessing = false;
    }

  } catch (error) {
    console.error('Poll error:', error.message);
  }
}

// Main
async function main() {
  console.log('📡 Polling Supabase for messages...');
  console.log('   (Polls every 2 seconds)\n');
  console.log('Press Ctrl+C to stop\n');
  
  // Start polling
  setInterval(pollMessages, 2000);
  pollMessages();
}

main().catch(console.error);