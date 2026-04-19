import { useState } from 'react'
import HeyMikeIcon from '../components/HeyMikeIcon'

// Status badge - pill style
const StatusBadge = ({ status }) => {
  const styles = {
    active: { background: '#DCFCE7', color: '#166534' },
    pending: { background: '#FEF3C7', color: '#92400E' },
    draft: { background: '#F3F4F6', color: '#6B7280' },
    paused: { background: '#FEE2E2', color: '#991B1B' },
  }
  const style = styles[status] || styles.draft
  
  return (
    <span style={{
      padding: '4px 10px',
      borderRadius: '20px',
      fontSize: '12px',
      fontWeight: '500',
      ...style,
    }}>
      {status}
    </span>
  )
}

// Metric display
const Metric = ({ label, value }) => (
  <div>
    <div style={{ fontSize: '20px', fontWeight: '600', color: '#111827' }}>{value}</div>
    <div style={{ fontSize: '11px', color: '#9CA3AF', textTransform: 'uppercase', marginTop: '2px', letterSpacing: '0.02em' }}>{label}</div>
  </div>
)

// Progress bar - minimal
const ProgressBar = ({ value }) => (
  <div style={{
    height: '4px',
    background: '#F3F4F6',
    borderRadius: '2px',
    overflow: 'hidden',
    marginTop: '10px',
  }}>
    <div style={{
      width: `${value}%`,
      height: '100%',
      background: '#2563EB',
      borderRadius: '2px',
    }} />
  </div>
)

// Campaign card - clean white, soft shadow
const CampaignCard = ({ title, platform, status, progress, leads, budget, cpl }) => (
  <div style={{
    background: 'white',
    borderRadius: '12px',
    padding: '24px',
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
    {/* Header */}
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
      <div>
        <h3 style={{ fontSize: '15px', fontWeight: '600', color: '#111827', margin: 0 }}>{title}</h3>
        <p style={{ fontSize: '13px', color: '#9CA3AF', margin: '4px 0 0 0' }}>{platform}</p>
      </div>
      <StatusBadge status={status} />
    </div>

    {/* Progress */}
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: '#6B7280' }}>
        <span>Progress</span>
        <span style={{ color: '#374151' }}>{progress}%</span>
      </div>
      <ProgressBar value={progress} />
    </div>

    {/* Stats */}
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(3, 1fr)',
      gap: '20px',
      marginTop: '20px',
      paddingTop: '20px',
      borderTop: '1px solid #F9FAFB',
    }}>
      <Metric label="Leads" value={leads} />
      <Metric label="Budget" value={budget} />
      <Metric label="CPL" value={cpl} />
    </div>
  </div>
)

// Campaigns View
const CampaignsView = () => {
  const [campaigns] = useState([
    { id: 1, title: 'Moon Kids B2B', platform: 'Meta + LinkedIn', status: 'active', progress: 75, leads: 24, budget: '5K', cpl: '208' },
    { id: 2, title: 'Summer Sale', platform: 'All platforms', status: 'pending', progress: 20, leads: 0, budget: 'TBD', cpl: '-' },
    { id: 3, title: 'Product Launch', platform: 'Meta + Google', status: 'draft', progress: 0, leads: 0, budget: '10K', cpl: '-' },
    { id: 4, title: 'Retargeting', platform: 'Meta only', status: 'paused', progress: 50, leads: 156, budget: '3K', cpl: '19' },
  ])

  return (
    <div style={{ padding: '28px', height: '100%', overflow: 'auto', background: '#FAFAFA' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '28px' }}>
        <div>
          <h1 style={{ fontSize: '22px', fontWeight: '600', color: '#111827', margin: 0 }}>Campaigns</h1>
          <p style={{ fontSize: '14px', color: '#9CA3AF', margin: '4px 0 0 0' }}>Manage your marketing campaigns</p>
        </div>
        <button style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          padding: '10px 18px',
          background: '#2563EB',
          color: 'white',
          border: 'none',
          borderRadius: '10px',
          fontSize: '14px',
          fontWeight: '500',
          cursor: 'pointer',
        }}>
          <HeyMikeIcon name="plus" size={16} color="white" />
          New Campaign
        </button>
      </div>

      {/* Campaign grid - generous spacing */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
        gap: '20px',
      }}>
        {campaigns.map(campaign => (
          <CampaignCard key={campaign.id} {...campaign} />
        ))}
      </div>
    </div>
  )
}

export default CampaignsView