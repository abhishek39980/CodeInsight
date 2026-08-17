/**
 * Central Technology Registry for CodeInsight
 * Master taxonomy spanning 20+ core engineering and emerging technology domains.
 */

export const TECHNOLOGY_DOMAINS = [
  // Core Computing & Systems
  {
    id: 'computer-science',
    name: 'Computer Science',
    category: 'Core',
    icon: '🧠',
    color: 'text-indigo-400',
    summary: 'Data structures, AST parsing, recursion, dynamic programming, and algorithm complexity.'
  },
  {
    id: 'operating-systems',
    name: 'Operating Systems',
    category: 'Core',
    icon: '⚙️',
    color: 'text-emerald-400',
    summary: 'CPU process scheduling, virtual memory, paging, call stacks, and garbage collection.'
  },
  {
    id: 'architecture',
    name: 'Computer Architecture & Hardware',
    category: 'Core',
    icon: '🖥️',
    color: 'text-teal-400',
    summary: 'CPU instruction pipelines, 3D L1/L2/L3 cache hierarchies, memory buses, and branch prediction.'
  },
  {
    id: 'networking',
    name: 'Networking & Protocols',
    category: 'Core',
    icon: '🌐',
    color: 'text-cyan-400',
    summary: 'TCP 3-way handshakes, congestion control (cwnd), DNS hierarchy, HTTP/2/3, and TLS.'
  },
  {
    id: 'distributed-systems',
    name: 'Distributed Systems',
    category: 'Core',
    icon: '☁️',
    color: 'text-sky-400',
    summary: 'Consistent hashing, distributed caching, rate limiters, circuit breakers, and Raft consensus.'
  },
  {
    id: 'databases',
    name: 'Databases & Storage',
    category: 'Core',
    icon: '🗄️',
    color: 'text-amber-400',
    summary: 'B-Tree indexing, LSM-Trees, write-ahead logging (WAL), MVCC, and dynamic sharding.'
  },
  {
    id: 'cybersecurity',
    name: 'Cybersecurity & Cryptography',
    category: 'Core',
    icon: '🔐',
    color: 'text-rose-400',
    summary: 'Public-key RSA cryptography, Diffie-Hellman key exchange, SHA hashing, and injection defenses.'
  },
  {
    id: 'cloud-infrastructure',
    name: 'Cloud Computing & Clusters',
    category: 'Infrastructure',
    icon: '🚀',
    color: 'text-blue-400',
    summary: 'Kubernetes pod rescheduling, auto-scaling, availability zones, and container runtimes.'
  },
  {
    id: 'devops',
    name: 'DevOps & CI/CD',
    category: 'Infrastructure',
    icon: '🔄',
    color: 'text-orange-400',
    summary: 'Git commit DAGs, branch 3-way merges, CI/CD build pipelines, and canary rollouts.'
  },
  {
    id: 'web-engineering',
    name: 'Web Engineering & Browsers',
    category: 'Software Engineering',
    icon: '⚡',
    color: 'text-yellow-400',
    summary: 'Browser critical rendering path, DOM/CSSOM construction, event loops, and WebSockets.'
  },
  {
    id: 'programming-languages',
    name: 'Programming Languages & Compilers',
    category: 'Software Engineering',
    icon: '📜',
    color: 'text-fuchsia-400',
    summary: 'Lexical analysis, AST tokenization, bytecode interpreters, and type systems.'
  },

  // AI & Data Systems
  {
    id: 'ai-ml',
    name: 'Artificial Intelligence & ML',
    category: 'AI & Data',
    icon: '🤖',
    color: 'text-purple-400',
    summary: '3D neural networks, forward propagation, decision boundaries, and loss gradients.'
  },
  {
    id: 'generative-ai',
    name: 'Generative AI & LLMs',
    category: 'AI & Data',
    icon: '✨',
    color: 'text-pink-400',
    summary: 'Transformer multi-head attention, subword tokenization, RAG vector search, and KV-Cache.'
  },
  {
    id: 'data-engineering',
    name: 'Data Engineering & Streaming',
    category: 'AI & Data',
    icon: '📊',
    color: 'text-lime-400',
    summary: 'Kafka partition streams, batch pipelines, MapReduce, and columnar data storage.'
  }
]

export const TECHNOLOGY_LABS = [
  // 3D Visualizer Labs
  {
    id: 'cpu-cache-3d',
    title: '3D CPU Memory & Cache Hierarchy Laboratory',
    domainId: 'architecture',
    category: 'Hardware & Microarchitecture',
    level: 'Advanced',
    summary: 'Interactive 3D WebGL stage visualizing physical data bus flows across CPU Core, L1, L2, L3 caches, and Main RAM with nanosecond latency clocks.',
    visualizationType: '3D WebGL Stage (Three.js)',
    tags: ['3D WebGL', 'CPU Cache', 'Memory Latency', 'L1/L2/L3', 'Hardware'],
    component: 'CPUCache3DLab'
  },
  {
    id: 'neural-net-3d',
    title: '3D Neural Network Volume & Activation Flow',
    domainId: 'ai-ml',
    category: 'Deep Learning',
    level: 'Intermediate',
    summary: 'Interactive 3D rotating neural space visualizing synaptic connections, forward activation waves, and tensor transformations.',
    visualizationType: '3D WebGL Stage (Three.js)',
    tags: ['3D WebGL', 'Neural Networks', 'Deep Learning', 'Activations'],
    component: 'NeuralNet3DLab'
  },

  // Cloud & DevOps Labs
  {
    id: 'kubernetes-cluster',
    title: 'Kubernetes Pod Rescheduling & Failure Recovery',
    domainId: 'cloud-infrastructure',
    category: 'Cluster Orchestration',
    level: 'Advanced',
    summary: 'Simulates Kubernetes controller manager detecting node crashes and automatically rescheduling pod replicas to healthy nodes with zero downtime.',
    visualizationType: 'Multi-Node Cluster Canvas & Health Probes',
    tags: ['Kubernetes', 'Cloud', 'Fault Recovery', 'Containers', 'DevOps'],
    component: 'KubernetesPodReschedulingLab'
  },
  {
    id: 'git-graph',
    title: 'Git Commit DAG & Branch Merge Engine',
    domainId: 'devops',
    category: 'Version Control Systems',
    level: 'Intermediate',
    summary: 'Interactive Directed Acyclic Graph (DAG) simulating git commits, branch pointers (HEAD, main, feature), fast-forward, and 3-way merges.',
    visualizationType: 'Interactive Commit DAG & Branch Tree',
    tags: ['Git', 'DevOps', 'DAG', 'Version Control', 'Merge Conflicts'],
    component: 'GitGraphLab'
  },

  // Networking Labs
  {
    id: 'tcp-handshake',
    title: 'TCP 3-Way Handshake & Connection Lab',
    domainId: 'networking',
    category: 'Transport Protocols',
    level: 'Beginner',
    summary: 'Interactive packet flight over physical wire negotiating SYN, SYN-ACK, ACK, and RFC 793 sequence numbers.',
    visualizationType: 'Animated Packet Transmission Line',
    tags: ['TCP', 'Networking', 'Handshake', 'Protocols'],
    component: 'TCPHandshakeLab'
  },
  {
    id: 'tcp-congestion',
    title: 'TCP Congestion Control & Sliding Window (CUBIC/Reno)',
    domainId: 'networking',
    category: 'Transport Layer Protocols',
    level: 'Advanced',
    summary: 'Simulates TCP sliding window, Slow Start exponential growth, Congestion Avoidance (cwnd), packet drop timeouts, and Fast Recovery.',
    visualizationType: 'Sliding Window Buffer & cwnd Graph',
    tags: ['TCP', 'Congestion Control', 'Sliding Window', 'Packet Loss', 'cwnd'],
    component: 'TCPCongestionLab'
  },

  // Databases & Storage
  {
    id: 'btree-index',
    title: 'B-Tree Database Indexing & Page Splits',
    domainId: 'databases',
    category: 'Storage Engines & Indexing',
    level: 'Advanced',
    summary: 'Self-balancing B-Tree index simulator demonstrating disk page traversals, node splitting, and logarithmic key searches.',
    visualizationType: 'Hierarchical Tree Visualizer & Disk Pages',
    tags: ['Databases', 'B-Tree', 'Indexing', 'Storage Engines'],
    component: 'BTreeIndexLab'
  },

  // Distributed Systems
  {
    id: 'lru-cache',
    title: 'LRU Cache Simulation Lab',
    domainId: 'distributed-systems',
    category: 'Caching & In-Memory',
    level: 'Intermediate',
    summary: 'Doubly Linked List + Hash Map simulator demonstrating strict O(1) cache hits and tail evictions.',
    visualizationType: '2D Data Structure Map',
    tags: ['Caching', 'O(1) Access', 'Distributed Systems'],
    component: 'LRUCacheVisualizer'
  },
  {
    id: 'rate-limiter',
    title: 'Rate Limiter Traffic Lab',
    domainId: 'distributed-systems',
    category: 'Traffic Management',
    level: 'Intermediate',
    summary: 'Token Bucket & Leaky Bucket traffic simulator with continuous token refill, request bursts, and HTTP 429 backpressure.',
    visualizationType: 'Fluid Particle Flow',
    tags: ['Rate Limiting', 'Traffic Shaping', 'API Gateways'],
    component: 'RateLimiterVisualizer'
  },
  {
    id: 'consistent-hashing',
    title: 'Consistent Hashing & Dynamic Sharding',
    domainId: 'distributed-systems',
    category: 'Sharding & Partitioning',
    level: 'Advanced',
    summary: '360° Circular Hash Ring simulating virtual nodes, key routing, and minimal K/N key rebalancing during server topology changes.',
    visualizationType: '360° Circular Ring SVG',
    tags: ['Consistent Hashing', 'Sharding', 'Load Balancing'],
    component: 'ConsistentHashingVisualizer'
  },
  {
    id: 'circuit-breaker',
    title: 'Circuit Breaker Fault Tolerance',
    domainId: 'distributed-systems',
    category: 'Reliability & Resilience',
    level: 'Advanced',
    summary: 'Netflix Hystrix-style 3-state machine (Closed, Open, Half-Open) with automated recovery timers and fault injection.',
    visualizationType: 'Finite State Machine Telemetry',
    tags: ['Fault Tolerance', 'Microservices', 'Resilience'],
    component: 'CircuitBreakerVisualizer'
  },

  // Operating Systems
  {
    id: 'memory-profiler',
    title: 'Hardware Memory Profiler & Stack/Heap',
    domainId: 'operating-systems',
    category: 'Memory Management',
    level: 'Intermediate',
    summary: 'Simulates raw call stack frame lifecycles, dynamic heap allocations, hex pointer addresses, and Mark & Sweep GC.',
    visualizationType: 'Dual-Segment Memory Canvas',
    tags: ['Operating Systems', 'Memory', 'Call Stack', 'Heap', 'GC'],
    component: 'DSAMemoryProfiler'
  },
  {
    id: 'cpu-scheduler',
    title: 'CPU Process Scheduling & Context Switching',
    domainId: 'operating-systems',
    category: 'Kernel Management',
    level: 'Intermediate',
    summary: 'Interactive process scheduler comparing Round Robin, Shortest Job First (SJF), and FCFS with live Gantt timeline charts.',
    visualizationType: 'Gantt Timeline Chart',
    tags: ['CPU Scheduling', 'Operating Systems', 'Process Management'],
    component: 'CPUSchedulerLab'
  },

  // AI & ML
  {
    id: 'neural-net',
    title: 'Neural Network Forward Propagation & Activations',
    domainId: 'ai-ml',
    category: 'Deep Learning',
    level: 'Intermediate',
    summary: 'Interactive multi-layer perceptron with real-time weight/bias tuning, activation functions, and 2D decision boundary maps.',
    visualizationType: 'Neuron Network & Decision Heatmap',
    tags: ['AI', 'Neural Networks', 'Deep Learning'],
    component: 'NeuralNetworkLab'
  },

  // Cybersecurity
  {
    id: 'rsa-encryption',
    title: 'Public-Key RSA Cryptography Lab',
    domainId: 'cybersecurity',
    category: 'Asymmetric Cryptography',
    level: 'Intermediate',
    summary: 'Interactive prime key generation (p, q -> N, e, d), live plaintext encryption, wire interception, and private key decryption.',
    visualizationType: 'Cryptographic Pipeline Inspector',
    tags: ['Cryptography', 'RSA', 'Encryption', 'Security'],
    component: 'RSACryptographyLab'
  },

  // Computer Science & Algorithms
  {
    id: 'dynamic-programming',
    title: '2D Dynamic Programming Grid & Cell Trace',
    domainId: 'computer-science',
    category: 'Dynamic Programming',
    level: 'Advanced',
    summary: 'Interactive 2D state matrix with cell dependency vector tracing and optimal path backtracking for Knapsack, LCS, and Edit Distance.',
    visualizationType: 'Interactive 2D Matrix',
    tags: ['Algorithms', 'Dynamic Programming', 'Memoization'],
    component: 'DSADynamicProgrammingVisualizer'
  },
  {
    id: 'pathfinding',
    title: 'Dijkstra & A* Shortest Pathfinding Lab',
    domainId: 'computer-science',
    category: 'Graph Algorithms & Heuristics',
    level: 'Intermediate',
    summary: 'Interactive 2D obstacle board with terrain weights and live Min-Heap priority queue telemetry (f = g + h).',
    visualizationType: 'Interactive Grid Board',
    tags: ['Algorithms', 'A*', 'Dijkstra', 'Graph Search'],
    component: 'PathfindingVisualizer'
  }
]

export function getDomainById(domainId) {
  return TECHNOLOGY_DOMAINS.find(d => d.id === domainId)
}

export function getLabById(labId) {
  return TECHNOLOGY_LABS.find(l => l.id === labId)
}

export function getLabsByDomain(domainId) {
  return TECHNOLOGY_LABS.filter(l => l.domainId === domainId)
}
