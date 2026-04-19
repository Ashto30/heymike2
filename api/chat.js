// Vercel Serverless API Route - Chat with Mike Ops
// This runs as a serverless function on Vercel (free tier)

const WebSocket = require('ws');

export default async function handler(req, res) {
  // Only allow POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { message, userId } = req.body;

  if (!message) {
    return res.status(400).json({ error: 'Message required' });
  }

  try {
    // Connect to Mike Ops gateway
    const gatewayUrl = process.env.GATEWAY_WS || 'ws://127.0.0.1:18789';
    const gatewayToken = process.env.GATEWAY_TOKEN || 'c44ab285ccbfe292e660a65029766dd74966aad5f9f43361';

    // For serverless, we can't hold WebSocket open - use polling fallback
    // In production, you'd use a message queue (Redis, Supabase Realtime, etc.)
    
    // For now, return a response indicating MCP is being set up
    const response = await callMikeOps(message, gatewayUrl, gatewayToken);

    return res.status(200).json({
      success: true,
      response: response,
      userId: userId || 'demo'
    });

  } catch (error) {
    console.error('Chat error:', error);
    
    // Fallback response when MCP isn't connected
    return res.status(200).json({
      success: true,
      response: getFallbackResponse(message),
      userId: userId || 'demo',
      note: 'MCP not yet connected'
    });
  }
}

// Call Mike Ops via WebSocket gateway
function callMikeOps(message, gatewayUrl, gatewayToken) {
  return new Promise((resolve, reject) => {
    try {
      const ws = new WebSocket(gatewayUrl, {
        headers: { 'Authorization': `Bearer ${gatewayToken}` }
      });

      const requestId = crypto.randomBytes(16).toString('hex');
      let responseData = '';

      const timeout = setTimeout(() => {
        ws.close();
        reject(new Error('Gateway timeout'));
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
              max_tokens: 1024,
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
            resolve(response.result?.content?.[0]?.text || 'Processed');
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

// Fallback responses when MCP isn't connected
function getFallbackResponse(message) {
  const lower = message.toLowerCase();
  
  if (lower.includes('campaign')) {
    return "I'd love to create a campaign for you! Unfortunately the MCP connection isn't set up yet. Once connected, I'll be able to generate full campaigns with ads, targeting, and scheduling.\n\nFor now, what's the campaign goal and target audience?";
  }
  
  if (lower.includes('ad') || lower.includes('content')) {
    return "I can generate amazing ad content for you! Meta, LinkedIn, Google - all supported. The MCP connection will let me create production-ready ads.\n\nWhat platform and product/service should I create ads for?";
  }
  
  if (lower.includes('help')) {
    return "I'm HeyMike, your AI Marketing Director! I can:\n\n• Create marketing campaigns\n• Generate ad creatives\n• Write email sequences\n• Research competitors\n• Plan content calendars\n\nWhat's your first project?";
  }
  
  return "I'm here and ready to help! The MCP connection is being set up for full AI capabilities. In the meantime, tell me about your marketing project and I'll guide you through the process.";
}