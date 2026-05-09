import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import AddTransactionSheet from '../transactions/AddTransactionSheet'

function IconDashboard() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="7" height="7" rx="1.5" />
      <rect x="14" y="3" width="7" height="7" rx="1.5" />
      <rect x="3" y="14" width="7" height="7" rx="1.5" />
      <rect x="14" y="14" width="7" height="7" rx="1.5" />
    </svg>
  )
}

function IconTransactions() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2" />
      <rect x="9" y="3" width="6" height="4" rx="2" />
      <path d="M9 12h6M9 16h4" />
    </svg>
  )
}

function IconAnalytics() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 20V10M12 20V4M6 20v-6" />
    </svg>
  )
}

function IconSettings() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
    </svg>
  )
}

type NavKey = 'dashboard' | 'transactions' | 'analytics' | 'settings' | 'fab'

const NAV = [
  { key: 'dashboard' as NavKey, path: '/dashboard', label: 'Dashboard', Icon: IconDashboard },
  { key: 'transactions' as NavKey, path: '/transactions', label: 'Transakce', Icon: IconTransactions },
  { key: 'fab' as NavKey, path: null, label: '', Icon: null },
  { key: 'analytics' as NavKey, path: '/analytics', label: 'Analytika', Icon: IconAnalytics },
  { key: 'settings' as NavKey, path: '/settings', label: 'Nastavení', Icon: IconSettings },
]

export default function BottomNav() {
  const navigate = useNavigate()
  const location = useLocation()
  const [pressed, setPressed] = useState<NavKey | null>(null)
  const [addOpen, setAddOpen] = useState(false)

  const isActive = (path: string | null) =>
    path ? location.pathname === path : false

  const press = (key: NavKey) => {
    setPressed(key)
  }
  const release = () => setPressed(null)

  return (
    <>
      <nav
        style={{
          position: 'fixed',
          bottom: 0,
          left: 0,
          right: 0,
          height: 'calc(64px + env(safe-area-inset-bottom))',
          background: '#13151a',
          borderTop: '0.5px solid rgba(255,255,255,0.06)',
          display: 'flex',
          alignItems: 'center',
          zIndex: 100,
          paddingBottom: 'env(safe-area-inset-bottom)',
        }}
      >
        {NAV.map(({ key, path, label, Icon }) => {
          if (key === 'fab') {
            return (
              <div
                key="fab"
                style={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center' }}
              >
                <button
                  onClick={() => setAddOpen(true)}
                  onTouchStart={() => press('fab')}
                  onTouchEnd={release}
                  onMouseDown={() => press('fab')}
                  onMouseUp={release}
                  style={{
                    width: 56,
                    height: 56,
                    borderRadius: '50%',
                    background: 'var(--gradient)',
                    border: 'none',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 4px 20px rgba(108,99,255,0.4)',
                    transform: pressed === 'fab' ? 'scale(0.95)' : 'scale(1)',
                    transition: 'transform 100ms ease',
                    touchAction: 'manipulation',
                    flexShrink: 0,
                  }}
                >
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round">
                    <path d="M12 5v14M5 12h14" />
                  </svg>
                </button>
              </div>
            )
          }

          const active = isActive(path)
          const color = active ? 'var(--accent)' : 'var(--text2)'

          return (
            <button
              key={key}
              onClick={() => path && navigate(path)}
              onTouchStart={() => press(key)}
              onTouchEnd={release}
              onMouseDown={() => press(key)}
              onMouseUp={release}
              style={{
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 4,
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                color,
                transform: pressed === key ? 'scale(0.95)' : 'scale(1)',
                transition: 'transform 100ms ease',
                touchAction: 'manipulation',
                padding: '8px 0',
                height: '100%',
              }}
            >
              {Icon && <Icon />}
              <span style={{ fontSize: 10, fontWeight: 500, lineHeight: 1 }}>{label}</span>
            </button>
          )
        })}
      </nav>

      <AddTransactionSheet isOpen={addOpen} onClose={() => setAddOpen(false)} />
    </>
  )
}
