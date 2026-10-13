import { HashRouter, Routes, Route, Outlet } from 'react-router-dom'
import Navbar from './components/Navbar'
import { AppProvider } from './AppContext'
import Landing from './pages/Landing'
import BuilderResume from './pages/BuilderResume'
import Step1ProjectOverview from './pages/Step1ProjectOverview'
import Step2BusinessAlignment from './pages/Step2BusinessAlignment'
import Step3ValueROI from './pages/Step3ValueROI'
import Step4ScalabilityAutomation from './pages/Step4ScalabilityAutomation'
import Step5Recommendation from './pages/Step5Recommendation'
import ReviewExport from './pages/ReviewExport'
import PromptLibrary from './pages/PromptLibrary'

function Layout() {
  return (
    <div className="min-h-screen bg-canvas">
      <Navbar />
      <main className="mx-auto max-w-5xl px-4 py-8 sm:px-6">
        <Outlet />
      </main>
    </div>
  )
}

export default function App() {
  return (
    <AppProvider>
      <HashRouter>
        <Routes>
          <Route element={<Layout />}>
            <Route path="/" element={<Landing />} />
            <Route path="/builder" element={<BuilderResume />} />
            <Route path="/builder/step-1" element={<Step1ProjectOverview />} />
            <Route path="/builder/step-2" element={<Step2BusinessAlignment />} />
            <Route path="/builder/step-3" element={<Step3ValueROI />} />
            <Route path="/builder/step-4" element={<Step4ScalabilityAutomation />} />
            <Route path="/builder/step-5" element={<Step5Recommendation />} />
            <Route path="/review" element={<ReviewExport />} />
            <Route path="/prompts" element={<PromptLibrary />} />
          </Route>
        </Routes>
      </HashRouter>
    </AppProvider>
  )
}
