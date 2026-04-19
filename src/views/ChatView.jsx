import { useState, useRef, useEffect } from 'react'
import HeyMikeIcon from '../components/HeyMikeIcon'

// Chat View - connects to Mike Ops via MCP
const ChatView = () => {
  const [messages, setMessages] = useState([
    { text: "Hey! I'm Mike Ops, your AI Marketing Director.\n\nJust tell me what you want to build - campaigns, ads, content - and I'll handle the rest. You approve, I create.\n\nWhat are we building today?", isUser: false, time: 'Just now' },
  ])
  const [input, setInput] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [isMikeTyping, setIsMikeTyping] = useState(false)
  const messagesEndRef = useRef(null)
  const pollIntervalRef = useRef(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
    return () => {
      if (pollIntervalRef.current) clearInterval(pollIntervalRef.current)
    }
  }, [messages])

  // Poll for Mike's response
  const startPolling = () => {
    setIsMikeTyping(true)
    
    pollIntervalRef.current = setInterval(async () => {
      try {
        const response = await fetch('/api/poll')
        const data = await response.json()
        
        if (data.hasResponse) {
          clearInterval(pollIntervalRef.current)
          setIsMikeTyping(false)
          setMessages(prev => [...prev, { 
            text: data.response, 
            isUser: false, 
            time: 'Just now' 
          }])
        }
      } catch (e) {
        console.error('Poll error:', e)
      }
    }, 1000) // Poll every second
  }

  const handleSend = async () => {
    if (!input.trim()) return
    
    const userMessage = input
    setInput('')
    
    // Add user message
    setMessages(prev => [...prev, { text: userMessage, isUser: true, time: 'Just now' }])
    
    setIsTyping(true)
    
    try {
      // Send to MCP via Supabase
      await fetch('/api/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userMessage })
      })
      
      setIsTyping(false)
      
      // Start polling for Mike's response
      startPolling()
      
    } catch (error) {
      setIsTyping(false)
      setMessages(prev => [...prev, { 
        text: "Couldn't reach Mike. Make sure the local connector is running.", 
        isUser: false, 
        time: 'Just now' 
      }])
    }
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', background: '#FAFAFA' }}>
      {/* Chat header */}
      <div style={{
        padding: '20px 28px',
        borderBottom: '1px solid #F3F4F6',
        background: 'white',
        display: 'flex',
        alignItems: 'center',
        gap: '14px',
      }}>
        <div style={{
          width: '44px',
          height: '44px',
          borderRadius: '12px',
          background: '#2563EB',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
          <HeyMikeIcon name="heymikeLogo" size={26} />
        </div>
        <div>
          <div style={{ fontWeight: '600', fontSize: '16px', color: '#111827' }}>Mike Ops</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '2px' }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#22C55E', display: 'inline-block' }} />
            <span style={{ fontSize: '13px', color: '#6B7280' }}>Online</span>
          </div>
        </div>
      </div>

      {/* Messages area */}
      <div style={{
        flex: '1',
        overflow: 'auto',
        padding: '28px',
        background: '#FAFAFA',
      }}>
        {messages.map((msg, i) => (
          <div key={i} style={{
            display: 'flex',
            justifyContent: msg.isUser ? 'flex-end' : 'flex-start',
            gap: '12px',
            marginBottom: '20px',
          }}>
            {!msg.isUser && (
              <div style={{
                width: '36px',
                height: '36px',
                borderRadius: '10px',
                background: '#2563EB',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}>
                <HeyMikeIcon name="heymikeLogo" size={20} />
              </div>
            )}
            <div style={{ maxWidth: '72%' }}>
              <div style={{
                padding: '14px 18px',
                borderRadius: msg.isUser ? '18px 18px 6px 18px' : '18px 18px 18px 6px',
                background: msg.isUser ? '#2563EB' : 'white',
                color: msg.isUser ? 'white' : '#111827',
                fontSize: '14px',
                lineHeight: '1.6',
                boxShadow: '0 1px 2px rgba(0,0,0,0.04)',
                whiteSpace: 'pre-wrap',
              }}>
                {msg.text}
              </div>
              <span style={{
                fontSize: '11px',
                color: '#9CA3AF',
                marginTop: '6px',
                display: 'block',
                paddingLeft: msg.isUser ? '0' : '4px',
              }}>
                {msg.time}
              </span>
            </div>
            {msg.isUser && (
              <div style={{
                width: '36px',
                height: '36px',
                borderRadius: '10px',
                background: '#F3F4F6',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
                fontSize: '13px',
                fontWeight: '600',
                color: '#374151',
              }}>
                A
              </div>
            )}
          </div>
        ))}
        
        {/* User typing indicator */}
        {isTyping && (
          <div style={{ display: 'flex', gap: '12px', marginBottom: '20px' }}>
            <div style={{
              width: '36px',
              height: '36px',
              borderRadius: '10px',
              background: '#F3F4F6',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '13px',
              fontWeight: '600',
              color: '#374151',
            }}>
              A
            </div>
            <div style={{
              padding: '14px 18px',
              borderRadius: '18px 18px 18px 6px',
              background: '#F3F4F6',
            }}>
              <span style={{ color: '#9CA3AF', fontSize: '14px' }}>Typing...</span>
            </div>
          </div>
        )}
        
        {/* Mike typing indicator */}
        {isMikeTyping && (
          <div style={{ display: 'flex', gap: '12px', marginBottom: '20px' }}>
            <div style={{
              width: '36px',
              height: '36px',
              borderRadius: '10px',
              background: '#2563EB',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
              <HeyMikeIcon name="heymikeLogo" size={20} />
            </div>
            <div style={{
              padding: '14px 18px',
              borderRadius: '18px 18px 18px 6px',
              background: 'white',
              boxShadow: '0 1px 2px rgba(0,0,0,0.04)',
            }}>
              <div style={{ display: 'flex', gap: '4px' }}>
                <div style={{
                  width: '6px',
                  height: '6px',
                  borderRadius: '50%',
                  background: '#9CA3AF',
                  animation: 'bounce 1.4s infinite ease-in-out both'
                }} />
                <div style={{
                  width: '6px',
                  height: '6px',
                  borderRadius: '50%',
                  background: '#9CA3AF',
                  animation: 'bounce 1.4s infinite ease-in-out 0.16s both'
                }} />
                <div style={{
                  width: '6px',
                  height: '6px',
                  borderRadius: '50%',
                  background: '#9CA3AF',
                  animation: 'bounce 1.4s infinite ease-in-out 0.32s both'
                }} />
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input area */}
      <div style={{
        padding: '20px 28px',
        borderTop: '1px solid #F3F4F6',
        background: 'white',
      }}>
        <div style={{
          display: 'flex',
          gap: '12px',
          maxWidth: '720px',
          margin: '0 auto',
        }}>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Tell Mike what to build..."
            style={{
              flex: '1',
              padding: '14px 18px',
              borderRadius: '12px',
              border: '1px solid #E5E7EB',
              fontSize: '14px',
              outline: 'none',
              background: '#FAFAFA',
              color: '#111827',
            }}
          />
          <button
            onClick={handleSend}
            style={{
              width: '46px',
              height: '46px',
              borderRadius: '12px',
              background: '#2563EB',
              border: 'none',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
            }}
          >
            <HeyMikeIcon name="send" size={18} color="white" />
          </button>
        </div>
      </div>

      {/* Animation styles */}
      <style>{`
        @keyframes bounce {
          0%, 80%, 100% { transform: scale(0); }
          40% { transform: scale(1); }
        }
      `}</style>
    </div>
  )
}

export default ChatView