import { useState } from 'react'
import { NavLink, useLocation } from 'react-router-dom'

const TABS = [
  { to: '/', label: 'Mission', end: true },
  { to: '/builder/step-1', label: '1 · Project Overview' },
  { to: '/builder/step-2', label: '2 · Business Alignment' },
  { to: '/builder/step-3', label: '3 · Value & ROI' },
  { to: '/builder/step-4', label: '4 · Scalability' },
  { to: '/builder/step-5', label: '5 · Recommendation' },
  { to: '/prompts', label: 'Prompt Library' },
  { to: '/review', label: 'Review & Export' },
]

export default function Navbar() {
  const [aboutOpen, setAboutOpen] = useState(false)
  const location = useLocation()

  return (
    <>
      <header className="sticky top-0 z-30 border-b border-gray-200 bg-white/95 backdrop-blur">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3 sm:px-6">
          <NavLink to="/" className="flex items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-ink text-sm font-bold text-white">V</span>
            <span className="font-display text-sm font-bold text-ink sm:text-base">Intern Value Proposition Builder</span>
          </NavLink>
          <button onClick={() => setAboutOpen(true)} className="text-sm font-semibold text-muted hover:text-ink">About</button>
        </div>
        <div className="relative mx-auto max-w-5xl">
          <nav className="flex items-center gap-1.5 overflow-x-auto px-4 pb-3 sm:px-6 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {TABS.map((tab) => {
              const isActive = tab.end ? location.pathname === tab.to : location.pathname.startsWith(tab.to)
              return (
                <NavLink key={tab.to} to={tab.to} className={`tab-pill ${isActive ? 'tab-pill-active' : 'tab-pill-inactive'}`}>
                  {tab.label}
                </NavLink>
              )
            })}
          </nav>
          <div className="pointer-events-none absolute right-0 top-0 bottom-3 w-10 bg-gradient-to-l from-white to-transparent sm:right-6" />
        </div>
      </header>

      {aboutOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4" onClick={() => setAboutOpen(false)}>
          <div className="card max-w-md" onClick={(e) => e.stopPropagation()}>
            <h2 className="mb-2 text-lg font-bold text-ink">About This Tool</h2>
            <p className="text-sm text-gray-600">
              This tool was created to help Dell Global Operations interns prepare impactful
              end-of-internship presentations. Use the 5-step builder to map your project to
              Dell's business strategy, or browse the Prompt Library for AI prompts you can use
              on your own.
            </p>
            <button className="btn-primary mt-4" onClick={() => setAboutOpen(false)}>Got it</button>
          </div>
        </div>
      )}
    </>
  )
}
