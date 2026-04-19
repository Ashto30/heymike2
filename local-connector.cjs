// HeyMike Local Connector v3
// Uses HTTP API to connect to OpenClaw gateway
//
// Keep this running while you use HeyMike dashboard

const { createClient } = require('@supabase/supabase-js');
const http = require('http');

// Config
const SUPABASE_URL = 'https://uyaepyidfwkypjvsxzae.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InV5YWVweWlkZndreXBqdnN4emFlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzY2MDYxODYsImV4cCI6MjA5MjE4MjE4Nn0.i1qnxJeYDB9ON_7cGT7NDm2dOAysCDQL0bM1r__EPKA';
const GATEWAY_TOKEN = 'c44ab285ccbfe292e660a65029766dd74966aad5f9f43361';
const GATEWAY_HOST = '127.0.0.1';
const GATEWAY_PORT = 18789;
const SESSION_ID = 'heymike-demo-session';

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

let isProcessing = false;

console.log('╔══════════════════════════════════════════╗');
console.log('║  HeyMike Local Connector v3            ║');
console.log('╚══════════════════════════════════════════╝\n');

// Send to Mike Ops via HTTP
function sendToMikeOps(message) {
  return new Promise((resolve, reject) => {
    const postData = JSON.stringify({
      tool: 'sessions_send',
      action: 'json',
      args: {
        sessionKey: 'main',
        message: message
      },
      dryRun: false
    });

    const options = {
      hostname: GATEWAY_HOST,
      port: GATEWAY_PORT,
      path: '/tools/invoke',
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${GATEWAY_TOKEN}`,
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(postData)
      }
    };

    const req = http.request(options, (res) => {
      let data = '';
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        try {
          const response = JSON.parse(data);
          if (response.result) {
            resolve(response.result);
          } else {
            reject(new Error('No result from gateway'));
          }
        } catch (e) {
          reject(new Error('Failed to parse response: ' + data.substring(0, 200)));
        }
      });
    });

    req.on('error', (e) => {
      reject(e);
    });

    req.setTimeout(30000, () => {
      req.destroy();
      reject(new Error('Gateway timeout (30s)'));
    });

    req.write(postData);
    req.end();
  });
}

// Test gateway connection
function testGateway() {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: GATEWAY_HOST,
      port: GATEWAY_PORT,
      path: '/health',
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${GATEWAY_TOKEN}`
      }
    };

    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => {
        if (res.statusCode === 200) {
          resolve(true);
        } else {
          resolve(false);
        }
      });
    });

    req.on('error', () => resolve(false));
    req.setTimeout(3000, () => { req.destroy(); resolve(false); });
    req.end();
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
        console.log('🤖 Sending to Mike Ops...');
        const response = await sendToMikeOps(msg.content);
        
        console.log('✅ Response received');
        const responseText = typeof response === 'string' ? response : JSON.stringify(response).substring(0, 200);
        console.log(`   "${responseText.substring(0, 80)}${responseText.length > 80 ? '...' : ''}"`);
        
        // Save response to Supabase
        await supabase.from('demo_messages').insert({
          session_id: SESSION_ID,
          sender: 'assistant',
          content: typeof response === 'string' ? response : JSON.stringify(response),
          processed: true
        });
        
        console.log('💾 Response saved to Supabase');
        
      } catch ( err) {
        console.error('❌ Mike Ops error:', err.message);
        
        await supabase.from('demo_messages').insert({
          session_id: SESSION_ID,
          sender: 'assistant',
          content: `Error: ${err.message}. Is Mike Ops gateway running?`,
          processed: true
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
  // Test gateway
  console.log('Testing gateway connection...');
  const gatewayOk = await testGateway();
  
  if (gatewayOk) {
    console.log('✅ Gateway is reachable\n');
  } else {
    console.log('⚠️  Gateway not reachable on localhost:18789');
    console.log('   Make sure OpenClaw gateway is running: openclaw gateway start\n');
  }
  
  console.log('📡 Polling Supabase for messages...');
  console.log('   (Polls every 2 seconds)\n');
  console.log('Press Ctrl+C to stop\n');
  
  // Start polling
  setInterval(pollMessages, 2000);
  pollMessages();
}

main().catch(console.error);