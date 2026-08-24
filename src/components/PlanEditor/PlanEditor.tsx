import { useEffect, useState } from 'react'
import PlanTable from './PlanTable.tsx'
import VersionPanel from './VersionPanel.tsx'
import { loadVersions, saveVersions } from './planStorage.ts'
import type { PlanRow, PlanVersion } from './types.ts'
import './PlanEditor.css'

function createInitialRows(): PlanRow[] {
  return [{ id: crypto.randomUUID(), step: 1, description: '', owner: '', status: '' }]
}

function PlanEditor() {
  const [rows, setRows] = useState<PlanRow[]>(createInitialRows)
  const [versions, setVersions] = useState<PlanVersion[]>(() => loadVersions())

  useEffect(() => {
    saveVersions(versions)
  }, [versions])

  const handleSaveVersion = (name: string) => {
    const version: PlanVersion = {
      id: crypto.randomUUID(),
      name,
      timestamp: new Date().toISOString(),
      rows: rows.map((row) => ({ ...row })),
    }
    setVersions((prev) => [...prev, version])
  }

  const handleRestoreVersion = (version: PlanVersion) => {
    const confirmed = window.confirm(
      `Restore "${version.name}"? This will overwrite your current unsaved edits.`,
    )
    if (!confirmed) return
    setRows(version.rows.map((row) => ({ ...row })))
  }

  return (
    <section className="plan-editor">
      <h1>Plan Editor</h1>
      <PlanTable rows={rows} onChange={setRows} />
      <VersionPanel versions={versions} onSave={handleSaveVersion} onRestore={handleRestoreVersion} />
    </section>
  )
}

export default PlanEditor
