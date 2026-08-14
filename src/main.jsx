import { Component, StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import './index.css'
import App from './App.jsx'

class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }

  componentDidCatch(error, errorInfo) {
    console.error('CodeInsight App Crash:', error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-atlas-bg0 p-6 text-atlas-text">
          <div className="max-w-md rounded-2xl border border-red-500/40 bg-atlas-surface/90 p-6 text-center shadow-2xl">
            <h2 className="text-xl font-bold text-red-400">Application Error Caught</h2>
            <p className="mt-2 text-xs font-mono text-atlas-muted text-left bg-atlas-bg0 p-3 rounded-lg border border-atlas-muted/20 overflow-auto max-h-40">
              {this.state.error?.toString()}
            </p>
            <button
              type="button"
              onClick={() => { window.location.pathname = '/'; window.location.reload() }}
              className="mt-4 rounded-xl border border-atlas-brand/50 bg-atlas-brand/20 px-4 py-2 text-xs text-atlas-text hover:bg-atlas-brand/30"
            >
              Reset App State
            </button>
          </div>
        </div>
      )
    }
    return this.props.children
  }
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ErrorBoundary>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </ErrorBoundary>
  </StrictMode>,
)
