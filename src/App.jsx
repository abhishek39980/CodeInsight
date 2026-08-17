import { Routes, Route, Link, useLocation, useNavigate, Navigate } from 'react-router-dom'
import {
  Compass,
  FlaskConical,
  Globe,
  Layers,
  Code2,
  Share2,
  Brain,
  Sparkles
} from 'lucide-react'

// Master Views
import HomeView from './views/HomeView'
import ExploreView from './views/ExploreView'
import LabsHubView from './views/LabsHubView'
import LabDetailView from './views/LabDetailView'
import JourneysHubView from './views/JourneysHubView'
import JourneyDetailView from './views/JourneyDetailView'
import ArchitectureBuilderView from './views/ArchitectureBuilderView'
import CodeEngineView from './views/CodeEngineView'
import TechnologyGraphView from './views/TechnologyGraphView'
import AlgorithmExplorerView from './views/AlgorithmExplorerView'
import ProblemView from './views/ProblemView'
import { cn } from './utils/cn'

function NavLink({ to, icon, label, exact = false }) {
  const location = useLocation()
  const isActive = exact ? location.pathname === to : location.pathname.startsWith(to)
  return (
    <Link
      to={to}
      className={cn(
        'inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-medium transition',
        isActive
          ? 'bg-atlas-elev text-atlas-text shadow-sm border border-atlas-muted/20'
          : 'text-atlas-muted hover:text-atlas-text'
      )}
    >
      {icon}
      <span>{label}</span>
    </Link>
  )
}

export default function App() {
  return (
    <div className="min-h-screen bg-atlas-bg0 text-atlas-text flex flex-col font-sans selection:bg-atlas-brand/20 selection:text-atlas-text">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-atlas-muted/15 bg-atlas-bg0/95 backdrop-blur-md">
        <div className="mx-auto flex max-w-[1580px] items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="h-7 w-7 rounded-lg bg-atlas-brand flex items-center justify-center shadow-md shadow-atlas-brand/20">
              <Sparkles size={15} className="text-white" />
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-bold text-atlas-text tracking-tight flex items-center gap-1.5">
                CodeInsight
              </span>
              <span className="text-[9px] font-mono text-atlas-muted uppercase -mt-0.5 tracking-wider">
                Tech Laboratory
              </span>
            </div>
          </Link>

          {/* Top-Level Navigation */}
          <nav className="flex items-center gap-1 overflow-x-auto py-0.5">
            <NavLink to="/explore" icon={<Compass size={13} />} label="Explore" />
            <NavLink to="/labs" icon={<FlaskConical size={13} />} label="Labs" />
            <NavLink to="/journeys" icon={<Globe size={13} />} label="Journeys" />
            <NavLink to="/builder" icon={<Layers size={13} />} label="System Designer" />
            <NavLink to="/code-engine" icon={<Code2 size={13} />} label="Code Engine" />
            <NavLink to="/graph" icon={<Share2 size={13} />} label="Tech Graph" />
            <NavLink to="/algorithms" icon={<Brain size={13} />} label="Algorithms" />
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<HomeView />} />
          <Route path="/explore" element={<ExploreView />} />
          <Route path="/labs" element={<LabsHubView />} />
          <Route path="/labs/:labId" element={<LabDetailView />} />
          <Route path="/journeys" element={<JourneysHubView />} />
          <Route path="/journeys/:journeyId" element={<JourneyDetailView />} />
          <Route path="/builder" element={<ArchitectureBuilderView />} />
          <Route path="/code-engine" element={<CodeEngineView />} />
          <Route path="/graph" element={<TechnologyGraphView />} />
          <Route path="/algorithms" element={<AlgorithmExplorerView />} />
          <Route path="/problem/:problemId" element={<ProblemView />} />
          <Route path="/problem/:problemId/:tab" element={<ProblemView />} />
          <Route path="/system-design" element={<Navigate to="/labs" replace />} />
          <Route path="/system-design/:lab" element={<Navigate to="/labs" replace />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>

      {/* Footer */}
      <footer className="border-t border-atlas-muted/10 py-6 mt-12 bg-atlas-surface/30">
        <div className="mx-auto max-w-[1580px] px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-atlas-muted">
          <div className="flex items-center gap-2">
            <span className="font-bold text-atlas-text">CodeInsight</span>
            <span>—</span>
            <span>Explore How Technology Works</span>
          </div>
          <div className="font-mono text-[11px]">
            Interactive simulations for Computer Science, Distributed Systems, Networking, OS, Databases, & AI
          </div>
        </div>
      </footer>
    </div>
  )
}
