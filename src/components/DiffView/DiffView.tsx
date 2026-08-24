import { useEffect, useMemo, useState } from 'react'
import DiffPanel from './DiffPanel.tsx'
import { computeDiff } from './diffUtils.ts'
import { fetchAllocations, fetchVersions } from '../../api/diffApi.ts'
import type { AllocationRow, WorkAllocationVersion } from '../../api/diffApi.ts'
import './DiffView.css'

function errorMessage(err: unknown, fallback: string): string {
  return err instanceof Error ? err.message : fallback
}

function DiffView() {
  const [versions, setVersions] = useState<WorkAllocationVersion[]>([])
  const [versionsError, setVersionsError] = useState<string | null>(null)

  const [leftVersionId, setLeftVersionId] = useState(1)
  const [rightVersionId, setRightVersionId] = useState(2)

  const [leftRows, setLeftRows] = useState<AllocationRow[]>([])
  const [rightRows, setRightRows] = useState<AllocationRow[]>([])
  const [leftLoading, setLeftLoading] = useState(true)
  const [rightLoading, setRightLoading] = useState(true)
  const [leftError, setLeftError] = useState<string | null>(null)
  const [rightError, setRightError] = useState<string | null>(null)

  useEffect(() => {
    fetchVersions()
      .then(setVersions)
      .catch((err: unknown) => setVersionsError(errorMessage(err, 'Failed to load versions')))
  }, [])

  useEffect(() => {
    setLeftLoading(true)
    setLeftError(null)
    fetchAllocations(leftVersionId)
      .then(setLeftRows)
      .catch((err: unknown) => setLeftError(errorMessage(err, 'Failed to load allocations')))
      .finally(() => setLeftLoading(false))
  }, [leftVersionId])

  useEffect(() => {
    setRightLoading(true)
    setRightError(null)
    fetchAllocations(rightVersionId)
      .then(setRightRows)
      .catch((err: unknown) => setRightError(errorMessage(err, 'Failed to load allocations')))
      .finally(() => setRightLoading(false))
  }, [rightVersionId])

  const { left: leftDiffs, right: rightDiffs } = useMemo(
    () => computeDiff(leftRows, rightRows),
    [leftRows, rightRows],
  )

  return (
    <section className="diff-view">
      <h1>Diff View</h1>

      {versionsError && <p className="diff-view-error">{versionsError}</p>}

      <div className="diff-legend">
        <span className="diff-legend-item">
          <span className="diff-swatch diff-swatch-added" /> Added
        </span>
        <span className="diff-legend-item">
          <span className="diff-swatch diff-swatch-removed" /> Removed
        </span>
        <span className="diff-legend-item">
          <span className="diff-swatch diff-swatch-edited" /> Edited
        </span>
      </div>

      <div className="diff-columns">
        <DiffPanel
          title="Left"
          versions={versions}
          selectedVersionId={leftVersionId}
          onVersionChange={setLeftVersionId}
          rows={leftRows}
          rowDiffs={leftDiffs}
          loading={leftLoading}
          error={leftError}
        />
        <DiffPanel
          title="Right"
          versions={versions}
          selectedVersionId={rightVersionId}
          onVersionChange={setRightVersionId}
          rows={rightRows}
          rowDiffs={rightDiffs}
          loading={rightLoading}
          error={rightError}
        />
      </div>
    </section>
  )
}

export default DiffView
