import { useState, useRef, useEffect } from 'react'
import HeyMikeIcon from '../components/HeyMikeIcon'

// Campaign context stored during conversation
const CampaignContext = {
  platform: '',
  goal: '',
  audience: '',
  brand: '',
  budget: ''
}

// Simulated campaign generation (replaces MCP for now)
const generateCampaign = (context) => {
  const { platform, goal, audience, brand } = context
  
  return `
🎯 **Campaign Generated**

**Platform:** ${platform || 'Meta'}
**Goal:** ${goal || 'Brand Awareness + Lead Gen'}
**Audience:** ${audience || 'Hotels, Schools, Corporate offices'}

---

**📅 Campaign Structure (14 Days)**

**Week 1 - Awareness**
• Day 1-2: Video ad - Brand story
• Day 3-4: Carousel - Services showcase  
• Day 5-7: Lead gen form ad

**Week 2 - Nurture**
• Day 8-10: Retargeting video
• Day 11-12: Testimonial carousel
• Day 13-14: Final conversion push

---

**📝 Ad Copy Ready:**

**Ad 1 - Video Hook:**
"Play areas that transform spaces. Hotels, schools, communities - we design adventure."

**Ad 2 - Lead Gen:**
"Get a free site survey for your play area. No obligation, just ideas."

**Ad 3 - Carousel:**
3-image carousel showing before/after transformations

---

All content ready for your review. Say **"launch it"** to start posting, or **"edit"** to make changes.`
}

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
    <div style={{ maxWidth: '72%' }}>
      <div style={{
        padding: '14px 18px',
        borderRadius: isUser ? '18px 18px 6px 18px' : '18px 18px 18px 6px',
        background: isUser ? '#2563EB' : 'white',
        color: isUser ? 'white' : '#111827',
        fontSize: '14px',
        lineHeight: '1.6',
        boxShadow: '0 1px 2px rgba(0,0,0,0.04)',
        whiteSpace: 'pre-wrap',
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
    { text: "Hey! I'm Mike Ops, your AI Marketing Director.\n\nJust tell me what you want to build - campaigns, ads, content - and I'll handle the rest. You approve, I create.\n\nWhat are we building today?", isUser: false, time: 'Just now' },
  ])
  const [input, setInput] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [campaignContext, setCampaignContext] = useState(CampaignContext)
  const [campaignGenerated, setCampaignGenerated] = useState(false)
  const messagesEndRef = useRef(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSend = async () => {
    if (!input.trim()) return
    
    const userMessage = input
    setInput('')
    
    // Add user message
    setMessages(prev => [...prev, { text: userMessage, isUser: true, time: 'Just now' }])
    
    // Show typing
    setIsTyping(true)
    
    // Simulate Mike working
    setTimeout(() => {
      setIsTyping(false)
      
      const lower = userMessage.toLowerCase()
      let response = ''
      
      // User wants to build something
      if (lower.includes('build') || lower.includes('create') || lower.includes('campaign') || lower.includes('ad') || lower.includes('content')) {
        // Extract info from message
        if (lower.includes('meta') || lower.includes('facebook') || lower.includes('instagram')) {
          setCampaignContext(prev => ({ ...prev, platform: 'Meta' }))
        } else if (lower.includes('linkedin')) {
          setCampaignContext(prev => ({ ...prev, platform: 'LinkedIn' }))
        } else if (lower.includes('google')) {
          setCampaignContext(prev => ({ ...prev, platform: 'Google' }))
        }
        
        if (lower.includes('brand')) {
          setCampaignContext(prev => ({ ...prev, goal: 'Brand Awareness' }))
        } else if (lower.includes('lead')) {
          setCampaignContext(prev => ({ ...prev, goal: 'Lead Generation' }))
        } else if (lower.includes('sale')) {
          setCampaignContext(prev => ({ ...prev, goal: 'Sales' }))
        }
        
        // Extract audience
        if (lower.includes('hotel')) {
          setCampaignContext(prev => ({ ...prev, audience: 'Hotels & Resorts' }))
        } else if (lower.includes('school')) {
          setCampaignContext(prev => ({ ...prev, audience: 'Schools & Universities' }))
        } else if (lower.includes('hotel') && lower.includes('school')) {
          setCampaignContext(prev => ({ ...prev, audience: 'Hotels, Schools & Corporate' }))
        }
        
        response = `Perfect. Let me build that for you.\n\nI'm creating your campaign now - ads, copy, targeting, the works. You'll see everything ready to review.\n\nHold tight...`
        
        // Generate campaign after a delay
        setTimeout(() => {
          const campaign = generateCampaign(campaignContext)
          setMessages(prev => [...prev, { text: campaign, isUser: false, time: 'Just now' }])
          setCampaignGenerated(true)
        }, 2000)
        
      } else if (campaignGenerated && (lower.includes('launch') || lower.includes('go') || lower.includes('post') || lower.includes('publish'))) {
        response = `🚀 Launching your campaign!\n\nScheduled to start posting tomorrow at 9 AM. I'll monitor performance and send you daily reports.\n\nAnything else you need?`
        setCampaignGenerated(false)
        setCampaignContext(CampaignContext)
        
      } else if (campaignGenerated && (lower.includes('edit') || lower.includes('change') || lower.includes('update'))) {
        response = `What would you like to change?\n\n• Platform\n• Goal\n• Audience\n• Budget\n• Ad copy\n\nJust tell me what to update.`
        
      } else if (campaignGenerated) {
        response = `Your campaign is ready for review! Check the **Content** page to see all generated ads.\n\nSay **"launch it"** when you're happy, or **"edit"** to make changes.`
        
      } else if (lower.includes('help')) {
        response = `I'm your AI Marketing Director. Here's how I work:\n\n1. **You tell me what to build** - "Create a Meta campaign for my hotel"\n2. **I build it** - Campaign structure, ads, targeting, copy\n3. **You review** - See everything in the Content page\n4. **You approve** - Say "launch" and I start posting\n\nWhat would you like to create?`
        
      } else {
        response = `Got it. Just tell me what you want to build - campaigns, ads, emails, content - and I'll get to work.\n\nStart with something like:\n• "Create a campaign for my business"\n• "Build Meta ads for my product"\n• "Generate email sequences"`
      }
      
      if (response) {
        setMessages(prev => [...prev, { text: response, isUser: false, time: 'Just now' }])
      }
      
    }, 1500)
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
          <MessageBubble key={i} text={msg.text} isUser={msg.isUser} time={msg.time} />
        ))}
        
        {/* Typing indicator */}
        {isTyping && (
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