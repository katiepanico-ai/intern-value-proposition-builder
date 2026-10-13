import { useState, useRef } from 'react'
import { useAppData } from '../AppContext'
import { parseImportedProgress } from '../lib/storage'

// A slim, persistent bar shown on every builder step so interns always know
// their save status and have Export/Import one click away — not just
// buried on the landing page. Progress only lives in THIS browser's storage,
// so this bar is also where we keep reminding them of that.
export default function ProgressBar() {
  const { exportProgress, importProgress, lastSavedLabel } = useAppData()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [importError, setImportError] = useState('')
  const [importedOk, setImportedOk] = useState(false)

  const handleImportClick = () => {
    setImportError('')
    fileInputRef.current?.click()
  }

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    e.target.value = '' // allow re-selecting the same file later
    if (!file) return
    const text = await file.text()
    const result = parseImportedProgress(text)
    if (!result.ok || !result.data) {
      setImportError(result.error || 'Could not import that file.')
      return
    }
    importProgress(result.data)
    setImportedOk(true)
    setTimeout(() => setImportedOk(false), 2000)
  }

  return (
    <div className="mb-4 flex flex-wrap items-center justify-between gap-x-3 gap-y-1 rounded-full border border-gray-200 bg-panel px-4 py-2 text-xs">
      <span className="text-muted">
        {lastSavedLabel ? <>Saved on this browser — last saved {lastSavedLabel}</> : 'Not saved yet'}
        {importedOk && <span className="ml-2 font-semibold text-strength-green">Progress imported!</span>}
      </span>
      <div className="flex items-center gap-3">
        <button onClick={exportProgress} className="font-semibold text-dell-blue hover:underline">
          Export backup
        </button>
        <span className="text-gray-300">|</span>
        <button onClick={handleImportClick} className="font-semibold text-dell-blue hover:underline">
          Import backup
        </button>
        <input ref={fileInputRef} type="file" accept="application/json,.json" onChange={handleFileChange} className="hidden" />
      </div>
      <span className="w-full text-gray-400">
        Progress is only saved on this device and browser — switching devices? Export a backup first.
      </span>
      {importError && <span className="w-full text-red-600">{importError}</span>}
    </div>
  )
}
