import { useState, type CSSProperties } from 'react'
import { useAppStore } from '../store/useAppStore'
import AddTransactionSheet from '../components/transactions/AddTransactionSheet'

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

function formatCZK(amount: number) {
  return new Intl.NumberFormat('cs-CZ', {
    style: 'currency',
    currency: 'CZK',
    maximumFractionDigits: 0,
  }).format(amount)
}

function formatDate(dateStr: string) {
  return new Date(dateStr + 'T00:00:00').toLocaleDateString('cs-CZ', {
    day: 'numeric',
    month: 'short',
  })
}

const card: CSSProperties = {
  background: '#1e1d2e',
  borderRadius: 14,
  border: '0.5px solid rgba(255,255,255,0.06)',
  padding: '14px 16px',
}

export default function Dashboard() {
  const { transactions, categories, selectedMonth, setSelectedMonth } = useAppStore()
  const [addOpen, setAddOpen] = useState(false)
  const [addType, setAddType] = useState<'income' | 'expense'>('expense')

  const filtered = transactions.filter((t) => t.date.startsWith(selectedMonth))
  const totalIncome = filtered
    .filter((t) => t.type === 'income')
    .reduce((s, t) => s + t.amount, 0)
  const totalExpense = filtered
    .filter((t) => t.type === 'expense')
    .reduce((s, t) => s + t.amount, 0)
  const balance = totalIncome - totalExpense

  const recent = [...filtered]
    .sort((a, b) => b.date.localeCompare(a.date))
    .slice(0, 5)

  const budgetPct = totalIncome > 0
    ? Math.min((totalExpense / totalIncome) * 100, 100)
    : 0
  const budgetColor =
    budgetPct < 70 ? 'var(--green)' : budgetPct < 90 ? 'var(--amber)' : 'var(--red)'

  const getCat = (id: string) => categories.find((c) => c.id === id)

  const openAdd = (type: 'income' | 'expense') => {
    setAddType(type)
    setAddOpen(true)
  }

  return (
    <div style={{ padding: '20px 16px', maxWidth: 600, margin: '0 auto' }}>

      {/* Header — month navigation */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: 24,
        }}
      >
        <button
          onClick={() => setSelectedMonth(prevMonth(selectedMonth))}
          style={{
            background: 'none',
            border: 'none',
            color: 'var(--text2)',
            cursor: 'pointer',
            fontSize: 22,
            padding: '8px 12px',
            borderRadius: 8,
            touchAction: 'manipulation',
            lineHeight: 1,
          }}
        >
          ←
        </button>
        <h1
          style={{
            margin: 0,
            fontSize: 20,
            fontWeight: 600,
            color: 'var(--text)',
          }}
        >
          {formatMonthLabel(selectedMonth)}
        </h1>
        <button
          onClick={() => setSelectedMonth(nextMonth(selectedMonth))}
          style={{
            background: 'none',
            border: 'none',
            color: 'var(--text2)',
            cursor: 'pointer',
            fontSize: 22,
            padding: '8px 12px',
            borderRadius: 8,
            touchAction: 'manipulation',
            lineHeight: 1,
          }}
        >
          →
        </button>
      </div>

      {/* Summary cards */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: 10,
          marginBottom: 16,
        }}
      >
        <div style={card}>
          <div
            style={{
              fontSize: 10,
              fontWeight: 600,
              color: 'var(--green)',
              textTransform: 'uppercase',
              letterSpacing: 0.6,
              marginBottom: 8,
            }}
          >
            Příjmy
          </div>
          <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--text)' }}>
            {formatCZK(totalIncome)}
          </div>
        </div>
        <div style={card}>
          <div
            style={{
              fontSize: 10,
              fontWeight: 600,
              color: 'var(--red)',
              textTransform: 'uppercase',
              letterSpacing: 0.6,
              marginBottom: 8,
            }}
          >
            Výdaje
          </div>
          <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--text)' }}>
            {formatCZK(totalExpense)}
          </div>
        </div>
        <div style={card}>
          <div
            style={{
              fontSize: 10,
              fontWeight: 600,
              color: 'var(--accent2)',
              textTransform: 'uppercase',
              letterSpacing: 0.6,
              marginBottom: 8,
            }}
          >
            Zůstatek
          </div>
          <div
            style={{
              fontSize: 14,
              fontWeight: 600,
              color: balance >= 0 ? 'var(--text)' : 'var(--red)',
            }}
          >
            {formatCZK(balance)}
          </div>
        </div>
      </div>

      {/* Quick add */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: 10,
          marginBottom: 20,
        }}
      >
        <button
          onClick={() => openAdd('income')}
          style={{
            background: 'rgba(34,197,94,0.12)',
            border: '1px solid rgba(34,197,94,0.25)',
            borderRadius: 14,
            padding: '14px 0',
            color: 'var(--green)',
            fontSize: 15,
            fontWeight: 600,
            fontFamily: 'inherit',
            cursor: 'pointer',
            touchAction: 'manipulation',
          }}
        >
          + Příjem
        </button>
        <button
          onClick={() => openAdd('expense')}
          style={{
            background: 'rgba(239,68,68,0.12)',
            border: '1px solid rgba(239,68,68,0.25)',
            borderRadius: 14,
            padding: '14px 0',
            color: 'var(--red)',
            fontSize: 15,
            fontWeight: 600,
            fontFamily: 'inherit',
            cursor: 'pointer',
            touchAction: 'manipulation',
          }}
        >
          − Výdaj
        </button>
      </div>

      {/* Budget progress */}
      {totalIncome > 0 && (
        <div style={{ ...card, marginBottom: 24 }}>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: 10,
            }}
          >
            <span style={{ fontSize: 14, fontWeight: 500, color: 'var(--text)' }}>
              Rozpočet měsíce
            </span>
            <span style={{ fontSize: 13, color: 'var(--text2)' }}>
              {Math.round(budgetPct)} %
            </span>
          </div>
          <div
            style={{
              height: 8,
              background: 'rgba(255,255,255,0.06)',
              borderRadius: 4,
              overflow: 'hidden',
              marginBottom: 8,
            }}
          >
            <div
              style={{
                height: '100%',
                width: `${budgetPct}%`,
                background: budgetColor,
                borderRadius: 4,
                transition: 'width 500ms ease',
              }}
            />
          </div>
          <div style={{ fontSize: 13, color: 'var(--text2)' }}>
            {formatCZK(totalExpense)} z {formatCZK(totalIncome)}
          </div>
        </div>
      )}

      {/* Recent transactions */}
      <h2
        style={{
          margin: '0 0 12px',
          fontSize: 16,
          fontWeight: 600,
          color: 'var(--text)',
        }}
      >
        Poslední transakce
      </h2>

      {recent.length === 0 ? (
        <div
          style={{
            ...card,
            textAlign: 'center',
            color: 'var(--text2)',
            fontSize: 14,
            padding: 28,
          }}
        >
          Žádné transakce v tomto měsíci
        </div>
      ) : (
        recent.map((tx) => {
          const cat = getCat(tx.categoryId)
          return (
            <div
              key={tx.id}
              onClick={() => console.log('detail:', tx.id)}
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
                <div
                  style={{
                    fontSize: 13,
                    color: 'var(--text2)',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                  }}
                >
                  {tx.note ?? formatDate(tx.date)}
                </div>
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
                <div
                  style={{ fontSize: 12, color: 'var(--text3)', marginTop: 2 }}
                >
                  {formatDate(tx.date)}
                </div>
              </div>
            </div>
          )
        })
      )}

      <AddTransactionSheet
        isOpen={addOpen}
        onClose={() => setAddOpen(false)}
        initialType={addType}
      />
    </div>
  )
}
