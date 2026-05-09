import { useState, useEffect, type CSSProperties } from 'react'
import BottomSheet from '../ui/BottomSheet'
import { useAppStore } from '../../store/useAppStore'
import type { Transaction } from '../../types'

interface Props {
  isOpen: boolean
  onClose: () => void
  transaction: Transaction | null
}

const baseInput: CSSProperties = {
  width: '100%',
  background: '#ffffff',
  border: '1px solid rgba(0,0,0,0.12)',
  borderRadius: 12,
  padding: '14px 16px',
  fontSize: 16,
  fontFamily: 'inherit',
  color: 'var(--sheet-text)',
  outline: 'none',
  appearance: 'none',
  WebkitAppearance: 'none',
  touchAction: 'manipulation',
  display: 'block',
}

const focusStyle: CSSProperties = {
  borderColor: '#6c63ff',
  boxShadow: '0 0 0 3px rgba(108,99,255,0.15)',
}

function Field(props: React.InputHTMLAttributes<HTMLInputElement>) {
  const [focused, setFocused] = useState(false)
  const { style, ...rest } = props
  return (
    <input
      {...rest}
      autoFocus={false}
      style={{ ...baseInput, ...(focused ? focusStyle : {}), ...style }}
      onFocus={() => setFocused(true)}
      onBlur={() => setFocused(false)}
    />
  )
}

function SelectField(props: React.SelectHTMLAttributes<HTMLSelectElement>) {
  const [focused, setFocused] = useState(false)
  const { style, children, ...rest } = props
  return (
    <select
      {...rest}
      style={{ ...baseInput, ...(focused ? focusStyle : {}), ...style }}
      onFocus={() => setFocused(true)}
      onBlur={() => setFocused(false)}
    >
      {children}
    </select>
  )
}

function DetailCell({ label, value }: { label: string; value: string }) {
  return (
    <div style={{ background: '#ffffff', borderRadius: 12, padding: 12 }}>
      <div
        style={{
          fontSize: 11,
          fontWeight: 600,
          color: 'var(--sheet-text3)',
          textTransform: 'uppercase',
          letterSpacing: '0.06em',
          marginBottom: 6,
        }}
      >
        {label}
      </div>
      <div style={{ fontSize: 14, color: 'var(--sheet-text)', fontWeight: 500 }}>{value}</div>
    </div>
  )
}

function formatFullDate(dateStr: string) {
  return new Date(dateStr + 'T00:00:00').toLocaleDateString('cs-CZ', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}

function formatCZK(amount: number) {
  return new Intl.NumberFormat('cs-CZ', {
    style: 'currency',
    currency: 'CZK',
    maximumFractionDigits: 0,
  }).format(amount)
}

export default function TransactionDetailSheet({ isOpen, onClose, transaction }: Props) {
  const { categories, updateTransaction, deleteTransaction } = useAppStore()
  const [editMode, setEditMode] = useState(false)
  const [cached, setCached] = useState<Transaction | null>(null)
  const [amount, setAmount] = useState('')
  const [categoryId, setCategoryId] = useState('')
  const [date, setDate] = useState('')
  const [note, setNote] = useState('')

  // Cache transaction so it stays visible during close animation
  useEffect(() => {
    if (transaction) setCached(transaction)
  }, [transaction])

  // Populate form when a new transaction is opened
  useEffect(() => {
    if (transaction) {
      setAmount(String(transaction.amount))
      setCategoryId(transaction.categoryId)
      setDate(transaction.date)
      setNote(transaction.note ?? '')
    }
  }, [transaction?.id]) // eslint-disable-line react-hooks/exhaustive-deps

  // Reset edit mode on close
  useEffect(() => {
    if (!isOpen) setEditMode(false)
  }, [isOpen])

  if (!cached) return null

  const cat = categories.find((c) => c.id === cached.categoryId)

  const handleSave = () => {
    const parsed = parseFloat(amount.replace(',', '.'))
    if (!parsed || parsed <= 0 || !categoryId) return
    updateTransaction(cached.id, {
      amount: parsed,
      categoryId,
      date,
      note: note.trim() || null,
    })
    onClose()
  }

  const handleDelete = () => {
    if (window.confirm('Opravdu smazat tuto transakci?')) {
      deleteTransaction(cached.id)
      onClose()
    }
  }

  const filteredCategories = categories.filter(
    (c) => c.type === cached.type || c.type === 'both'
  )

  return (
    <BottomSheet isOpen={isOpen} onClose={onClose} title="Detail transakce">
      <div style={{ padding: '8px 20px 32px', display: 'flex', flexDirection: 'column', gap: 16 }}>

        {!editMode ? (
          <>
            {/* Icon + name + amount */}
            <div style={{ textAlign: 'center', padding: '8px 0 4px' }}>
              <div
                style={{
                  width: 64,
                  height: 64,
                  borderRadius: 18,
                  background: cat ? `${cat.color}22` : 'rgba(0,0,0,0.06)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 30,
                  margin: '0 auto 10px',
                }}
              >
                {cat?.icon ?? '💸'}
              </div>
              <div style={{ fontSize: 15, fontWeight: 500, color: 'var(--sheet-text2)', marginBottom: 6 }}>
                {cat?.name ?? 'Nezařazeno'}
              </div>
              <div
                style={{
                  fontSize: 32,
                  fontWeight: 700,
                  color: cached.type === 'income' ? '#22c55e' : '#ef4444',
                }}
              >
                {cached.type === 'income' ? '+' : '−'}{formatCZK(cached.amount)}
              </div>
            </div>

            {/* Details grid */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
              <DetailCell label="Datum" value={formatFullDate(cached.date)} />
              <DetailCell label="Typ" value={cached.type === 'income' ? 'Příjem' : 'Výdaj'} />
              <DetailCell label="Kategorie" value={cat?.name ?? 'Nezařazeno'} />
              <DetailCell label="Poznámka" value={cached.note ?? '—'} />
            </div>

            {/* Actions */}
            <button
              onClick={() => setEditMode(true)}
              style={{
                width: '100%',
                background: 'var(--gradient)',
                border: 'none',
                borderRadius: 14,
                padding: '16px',
                fontSize: 16,
                fontWeight: 600,
                fontFamily: 'inherit',
                color: '#ffffff',
                cursor: 'pointer',
                marginTop: 4,
                touchAction: 'manipulation',
              }}
            >
              Upravit
            </button>
            <button
              onClick={handleDelete}
              style={{
                width: '100%',
                background: 'transparent',
                border: '1px solid var(--red)',
                borderRadius: 14,
                padding: '16px',
                fontSize: 16,
                fontWeight: 600,
                fontFamily: 'inherit',
                color: 'var(--red)',
                cursor: 'pointer',
                touchAction: 'manipulation',
              }}
            >
              Smazat transakci
            </button>
          </>
        ) : (
          <>
            {/* Edit form */}
            <div>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 500, color: 'var(--sheet-text2)', marginBottom: 8 }}>
                Částka (Kč)
              </label>
              <Field
                type="number"
                inputMode="decimal"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 500, color: 'var(--sheet-text2)', marginBottom: 8 }}>
                Kategorie
              </label>
              <SelectField value={categoryId} onChange={(e) => setCategoryId(e.target.value)}>
                {filteredCategories.map((c) => (
                  <option key={c.id} value={c.id}>{c.icon} {c.name}</option>
                ))}
              </SelectField>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 500, color: 'var(--sheet-text2)', marginBottom: 8 }}>
                Datum
              </label>
              <Field
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 500, color: 'var(--sheet-text2)', marginBottom: 8 }}>
                Poznámka <span style={{ color: 'var(--sheet-text3)', fontWeight: 400 }}>(volitelná)</span>
              </label>
              <Field
                type="text"
                placeholder="Přidat poznámku..."
                value={note}
                onChange={(e) => setNote(e.target.value)}
              />
            </div>

            <button
              onClick={handleSave}
              style={{
                width: '100%',
                background: 'var(--gradient)',
                border: 'none',
                borderRadius: 14,
                padding: '16px',
                fontSize: 16,
                fontWeight: 600,
                fontFamily: 'inherit',
                color: '#ffffff',
                cursor: 'pointer',
                marginTop: 4,
                touchAction: 'manipulation',
              }}
            >
              Uložit změny
            </button>
            <button
              onClick={handleDelete}
              style={{
                width: '100%',
                background: 'transparent',
                border: '1px solid var(--red)',
                borderRadius: 14,
                padding: '16px',
                fontSize: 16,
                fontWeight: 600,
                fontFamily: 'inherit',
                color: 'var(--red)',
                cursor: 'pointer',
                touchAction: 'manipulation',
              }}
            >
              Smazat transakci
            </button>
          </>
        )}
      </div>
    </BottomSheet>
  )
}
