import { AnimatePresence, motion } from 'framer-motion'
import { motionTokens } from '../../atlas/motion'
import AtlasComplexityScene from './AtlasComplexityScene'
import AtlasAstScene from './AtlasAstScene'
import AtlasTimelineScene from './AtlasTimelineScene'
import AtlasCompareScene from './AtlasCompareScene'

const viewLabel = {
  timeline: 'Timeline View',
  compare: 'Dual Algorithm Comparison View',
  ast: 'AST Explorer View',
  complexity: 'Complexity & Big-O Analysis View',
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
          <h2 className="font-display text-2xl font-semibold">CodeInsight Atlas</h2>
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
              onSelectEntity={onSelectEntity}
              onHoverEntity={onHoverEntity}
              breakpoints={breakpoints}
              onToggleBreakpoint={onToggleBreakpoint}
            />
          ) : null}

          {view === 'compare' ? <AtlasCompareScene /> : null}

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
        </motion.div>
      </AnimatePresence>
    </div>
  )
}

export default AtlasSceneCanvas
