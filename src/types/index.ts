export interface Transaction {
  id: string
  type: 'income' | 'expense'
  amount: number
  currency: 'CZK'
  categoryId: string
  date: string
  note: string | null
  recurringId: string | null
  createdAt: string
  updatedAt: string
}

export interface Category {
  id: string
  name: string
  icon: string
  color: string
  type: 'income' | 'expense' | 'both'
  createdAt: string
}

export interface Budget {
  id: string
  categoryId: string
  amount: number
  period: 'monthly' | 'yearly'
  createdAt: string
}

export interface RecurringTransaction {
  id: string
  type: 'income' | 'expense'
  amount: number
  categoryId: string
  note: string | null
  intervalDays: number
  nextDue: string
  active: boolean
  createdAt: string
}

export interface BackupState {
  lastSuccess: string | null
  pending: boolean
  error: string | null
}

export interface AppState {
  transactions: Transaction[]
  categories: Category[]
  budgets: Budget[]
  recurringTransactions: RecurringTransaction[]
  selectedMonth: string
  backup: BackupState
}
