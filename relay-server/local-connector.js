#!/usr/bin/env node
// HeyMike Local Connector - runs on Ash's machine, connects to Mike Ops via gateway
// Polls the relay server for new messages and sends them to me for processing

const WebSocket = require('ws');
const fetch = require('node-fetch');

// Configuration
const RELAY_URL = process.env.RELAY_URL || 'http://localhost:3002';
const GATEWAY_WS = 'ws://127.0.0.1:18789';
const GATEWAY_TOKEN = 'c44ab285ccbfe292e660a65029766dd74966aad5f9f43361';
const POLL_INTERVAL = 3000; // 3 seconds

// Demo user ID (for testing without auth)
const DEMO_USER_ID = '00000000-0000-0000-0000-000000000000';

let lastPollTime = new Date().toISOString();
let isConnected = false;

console.log('========================================');
console.log('  HeyMike Local Connector');
console.log('  Connecting dashboard to Mike Ops...');
console.log('========================================\n');

// Check gateway connection
async function checkGateway() {
  return new Promise((resolve) => {
    try {
      const ws = new WebSocket(GATEWAY_WS, {
        headers: { 'Authorization': `Bearer ${GATEWAY_TOKEN}` }
      });
      
      ws.on('open', () => {
        console.log('✓ Gateway connection ready');
        ws.close();
        resolve(true);
      });
      
      ws.on('error', () => {
        console.log('✗ Gateway not reachable (is OpenClaw running?)');
        resolve(false);
      });
      
      setTimeout(() => {
        ws.terminate();
        resolve(false);
      }, 3000);
    } catch (e) {
      console.log('✗ Gateway error:', e.message);
      resolve(false);
    }
  });
}

// Send message to Mike Ops via gateway
async function sendToMikeOps(message) {
  return new Promise((resolve, reject) => {
    try {
      const ws = new WebSocket(GATEWAY_WS, {
        headers: { 'Authorization': `Bearer ${GATEWAY_TOKEN}` }
      });
      
      const requestId = require('crypto').randomBytes(16).toString('hex');
      
      ws.on('open', () => {
        // Use the messages_create tool
        const toolCall = JSON.stringify({
          jsonrpc: '2.0',
          id: requestId,
          method: 'tools/call',
          params: {
            name: 'anthropic_messages_create',
            arguments: {
              model: 'minimax-portal/MiniMax-M2.7',
              max_tokens: 1024,
              messages: [
                { role: 'user', content: message }
              ]
            }
          }
        });
        ws.send(toolCall);
      });
      
      let responseData = '';
      
      ws.on('message', (data) => {
        responseData += data.toString();
        try {
          const response = JSON.parse(responseData);
          if (response.id === requestId) {
            ws.close();
            resolve(response.result?.content?.[0]?.text || 'Processed');
          }
        } catch (e) {
          // Partial parse, wait for more data
        }
      });
      
      ws.on('error', (err) => {
        reject(err);
      });
      
      setTimeout(() => {
        ws.close();
        reject(new Error('Gateway timeout'));
      }, 30000);
      
    } catch (e) {
      reject(e);
    }
  });
}

// Poll relay for new messages
async function pollMessages() {
  try {
    const response = await fetch(`${RELAY_URL}/poll/${DEMO_USER_ID}?since=${encodeURIComponent(lastPollTime)}`);
    
    if (!response.ok) {
      console.log('Poll failed:', response.status);
      return;
    }
    
    const data = await response.json();
    
    if (data.messages && data.messages.length > 0) {
      for (const msg of data.messages) {
        if (msg.sender === 'user') {
          console.log('\n--- New Message ---');
          console.log('User:', msg.content.substring(0, 100));
          
          // Send to Mike Ops
          console.log('Sending to Mike Ops...');
          try {
            const mikeResponse = await sendToMikeOps(msg.content);
            console.log('Mike Ops response:', mikeResponse.substring(0, 100));
            
            // Post response back to relay
            await fetch(`${RELAY_URL}/simulate-response`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                userId: DEMO_USER_ID,
                response: mikeResponse
              })
            });
            console.log('Response sent to dashboard');
          } catch (e) {
            console.log('Mike Ops error:', e.message);
          }
        }
      }
      lastPollTime = new Date().toISOString();
    }
    
  } catch (e) {
    // Silent fail on poll errors
  }
}

// Main
async function main() {
  console.log('Relay URL:', RELAY_URL);
  console.log('Gateway:', GATEWAY_WS);
  console.log('');
  
  // Check gateway
  const gatewayOk = await checkGateway();
  
  if (!gatewayOk) {
    console.log('\n⚠️  Gateway not available. Mike Ops will not receive messages.');
    console.log('   Start OpenClaw gateway: openclaw gateway start');
    console.log('');
  }
  
  // Start polling
  console.log('\nStarting poll loop...');
  console.log('Press Ctrl+C to stop\n');
  
  setInterval(pollMessages, POLL_INTERVAL);
}

main();