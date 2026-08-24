export interface WorkAllocationVersion {
  id: number
  name: string
  createdAt: string
}

export interface AllocationRow {
  allocationId: number
  localId: number
  personName: string
  role: string
  team: string
  allocationPct: number
  startDate: string
  endDate: string
}

const API_BASE = 'http://localhost:8080/api'

export async function fetchVersions(): Promise<WorkAllocationVersion[]> {
  const res = await fetch(`${API_BASE}/versions`)
  if (!res.ok) throw new Error(`Failed to fetch versions: ${res.status}`)
  return res.json() as Promise<WorkAllocationVersion[]>
}

export async function fetchAllocations(versionId: number): Promise<AllocationRow[]> {
  const res = await fetch(`${API_BASE}/versions/${versionId}/allocations`)
  if (!res.ok) throw new Error(`Failed to fetch allocations: ${res.status}`)
  return res.json() as Promise<AllocationRow[]>
}
