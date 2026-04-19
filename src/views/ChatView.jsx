import { useState, useRef, useEffect } from 'react'
import HeyMikeIcon from '../components/HeyMikeIcon'

// Conversation states
const STATES = {
  WELCOME: 'welcome',
  AWAITING_PLATFORM: 'awaiting_platform',
  AWAITING_GOAL: 'awaiting_goal', 
  AWAITING_AUDIENCE: 'awaiting_audience',
  BUILDING_CAMPAIGN: 'building',
  CREATING_CONTENT: 'creating',
  READY: 'ready'
}

// Generate smart response based on state and message and context
const getResponse = (state, userMessage, context = {}) => {
  const lower = userMessage.toLowerCase()
  
  // Handle welcome state
  if (state === STATES.WELCOME) {
    if (lower.includes('campaign')) {
      return { text: "Let's create a campaign! First question:\n\n**What platform?** (Meta, LinkedIn, Google, or All)", nextState: STATES.AWAITING_PLATFORM }
    }
    if (lower.includes('content') || lower.includes('ad') || lower.includes('creative')) {
      return { text: "What type of content?\n\n• Social media posts\n• Google display ads\n• Email sequences\n• Video scripts\n\nJust say the type and I'll get to work!", nextState: STATES.CREATING_CONTENT }
    }
    if (lower.includes('help')) {
      return { text: "Here's what I can do:\n\n**Campaigns** - Tell me 'create a campaign' and I'll build one for you\n**Content** - Say 'generate ads' or 'write emails'\n**Research** - Ask about competitors or market\n**Calendar** - Plan your content schedule\n\nWhat would you like to tackle?", nextState: STATES.READY }
    }
    return { text: "I'm ready to help! You can:\n\n• **Create a campaign** - Just say 'create campaign'\n• **Generate content** - Say 'generate ads' or 'write emails'\n• **Research** - Ask about competitors\n\nWhat shall we work on?", nextState: STATES.READY }
  }
  
  // Handle platform selection
  if (state === STATES.AWAITING_PLATFORM) {
    if (lower.includes('meta') || lower.includes('facebook') || lower.includes('instagram')) {
      return { text: "Great! **Meta (Facebook/Instagram)** selected.\n\n**What's the campaign goal?**\n• Brand Awareness\n• Lead Generation\n• Sales\n• Website Traffic", nextState: STATES.AWAITING_GOAL, context: { platform: 'Meta' } }
    }
    if (lower.includes('linkedin')) {
      return { text: "Great! **LinkedIn** selected.\n\n**What's the campaign goal?**\n• Brand Awareness\n• Lead Generation\n• Website Traffic\n• Job Applications", nextState: STATES.AWAITING_GOAL, context: { platform: 'LinkedIn' } }
    }
    if (lower.includes('google')) {
      return { text: "Great! **Google Ads** selected.\n\n**What's the campaign goal?**\n• Brand Awareness\n• Leads\n• Sales\n• Website Traffic", nextState: STATES.AWAITING_GOAL, context: { platform: 'Google' } }
    }
    if (lower.includes('all')) {
      return { text: "Great! **All Platforms** selected.\n\n**What's the campaign goal?**\n• Brand Awareness\n• Lead Generation\n• Sales\n• Website Traffic", nextState: STATES.AWAITING_GOAL, context: { platform: 'All' } }
    }
    return { text: "I didn't catch that. Which platform? (Meta, LinkedIn, Google, or All)", nextState: STATES.AWAITING_PLATFORM }
  }
  
  // Handle goal selection
  if (state === STATES.AWAITING_GOAL) {
    const platform = context.platform || 'Meta'
    if (lower.includes('brand') || lower.includes('awareness')) {
      return { text: `**Brand Awareness** - Perfect for B2B!\n\n**Who's your target audience?**\n• Hotels & Resorts\n• Schools & Universities\n• Hospitals\n• Corporate offices\n• Or describe your own...`, nextState: STATES.AWAITING_AUDIENCE, context: { platform, goal: 'Brand Awareness' } }
    }
    if (lower.includes('lead') || lower.includes('generation')) {
      return { text: `**Lead Generation** - Great choice!\n\n**Who's your target audience?**\n• Hotels & Resorts\n• Schools & Universities\n• Hospitals\n• Corporate offices\n• Or describe your own...`, nextState: STATES.AWAITING_AUDIENCE, context: { platform, goal: 'Lead Generation' } }
    }
    if (lower.includes('sales') || lower.includes('conversion')) {
      return { text: `**Sales** - Let's drive revenue!\n\n**Who's your target audience?**\n• Hotels & Resorts\n• Schools & Universities\n• Hospitals\n• Corporate offices\n• Or describe your own...`, nextState: STATES.AWAITING_AUDIENCE, context: { platform, goal: 'Sales' } }
    }
    return { text: "What's the goal? (Brand Awareness, Lead Generation, Sales, or Website Traffic)", nextState: STATES.AWAITING_GOAL }
  }
  
  // Handle audience selection - NOW WE BUILD
  if (state === STATES.AWAITING_AUDIENCE) {
    return { 
      text: `Perfect! I've got everything I need to create your campaign:\n\n**Platform:** Meta (Facebook/Instagram)\n**Goal:** Brand Awareness + Lead Gen\n**Audience:** ${userMessage}\n\nStarting to build your campaign now... I'll have ads ready for review shortly! 🎯`, 
      nextState: STATES.BUILDING_CAMPAIGN,
      action: 'create_campaign'
    }
  }
  
  // Building state - take action
  if (state === STATES.BUILDING_CAMPAIGN) {
    return { 
      text: "Your campaign is being built! Check the **Campaigns** page to see progress, and **Content** page for generated ads to review.\n\nWant me to:\n• Generate specific ad variations?\n• Write email follow-ups?\n• Analyze competitor ads?", 
      nextState: STATES.READY 
    }
  }
  
  // Creating content
  if (state === STATES.CREATING_CONTENT) {
    return { 
      text: `Got it! I'll generate ${userMessage} for you.\n\nCheck the **Content** page in a moment to see the generated content ready for review. I'll create multiple variations so you can pick the best!\n\nAnything else you need?`,
      nextState: STATES.READY,
      action: 'generate_content'
    }
  }
  
  // Ready state - but check for key intents first
  if (lower.includes('campaign') && (lower.includes('create') || lower.includes('start') || lower.includes('new'))) {
    return { text: "Let's create a campaign! First question:\n\n**What platform?** (Meta, LinkedIn, Google, or All)", nextState: STATES.AWAITING_PLATFORM }
  }
  if (lower.includes('content') || lower.includes('ad') || lower.includes('creative')) {
    return { text: "What type of content?\n\n• Social media posts\n• Google display ads\n• Email sequences\n• Video scripts\n\nJust say the type and I'll get to work!", nextState: STATES.CREATING_CONTENT }
  }
  
  return { 
    text: "I'm ready! Here's what I can do:\n\n**Campaigns** - Say 'create campaign' to start fresh\n**Content** - Say 'generate ads' or 'write emails'\n**Research** - Ask about competitors\n**Calendar** - Plan your schedule\n\nJust tell me what you need!", 
    nextState: STATES.READY 
  }
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
        {text.split('\n').map((line, i) => (
          <div key={i} style={{ marginBottom: i < text.split('\n').length - 1 ? '8px' : 0 }}>
            {line.startsWith('•') ? <span style={{ marginLeft: '12px' }}>{line}</span> : 
             line.startsWith('**') ? <strong>{line.replace(/\*\*/g, '')}</strong> : line}
          </div>
        ))}
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
    { text: "Hey! I'm HeyMike, your AI Marketing Director. 👋\n\nI can help you create campaigns, generate ads, write emails, and more.\n\nWhat would you like to work on today?", isUser: false, time: 'Just now' },
  ])
  const [input, setInput] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [conversationState, setConversationState] = useState(STATES.WELCOME)
  const [campaignContext, setCampaignContext] = useState({})
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
    
    // Show typing indicator
    setIsTyping(true)
    
    // Get response based on state
    setTimeout(() => {
      const response = getResponse(conversationState, userMessage, campaignContext)
      setIsTyping(false)
      setConversationState(response.nextState)
      if (response.context) setCampaignContext(prev => ({ ...prev, ...response.context }))
      
      setMessages(prev => [...prev, { 
        text: response.text, 
        isUser: false, 
        time: 'Just now' 
      }])
    }, 1200)
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