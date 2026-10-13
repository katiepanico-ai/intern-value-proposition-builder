import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAppData } from '../AppContext'

// The "/builder" nav link lands here and immediately forwards to whichever
// step the intern was last on (or Step 1 if they're starting fresh).
export default function BuilderResume() {
  const { data } = useAppData()
  const navigate = useNavigate()

  useEffect(() => {
    const step = Math.min(Math.max(data.currentStep || 1, 1), 5)
    navigate(`/builder/step-${step}`, { replace: true })
  }, [])

  return null
}
