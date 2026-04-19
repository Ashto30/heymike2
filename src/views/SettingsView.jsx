import HeyMikeIcon from '../components/HeyMikeIcon'

// Connection row - minimal
const ConnectionRow = ({ platform, icon, connected }) => (
  <div style={{
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '16px 0',
    borderBottom: '1px solid #F9FAFB',
  }}>
    <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
      <div style={{
        width: '40px',
        height: '40px',
        borderRadius: '10px',
        background: '#F9FAFB',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}>
        <HeyMikeIcon name={icon} size={18} color="#2563EB" />
      </div>
      <span style={{ fontSize: '14px', fontWeight: '500', color: '#111827' }}>{platform}</span>
    </div>
    <button style={{
      padding: '8px 16px',
      borderRadius: '8px',
      border: 'none',
      fontSize: '13px',
      fontWeight: '500',
      cursor: 'pointer',
      background: connected ? '#DCFCE7' : '#2563EB',
      color: connected ? '#166534' : 'white',
    }}>
      {connected ? 'Connected' : 'Connect'}
    </button>
  </div>
)

// API status row
const ApiStatusRow = ({ service, status }) => (
  <div style={{
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '14px 0',
    borderBottom: '1px solid #F9FAFB',
  }}>
    <span style={{ fontSize: '14px', color: '#374151' }}>{service}</span>
    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
      <span style={{
        width: '8px',
        height: '8px',
        borderRadius: '50%',
        background: status ? '#22C55E' : '#D1D5DB',
      }} />
      <span style={{ fontSize: '13px', color: status ? '#166534' : '#9CA3AF' }}>
        {status ? 'Active' : 'Not configured'}
      </span>
    </div>
  </div>
)

// Section card - clean white
const SectionCard = ({ title, icon, children }) => (
  <div style={{
    background: 'white',
    borderRadius: '12px',
    padding: '24px',
    boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
    marginBottom: '16px',
  }}>
    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
      <HeyMikeIcon name={icon} size={18} color="#2563EB" />
      <h2 style={{ fontSize: '15px', fontWeight: '600', color: '#111827', margin: 0 }}>{title}</h2>
    </div>
    {children}
  </div>
)

// Settings View
const SettingsView = () => (
  <div style={{ padding: '28px', maxWidth: '600px', height: '100%', overflow: 'auto', background: '#FAFAFA' }}>
    <h1 style={{ fontSize: '22px', fontWeight: '600', color: '#111827', margin: '0 0 28px 0' }}>Settings</h1>

    {/* Ad Accounts */}
    <SectionCard title="Ad Accounts" icon="chat">
      <ConnectionRow platform="Meta Business" icon="chat" connected={true} />
      <ConnectionRow platform="Google Ads" icon="campaigns" connected={false} />
      <ConnectionRow platform="LinkedIn Ads" icon="campaigns" connected={false} />
    </SectionCard>

    {/* API Status */}
    <SectionCard title="API Status" icon="settings">
      <ApiStatusRow service="OpenAI (GPT-4o)" status={true} />
      <ApiStatusRow service="fal.ai (FLUX + MiniMax)" status={true} />
      <ApiStatusRow service="Higgsfield (Video)" status={false} />
      <ApiStatusRow service="Meta Ad Library" status={false} />
    </SectionCard>

    {/* Brand Settings */}
    <SectionCard title="Brand Settings" icon="assets">
      <p style={{ fontSize: '13px', color: '#9CA3AF', margin: 0 }}>Connected brands will appear here</p>
      <div style={{
        marginTop: '16px',
        padding: '24px',
        background: '#FAFBFC',
        borderRadius: '10px',
        textAlign: 'center',
        border: '1px dashed #E5E7EB',
      }}>
        <span style={{ fontSize: '13px', color: '#9CA3AF' }}>No brands connected</span>
      </div>
    </SectionCard>

    {/* Danger Zone */}
    <div style={{
      background: 'white',
      borderRadius: '12px',
      padding: '24px',
      boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
      border: '1px solid #FEE2E2',
    }}>
      <div style={{ marginBottom: '8px' }}>
        <span style={{ fontSize: '15px', fontWeight: '600', color: '#DC2626' }}>Danger Zone</span>
      </div>
      <p style={{ fontSize: '13px', color: '#9CA3AF', margin: '0 0 16px 0' }}>Once you delete your account, there is no going back.</p>
      <button style={{
        padding: '10px 18px',
        borderRadius: '8px',
        border: '1px solid #FECACA',
        background: 'white',
        color: '#DC2626',
        fontSize: '13px',
        fontWeight: '500',
        cursor: 'pointer',
      }}>
        Delete Account
      </button>
    </div>
  </div>
)

export default SettingsView