import { motion } from 'framer-motion'
import { motionTokens } from '../../atlas/motion'
import { cn } from '../../utils/cn'

const ScopeNode = ({ scope, activeScopeId, depth = 0 }) => {
  const active = scope.id === activeScopeId

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={motionTokens.microSpring}
      className={cn(
        'rounded-xl border p-2',
        active
          ? 'border-atlas-brand/45 bg-atlas-brand/12'
          : 'border-atlas-muted/30 bg-atlas-surface/65',
      )}
      style={{ marginLeft: `${depth * 12}px` }}
    >
      <div className="flex items-center justify-between text-xs">
        <span className="text-atlas-text">{scope.name}</span>
        <span className="text-atlas-muted">{scope.type}</span>
      </div>
      {scope.captures?.length ? (
        <p className="mt-1 text-[10px] text-atlas-muted">captures: {scope.captures.join(', ')}</p>
      ) : null}
      {scope.children?.length
        ? scope.children.map((child) => <ScopeNode key={child.id} scope={child} activeScopeId={activeScopeId} depth={depth + 1} />)
        : null}
    </motion.div>
  )
}

const AtlasScopeScene = ({ currentStep }) => {
  const scopeState = currentStep?.scopeState || {
    tree: [],
    activeScopeId: null,
    resolutionPath: [],
  }

  const pathText = scopeState.resolutionPath?.length
    ? scopeState.resolutionPath.join(' -> ')
    : 'No identifier resolution tracked for this step.'

  return (
    <div className="grid h-full grid-cols-1 gap-4 xl:grid-cols-[minmax(0,1fr)_360px]">
      <section className="atlas-surface p-3">
        <div className="mb-2">
          <h3 className="text-sm font-semibold">Scope & Closure Visualizer</h3>
          <p className="text-xs text-atlas-muted">Global, function, and block scope lifecycles with closure capture metadata</p>
        </div>

        <div className="atlas-scrollbar h-[560px] space-y-2 overflow-auto pr-1">
          {scopeState.tree?.length ? (
            scopeState.tree.map((scope) => (
              <ScopeNode key={scope.id} scope={scope} activeScopeId={scopeState.activeScopeId} />
            ))
          ) : (
            <p className="rounded-xl border border-dashed border-atlas-muted/35 px-3 py-4 text-xs text-atlas-muted">
              Scope graph appears once execution starts.
            </p>
          )}
        </div>
      </section>

      <aside className="atlas-surface p-3">
        <h4 className="mb-2 text-sm font-semibold">Resolution Path</h4>
        <div className="rounded-xl border border-atlas-muted/25 bg-atlas-surface/70 p-3 text-xs text-atlas-muted">
          {pathText}
        </div>

        <h4 className="mb-2 mt-3 text-sm font-semibold">Scope Lifecycle</h4>
        <div className="atlas-scrollbar h-[460px] space-y-1 overflow-auto pr-1">
          {(scopeState.scopes || []).slice(-20).reverse().map((scope) => (
            <div key={scope.id} className="rounded-lg border border-atlas-muted/25 bg-atlas-surface/70 px-2.5 py-2 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-atlas-text">{scope.name}</span>
                <span className="text-atlas-muted">{scope.status}</span>
              </div>
              <p className="mt-1 text-[10px] text-atlas-muted">
                created {scope.createdAtStep}
                {scope.destroyedAtStep != null ? ` � destroyed ${scope.destroyedAtStep}` : ''}
              </p>
            </div>
          ))}
        </div>
      </aside>
    </div>
  )
}

export default AtlasScopeScene
