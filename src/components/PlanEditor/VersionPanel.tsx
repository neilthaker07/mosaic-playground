import { useState } from 'react'
import type { PlanVersion } from './types.ts'

interface VersionPanelProps {
  versions: PlanVersion[]
  onSave: (name: string) => void
  onRestore: (version: PlanVersion) => void
}

function formatTimestamp(iso: string): string {
  return new Date(iso).toLocaleString()
}

function VersionPanel({ versions, onSave, onRestore }: VersionPanelProps) {
  const [name, setName] = useState('')

  const handleSave = () => {
    const trimmed = name.trim()
    if (!trimmed) return
    onSave(trimmed)
    setName('')
  }

  const sortedVersions = [...versions].sort((a, b) => b.timestamp.localeCompare(a.timestamp))

  return (
    <div className="version-panel">
      <div className="version-save">
        <input
          type="text"
          value={name}
          placeholder="Version name"
          onChange={(e) => setName(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') handleSave()
          }}
        />
        <button type="button" onClick={handleSave} disabled={!name.trim()}>
          Save Version
        </button>
      </div>

      <ul className="version-list">
        {sortedVersions.length === 0 ? (
          <li className="version-list-empty">No saved versions yet.</li>
        ) : (
          sortedVersions.map((version) => (
            <li key={version.id} className="version-list-item">
              <div>
                <span className="version-name">{version.name}</span>
                <span className="version-timestamp">{formatTimestamp(version.timestamp)}</span>
              </div>
              <button type="button" onClick={() => onRestore(version)}>
                Restore
              </button>
            </li>
          ))
        )}
      </ul>
    </div>
  )
}

export default VersionPanel
