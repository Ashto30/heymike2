import { useState } from 'react'
import HeyMikeIcon from './components/HeyMikeIcon'
import ChatView from './views/ChatView'
import CampaignsView from './views/CampaignsView'
import ContentView from './views/ContentView'
import AssetsView from './views/AssetsView'
import CalendarView from './views/CalendarView'
import SettingsView from './views/SettingsView'

// Nav item - minimal, clean
const NavItem = ({ icon, label, active, onClick }) => (
  <button
    onClick={onClick}
    style={{
      width: '100%',
      display: 'flex',
      alignItems: 'center',
      gap: '10px',
      padding: '10px 14px',
      borderRadius: '10px',
      border: 'none',
      background: active ? '#EFF6FF' : 'transparent',
      color: active ? '#2563EB' : '#6B7280',
      cursor: 'pointer',
      fontSize: '14px',
      fontWeight: active ? '500' : '400',
      textAlign: 'left',
      transition: 'all 0.15s ease',
    }}
  >
    <HeyMikeIcon name={icon} size={18} color={active ? '#2563EB' : '#9CA3AF'} />
    {label}
  </button>
)

// Reports View placeholder
const ReportsView = () => (
  <div style={{ padding: '28px', background: '#FAFAFA', height: '100%', overflow: 'auto' }}>
    <div style={{ marginBottom: '28px' }}>
      <h1 style={{ fontSize: '22px', fontWeight: '600', color: '#111827', margin: 0 }}>Analytics</h1>
      <p style={{ fontSize: '14px', color: '#9CA3AF', margin: '4px 0 0 0' }}>Track your campaign performance</p>
    </div>
    
    {/* Stats cards */}
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '24px' }}>
      {[
        { label: 'Total Spend', value: '12,450 AED', change: '+12%' },
        { label: 'Impressions', value: '234K', change: '+8%' },
        { label: 'Clicks', value: '4,567', change: '+15%' },
        { label: 'Conversions', value: '89', change: '+23%' },
      ].map((stat, i) => (
        <div key={i} style={{
          background: 'white',
          borderRadius: '12px',
          padding: '20px',
          boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
        }}>
          <div style={{ fontSize: '12px', color: '#9CA3AF', textTransform: 'uppercase' }}>{stat.label}</div>
          <div style={{ fontSize: '28px', fontWeight: '600', color: '#111827', marginTop: '4px' }}>{stat.value}</div>
          <div style={{ fontSize: '12px', color: '#16A34A', marginTop: '8px' }}>{stat.change} vs last month</div>
        </div>
      ))}
    </div>

    {/* Chart placeholder */}
    <div style={{
      background: 'white',
      borderRadius: '12px',
      padding: '24px',
      boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
    }}>
      <h3 style={{ fontSize: '15px', fontWeight: '600', color: '#111827', margin: '0 0 16px 0' }}>Performance Over Time</h3>
      <div style={{
        height: '240px',
        background: 'linear-gradient(180deg, #F9FAFB 0%, white 100%)',
        borderRadius: '8px',
        display: 'flex',
        alignItems: 'center',
        justify: 'center',
        color: '#9CA3AF',
        fontSize: '14px',
      }}>
        Chart visualization coming soon
      </div>
    </div>
  </div>
)

// Main App - clean white background, minimal
function App() {
  const [page, setPage] = useState('chat')

  const renderPage = () => {
    switch(page) {
      case 'chat': return <ChatView />
      case 'campaigns': return <CampaignsView />
      case 'content': return <ContentView />
      case 'assets': return <AssetsView />
      case 'calendar': return <CalendarView />
      case 'reports': return <ReportsView />
      case 'settings': return <SettingsView />
      default: return <ChatView />
    }
  }

  return (
    <div style={{
      display: 'flex',
      height: '100vh',
      background: '#FAFAFA',
      fontFamily: 'Inter, system-ui, sans-serif',
    }}>
      {/* Sidebar - clean white */}
      <aside style={{
        width: '240px',
        background: 'white',
        borderRight: '1px solid #F3F4F6',
        display: 'flex',
        flexDirection: 'column',
      }}>
        {/* Logo */}
        <div style={{
          padding: '24px 20px',
          borderBottom: '1px solid #F3F4F6',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{
              width: '36px',
              height: '36px',
              borderRadius: '10px',
              background: '#2563EB',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
              <HeyMikeIcon name="heymikeLogo" size={22} />
            </div>
            <div>
              <div style={{ fontSize: '15px', fontWeight: '600', color: '#111827' }}>HeyMike</div>
              <div style={{ fontSize: '11px', color: '#9CA3AF', fontWeight: '500' }}>MARKETING DIRECTOR</div>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav style={{ flex: '1', padding: '16px 12px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <NavItem icon="chat" label="Chat" active={page === 'chat'} onClick={() => setPage('chat')} />
            <NavItem icon="campaigns" label="Campaigns" active={page === 'campaigns'} onClick={() => setPage('campaigns')} />
            <NavItem icon="content" label="Content" active={page === 'content'} onClick={() => setPage('content')} />
            <NavItem icon="assets" label="Assets" active={page === 'assets'} onClick={() => setPage('assets')} />
            <NavItem icon="calendar" label="Calendar" active={page === 'calendar'} onClick={() => setPage('calendar')} />
            <NavItem icon="reports" label="Analytics" active={page === 'reports'} onClick={() => setPage('reports')} />
          </div>
        </nav>

        {/* Bottom */}
        <div style={{ padding: '16px 12px', borderTop: '1px solid #F3F4F6' }}>
          <NavItem icon="settings" label="Settings" active={page === 'settings'} onClick={() => setPage('settings')} />
        </div>
      </aside>

      {/* Main Content */}
      <main style={{
        flex: '1',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        background: '#FAFAFA',
      }}>
        {/* Top bar - minimal */}
        <header style={{
          height: '56px',
          borderBottom: '1px solid #F3F4F6',
          display: 'flex',
          alignItems: 'center',
          padding: '0 28px',
          flexShrink: 0,
          background: 'white',
        }}>
          <span style={{ fontSize: '14px', fontWeight: '500', color: '#374151', textTransform: 'capitalize' }}>
            {page === 'reports' ? 'Analytics' : page}
          </span>
        </header>
        {/* Page content */}
        <div style={{ flex: '1', overflow: 'hidden' }}>
          {renderPage()}
        </div>
      </main>
    </div>
  )
}

export default App