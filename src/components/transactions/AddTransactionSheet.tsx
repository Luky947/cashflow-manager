import { useState, useEffect, type CSSProperties } from 'react'
import BottomSheet from '../ui/BottomSheet'
import { useAppStore } from '../../store/useAppStore'
import type { Transaction } from '../../types'

interface Props {
  isOpen: boolean
  onClose: () => void
  initialType?: 'income' | 'expense'
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

function Field({
  style,
  ...props
}: React.InputHTMLAttributes<HTMLInputElement>) {
  const [focused, setFocused] = useState(false)
  return (
    <input
      {...props}
      autoFocus={false}
      style={{ ...baseInput, ...(focused ? focusStyle : {}), ...style }}
      onFocus={() => setFocused(true)}
      onBlur={() => setFocused(false)}
    />
  )
}

function SelectField({
  style,
  children,
  ...props
}: React.SelectHTMLAttributes<HTMLSelectElement>) {
  const [focused, setFocused] = useState(false)
  return (
    <select
      {...props}
      style={{ ...baseInput, ...(focused ? focusStyle : {}), ...style }}
      onFocus={() => setFocused(true)}
      onBlur={() => setFocused(false)}
    >
      {children}
    </select>
  )
}

function Label({ text, optional }: { text: string; optional?: boolean }) {
  return (
    <label
      style={{
        display: 'block',
        fontSize: 13,
        fontWeight: 500,
        color: 'var(--sheet-text2)',
        marginBottom: 8,
      }}
    >
      {text}
      {optional && (
        <span style={{ color: 'var(--sheet-text3)', fontWeight: 400 }}>
          {' '}(volitelná)
        </span>
      )}
    </label>
  )
}

export default function AddTransactionSheet({
  isOpen,
  onClose,
  initialType = 'expense',
}: Props) {
  const { categories, addTransaction } = useAppStore()
  const [type, setType] = useState<'income' | 'expense'>(initialType)
  const [amount, setAmount] = useState('')
  const [categoryId, setCategoryId] = useState('')
  const [date, setDate] = useState(() => new Date().toISOString().slice(0, 10))
  const [note, setNote] = useState('')

  useEffect(() => {
    if (isOpen) {
      setType(initialType)
      setCategoryId('')
    }
  }, [isOpen, initialType])

  const filteredCategories = categories.filter(
    (c) => c.type === type || c.type === 'both'
  )

  const handleSubmit = () => {
    const parsed = parseFloat(amount.replace(',', '.'))
    if (!parsed || parsed <= 0 || !categoryId) return

    const now = new Date().toISOString()
    const tx: Transaction = {
      id: crypto.randomUUID(),
      type,
      amount: parsed,
      currency: 'CZK',
      categoryId,
      date,
      note: note.trim() || null,
      recurringId: null,
      createdAt: now,
      updatedAt: now,
    }
    addTransaction(tx)
    onClose()
    setAmount('')
    setCategoryId('')
    setDate(new Date().toISOString().slice(0, 10))
    setNote('')
  }

  return (
    <BottomSheet isOpen={isOpen} onClose={onClose} title="Nová transakce">
      <div
        style={{
          padding: '16px 20px 24px',
          display: 'flex',
          flexDirection: 'column',
          gap: 16,
        }}
      >
        {/* Segmented control */}
        <div
          style={{
            background: '#1e1d2e',
            borderRadius: 12,
            padding: 4,
            display: 'flex',
            gap: 4,
          }}
        >
          {(['expense', 'income'] as const).map((t) => (
            <button
              key={t}
              onClick={() => { setType(t); setCategoryId('') }}
              style={{
                flex: 1,
                padding: '10px 0',
                borderRadius: 10,
                border: 'none',
                cursor: 'pointer',
                fontSize: 15,
                fontWeight: 500,
                fontFamily: 'inherit',
                background: type === t ? 'var(--gradient)' : 'transparent',
                color: type === t ? '#ffffff' : '#9a9da8',
                transition: 'background 150ms ease, color 150ms ease',
                touchAction: 'manipulation',
              }}
            >
              {t === 'expense' ? 'Výdaj' : 'Příjem'}
            </button>
          ))}
        </div>

        {/* Amount */}
        <div>
          <Label text="Částka (Kč)" />
          <Field
            type="number"
            inputMode="decimal"
            placeholder="0"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />
        </div>

        {/* Category */}
        <div>
          <Label text="Kategorie" />
          <SelectField
            value={categoryId}
            onChange={(e) => setCategoryId(e.target.value)}
          >
            <option value="">Vyber kategorii</option>
            {filteredCategories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.icon} {c.name}
              </option>
            ))}
          </SelectField>
        </div>

        {/* Date */}
        <div>
          <Label text="Datum" />
          <Field
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
        </div>

        {/* Note */}
        <div>
          <Label text="Poznámka" optional />
          <Field
            type="text"
            placeholder="Přidat poznámku..."
            value={note}
            onChange={(e) => setNote(e.target.value)}
          />
        </div>

        {/* Submit */}
        <button
          onClick={handleSubmit}
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
            marginTop: 8,
            touchAction: 'manipulation',
          }}
        >
          Přidat
        </button>
      </div>
    </BottomSheet>
  )
}
