import { useState, useRef, useEffect } from 'react'
import HeyMikeIcon from '../components/HeyMikeIcon'

// Message bubble component
const MessageBubble = ({ text, isUser, time }) => (
  <div style={{
    display: 'flex',
    justifyContent: isUser ? 'flex-end' : 'flex-start',
    gap: '12px',
    marginBottom: '20px',
  }}>
    {!isUser && (
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
    <div style={{ maxWidth: '68%' }}>
      <div style={{
        padding: '14px 18px',
        borderRadius: isUser ? '18px 18px 6px 18px' : '18px 18px 18px 6px',
        background: isUser ? '#2563EB' : 'white',
        color: isUser ? 'white' : '#111827',
        fontSize: '14px',
        lineHeight: '1.6',
        boxShadow: '0 1px 2px rgba(0,0,0,0.04)',
      }}>
        {text}
      </div>
      <span style={{
        fontSize: '11px',
        color: '#9CA3AF',
        marginTop: '6px',
        display: 'block',
        paddingLeft: isUser ? '0' : '4px',
      }}>
        {time}
      </span>
    </div>
    {isUser && (
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
)

// Chat View
const ChatView = () => {
  const [messages, setMessages] = useState([
    { text: "Hey, I'm HeyMike. I'm your AI Marketing Director. What would you like to work on today?", isUser: false, time: 'Just now' },
  ])
  const [input, setInput] = useState('')
  const messagesEndRef = useRef(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSend = () => {
    if (!input.trim()) return
    setMessages([...messages, { text: input, isUser: true, time: 'Just now' }])
    setInput('')
    setTimeout(() => {
      setMessages(prev => [...prev, {
        text: "Got it. I'll get started on that. Check the Content page for new items to review shortly.",
        isUser: false,
        time: 'Just now'
      }])
    }, 1000)
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
          <div style={{ fontWeight: '600', fontSize: '16px', color: '#111827' }}>HeyMike</div>
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
          <MessageBubble key={i} text={msg.text} isUser={msg.isUser} time={msg.time} />
        ))}
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
            placeholder="Message HeyMike..."
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
    </div>
  )
}

export default ChatView