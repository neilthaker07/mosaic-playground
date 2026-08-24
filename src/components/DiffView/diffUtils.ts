import type { AllocationRow } from '../../api/diffApi.ts'

export type RowStatus = 'added' | 'removed' | 'edited' | 'unchanged'

export interface RowDiff {
  status: RowStatus
  changedFields: Set<string>
}

export interface DiffResult {
  left: Map<number, RowDiff>
  right: Map<number, RowDiff>
}

const COMPARE_FIELDS: (keyof AllocationRow)[] = [
  'personName',
  'role',
  'team',
  'allocationPct',
  'startDate',
  'endDate',
]

export function computeDiff(leftRows: AllocationRow[], rightRows: AllocationRow[]): DiffResult {
  const leftByLocalId = new Map(leftRows.map((row) => [row.localId, row]))
  const rightByLocalId = new Map(rightRows.map((row) => [row.localId, row]))

  const left = new Map<number, RowDiff>()
  const right = new Map<number, RowDiff>()

  for (const [localId, leftRow] of leftByLocalId) {
    const rightRow = rightByLocalId.get(localId)
    if (!rightRow) {
      left.set(localId, { status: 'removed', changedFields: new Set() })
      continue
    }
    const changedFields = diffFields(leftRow, rightRow)
    const status: RowStatus = changedFields.size > 0 ? 'edited' : 'unchanged'
    left.set(localId, { status, changedFields })
    right.set(localId, { status, changedFields })
  }

  for (const [localId] of rightByLocalId) {
    if (!leftByLocalId.has(localId)) {
      right.set(localId, { status: 'added', changedFields: new Set() })
    }
  }

  return { left, right }
}

function diffFields(a: AllocationRow, b: AllocationRow): Set<string> {
  const changed = new Set<string>()
  for (const field of COMPARE_FIELDS) {
    if (a[field] !== b[field]) changed.add(field)
  }
  return changed
}
