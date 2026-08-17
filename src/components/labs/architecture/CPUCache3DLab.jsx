import { useEffect, useRef, useState } from 'react'
import * as THREE from 'three'
import {
  Cpu,
  RotateCcw,
  Zap,
  Layers,
  Sparkles,
  Info,
  Activity,
  HardDrive,
  Clock
} from 'lucide-react'
import { cn } from '../../../utils/cn'

export default function CPUCache3DLab() {
  const mountRef = useRef(null)
  const [activeTier, setActiveTier] = useState('L1') // 'L1' | 'L2' | 'L3' | 'RAM'
  const [latencyNs, setLatencyNs] = useState(1.1)
  const [isReading, setIsReading] = useState(false)
  const [addressHex, setAddressHex] = useState('0x7FFEE4B201A8')

  const sceneRef = useRef(null)
  const packetMeshRef = useRef(null)

  useEffect(() => {
    const currentMount = mountRef.current
    if (!currentMount) return

    const width = currentMount.clientWidth || 700
    const height = 400

    // Scene, Camera, Renderer
    const scene = new THREE.Scene()
    sceneRef.current = scene
    scene.background = new THREE.Color(0x0a0e14)

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000)
    camera.position.set(0, 15, 28)
    camera.lookAt(0, 0, 0)

    const renderer = new THREE.WebGLRenderer({ antialias: true })
    renderer.setSize(width, height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    currentMount.appendChild(renderer.domElement)

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.8)
    scene.add(ambientLight)

    const dirLight = new THREE.DirectionalLight(0x38bdf8, 1.5)
    dirLight.position.set(10, 20, 10)
    scene.add(dirLight)

    // 1. CPU Core (Gold/Cyan Center Block)
    const coreGeo = new THREE.BoxGeometry(4, 1.5, 4)
    const coreMat = new THREE.MeshStandardMaterial({ color: 0x38bdf8, metalness: 0.8, roughness: 0.2 })
    const coreMesh = new THREE.Mesh(coreGeo, coreMat)
    coreMesh.position.set(0, 0, -8)
    scene.add(coreMesh)

    // 2. L1 Cache Block (Emerald)
    const l1Geo = new THREE.BoxGeometry(5, 1.2, 3)
    const l1Mat = new THREE.MeshStandardMaterial({ color: 0x34d399, metalness: 0.6, roughness: 0.3 })
    const l1Mesh = new THREE.Mesh(l1Geo, l1Mat)
    l1Mesh.position.set(0, 0, -3)
    scene.add(l1Mesh)

    // 3. L2 Cache Block (Amber)
    const l2Geo = new THREE.BoxGeometry(6.5, 1.2, 3)
    const l2Mat = new THREE.MeshStandardMaterial({ color: 0xfbbf24, metalness: 0.6, roughness: 0.3 })
    const l2Mesh = new THREE.Mesh(l2Geo, l2Mat)
    l2Mesh.position.set(0, 0, 2)
    scene.add(l2Mesh)

    // 4. L3 Cache Block (Violet)
    const l3Geo = new THREE.BoxGeometry(8, 1.2, 3)
    const l3Mat = new THREE.MeshStandardMaterial({ color: 0xc084fc, metalness: 0.6, roughness: 0.3 })
    const l3Mesh = new THREE.Mesh(l3Geo, l3Mat)
    l3Mesh.position.set(0, 0, 7)
    scene.add(l3Mesh)

    // 5. Main RAM Block (Rose Plane)
    const ramGeo = new THREE.BoxGeometry(11, 1.2, 3.5)
    const ramMat = new THREE.MeshStandardMaterial({ color: 0xfb7185, metalness: 0.7, roughness: 0.2 })
    const ramMesh = new THREE.Mesh(ramGeo, ramMat)
    ramMesh.position.set(0, 0, 13)
    scene.add(ramMesh)

    // Data Packet Sphere
    const packetGeo = new THREE.SphereGeometry(0.6, 16, 16)
    const packetMat = new THREE.MeshBasicMaterial({ color: 0xffffff })
    const packetMesh = new THREE.Mesh(packetGeo, packetMat)
    packetMesh.position.set(0, 1.5, -8)
    scene.add(packetMesh)
    packetMeshRef.current = packetMesh

    // Memory Bus Line Grid
    const grid = new THREE.GridHelper(32, 16, 0x1f2937, 0x111827)
    grid.position.y = -1
    scene.add(grid)

    // Animation Loop
    let reqId
    const animate = () => {
      reqId = requestAnimationFrame(animate)
      coreMesh.rotation.y += 0.005
      renderer.render(scene, camera)
    }
    animate()

    return () => {
      cancelAnimationFrame(reqId)
      if (currentMount && renderer.domElement) {
        currentMount.removeChild(renderer.domElement)
      }
      renderer.dispose()
    }
  }, [])

  // Trigger memory read animation
  const triggerMemoryRead = (tier) => {
    setActiveTier(tier)
    setIsReading(true)

    let targetZ = -3
    let lat = 1.1

    if (tier === 'L1') { targetZ = -3; lat = 1.1 }
    else if (tier === 'L2') { targetZ = 2; lat = 4.2 }
    else if (tier === 'L3') { targetZ = 7; lat = 14.8 }
    else if (tier === 'RAM') { targetZ = 13; lat = 96.5 }

    setLatencyNs(lat)
    setAddressHex(`0x7FFF${Math.floor(1000 + Math.random() * 9000).toString(16).toUpperCase()}`)

    if (packetMeshRef.current) {
      packetMeshRef.current.position.z = targetZ
    }

    setTimeout(() => setIsReading(false), 500)
  }

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="rounded-3xl border border-teal-500/30 bg-gradient-to-br from-atlas-surface via-atlas-elev to-atlas-surface p-6 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-teal-400">
            <Cpu size={18} className="text-teal-400" />
            <span>3D WebGL Microarchitecture Stage</span>
          </div>
          <h3 className="mt-1 text-xl font-bold text-atlas-text">CPU Memory & Cache Hierarchy Laboratory</h3>
          <p className="text-xs text-atlas-muted mt-0.5 max-w-2xl">
            Explore why CPU caches exist. Step through nanosecond latency penalties when data travels from on-chip SRAM registers to off-die Main System DRAM.
          </p>
        </div>

        {/* Latency Clock Gauge */}
        <div className="flex items-center gap-3 bg-atlas-bg0/80 p-3 rounded-2xl border border-atlas-muted/20">
          <div className="text-center px-2 font-mono">
            <span className="text-[10px] text-atlas-muted uppercase block">Access Latency</span>
            <span className="text-lg font-bold text-teal-300">{latencyNs} ns</span>
          </div>
          <div className="h-7 w-px bg-atlas-muted/20" />
          <div className="text-center px-2 font-mono">
            <span className="text-[10px] text-atlas-muted uppercase block">Cache Tier</span>
            <span className="text-xs font-bold text-emerald-400">{activeTier} HIT</span>
          </div>
        </div>
      </div>

      {/* Control Strip */}
      <div className="rounded-2xl border border-atlas-muted/20 bg-atlas-surface/80 p-4 space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs text-atlas-muted font-medium mr-1">Simulate Memory Lookup:</span>
            {[
              { id: 'L1', label: 'L1 Cache Hit (1ns)', color: 'border-emerald-500/40 text-emerald-300' },
              { id: 'L2', label: 'L2 Cache Hit (4ns)', color: 'border-amber-500/40 text-amber-300' },
              { id: 'L3', label: 'L3 Cache Hit (15ns)', color: 'border-purple-500/40 text-purple-300' },
              { id: 'RAM', label: 'Main RAM Access (100ns)', color: 'border-rose-500/40 text-rose-300' }
            ].map(t => (
              <button
                key={t.id}
                onClick={() => triggerMemoryRead(t.id)}
                className={cn(
                  'px-3.5 py-1.5 text-xs font-mono font-semibold rounded-lg transition border flex items-center gap-1.5 shadow',
                  activeTier === t.id
                    ? 'bg-atlas-elev ring-2 ring-teal-400 text-atlas-text'
                    : 'bg-atlas-bg0/80 text-atlas-muted hover:text-atlas-text'
                )}
              >
                <Zap size={12} className="text-teal-400" />
                {t.label}
              </button>
            ))}
          </div>

          <div className="text-xs font-mono text-atlas-muted">
            Address: <span className="text-teal-300 font-bold">{addressHex}</span>
          </div>
        </div>
      </div>

      {/* 3D WebGL Stage Canvas */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left 8 cols: Three.js Viewport */}
        <div className="lg:col-span-8 space-y-4">
          <div className="rounded-3xl border border-atlas-muted/25 bg-[#0a0e14] p-4 relative overflow-hidden shadow-2xl">
            <div className="flex items-center justify-between pb-2 px-2 border-b border-atlas-muted/15">
              <span className="text-xs font-mono text-teal-400 font-bold flex items-center gap-1.5">
                <Sparkles size={13} />
                3D Physical Bus Layout (Core ➔ L1 ➔ L2 ➔ L3 ➔ RAM)
              </span>
              <span className="text-[10px] font-mono text-atlas-muted">Three.js WebGL Engine</span>
            </div>

            {/* Canvas Mount */}
            <div ref={mountRef} className="w-full h-[400px] rounded-2xl overflow-hidden cursor-grab" />
          </div>
        </div>

        {/* Right 4 cols: Microarchitecture Comparison Metrics */}
        <div className="lg:col-span-4 space-y-4">
          <div className="rounded-3xl border border-atlas-muted/25 bg-atlas-surface/90 p-5 space-y-4 font-mono text-xs">
            <h4 className="text-sm font-bold text-atlas-text font-sans">Memory Hierarchy Metrics</h4>

            <div className="space-y-2">
              <div className="p-2.5 rounded-xl bg-atlas-elev border border-emerald-500/30 flex justify-between items-center">
                <div>
                  <span className="font-bold text-emerald-300 block">L1 Data Cache</span>
                  <span className="text-[10px] text-atlas-muted">64 KB per core · On-Die SRAM</span>
                </div>
                <span className="text-sm font-bold text-emerald-300">~1.1 ns (4 Cycles)</span>
              </div>

              <div className="p-2.5 rounded-xl bg-atlas-elev border border-amber-500/30 flex justify-between items-center">
                <div>
                  <span className="font-bold text-amber-300 block">L2 Cache</span>
                  <span className="text-[10px] text-atlas-muted">512 KB per core · SRAM</span>
                </div>
                <span className="text-sm font-bold text-amber-300">~4.2 ns (14 Cycles)</span>
              </div>

              <div className="p-2.5 rounded-xl bg-atlas-elev border border-purple-500/30 flex justify-between items-center">
                <div>
                  <span className="font-bold text-purple-300 block">L3 Shared Cache</span>
                  <span className="text-[10px] text-atlas-muted">32 MB Shared · SRAM</span>
                </div>
                <span className="text-sm font-bold text-purple-300">~14.8 ns (50 Cycles)</span>
              </div>

              <div className="p-2.5 rounded-xl bg-atlas-elev border border-rose-500/30 flex justify-between items-center">
                <div>
                  <span className="font-bold text-rose-300 block">Main System RAM</span>
                  <span className="text-[10px] text-atlas-muted">32 GB DDR5 · Off-Die DRAM Bus</span>
                </div>
                <span className="text-sm font-bold text-rose-300">~96.5 ns (300 Cycles)</span>
              </div>
            </div>

            <div className="rounded-xl bg-atlas-bg0/60 p-3 text-[11px] text-atlas-muted space-y-1 border border-atlas-muted/10 font-sans">
              <span className="font-semibold text-atlas-text block">Mechanical Analogy:</span>
              <p className="leading-relaxed">
                Accessing <strong>L1 Cache (1ns)</strong> is like grabbing a book off your desk. Accessing <strong>Main RAM (100ns)</strong> is like driving to the public library across town.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
