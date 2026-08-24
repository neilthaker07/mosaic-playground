import type { AllocationRow, WorkAllocationVersion } from '../../api/diffApi.ts'
import type { RowDiff } from './diffUtils.ts'

interface Column {
  key: keyof AllocationRow
  label: string
}

const COLUMNS: Column[] = [
  { key: 'localId', label: 'ID' },
  { key: 'personName', label: 'Person' },
  { key: 'role', label: 'Role' },
  { key: 'team', label: 'Team' },
  { key: 'allocationPct', label: 'Allocation %' },
  { key: 'startDate', label: 'Start' },
  { key: 'endDate', label: 'End' },
]

interface DiffPanelProps {
  title: string
  versions: WorkAllocationVersion[]
  selectedVersionId: number
  onVersionChange: (versionId: number) => void
  rows: AllocationRow[]
  rowDiffs: Map<number, RowDiff>
  loading: boolean
  error: string | null
}

function DiffPanel({
  title,
  versions,
  selectedVersionId,
  onVersionChange,
  rows,
  rowDiffs,
  loading,
  error,
}: DiffPanelProps) {
  return (
    <div className="diff-panel">
      <div className="diff-panel-header">
        <span className="diff-panel-title">{title}</span>
        <select value={selectedVersionId} onChange={(e) => onVersionChange(Number(e.target.value))}>
          {versions.map((version) => (
            <option key={version.id} value={version.id}>
              {version.name}
            </option>
          ))}
        </select>
      </div>

      <div className="diff-table-wrap">
        <table className="diff-table">
          <thead>
            <tr>
              {COLUMNS.map((column) => (
                <th key={column.key}>{column.label}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {error ? (
              <tr>
                <td colSpan={COLUMNS.length} className="diff-table-message diff-table-error">
                  {error}
                </td>
              </tr>
            ) : loading ? (
              <tr>
                <td colSpan={COLUMNS.length} className="diff-table-message">
                  Loading…
                </td>
              </tr>
            ) : rows.length === 0 ? (
              <tr>
                <td colSpan={COLUMNS.length} className="diff-table-message">
                  No allocations.
                </td>
              </tr>
            ) : (
              rows.map((row) => {
                const diff = rowDiffs.get(row.localId)
                const status = diff?.status ?? 'unchanged'
                return (
                  <tr key={row.localId} className={`diff-row diff-row-${status}`}>
                    {COLUMNS.map((column) => {
                      const isChanged = diff?.changedFields.has(column.key) ?? false
                      return (
                        <td key={column.key} className={isChanged ? 'diff-cell-changed' : undefined}>
                          {row[column.key]}
                        </td>
                      )
                    })}
                  </tr>
                )
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default DiffPanel
