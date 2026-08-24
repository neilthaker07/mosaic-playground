import type { PlanRow } from './types.ts'

interface PlanTableProps {
  rows: PlanRow[]
  onChange: (rows: PlanRow[]) => void
}

type EditableField = 'description' | 'owner' | 'status'

function createRow(step: number): PlanRow {
  return { id: crypto.randomUUID(), step, description: '', owner: '', status: '' }
}

function PlanTable({ rows, onChange }: PlanTableProps) {
  const updateRow = (id: string, field: EditableField, value: string) => {
    onChange(rows.map((row) => (row.id === id ? { ...row, [field]: value } : row)))
  }

  const removeRow = (id: string) => {
    onChange(
      rows.filter((row) => row.id !== id).map((row, index) => ({ ...row, step: index + 1 })),
    )
  }

  const addRow = () => {
    onChange([...rows, createRow(rows.length + 1)])
  }

  return (
    <div className="plan-table-wrap">
      <table className="plan-table">
        <thead>
          <tr>
            <th>Step</th>
            <th>Description</th>
            <th>Owner</th>
            <th>Status</th>
            <th aria-label="Actions"></th>
          </tr>
        </thead>
        <tbody>
          {rows.length === 0 ? (
            <tr>
              <td colSpan={5} className="plan-table-empty">
                No steps yet — add one below.
              </td>
            </tr>
          ) : (
            rows.map((row) => (
              <tr key={row.id}>
                <td className="plan-table-step">{row.step}</td>
                <td>
                  <input
                    type="text"
                    value={row.description}
                    placeholder="Description"
                    onChange={(e) => updateRow(row.id, 'description', e.target.value)}
                  />
                </td>
                <td>
                  <input
                    type="text"
                    value={row.owner}
                    placeholder="Owner"
                    onChange={(e) => updateRow(row.id, 'owner', e.target.value)}
                  />
                </td>
                <td>
                  <input
                    type="text"
                    value={row.status}
                    placeholder="Status"
                    onChange={(e) => updateRow(row.id, 'status', e.target.value)}
                  />
                </td>
                <td>
                  <button type="button" className="plan-table-remove" onClick={() => removeRow(row.id)}>
                    Remove
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
      <button type="button" className="plan-add-row" onClick={addRow}>
        + Add step
      </button>
    </div>
  )
}

export default PlanTable
