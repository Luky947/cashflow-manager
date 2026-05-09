import { useState, useEffect, type CSSProperties } from 'react'
import { useAppStore } from '../store/useAppStore'
import TransactionDetailSheet from '../components/transactions/TransactionDetailSheet'
import type { Transaction } from '../types'

// ── Month helpers (same as Dashboard) ────────────────────────────────────────

const MONTHS = [
  'Leden', 'Únor', 'Březen', 'Duben', 'Květen', 'Červen',
  'Červenec', 'Srpen', 'Září', 'Říjen', 'Listopad', 'Prosinec',
]

function parseYM(ym: string) {
  const [y, m] = ym.split('-').map(Number)
  return { year: y, month: m }
}

function prevMonth(ym: string) {
  const { year, month } = parseYM(ym)
  if (month === 1) return `${year - 1}-12`
  return `${year}-${String(month - 1).padStart(2, '0')}`
}

function nextMonth(ym: string) {
  const { year, month } = parseYM(ym)
  if (month === 12) return `${year + 1}-01`
  return `${year}-${String(month + 1).padStart(2, '0')}`
}

function formatMonthLabel(ym: string) {
  const { year, month } = parseYM(ym)
  return `${MONTHS[month - 1]} ${year}`
}

// ── Format helpers ────────────────────────────────────────────────────────────

function formatCZK(amount: number) {
  return new Intl.NumberFormat('cs-CZ', {
    style: 'currency',
    currency: 'CZK',
    maximumFractionDigits: 0,
  }).format(amount)
}

function formatDayLabel(dateStr: string): string {
  const today = new Date().toISOString().slice(0, 10)
  const d = new Date(Date.now() - 86400000)
  const yesterday = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
  if (dateStr === today) return 'Dnes'
  if (dateStr === yesterday) return 'Včera'
  return new Date(dateStr + 'T00:00:00').toLocaleDateString('cs-CZ', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}

// ── Styles ────────────────────────────────────────────────────────────────────

const card: CSSProperties = {
  background: '#1e1d2e',
  borderRadius: 14,
  border: '0.5px solid rgba(255,255,255,0.06)',
  padding: '14px 16px',
}

// ── Component ────────────────────────────────────────────────────────────────

type TypeFilter = 'all' | 'income' | 'expense'

export default function Transactions() {
  const { transactions, categories, selectedMonth, setSelectedMonth } = useAppStore()

  const [searchInput, setSearchInput] = useState('')
  const [query, setQuery] = useState('')
  const [typeFilter, setTypeFilter] = useState<TypeFilter>('all')
  const [catFilter, setCatFilter] = useState('')
  const [selected, setSelected] = useState<Transaction | null>(null)
  const [detailOpen, setDetailOpen] = useState(false)

  // Debounce search 300ms
  useEffect(() => {
    const t = setTimeout(() => setQuery(searchInput), 300)
    return () => clearTimeout(t)
  }, [searchInput])

  const getCat = (id: string) => categories.find((c) => c.id === id)

  // Filter pipeline
  const filtered = transactions
    .filter((t) => t.date.startsWith(selectedMonth))
    .filter((t) => typeFilter === 'all' || t.type === typeFilter)
    .filter((t) => catFilter === '' || t.categoryId === catFilter)
    .filter((t) => {
      if (!query) return true
      const q = query.toLowerCase()
      const inNote = t.note?.toLowerCase().includes(q) ?? false
      const inCat = getCat(t.categoryId)?.name.toLowerCase().includes(q) ?? false
      return inNote || inCat
    })

  // Summary
  const totalIncome = filtered
    .filter((t) => t.type === 'income')
    .reduce((s, t) => s + t.amount, 0)
  const totalExpense = filtered
    .filter((t) => t.type === 'expense')
    .reduce((s, t) => s + t.amount, 0)

  // Group by date, sorted desc
  const sorted = [...filtered].sort((a, b) => b.date.localeCompare(a.date))
  const grouped: Record<string, Transaction[]> = {}
  for (const t of sorted) {
    if (!grouped[t.date]) grouped[t.date] = []
    grouped[t.date].push(t)
  }
  const sortedDates = Object.keys(grouped).sort((a, b) => b.localeCompare(a))

  const openDetail = (tx: Transaction) => {
    setSelected(tx)
    setDetailOpen(true)
  }

  return (
    <div style={{ padding: '20px 16px', maxWidth: 600, margin: '0 auto' }}>

      {/* Header */}
      <h1 style={{ margin: '0 0 20px', fontSize: 24, fontWeight: 700, color: 'var(--text)' }}>
        Transakce
      </h1>

      {/* Search */}
      <div style={{ position: 'relative', marginBottom: 12 }}>
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="var(--text3)"
          strokeWidth="2"
          strokeLinecap="round"
          style={{
            position: 'absolute',
            left: 14,
            top: '50%',
            transform: 'translateY(-50%)',
            pointerEvents: 'none',
            flexShrink: 0,
          }}
        >
          <circle cx="11" cy="11" r="8" />
          <path d="m21 21-4.35-4.35" />
        </svg>
        <input
          type="search"
          placeholder="Hledat v transakcích..."
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          style={{
            width: '100%',
            background: '#1e1d2e',
            border: '0.5px solid rgba(255,255,255,0.10)',
            borderRadius: 12,
            padding: '12px 16px 12px 42px',
            fontSize: 16,
            fontFamily: 'inherit',
            color: 'var(--text)',
            outline: 'none',
            boxSizing: 'border-box',
            touchAction: 'manipulation',
          }}
        />
      </div>

      {/* Type filter */}
      <div
        style={{
          background: '#1e1d2e',
          borderRadius: 12,
          padding: 4,
          display: 'flex',
          gap: 4,
          marginBottom: 10,
        }}
      >
        {([['all', 'Vše'], ['income', 'Příjmy'], ['expense', 'Výdaje']] as const).map(
          ([val, label]) => (
            <button
              key={val}
              onClick={() => setTypeFilter(val)}
              style={{
                flex: 1,
                padding: '9px 0',
                borderRadius: 10,
                border: 'none',
                cursor: 'pointer',
                fontSize: 14,
                fontWeight: 500,
                fontFamily: 'inherit',
                background: typeFilter === val ? 'var(--gradient)' : 'transparent',
                color: typeFilter === val ? '#ffffff' : '#9a9da8',
                transition: 'background 150ms ease, color 150ms ease',
                touchAction: 'manipulation',
              }}
            >
              {label}
            </button>
          )
        )}
      </div>

      {/* Category + month row */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 16, alignItems: 'center' }}>
        <select
          value={catFilter}
          onChange={(e) => setCatFilter(e.target.value)}
          style={{
            flex: 1,
            background: '#1e1d2e',
            border: '0.5px solid rgba(255,255,255,0.10)',
            borderRadius: 10,
            color: 'var(--text)',
            fontSize: 14,
            fontFamily: 'inherit',
            padding: '8px 12px',
            outline: 'none',
            appearance: 'none',
            WebkitAppearance: 'none',
            touchAction: 'manipulation',
          }}
        >
          <option value="">Všechny kategorie</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>
              {c.icon} {c.name}
            </option>
          ))}
        </select>

        {/* Month nav */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 2, flexShrink: 0 }}>
          <button
            onClick={() => setSelectedMonth(prevMonth(selectedMonth))}
            style={{
              background: '#1e1d2e',
              border: '0.5px solid rgba(255,255,255,0.10)',
              borderRadius: 10,
              color: 'var(--text2)',
              cursor: 'pointer',
              fontSize: 16,
              padding: '7px 10px',
              lineHeight: 1,
              touchAction: 'manipulation',
            }}
          >
            ←
          </button>
          <span
            style={{
              fontSize: 13,
              fontWeight: 500,
              color: 'var(--text)',
              padding: '0 6px',
              whiteSpace: 'nowrap',
            }}
          >
            {formatMonthLabel(selectedMonth)}
          </span>
          <button
            onClick={() => setSelectedMonth(nextMonth(selectedMonth))}
            style={{
              background: '#1e1d2e',
              border: '0.5px solid rgba(255,255,255,0.10)',
              borderRadius: 10,
              color: 'var(--text2)',
              cursor: 'pointer',
              fontSize: 16,
              padding: '7px 10px',
              lineHeight: 1,
              touchAction: 'manipulation',
            }}
          >
            →
          </button>
        </div>
      </div>

      {/* Summary */}
      <div
        style={{
          fontSize: 13,
          color: 'var(--text2)',
          marginBottom: 16,
          display: 'flex',
          gap: 12,
          flexWrap: 'wrap',
        }}
      >
        <span>{filtered.length} {filtered.length === 1 ? 'transakce' : filtered.length < 5 ? 'transakce' : 'transakcí'}</span>
        {totalIncome > 0 && (
          <span style={{ color: 'var(--green)' }}>+{formatCZK(totalIncome)}</span>
        )}
        {totalExpense > 0 && (
          <span style={{ color: 'var(--red)' }}>−{formatCZK(totalExpense)}</span>
        )}
      </div>

      {/* Empty state */}
      {sortedDates.length === 0 && (
        <div style={{ textAlign: 'center', padding: '56px 0', color: 'var(--text2)' }}>
          <div style={{ fontSize: 44, marginBottom: 14 }}>🔍</div>
          <div style={{ fontSize: 16, fontWeight: 500, color: 'var(--text)', marginBottom: 6 }}>
            Žádné transakce
          </div>
          <div style={{ fontSize: 13, color: 'var(--text3)' }}>
            Zkus změnit filtry nebo přidej novou transakci
          </div>
        </div>
      )}

      {/* Grouped list */}
      {sortedDates.map((dateStr) => (
        <div key={dateStr} style={{ marginBottom: 20 }}>
          <div
            style={{
              fontSize: 11,
              fontWeight: 600,
              color: 'var(--text3)',
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
              marginBottom: 8,
            }}
          >
            {formatDayLabel(dateStr)}
          </div>

          {grouped[dateStr].map((tx) => {
            const cat = getCat(tx.categoryId)
            return (
              <div
                key={tx.id}
                onClick={() => openDetail(tx)}
                style={{
                  ...card,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 12,
                  marginBottom: 8,
                  cursor: 'pointer',
                  touchAction: 'manipulation',
                }}
              >
                <div
                  style={{
                    width: 44,
                    height: 44,
                    borderRadius: 12,
                    background: cat ? `${cat.color}22` : 'rgba(255,255,255,0.06)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 22,
                    flexShrink: 0,
                  }}
                >
                  {cat?.icon ?? '💸'}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div
                    style={{
                      fontSize: 15,
                      fontWeight: 500,
                      color: 'var(--text)',
                      marginBottom: 2,
                    }}
                  >
                    {cat?.name ?? 'Nezařazeno'}
                  </div>
                  {tx.note && (
                    <div
                      style={{
                        fontSize: 13,
                        color: 'var(--text2)',
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                      }}
                    >
                      {tx.note}
                    </div>
                  )}
                </div>
                <div style={{ textAlign: 'right', flexShrink: 0 }}>
                  <div
                    style={{
                      fontSize: 15,
                      fontWeight: 600,
                      color: tx.type === 'income' ? 'var(--green)' : 'var(--red)',
                    }}
                  >
                    {tx.type === 'income' ? '+' : '−'}
                    {formatCZK(tx.amount)}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      ))}

      <TransactionDetailSheet
        isOpen={detailOpen}
        onClose={() => setDetailOpen(false)}
        transaction={selected}
      />
    </div>
  )
}
