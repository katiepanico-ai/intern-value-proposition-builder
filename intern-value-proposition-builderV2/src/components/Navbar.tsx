import { useState } from 'react'
import { NavLink } from 'react-router-dom'

export default function Navbar() {
  const [aboutOpen, setAboutOpen] = useState(false)
  const linkClass = ({ isActive }: { isActive: boolean }) =>
    `text-sm font-semibold transition-colors ${isActive ? 'text-dell-blue' : 'text-dell-gray hover:text-dell-blue'}`

  return (
    <>
      <header className="sticky top-0 z-30 border-b border-gray-200 bg-white/95 backdrop-blur">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3 sm:px-6">
          <NavLink to="/" className="flex items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded bg-dell-blue text-sm font-bold text-white">V</span>
            <span className="text-sm font-bold text-dell-gray sm:text-base">Intern Value Proposition Builder</span>
          </NavLink>
          <nav className="flex items-center gap-5">
            <NavLink to="/builder" className={linkClass}>Builder</NavLink>
            <NavLink to="/prompts" className={linkClass}>Prompt Library</NavLink>
            <button onClick={() => setAboutOpen(true)} className="text-sm font-semibold text-dell-gray hover:text-dell-blue">About</button>
          </nav>
        </div>
      </header>

      {aboutOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4" onClick={() => setAboutOpen(false)}>
          <div className="card max-w-md" onClick={(e) => e.stopPropagation()}>
            <h2 className="mb-2 text-lg font-bold text-dell-gray">About This Tool</h2>
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
