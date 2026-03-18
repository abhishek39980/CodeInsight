import { useEffect, useMemo, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import Editor from '@monaco-editor/react'
import { ChevronDown, ChevronRight } from 'lucide-react'
import { motionTokens } from '../../atlas/motion'
import { cn } from '../../utils/cn'

const AstNodeRow = ({ node, depth, expanded, activeNodeId, onToggle, onSelect }) => {
  const hasChildren = node.children?.length > 0
  const isOpen = expanded[node.id] ?? depth < 2
  const isActive = activeNodeId === node.id

  return (
    <div>
      <button
        type="button"
        onClick={() => onSelect(node.id)}
        className={cn(
          'flex w-full items-center gap-1 rounded-md px-2 py-1 text-left text-xs transition',
          isActive ? 'bg-atlas-brand/20 text-atlas-text' : 'text-atlas-muted hover:bg-atlas-surface/70 hover:text-atlas-text',
        )}
        style={{ paddingLeft: `${8 + depth * 12}px` }}
      >
        {hasChildren ? (
          <span
            onClick={(event) => {
              event.stopPropagation()
              onToggle(node.id)
            }}
            className="inline-flex h-4 w-4 items-center justify-center"
          >
            {isOpen ? <ChevronDown size={12} /> : <ChevronRight size={12} />}
          </span>
        ) : (
          <span className="inline-block h-4 w-4" />
        )}
        <span className="font-mono text-atlas-text">{node.type}</span>
        <span className="text-[10px] text-atlas-muted">L{node.startLine}</span>
      </button>

      {hasChildren && isOpen
        ? node.children.map((child) => (
            <AstNodeRow
              key={child.id}
              node={child}
              depth={depth + 1}
              expanded={expanded}
              activeNodeId={activeNodeId}
              onToggle={onToggle}
              onSelect={onSelect}
            />
          ))
        : null}
    </div>
  )
}

const AtlasAstScene = ({
  code,
  language,
  currentStep,
  astArtifacts,
  selectedAstNodeId,
  onSelectAstNode,
  onSeekByNode,
  onClearAstSelection,
}) => {
  const editorRef = useRef(null)
  const decorationsRef = useRef([])
  const [expanded, setExpanded] = useState({})

  const activeNodeId = selectedAstNodeId || currentStep?.meta?.astNodeId || null
  const activeNode = activeNodeId ? astArtifacts?.nodesById?.[activeNodeId] : null

  const root = astArtifacts?.root || null

  useEffect(() => {
    const editor = editorRef.current
    if (!editor || !activeNode) {
      return
    }

    decorationsRef.current = editor.deltaDecorations(decorationsRef.current, [{
      range: {
        startLineNumber: activeNode.startLine,
        startColumn: 1,
        endLineNumber: activeNode.endLine,
        endColumn: 1,
      },
      options: {
        isWholeLine: true,
        className: 'atlas-ast-line',
      },
    }])

    editor.revealLineInCenterIfOutsideViewport(activeNode.startLine, 0)
  }, [activeNode])

  const activeMeta = useMemo(() => {
    if (!activeNode) {
      return null
    }

    return {
      type: activeNode.type,
      line: activeNode.startLine,
      range: `L${activeNode.startLine}:${activeNode.startColumn} - L${activeNode.endLine}:${activeNode.endColumn}`,
      summary: activeNode.summary,
    }
  }, [activeNode])

  return (
    <div className="grid h-full grid-cols-1 gap-4 xl:grid-cols-[360px_minmax(0,1fr)]">
      <section className="atlas-surface p-3">
        <div className="mb-2 flex items-center justify-between">
          <h3 className="text-sm font-semibold">Live AST</h3>
          {selectedAstNodeId ? (
            <button type="button" className="text-xs text-atlas-muted hover:text-atlas-text" onClick={onClearAstSelection}>
              Follow Step
            </button>
          ) : null}
        </div>

        <div className="atlas-scrollbar h-[560px] overflow-auto rounded-xl border border-atlas-muted/25 bg-atlas-bg0/30 p-2">
          {root ? (
            <AstNodeRow
              node={root}
              depth={0}
              expanded={expanded}
              activeNodeId={activeNodeId}
              onToggle={(id) => setExpanded((prev) => ({ ...prev, [id]: !prev[id] }))}
              onSelect={(id) => {
                onSelectAstNode(id)
                onSeekByNode(id)
              }}
            />
          ) : (
            <p className="px-2 py-3 text-xs text-atlas-muted">Run code to generate AST tree.</p>
          )}
        </div>
      </section>

      <section className="atlas-surface p-3">
        <div className="mb-3 flex items-center justify-between">
          <div>
            <h3 className="text-sm font-semibold">Node-Synced Code View</h3>
            <p className="text-xs text-atlas-muted">Selecting AST nodes highlights source lines and syncs with execution steps</p>
          </div>
          {activeMeta ? (
            <motion.div
              key={activeMeta.range}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={motionTokens.microSpring}
              className="rounded-lg border border-atlas-brand/30 bg-atlas-brand/12 px-3 py-1.5 text-xs"
            >
              {activeMeta.type} • {activeMeta.range}
            </motion.div>
          ) : null}
        </div>

        <div className="atlas-elevated mb-3 p-2 text-xs text-atlas-muted">
          {activeMeta ? activeMeta.summary : 'Step through execution or click a node to inspect metadata.'}
        </div>

        <div className="atlas-elevated h-[500px] overflow-hidden p-2">
          <Editor
            value={code}
            language={language}
            theme="vs-dark"
            onMount={(editor) => {
              editorRef.current = editor
            }}
            options={{
              readOnly: true,
              minimap: { enabled: false },
              lineHeight: 22,
              fontSize: 13,
              scrollBeyondLastLine: false,
              fontFamily: "'IBM Plex Mono', ui-monospace, monospace",
              padding: { top: 10, bottom: 10 },
            }}
          />
        </div>
      </section>
    </div>
  )
}

export default AtlasAstScene
