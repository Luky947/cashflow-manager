import { useEffect, useState, useRef, type ReactNode } from 'react'

interface BottomSheetProps {
  isOpen: boolean
  onClose: () => void
  children: ReactNode
  title?: string
}

export default function BottomSheet({ isOpen, onClose, children, title }: BottomSheetProps) {
  const [mounted, setMounted] = useState(false)
  const [visible, setVisible] = useState(false)
  const [dragY, setDragY] = useState(0)
  const [isDragging, setIsDragging] = useState(false)
  const startY = useRef(0)

  useEffect(() => {
    if (isOpen) {
      setMounted(true)
      const r1 = requestAnimationFrame(() => {
        const r2 = requestAnimationFrame(() => setVisible(true))
        return r2
      })
      return () => cancelAnimationFrame(r1)
    } else {
      setVisible(false)
      const t = setTimeout(() => setMounted(false), 300)
      return () => clearTimeout(t)
    }
  }, [isOpen])

  if (!mounted) return null

  const handleTouchStart = (e: React.TouchEvent) => {
    startY.current = e.touches[0].clientY
    setIsDragging(true)
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    const delta = e.touches[0].clientY - startY.current
    if (delta > 0) setDragY(delta)
  }

  const handleTouchEnd = () => {
    setIsDragging(false)
    if (dragY > 80) {
      onClose()
    }
    setDragY(0)
  }

  const sheetTransform = visible
    ? dragY > 0
      ? `translateY(${dragY}px)`
      : 'translateY(0)'
    : 'translateY(100%)'

  const openTransition = 'transform 350ms cubic-bezier(0.34, 1.56, 0.64, 1)'
  const closeTransition = 'transform 300ms cubic-bezier(0.4, 0, 1, 1)'

  return (
    <>
      <div
        onClick={onClose}
        style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0,0,0,0.5)',
          zIndex: 200,
          opacity: visible ? 1 : 0,
          transition: 'opacity 300ms ease',
          touchAction: 'none',
        }}
      />

      <div
        style={{
          position: 'fixed',
          bottom: 0,
          left: 0,
          right: 0,
          zIndex: 201,
          background: 'var(--sheet-bg)',
          borderRadius: '24px 24px 0 0',
          transform: sheetTransform,
          transition: isDragging ? 'none' : visible ? openTransition : closeTransition,
          maxHeight: '92dvh',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <div
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          style={{ padding: '12px 16px 8px', touchAction: 'none', cursor: 'grab' }}
        >
          <div
            style={{
              width: 36,
              height: 4,
              background: 'rgba(0,0,0,0.15)',
              borderRadius: 2,
              margin: '0 auto',
            }}
          />
          {title && (
            <h2
              style={{
                margin: '14px 0 4px',
                fontSize: 18,
                fontWeight: 600,
                color: 'var(--sheet-text)',
                textAlign: 'center',
              }}
            >
              {title}
            </h2>
          )}
        </div>

        <div
          style={{
            flex: 1,
            overflowY: 'auto',
            paddingBottom: 'env(safe-area-inset-bottom)',
          }}
        >
          {children}
        </div>
      </div>
    </>
  )
}
