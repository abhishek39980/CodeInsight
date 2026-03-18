import { AnimatePresence, motion } from 'framer-motion'
import { motionTokens } from '../../atlas/motion'
import AtlasCallTreeScene from './AtlasCallTreeScene'
import AtlasComplexityScene from './AtlasComplexityScene'
import AtlasEventLoopScene from './AtlasEventLoopScene'
import AtlasMemoryGraphScene from './AtlasMemoryGraphScene'
import AtlasScopeScene from './AtlasScopeScene'
import AtlasAstScene from './AtlasAstScene'
import AtlasTimelineScene from './AtlasTimelineScene'

const viewLabel = {
  timeline: 'Timeline View',
  memory: 'Memory Graph View',
  callTree: 'Call Tree View',
  eventLoop: 'Event Loop View',
  ast: 'AST View',
  complexity: 'Complexity View',
  scope: 'Scope View',
}

const AtlasSceneCanvas = ({
  view,
  code,
  onCodeChange,
  language,
  loadingExample,
  currentStep,
  previousStep,
  nextStep,
  selectedEntity,
  hoverEntity,
  pointerTags,
  focusMode,
  astArtifacts,
  complexityReport,
  selectedAstNodeId,
  onSelectAstNode,
  onSeekByAstNode,
  onClearAstSelection,
  onTogglePointerTag,
  onSelectEntity,
  onHoverEntity,
}) => {
  return (
    <div className="flex min-h-[640px] flex-col gap-3">
      <div className="flex items-center justify-between px-1">
        <div>
          <p className="text-[11px] uppercase tracking-[0.16em] text-atlas-muted">Atlas Scene Canvas</p>
          <h1 className="font-display text-2xl font-semibold">CodeInsight Atlas</h1>
        </div>
        <p className="rounded-full border border-atlas-muted/35 bg-atlas-surface/70 px-3 py-1 text-xs text-atlas-muted">
          {viewLabel[view] || 'Timeline View'}
        </p>
      </div>

      <AnimatePresence mode="popLayout" initial={false}>
        <motion.div
          key={view}
          initial={{ opacity: 0, y: 14, scale: 0.99 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -10, scale: 0.99 }}
          transition={motionTokens.sceneSpring}
          className="min-h-0 flex-1"
        >
          {view === 'timeline' ? (
            <AtlasTimelineScene
              code={code}
              onCodeChange={onCodeChange}
              language={language}
              loadingExample={loadingExample}
              currentStep={currentStep}
              previousStep={previousStep}
              nextStep={nextStep}
              selectedEntity={selectedEntity}
              astHighlightedLine={astArtifacts?.nodesById?.[selectedAstNodeId || currentStep?.meta?.astNodeId]?.startLine || null}
              focusMode={focusMode}
              onSelectEntity={onSelectEntity}
              onHoverEntity={onHoverEntity}
            />
          ) : null}
          {view === 'memory' ? (
            <AtlasMemoryGraphScene
              currentStep={currentStep}
              selectedEntity={selectedEntity}
              hoverEntity={hoverEntity}
              focusMode={focusMode}
              pointerTags={pointerTags}
              onTogglePointerTag={onTogglePointerTag}
              onSelectEntity={onSelectEntity}
              onHoverEntity={onHoverEntity}
            />
          ) : null}
          {view === 'callTree' ? <AtlasCallTreeScene currentStep={currentStep} focusMode={focusMode} /> : null}
          {view === 'eventLoop' ? <AtlasEventLoopScene currentStep={currentStep} /> : null}
          {view === 'ast' ? (
            <AtlasAstScene
              code={code}
              language={language}
              currentStep={currentStep}
              astArtifacts={astArtifacts}
              selectedAstNodeId={selectedAstNodeId}
              onSelectAstNode={onSelectAstNode}
              onSeekByNode={onSeekByAstNode}
              onClearAstSelection={onClearAstSelection}
            />
          ) : null}
          {view === 'complexity' ? <AtlasComplexityScene complexityReport={complexityReport} /> : null}
          {view === 'scope' ? <AtlasScopeScene currentStep={currentStep} /> : null}
        </motion.div>
      </AnimatePresence>
    </div>
  )
}

export default AtlasSceneCanvas
