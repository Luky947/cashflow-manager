import { useAppStore } from '../store/useAppStore'
import type { Category, Transaction } from '../types'

const DEFAULT_CATEGORIES: Category[] = [
  {
    id: 'cat-food',
    name: 'Jídlo',
    icon: '🍽️',
    color: '#f97316',
    type: 'expense',
    createdAt: '2026-01-01T00:00:00.000Z',
  },
  {
    id: 'cat-transport',
    name: 'Doprava',
    icon: '🚗',
    color: '#3b82f6',
    type: 'expense',
    createdAt: '2026-01-01T00:00:00.000Z',
  },
  {
    id: 'cat-housing',
    name: 'Bydlení',
    icon: '🏠',
    color: '#8b5cf6',
    type: 'expense',
    createdAt: '2026-01-01T00:00:00.000Z',
  },
  {
    id: 'cat-fun',
    name: 'Zábava',
    icon: '🎬',
    color: '#ec4899',
    type: 'expense',
    createdAt: '2026-01-01T00:00:00.000Z',
  },
  {
    id: 'cat-salary',
    name: 'Plat',
    icon: '💰',
    color: '#22c55e',
    type: 'income',
    createdAt: '2026-01-01T00:00:00.000Z',
  },
]

function daysAgo(n: number): string {
  const d = new Date()
  d.setDate(d.getDate() - n)
  return d.toISOString().slice(0, 10)
}

function makeId(prefix: string, n: number) {
  return `${prefix}-seed-${n}`
}

function tx(
  n: number,
  type: 'income' | 'expense',
  amount: number,
  categoryId: string,
  daysBack: number,
  note: string
): Transaction {
  const iso = new Date(daysAgo(daysBack) + 'T10:00:00.000Z').toISOString()
  return {
    id: makeId('tx', n),
    type,
    amount,
    currency: 'CZK',
    categoryId,
    date: daysAgo(daysBack),
    note,
    createdAt: iso,
    updatedAt: iso,
  }
}

const SEED_TRANSACTIONS: Transaction[] = [
  tx(1, 'income', 42000, 'cat-salary', 45, 'Výplata duben'),
  tx(2, 'expense', 12500, 'cat-housing', 44, 'Nájem duben'),
  tx(3, 'expense', 3200, 'cat-food', 40, 'Nákup v Albertu'),
  tx(4, 'expense', 890, 'cat-transport', 38, 'Měsíční jízdenka'),
  tx(5, 'expense', 650, 'cat-fun', 35, 'Kino + popcorn'),
  tx(6, 'income', 42000, 'cat-salary', 15, 'Výplata květen'),
  tx(7, 'expense', 12500, 'cat-housing', 14, 'Nájem květen'),
  tx(8, 'expense', 2800, 'cat-food', 10, 'Rohlíky, zelenina, mléko'),
  tx(9, 'expense', 1200, 'cat-transport', 7, 'Benzín'),
  tx(10, 'expense', 430, 'cat-fun', 3, 'Netflix + Spotify'),
]

export function seedIfEmpty(): void {
  const { categories, transactions, addCategory, addTransaction } =
    useAppStore.getState()

  if (categories.length === 0) {
    DEFAULT_CATEGORIES.forEach(addCategory)
  }

  if (transactions.length === 0) {
    SEED_TRANSACTIONS.forEach(addTransaction)
  }
}
