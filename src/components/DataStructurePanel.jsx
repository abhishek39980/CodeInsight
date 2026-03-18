import Panel from './Panel'
import ArrayVisualizer from './visualizers/ArrayVisualizer'
import GraphVisualizer from './visualizers/GraphVisualizer'
import LinkedListVisualizer from './visualizers/LinkedListVisualizer'
import ObjectVisualizer from './visualizers/ObjectVisualizer'
import TreeVisualizer from './visualizers/TreeVisualizer'

const pickVisualizer = (node) => {
  const subtype = node?.structureSubtype
  if (!subtype) {
    return 'object'
  }

  if (subtype.includes('array')) return 'array'
  if (subtype.includes('linked-list')) return 'linked-list'
  if (subtype.includes('binary-tree') || subtype.includes('tree')) return 'tree'
  if (subtype.includes('graph')) return 'graph'
  return 'object'
}

const DataStructurePanel = ({ heap, activeRefId }) => {
  const node = heap.find((item) => item.id === activeRefId) || heap[0]
  const kind = pickVisualizer(node)

  return (
    <Panel title="Data Structure View" subtitle="Auto-detected specialized visualization" accent>
      {!node ? (
        <p className="rounded-xl border border-dashed border-white/10 px-3 py-4 text-xs text-zinc-500">Run code with objects or arrays to enable structure visualizations.</p>
      ) : (
        <div className="space-y-2">
          <div className="flex items-center justify-between rounded-lg border border-white/10 bg-white/[0.02] px-3 py-2 text-xs">
            <span className="font-mono text-sky-300">#{node.id}</span>
            <span className="text-zinc-400">{node.structureSubtype} · nodes {node.nodeCount}</span>
          </div>

          {kind === 'array' ? <ArrayVisualizer node={node} /> : null}
          {kind === 'object' ? <ObjectVisualizer node={node} /> : null}
          {kind === 'linked-list' ? <LinkedListVisualizer node={node} heap={heap} /> : null}
          {kind === 'tree' ? <TreeVisualizer node={node} heap={heap} /> : null}
          {kind === 'graph' ? <GraphVisualizer node={node} heap={heap} /> : null}
        </div>
      )}
    </Panel>
  )
}

export default DataStructurePanel
