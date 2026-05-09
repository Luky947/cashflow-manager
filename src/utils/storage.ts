const STORAGE_KEY = 'cashflow-app-v1'

export function getStorageSize(): number {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return 0
    return Math.round((raw.length * 2) / 1024)
  } catch {
    return 0
  }
}

export function clearStorage(): void {
  localStorage.removeItem(STORAGE_KEY)
}
