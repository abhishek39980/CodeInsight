import { AnimatePresence, motion } from 'framer-motion'
import { motionTokens } from '../../atlas/motion'
import AtlasCallTreeScene from './AtlasCallTreeScene'
import AtlasComplexityScene from './AtlasComplexityScene'
import AtlasEventLoopScene from './AtlasEventLoopScene'
import AtlasMemoryGraphScene from './AtlasMemoryGraphScene'
import AtlasScopeScene from './AtlasScopeScene'
import AtlasAstScene from './AtlasAstScene'
import AtlasTimelineScene from './AtlasTimelineScene'
import AtlasStructureRenderer from './AtlasStructureRenderer'
import AtlasCompareScene from './AtlasCompareScene'
import AtlasGridScene from './AtlasGridScene'

const viewLabel = {
  timeline: 'Timeline View',
  structure: 'Tree & Graph Auto-Layout Diagram',
  compare: 'Dual Algorithm Comparison View',
  memory: 'Memory Graph View',
  grid: '2D Grid & Matrix View',
  callTree: 'Call Tree View',
  ast: 'AST Explorer View',
  complexity: 'Complexity & Big-O Analysis View',
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
  breakpoints = new Set(),
  onToggleBreakpoint,
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
              breakpoints={breakpoints}
              onToggleBreakpoint={onToggleBreakpoint}
            />
          ) : null}
          {view === 'structure' ? (
            <AtlasStructureRenderer currentStep={currentStep} />
          ) : null}
          {view === 'compare' ? (
            <AtlasCompareScene />
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
          {view === 'grid' ? (
            <AtlasGridScene
              currentStep={currentStep}
              selectedEntity={selectedEntity}
              onSelectEntity={onSelectEntity}
            />
          ) : null}
          {view === 'challenge' ? (
            <AtlasChallengePanel currentStep={currentStep} />
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
