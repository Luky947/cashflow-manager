const STORAGE_KEY = 'cashflow-app-v1'

export function checkStorageIntegrity(inMemoryData: unknown): boolean {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return false
    const stored = JSON.parse(raw)
    const inMemory = inMemoryData as Record<string, unknown>
    const storedState = stored?.state as Record<string, unknown>
    if (!storedState) return false
    const keys: Array<keyof typeof inMemory> = ['transactions', 'categories', 'budgets', 'recurringTransactions']
    for (const key of keys) {
      const memArr = inMemory[key] as unknown[]
      const storedArr = storedState[key] as unknown[]
      if (Array.isArray(memArr) && Array.isArray(storedArr)) {
        if (memArr.length !== storedArr.length) return false
      }
    }
    return true
  } catch {
    return false
  }
}

export function getStorageSize(): number {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return 0
    return Math.round((raw.length * 2) / 1024)
  } catch {
    return 0
  }
}
