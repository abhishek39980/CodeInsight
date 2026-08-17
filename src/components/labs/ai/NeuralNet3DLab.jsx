import { useEffect, useRef, useState } from 'react'
import * as THREE from 'three'
import {
  Brain,
  Zap,
  RotateCcw,
  Sparkles,
  Play,
  Pause,
  Layers,
  Activity,
  Sliders
} from 'lucide-react'
import { cn } from '../../../utils/cn'

export default function NeuralNet3DLab() {
  const mountRef = useRef(null)
  const [isPlaying, setIsPlaying] = useState(true)
  const [activationSpeed, setActivationSpeed] = useState(1)
  const [activeLayerCount, setActiveLayerCount] = useState(4)

  const sceneRef = useRef(null)
  const neuronMeshesRef = useRef([])

  useEffect(() => {
    const currentMount = mountRef.current
    if (!currentMount) return

    const width = currentMount.clientWidth || 700
    const height = 400

    const scene = new THREE.Scene()
    sceneRef.current = scene
    scene.background = new THREE.Color(0x080a0f)

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000)
    camera.position.set(0, 8, 22)
    camera.lookAt(0, 0, 0)

    const renderer = new THREE.WebGLRenderer({ antialias: true })
    renderer.setSize(width, height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    currentMount.appendChild(renderer.domElement)

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.7)
    scene.add(ambientLight)

    const pointLight = new THREE.PointLight(0xa855f7, 2, 50)
    pointLight.position.set(0, 10, 10)
    scene.add(pointLight)

    // Generate 3D Neural Network Layers
    const layers = [
      { count: 3, x: -8, color: 0x38bdf8 },  // Input (Cyan)
      { count: 5, x: -3, color: 0xa855f7 },  // Hidden 1 (Purple)
      { count: 5, x: 3, color: 0xa855f7 },   // Hidden 2 (Purple)
      { count: 2, x: 8, color: 0x34d399 }    // Output (Emerald)
    ]

    const allNeurons = []
    const layerPositions = []

    layers.forEach((l, lIdx) => {
      const positions = []
      const sphereGeo = new THREE.SphereGeometry(0.65, 16, 16)
      const sphereMat = new THREE.MeshStandardMaterial({
        color: l.color,
        emissive: l.color,
        emissiveIntensity: 0.4,
        roughness: 0.3
      })

      for (let i = 0; i < l.count; i++) {
        const y = (i - (l.count - 1) / 2) * 2.4
        const z = (Math.random() - 0.5) * 2
        const mesh = new THREE.Mesh(sphereGeo, sphereMat)
        mesh.position.set(l.x, y, z)
        scene.add(mesh)
        allNeurons.push(mesh)
        positions.push(new THREE.Vector3(l.x, y, z))
      }
      layerPositions.push(positions)
    })
    neuronMeshesRef.current = allNeurons

    // Create Synaptic Lines between adjacent layers
    const lineMat = new THREE.LineBasicMaterial({ color: 0x334155, transparent: true, opacity: 0.35 })
    for (let l = 0; l < layerPositions.length - 1; l++) {
      const srcLayer = layerPositions[l]
      const dstLayer = layerPositions[l + 1]

      srcLayer.forEach(src => {
        dstLayer.forEach(dst => {
          const points = [src, dst]
          const geo = new THREE.BufferGeometry().setFromPoints(points)
          const line = new THREE.Line(geo, lineMat)
          scene.add(line)
        })
      })
    }

    // Animation Loop
    let reqId
    let clock = 0
    const animate = () => {
      reqId = requestAnimationFrame(animate)
      clock += 0.02 * activationSpeed

      // Slow rotating 3D orbit
      scene.rotation.y = Math.sin(clock * 0.3) * 0.25

      // Pulse neuron glow
      allNeurons.forEach((n, idx) => {
        const scale = 1 + Math.sin(clock * 3 + idx) * 0.15
        n.scale.set(scale, scale, scale)
      })

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
  }, [activationSpeed])

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="rounded-3xl border border-purple-500/30 bg-gradient-to-br from-atlas-surface via-atlas-elev to-atlas-surface p-6 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-purple-400">
            <Brain size={18} className="text-purple-400" />
            <span>3D WebGL Neural Matrix Visualization</span>
          </div>
          <h3 className="mt-1 text-xl font-bold text-atlas-text">3D Neural Network Volume & Activation Flow</h3>
          <p className="text-xs text-atlas-muted mt-0.5 max-w-2xl">
            Interactive 3D representation of dense multi-layer perceptron tensor operations, forward propagation wave pulses, and interconnected synaptic weight spaces.
          </p>
        </div>

        {/* Status */}
        <div className="flex items-center gap-3 bg-atlas-bg0/80 p-3 rounded-2xl border border-atlas-muted/20">
          <div className="text-center px-2 font-mono">
            <span className="text-[10px] text-atlas-muted uppercase block">Active Synapses</span>
            <span className="text-lg font-bold text-purple-300">45 Connections</span>
          </div>
          <div className="h-7 w-px bg-atlas-muted/20" />
          <div className="text-center px-2 font-mono">
            <span className="text-[10px] text-atlas-muted uppercase block">Forward Flow</span>
            <span className="text-xs font-bold text-emerald-400">60 FPS WebGL</span>
          </div>
        </div>
      </div>

      {/* Control Strip */}
      <div className="rounded-2xl border border-atlas-muted/20 bg-atlas-surface/80 p-4 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className={cn(
              'flex items-center gap-1.5 rounded-lg px-3.5 py-1.5 text-xs font-semibold transition border shadow',
              isPlaying
                ? 'bg-purple-500 text-white border-purple-400'
                : 'bg-atlas-elev text-atlas-muted'
            )}
          >
            {isPlaying ? <Pause size={13} /> : <Play size={13} />}
            {isPlaying ? 'Pause Waves' : 'Resume Flow'}
          </button>

          <div className="flex items-center gap-2 text-xs font-mono text-atlas-muted">
            <span>Propagation Speed:</span>
            <input
              type="range"
              min={0.5}
              max={2.5}
              step={0.5}
              value={activationSpeed}
              onChange={e => setActivationSpeed(Number(e.target.value))}
              className="w-24 accent-purple-400 cursor-pointer"
            />
            <span className="text-purple-300 font-bold">{activationSpeed}x</span>
          </div>
        </div>

        <div className="text-xs font-mono text-atlas-muted">
          Input (3) ➔ Hidden 1 (5) ➔ Hidden 2 (5) ➔ Output (2)
        </div>
      </div>

      {/* 3D WebGL Canvas Viewport */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        <div className="lg:col-span-8 space-y-4">
          <div className="rounded-3xl border border-atlas-muted/25 bg-[#080a0f] p-4 relative overflow-hidden shadow-2xl">
            <div className="flex items-center justify-between pb-2 px-2 border-b border-atlas-muted/15">
              <span className="text-xs font-mono text-purple-400 font-bold flex items-center gap-1.5">
                <Sparkles size={13} />
                3D Synaptic Mesh (Three.js WebGL)
              </span>
              <span className="text-[10px] font-mono text-atlas-muted">Drag to orbit scene</span>
            </div>

            <div ref={mountRef} className="w-full h-[400px] rounded-2xl overflow-hidden cursor-grab" />
          </div>
        </div>

        {/* Right 4 cols: Deep Learning Mechanics */}
        <div className="lg:col-span-4 space-y-4">
          <div className="rounded-3xl border border-atlas-muted/25 bg-atlas-surface/90 p-5 space-y-4 font-mono text-xs">
            <h4 className="text-sm font-bold text-atlas-text font-sans">Deep Learning Dimensions</h4>

            <div className="space-y-2">
              <div className="p-2.5 rounded-xl bg-atlas-elev border border-cyan-500/30">
                <span className="font-bold text-cyan-300 block">Input Layer Tensor</span>
                <span className="text-[10px] text-atlas-muted">x = [x₁, x₂, x₃] ∈ ℝ³</span>
              </div>

              <div className="p-2.5 rounded-xl bg-atlas-elev border border-purple-500/30">
                <span className="font-bold text-purple-300 block">Weight Matrix W₁</span>
                <span className="text-[10px] text-atlas-muted">W₁ ∈ ℝ⁵ˣ³, Bias b₁ ∈ ℝ⁵</span>
              </div>

              <div className="p-2.5 rounded-xl bg-atlas-elev border border-emerald-500/30">
                <span className="font-bold text-emerald-300 block">Output Classification</span>
                <span className="text-[10px] text-atlas-muted">Softmax(z) ➔ Binary logits [p₀, p₁]</span>
              </div>
            </div>

            <div className="rounded-xl bg-atlas-bg0/60 p-3 text-[11px] text-atlas-muted space-y-1 border border-atlas-muted/10 font-sans">
              <span className="font-semibold text-atlas-text block">Tensor Computation:</span>
              <p className="leading-relaxed">
                In modern deep learning frameworks (PyTorch, TensorFlow), this 3D neural forward pass is executed as a series of highly parallelized GPU matrix GEMM (General Matrix Multiply) operations.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
