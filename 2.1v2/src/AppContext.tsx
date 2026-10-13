import { createContext, useContext, useState, useCallback, type ReactNode } from 'react'
import type { AppData } from './types'
import { emptyAppData, loadProgress, saveProgress, clearProgress, exportProgressToFile } from './lib/storage'

interface AppContextValue {
  data: AppData
  setData: (updater: (prev: AppData) => AppData) => void
  save: () => void
  startFresh: () => void
  exportProgress: () => void
  importProgress: (imported: AppData) => void
  lastSavedLabel: string
}

const AppCtx = createContext<AppContextValue | null>(null)

export function AppProvider({ children }: { children: ReactNode }) {
  const [data, setDataState] = useState<AppData>(() => loadProgress() || emptyAppData())

  const setData = useCallback((updater: (prev: AppData) => AppData) => {
    setDataState((prev) => updater(prev))
  }, [])

  const save = useCallback(() => {
    setDataState((prev) => {
      const withTimestamp = { ...prev, lastSaved: new Date().toISOString() }
      saveProgress(withTimestamp)
      return withTimestamp
    })
  }, [])

  const startFresh = useCallback(() => {
    clearProgress()
    setDataState(emptyAppData())
  }, [])

  const exportProgress = useCallback(() => {
    setDataState((prev) => {
      exportProgressToFile(prev)
      return prev
    })
  }, [])

  // Loads a progress file the intern picked (see ImportProgressButton), saves
  // it to localStorage on THIS browser, and makes it the active state — this
  // is how progress carries over to a new device/browser.
  const importProgress = useCallback((imported: AppData) => {
    const withTimestamp = { ...imported, lastSaved: new Date().toISOString() }
    saveProgress(withTimestamp)
    setDataState(withTimestamp)
  }, [])

  const lastSavedLabel = data.lastSaved
    ? new Date(data.lastSaved).toLocaleString(undefined, { hour: 'numeric', minute: '2-digit', month: 'short', day: 'numeric' })
    : ''

  return (
    <AppCtx.Provider value={{ data, setData, save, startFresh, exportProgress, importProgress, lastSavedLabel }}>
      {children}
    </AppCtx.Provider>
  )
}

export function useAppData() {
  const ctx = useContext(AppCtx)
  if (!ctx) throw new Error('useAppData must be used within AppProvider')
  return ctx
}
