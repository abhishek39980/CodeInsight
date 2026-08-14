import { Routes, Route, Link, useLocation, useNavigate } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { LayoutGrid, Compass, BarChart3 } from 'lucide-react'
import DSACatalogHome from './components/dsa/DSACatalogHome'
import DSARoadmapView from './components/dsa/DSARoadmapView'
import ProgressDashboard from './components/ProgressDashboard'
import ProblemView from './views/ProblemView'
import { useProgressStore } from './store/useProgressStore'
import { cn } from './utils/cn'

function NavLink({ to, icon, label, exact = false }) {
  const location = useLocation()
  const isActive = exact ? location.pathname === to : location.pathname.startsWith(to)
  return (
    <Link
      to={to}
      className={cn(
        'inline-flex items-center gap-2 rounded-lg px-3 py-1.5 text-xs font-medium transition',
        isActive
          ? 'bg-atlas-elev text-atlas-text'
          : 'text-atlas-muted hover:text-atlas-text'
      )}
    >
      {icon}
      <span>{label}</span>
    </Link>
  )
}

export default function App() {
  const navigate = useNavigate()
  const location = useLocation()
  const { xp, streak, getSolvedCount } = useProgressStore()
  const solved = getSolvedCount()

  return (
    <div className="min-h-screen bg-atlas-bg0 text-atlas-text flex flex-col font-sans selection:bg-atlas-brand/20 selection:text-atlas-text">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-atlas-muted/10 bg-atlas-bg0/95 backdrop-blur-sm">
        <div className="mx-auto flex max-w-[1580px] items-center justify-between px-5 py-3 sm:px-8">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="h-7 w-7 rounded-lg bg-atlas-brand/90 flex items-center justify-center">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M3 4h10M3 8h6M3 12h8" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
            </div>
            <span className="text-sm font-semibold text-atlas-text">CodeInsight</span>
          </Link>

          {/* Nav */}
          <nav className="flex items-center gap-0.5">
            <NavLink to="/" icon={<LayoutGrid size={13} />} label="Problems" exact />
            <NavLink to="/roadmap" icon={<Compass size={13} />} label="Roadmap" />
            <NavLink to="/progress" icon={<BarChart3 size={13} />} label="Progress" />
          </nav>

          {/* Minimal stats */}
          <div className="flex items-center gap-3 text-xs text-atlas-muted font-mono">
            {solved > 0 && <span>{solved} solved</span>}
            {streak > 0 && <span>{streak}d streak</span>}
            <span className="text-atlas-brand">{xp} xp</span>
          </div>
        </div>
      </header>

      {/* Main */}
      <main className="flex-1">
        <AnimatePresence mode="wait">
          <Routes location={location} key={location.pathname}>
            <Route path="/" element={
              <motion.div key="catalog" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.15 }}>
                <DSACatalogHome onSelectProblem={(id) => navigate(`/problem/${id}`)} onViewRoadmap={() => navigate('/roadmap')} />
              </motion.div>
            } />
            <Route path="/roadmap" element={
              <motion.div key="roadmap" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.15 }}>
                <DSARoadmapView onSelectProblem={(id) => navigate(`/problem/${id}`)} />
              </motion.div>
            } />
            <Route path="/progress" element={
              <motion.div key="progress" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.15 }}>
                <ProgressDashboard />
              </motion.div>
            } />
            <Route path="/problem/:problemId" element={<ProblemView />} />
            <Route path="/problem/:problemId/:tab" element={<ProblemView />} />
          </Routes>
        </AnimatePresence>
      </main>

      {/* Footer */}
      <footer className="border-t border-atlas-muted/10 py-4 mt-8">
        <div className="mx-auto max-w-[1580px] px-5 sm:px-8 flex items-center justify-between text-xs text-atlas-muted">
          <span>CodeInsight — Visual DSA Platform</span>
          <span>24 categories · Live judge · Multi-language</span>
        </div>
      </footer>
    </div>
  )
}
