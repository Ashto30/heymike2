// HeyMike MCP Bridge - connects dashboard to Mike Ops
// Handles AI chat via MCP gateway

const express = require('express');
const cors = require('cors');
const { WebSocket } = require('ws');
const crypto = require('crypto');

const app = express();
app.use(cors());
app.use(express.json());

const GATEWAY_WS = 'ws://127.0.0.1:18789';
const GATEWAY_TOKEN = 'c44ab285ccbfe292e660a65029766dd74966aad5f9f43361';

// Store for pending requests
const pendingRequests = new Map();

// Generate request ID
const generateId = () => crypto.randomBytes(16).toString('hex');

// Send message to MCP gateway and wait for response
async function sendToGateway(method, params) {
  return new Promise((resolve, reject) => {
    const ws = new WebSocket(GATEWAY_WS, {
      headers: {
        'Authorization': `Bearer ${GATEWAY_TOKEN}`
      }
    });

    const requestId = generateId();
    const timeout = setTimeout(() => {
      ws.close();
      reject(new Error('Gateway timeout'));
    }, 30000);

    ws.on('open', () => {
      const message = JSON.stringify({
        jsonrpc: '2.0',
        id: requestId,
        method,
        params
      });
      ws.send(message);
    });

    ws.on('message', (data) => {
      try {
        const response = JSON.parse(data.toString());
        if (response.id === requestId) {
          clearTimeout(timeout);
          ws.close();
          resolve(response.result);
        }
      } catch (e) {
        console.error('Parse error:', e);
      }
    });

    ws.on('error', (err) => {
      clearTimeout(timeout);
      reject(err);
    });
  });
}

// Chat endpoint - sends message to Mike Ops via MCP
app.post('/api/chat', async (req, res) => {
  try {
    const { message, userId } = req.body;
    
    if (!message) {
      return res.status(400).json({ error: 'Message required' });
    }

    console.log('Chat request from:', userId);
    console.log('Message:', message.substring(0, 100));

    // Try to send to MCP gateway
    let response;
    try {
      response = await sendToGateway('tools/call', {
        name: 'anthropic_messages_create',
        arguments: {
          model: 'minimax-portal/MiniMax-M2.7',
          max_tokens: 1024,
          messages: [
            { role: 'user', content: message }
          ]
        }
      });
    } catch (gatewayErr) {
      console.log('Gateway not reachable, using fallback');
      // Gateway fallback response
      response = {
        content: [
          {
            type: 'text',
            text: `I received your message: "${message.substring(0, 50)}..."\n\nI'm processing this. For now, this is a placeholder response while we set up the full MCP connection.\n\nTo properly connect, I need the gateway running locally. You can start it with: openclaw gateway start`
          }
        ]
      };
    }

    res.json({ 
      success: true,
      response: response?.content?.[0]?.text || 'Processed message'
    });

  } catch (error) {
    console.error('Chat error:', error);
    res.status(500).json({ error: 'Failed to process message' });
  }
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', service: 'heymike-mcp-bridge' });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`HeyMike MCP Bridge running on port ${PORT}`);
  console.log(`Gateway: ${GATEWAY_WS}`);
});

module.exports = app;