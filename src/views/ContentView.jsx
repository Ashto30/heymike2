import { useState } from 'react'
import HeyMikeIcon from '../components/HeyMikeIcon'

// Swipe card - clean white, minimal
const SwipeCard = ({ item, onApprove, onReject, onRegenerate }) => (
  <div style={{
    background: 'white',
    borderRadius: '16px',
    overflow: 'hidden',
    width: '100%',
    maxWidth: '380px',
    boxShadow: '0 4px 20px rgba(0,0,0,0.08), 0 2px 8px rgba(0,0,0,0.04)',
    border: '1px solid #F3F4F6',
  }}>
    {/* Preview area */}
    <div style={{
      aspectRatio: '16/9',
      background: 'linear-gradient(135deg, #F9FAFB 0%, #F3F4F6 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      position: 'relative',
    }}>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px' }}>
        <div style={{
          width: '56px',
          height: '56px',
          borderRadius: item.type === 'video' ? '50%' : '12px',
          background: 'white',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
        }}>
          <HeyMikeIcon name={item.type === 'video' ? 'play' : 'assets'} size={24} color="#2563EB" />
        </div>
        <span style={{ fontSize: '12px', color: '#9CA3AF' }}>{item.type === 'video' ? 'Video' : 'Image'}</span>
      </div>
      {/* Platform badge */}
      <div style={{
        position: 'absolute',
        top: '14px',
        left: '14px',
        padding: '6px 12px',
        background: 'white',
        borderRadius: '20px',
        boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
      }}>
        <span style={{ fontSize: '11px', color: '#374151', fontWeight: '500' }}>{item.platform}</span>
      </div>
    </div>

    {/* Content info */}
    <div style={{ padding: '24px' }}>
      <h3 style={{ fontSize: '16px', fontWeight: '600', color: '#111827', margin: '0 0 6px 0' }}>{item.title}</h3>
      <p style={{ fontSize: '13px', color: '#9CA3AF', margin: '0 0 20px 0', lineHeight: '1.5' }}>{item.description}</p>

      {/* Meta */}
      <div style={{ display: 'flex', gap: '12px', fontSize: '12px', color: '#9CA3AF' }}>
        <span>{item.format}</span>
        <span style={{ color: '#E5E7EB' }}>·</span>
        <span>{item.style}</span>
      </div>

      {/* Action buttons - minimal */}
      <div style={{ display: 'flex', gap: '10px', marginTop: '24px' }}>
        <button
          onClick={onReject}
          style={{
            flex: '1',
            padding: '12px',
            borderRadius: '10px',
            border: '1px solid #E5E7EB',
            background: 'white',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'all 0.15s',
          }}
          onMouseEnter={(e) => { e.currentTarget.style.background = '#FEF2F2'; e.currentTarget.style.borderColor = '#FECACA' }}
          onMouseLeave={(e) => { e.currentTarget.style.background = 'white'; e.currentTarget.style.borderColor = '#E5E7EB' }}
        >
          <HeyMikeIcon name="thumbsDown" size={18} color="#EF4444" />
        </button>
        <button
          onClick={onRegenerate}
          style={{
            flex: '1',
            padding: '12px',
            borderRadius: '10px',
            border: '1px solid #E5E7EB',
            background: 'white',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'all 0.15s',
          }}
          onMouseEnter={(e) => { e.currentTarget.style.background = '#FFFBEB'; e.currentTarget.style.borderColor = '#FDE68A' }}
          onMouseLeave={(e) => { e.currentTarget.style.background = 'white'; e.currentTarget.style.borderColor = '#E5E7EB' }}
        >
          <HeyMikeIcon name="refresh" size={18} color="#F59E0B" />
        </button>
        <button
          onClick={onApprove}
          style={{
            flex: '2',
            padding: '12px',
            borderRadius: '10px',
            border: 'none',
            background: '#22C55E',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            transition: 'opacity 0.15s',
          }}
          onMouseEnter={(e) => e.currentTarget.style.opacity = '0.9'}
          onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}
        >
          <HeyMikeIcon name="thumbsUp" size={18} color="white" />
          <span style={{ fontSize: '14px', fontWeight: '500', color: 'white' }}>Approve</span>
        </button>
      </div>
    </div>
  </div>
)

// Empty state - clean
const EmptyState = () => (
  <div style={{ textAlign: 'center', padding: '60px 20px' }}>
    <div style={{
      width: '72px',
      height: '72px',
      borderRadius: '20px',
      background: '#DCFCE7',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      margin: '0 auto 20px',
    }}>
      <HeyMikeIcon name="check" size={36} color="#16A34A" />
    </div>
    <h3 style={{ fontSize: '18px', fontWeight: '600', color: '#111827', margin: '0 0 8px 0' }}>All Caught Up</h3>
    <p style={{ fontSize: '14px', color: '#9CA3AF', margin: 0 }}>No pending content to review</p>
  </div>
)

// Content Queue View
const ContentView = () => {
  const [currentIndex, setCurrentIndex] = useState(0)

  const pendingContent = [
    { id: 1, type: 'image', title: 'Hero Banner A', description: 'Playground equipment with FREE SURVEY CTA overlay in purple and yellow', platform: 'Meta', format: '1200x628', style: 'Bold CTA' },
    { id: 2, type: 'image', title: 'B2B LinkedIn Ad', description: 'Professional tone with installation timeline and warranty badge', platform: 'LinkedIn', format: '1200x627', style: 'Professional' },
    { id: 3, type: 'video', title: '15s Product Demo', description: 'Time-lapse installation showing team assembling equipment', platform: 'Instagram Reels', format: '1080x1920', style: 'UGC-style' },
    { id: 4, type: 'image', title: 'Story Ad', description: 'Full-screen vertical ad with countdown timer CTA', platform: 'Meta Stories', format: '1080x1920', style: 'Urgency' },
  ]

  const handleApprove = () => setCurrentIndex(prev => prev + 1)
  const handleReject = () => setCurrentIndex(prev => prev + 1)
  const handleRegenerate = () => console.log('Regenerate:', pendingContent[currentIndex]?.title)
  const handleReset = () => setCurrentIndex(0)

  return (
    <div style={{
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      padding: '28px',
      overflow: 'auto',
      background: '#FAFAFA',
    }}>
      {/* Header */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '28px',
      }}>
        <div>
          <h1 style={{ fontSize: '22px', fontWeight: '600', color: '#111827', margin: 0 }}>Content Queue</h1>
          <p style={{ fontSize: '14px', color: '#9CA3AF', margin: '4px 0 0 0' }}>Review and approve generated content</p>
        </div>
        {currentIndex < pendingContent.length && (
          <div style={{
            padding: '8px 14px',
            background: 'white',
            borderRadius: '20px',
            fontSize: '13px',
            color: '#6B7280',
            boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
            border: '1px solid #F3F4F6',
          }}>
            {currentIndex + 1} of {pendingContent.length}
          </div>
        )}
      </div>

      {/* Swipe area */}
      <div style={{
        flex: '1',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}>
        {currentIndex < pendingContent.length ? (
          <SwipeCard
            item={pendingContent[currentIndex]}
            onApprove={handleApprove}
            onReject={handleReject}
            onRegenerate={handleRegenerate}
          />
        ) : (
          <EmptyState />
        )}
      </div>

      {/* Reset button */}
      {currentIndex >= pendingContent.length && (
        <div style={{ textAlign: 'center', marginTop: '28px' }}>
          <button
            onClick={handleReset}
            style={{
              padding: '10px 20px',
              background: 'white',
              border: '1px solid #E5E7EB',
              borderRadius: '10px',
              fontSize: '14px',
              color: '#6B7280',
              cursor: 'pointer',
            }}
          >
            Start Review Again
          </button>
        </div>
      )}
    </div>
  )
}

export default ContentView