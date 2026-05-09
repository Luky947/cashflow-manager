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

const SEED_TRANSACTIONS: Transaction[] = [
  // Březen 2026
  { id: 'tx-seed-1', type: 'income', amount: 42000, currency: 'CZK', categoryId: 'cat-salary', date: '2026-03-25', note: 'Výplata březen', recurringId: null, createdAt: '2026-03-25T10:00:00.000Z', updatedAt: '2026-03-25T10:00:00.000Z' },
  { id: 'tx-seed-2', type: 'expense', amount: 12500, currency: 'CZK', categoryId: 'cat-housing', date: '2026-03-01', note: 'Nájem březen', recurringId: null, createdAt: '2026-03-01T10:00:00.000Z', updatedAt: '2026-03-01T10:00:00.000Z' },
  { id: 'tx-seed-3', type: 'expense', amount: 3200, currency: 'CZK', categoryId: 'cat-food', date: '2026-03-10', note: 'Nákup v Albertu', recurringId: null, createdAt: '2026-03-10T10:00:00.000Z', updatedAt: '2026-03-10T10:00:00.000Z' },
  { id: 'tx-seed-4', type: 'expense', amount: 890, currency: 'CZK', categoryId: 'cat-transport', date: '2026-03-05', note: 'Měsíční jízdenka', recurringId: null, createdAt: '2026-03-05T10:00:00.000Z', updatedAt: '2026-03-05T10:00:00.000Z' },
  { id: 'tx-seed-5', type: 'expense', amount: 650, currency: 'CZK', categoryId: 'cat-fun', date: '2026-03-15', note: 'Kino + popcorn', recurringId: null, createdAt: '2026-03-15T10:00:00.000Z', updatedAt: '2026-03-15T10:00:00.000Z' },
  // Duben 2026
  { id: 'tx-seed-6', type: 'income', amount: 42000, currency: 'CZK', categoryId: 'cat-salary', date: '2026-04-25', note: 'Výplata duben', recurringId: null, createdAt: '2026-04-25T10:00:00.000Z', updatedAt: '2026-04-25T10:00:00.000Z' },
  { id: 'tx-seed-7', type: 'expense', amount: 12500, currency: 'CZK', categoryId: 'cat-housing', date: '2026-04-01', note: 'Nájem duben', recurringId: null, createdAt: '2026-04-01T10:00:00.000Z', updatedAt: '2026-04-01T10:00:00.000Z' },
  { id: 'tx-seed-8', type: 'expense', amount: 2800, currency: 'CZK', categoryId: 'cat-food', date: '2026-04-12', note: 'Rohlíky, zelenina, mléko', recurringId: null, createdAt: '2026-04-12T10:00:00.000Z', updatedAt: '2026-04-12T10:00:00.000Z' },
  { id: 'tx-seed-9', type: 'expense', amount: 1200, currency: 'CZK', categoryId: 'cat-transport', date: '2026-04-18', note: 'Benzín', recurringId: null, createdAt: '2026-04-18T10:00:00.000Z', updatedAt: '2026-04-18T10:00:00.000Z' },
  // Květen 2026
  { id: 'tx-seed-10', type: 'income', amount: 42000, currency: 'CZK', categoryId: 'cat-salary', date: '2026-05-06', note: 'Výplata květen', recurringId: null, createdAt: '2026-05-06T10:00:00.000Z', updatedAt: '2026-05-06T10:00:00.000Z' },
  { id: 'tx-seed-11', type: 'expense', amount: 12500, currency: 'CZK', categoryId: 'cat-housing', date: '2026-05-01', note: 'Nájem květen', recurringId: null, createdAt: '2026-05-01T10:00:00.000Z', updatedAt: '2026-05-01T10:00:00.000Z' },
  { id: 'tx-seed-12', type: 'expense', amount: 2400, currency: 'CZK', categoryId: 'cat-food', date: '2026-05-07', note: 'Týdenní nákup', recurringId: null, createdAt: '2026-05-07T10:00:00.000Z', updatedAt: '2026-05-07T10:00:00.000Z' },
  { id: 'tx-seed-13', type: 'expense', amount: 430, currency: 'CZK', categoryId: 'cat-fun', date: '2026-05-03', note: 'Netflix + Spotify', recurringId: null, createdAt: '2026-05-03T10:00:00.000Z', updatedAt: '2026-05-03T10:00:00.000Z' },
]

const OLD_SEED_IDS = [
  'tx-seed-1', 'tx-seed-2', 'tx-seed-3', 'tx-seed-4', 'tx-seed-5',
  'tx-seed-6', 'tx-seed-7', 'tx-seed-8', 'tx-seed-9', 'tx-seed-10',
]

export function seedIfEmpty(): void {
  const existingSeedIds = OLD_SEED_IDS
  const { transactions } = useAppStore.getState()
  const hasOldSeeds = existingSeedIds.every(id => transactions.some(t => t.id === id))
  if (hasOldSeeds) {
    existingSeedIds.forEach(id => useAppStore.getState().deleteTransaction(id))
  }

  const { categories, transactions: txAfterClean, addCategory, addTransaction } =
    useAppStore.getState()

  if (categories.length === 0) {
    DEFAULT_CATEGORIES.forEach(addCategory)
  }

  if (txAfterClean.length === 0) {
    SEED_TRANSACTIONS.forEach(addTransaction)
  }
}
