import type { PlanVersion } from './types.ts'

const STORAGE_KEY = 'plan-editor-versions'

export function loadVersions(): PlanVersion[] {
  const raw = localStorage.getItem(STORAGE_KEY)
  if (!raw) return []
  try {
    return JSON.parse(raw) as PlanVersion[]
  } catch {
    return []
  }
}

export function saveVersions(versions: PlanVersion[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(versions))
}
