import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type {
  Transaction,
  Category,
  Budget,
  RecurringTransaction,
  BackupState,
  AppState,
} from '../types'

interface AppActions {
  // Transactions
  addTransaction: (t: Transaction) => void
  updateTransaction: (id: string, patch: Partial<Transaction>) => void
  deleteTransaction: (id: string) => void

  // Categories
  addCategory: (c: Category) => void
  updateCategory: (id: string, patch: Partial<Category>) => void
  deleteCategory: (id: string) => void

  // Budgets
  addBudget: (b: Budget) => void
  updateBudget: (id: string, patch: Partial<Budget>) => void
  deleteBudget: (id: string) => void

  // Recurring
  addRecurring: (r: RecurringTransaction) => void
  updateRecurring: (id: string, patch: Partial<RecurringTransaction>) => void
  deleteRecurring: (id: string) => void

  // Navigation
  setSelectedMonth: (month: string) => void

  // Backup
  setBackup: (patch: Partial<BackupState>) => void

  // Storage integrity check (called on hydration)
  checkIntegrity: () => void
}

const initialBackup: BackupState = {
  lastSuccess: null,
  pending: false,
  error: null,
}

const now = new Date()
const defaultMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`

export const useAppStore = create<AppState & AppActions>()(
  persist(
    (set, get) => ({
      transactions: [],
      categories: [],
      budgets: [],
      recurringTransactions: [],
      selectedMonth: defaultMonth,
      backup: initialBackup,

      addTransaction: (t) =>
        set((s) => ({ transactions: [...s.transactions, t] })),
      updateTransaction: (id, patch) =>
        set((s) => ({
          transactions: s.transactions.map((t) =>
            t.id === id ? { ...t, ...patch, updatedAt: new Date().toISOString() } : t
          ),
        })),
      deleteTransaction: (id) =>
        set((s) => ({ transactions: s.transactions.filter((t) => t.id !== id) })),

      addCategory: (c) =>
        set((s) => ({ categories: [...s.categories, c] })),
      updateCategory: (id, patch) =>
        set((s) => ({
          categories: s.categories.map((c) =>
            c.id === id ? { ...c, ...patch } : c
          ),
        })),
      deleteCategory: (id) =>
        set((s) => ({ categories: s.categories.filter((c) => c.id !== id) })),

      addBudget: (b) =>
        set((s) => ({ budgets: [...s.budgets, b] })),
      updateBudget: (id, patch) =>
        set((s) => ({
          budgets: s.budgets.map((b) =>
            b.id === id ? { ...b, ...patch } : b
          ),
        })),
      deleteBudget: (id) =>
        set((s) => ({ budgets: s.budgets.filter((b) => b.id !== id) })),

      addRecurring: (r) =>
        set((s) => ({ recurringTransactions: [...s.recurringTransactions, r] })),
      updateRecurring: (id, patch) =>
        set((s) => ({
          recurringTransactions: s.recurringTransactions.map((r) =>
            r.id === id ? { ...r, ...patch } : r
          ),
        })),
      deleteRecurring: (id) =>
        set((s) => ({
          recurringTransactions: s.recurringTransactions.filter((r) => r.id !== id),
        })),

      setSelectedMonth: (month) => set({ selectedMonth: month }),

      setBackup: (patch) =>
        set((s) => ({ backup: { ...s.backup, ...patch } })),

      checkIntegrity: () => {
        const state = get()
        const hasData =
          state.transactions.length > 0 ||
          state.categories.length > 0 ||
          state.budgets.length > 0

        if (!hasData) return

        try {
          const raw = localStorage.getItem('cashflow-app-v1')
          if (!raw) {
            // In-memory has data but localStorage is empty — Safari cleared storage
            set((s) => ({
              backup: { ...s.backup, error: 'storage_cleared' },
            }))
          }
        } catch {
          set((s) => ({
            backup: { ...s.backup, error: 'storage_unavailable' },
          }))
        }
      },
    }),
    {
      name: 'cashflow-app-v1',
      onRehydrateStorage: () => (state) => {
        state?.checkIntegrity()
      },
    }
  )
)
