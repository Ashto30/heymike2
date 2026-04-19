import { useState } from 'react'
import HeyMikeIcon from '../components/HeyMikeIcon'

// Asset card - clean white
const AssetCard = ({ name, type, platform, status }) => (
  <div style={{
    background: 'white',
    borderRadius: '12px',
    overflow: 'hidden',
    boxShadow: '0 1px 3px rgba(0,0,0,0.04), 0 1px 2px rgba(0,0,0,0.02)',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    border: '1px solid transparent',
  }}
  onMouseEnter={(e) => {
    e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.08)'
    e.currentTarget.style.borderColor = '#E5E7EB'
  }}
  onMouseLeave={(e) => {
    e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.04), 0 1px 2px rgba(0,0,0,0.02)'
    e.currentTarget.style.borderColor = 'transparent'
  }}>
    {/* Preview area */}
    <div style={{
      aspectRatio: '1/1',
      background: 'linear-gradient(135deg, #FAFBFC 0%, #F3F4F6 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      position: 'relative',
    }}>
      <div style={{
        width: '48px',
        height: '48px',
        borderRadius: type === 'video' ? '50%' : '12px',
        background: 'white',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
      }}>
        <HeyMikeIcon name={type === 'video' ? 'play' : 'assets'} size={20} color="#2563EB" />
      </div>
      {/* Type badge */}
      <div style={{
        position: 'absolute',
        top: '10px',
        right: '10px',
        padding: '4px 10px',
        background: 'white',
        borderRadius: '12px',
        boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
      }}>
        <span style={{ fontSize: '10px', color: '#6B7280', fontWeight: '500', textTransform: 'uppercase' }}>{type}</span>
      </div>
    </div>

    {/* Info */}
    <div style={{ padding: '14px' }}>
      <h3 style={{
        fontSize: '13px',
        fontWeight: '500',
        color: '#111827',
        margin: '0 0 8px 0',
        whiteSpace: 'nowrap',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
      }}>{name}</h3>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ fontSize: '12px', color: '#9CA3AF' }}>{platform}</span>
        <span style={{
          fontSize: '11px',
          padding: '3px 8px',
          borderRadius: '10px',
          background: status === 'approved' ? '#DCFCE7' : '#FEF3C7',
          color: status === 'approved' ? '#166534' : '#92400E',
          fontWeight: '500',
        }}>
          {status}
        </span>
      </div>
    </div>
  </div>
)

// Assets View
const AssetsView = () => {
  const [assets] = useState([
    { id: 1, name: 'Hero Banner', type: 'image', platform: 'Meta', status: 'approved' },
    { id: 2, name: 'Product Showcase', type: 'video', platform: 'Instagram', status: 'approved' },
    { id: 3, name: 'B2B LinkedIn Ad', type: 'image', platform: 'LinkedIn', status: 'pending' },
    { id: 4, name: 'Story Ad', type: 'video', platform: 'Meta Stories', status: 'approved' },
    { id: 5, name: 'Carousel Ad', type: 'image', platform: 'Meta', status: 'approved' },
    { id: 6, name: 'Email Header', type: 'image', platform: 'Email', status: 'approved' },
    { id: 7, name: 'Reel Clip', type: 'video', platform: 'Instagram', status: 'pending' },
    { id: 8, name: 'Display Banner', type: 'image', platform: 'Google', status: 'approved' },
  ])

  return (
    <div style={{ padding: '28px', height: '100%', overflow: 'auto', background: '#FAFAFA' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '28px' }}>
        <div>
          <h1 style={{ fontSize: '22px', fontWeight: '600', color: '#111827', margin: 0 }}>Assets</h1>
          <p style={{ fontSize: '14px', color: '#9CA3AF', margin: '4px 0 0 0' }}>Your approved creatives</p>
        </div>
        <button style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          padding: '10px 18px',
          background: 'white',
          color: '#374151',
          border: '1px solid #E5E7EB',
          borderRadius: '10px',
          fontSize: '14px',
          fontWeight: '500',
          cursor: 'pointer',
          boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
        }}>
          <HeyMikeIcon name="plus" size={16} color="#6B7280" />
          Upload
        </button>
      </div>

      {/* Stats - clean card */}
      <div style={{
        display: 'flex',
        gap: '32px',
        marginBottom: '28px',
        padding: '20px 24px',
        background: 'white',
        borderRadius: '12px',
        boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
      }}>
        <div>
          <span style={{ fontSize: '11px', color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: '0.02em' }}>Total</span>
          <span style={{ fontSize: '24px', fontWeight: '600', marginLeft: '12px', color: '#111827' }}>{assets.length}</span>
        </div>
        <div style={{ width: '1px', background: '#F3F4F6' }} />
        <div>
          <span style={{ fontSize: '11px', color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: '0.02em' }}>Images</span>
          <span style={{ fontSize: '24px', fontWeight: '600', marginLeft: '12px', color: '#111827' }}>{assets.filter(a => a.type === 'image').length}</span>
        </div>
        <div style={{ width: '1px', background: '#F3F4F6' }} />
        <div>
          <span style={{ fontSize: '11px', color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: '0.02em' }}>Videos</span>
          <span style={{ fontSize: '24px', fontWeight: '600', marginLeft: '12px', color: '#111827' }}>{assets.filter(a => a.type === 'video').length}</span>
        </div>
        <div style={{ width: '1px', background: '#F3F4F6' }} />
        <div>
          <span style={{ fontSize: '11px', color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: '0.02em' }}>Approved</span>
          <span style={{ fontSize: '24px', fontWeight: '600', marginLeft: '12px', color: '#16A34A' }}>{assets.filter(a => a.status === 'approved').length}</span>
        </div>
      </div>

      {/* Asset grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))',
        gap: '16px',
      }}>
        {assets.map(asset => (
          <AssetCard key={asset.id} {...asset} />
        ))}
      </div>
    </div>
  )
}

export default AssetsView