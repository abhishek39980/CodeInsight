import { useParams, useNavigate } from 'react-router-dom'
import LabLayout from '../components/lab/LabLayout'
import { getLabById, getDomainById } from '../data/technologyRegistry'

// 3D WebGL Labs
import CPUCache3DLab from '../components/labs/architecture/CPUCache3DLab'
import NeuralNet3DLab from '../components/labs/ai/NeuralNet3DLab'

// Cloud & DevOps Labs
import KubernetesPodReschedulingLab from '../components/labs/cloud/KubernetesPodReschedulingLab'
import GitGraphLab from '../components/labs/devops/GitGraphLab'

// Networking Labs
import TCPHandshakeLab from '../components/labs/networking/TCPHandshakeLab'
import TCPCongestionLab from '../components/labs/networking/TCPCongestionLab'

// Databases & Systems Labs
import BTreeIndexLab from '../components/labs/databases/BTreeIndexLab'
import NeuralNetworkLab from '../components/labs/ai/NeuralNetworkLab'
import CPUSchedulerLab from '../components/labs/os/CPUSchedulerLab'
import RSACryptographyLab from '../components/labs/security/RSACryptographyLab'

// Repositioned Distributed Systems & DSA Labs
import LRUCacheVisualizer from '../components/systemdesign/LRUCacheVisualizer'
import RateLimiterVisualizer from '../components/systemdesign/RateLimiterVisualizer'
import ConsistentHashingVisualizer from '../components/systemdesign/ConsistentHashingVisualizer'
import CircuitBreakerVisualizer from '../components/systemdesign/CircuitBreakerVisualizer'
import DSAMemoryProfiler from '../components/dsa/DSAMemoryProfiler'
import DSADynamicProgrammingVisualizer from '../components/dsa/DSADynamicProgrammingVisualizer'
import PathfindingVisualizer from '../components/dsa/PathfindingVisualizer'

const LAB_COMPONENTS = {
  'cpu-cache-3d': CPUCache3DLab,
  'neural-net-3d': NeuralNet3DLab,
  'kubernetes-cluster': KubernetesPodReschedulingLab,
  'git-graph': GitGraphLab,
  'tcp-handshake': TCPHandshakeLab,
  'tcp-congestion': TCPCongestionLab,
  'btree-index': BTreeIndexLab,
  'neural-net': NeuralNetworkLab,
  'cpu-scheduler': CPUSchedulerLab,
  'rsa-encryption': RSACryptographyLab,
  'lru-cache': LRUCacheVisualizer,
  'rate-limiter': RateLimiterVisualizer,
  'consistent-hashing': ConsistentHashingVisualizer,
  'circuit-breaker': CircuitBreakerVisualizer,
  'memory-profiler': DSAMemoryProfiler,
  'dynamic-programming': DSADynamicProgrammingVisualizer,
  'pathfinding': PathfindingVisualizer
}

export default function LabDetailView() {
  const { labId } = useParams()
  const navigate = useNavigate()
  const lab = getLabById(labId)

  if (!lab) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center text-center">
        <div className="space-y-4">
          <p className="text-xl font-bold text-atlas-text">Laboratory not found</p>
          <button
            onClick={() => navigate('/labs')}
            className="text-sm text-atlas-brand hover:underline font-mono"
          >
            ← Browse All Labs
          </button>
        </div>
      </div>
    )
  }

  const domain = getDomainById(lab.domainId)
  const ComponentToRender = LAB_COMPONENTS[lab.id] || LRUCacheVisualizer

  return (
    <LabLayout
      title={lab.title}
      domain={domain?.name}
      category={lab.category}
      level={lab.level}
      summary={lab.summary}
    >
      <ComponentToRender />
    </LabLayout>
  )
}
