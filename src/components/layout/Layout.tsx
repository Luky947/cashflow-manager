import type { ReactNode } from 'react'
import BottomNav from './BottomNav'

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <div
      style={{
        background: 'var(--bg)',
        minHeight: '100dvh',
        paddingBottom: 'calc(64px + env(safe-area-inset-bottom))',
      }}
    >
      {children}
      <BottomNav />
    </div>
  )
}
