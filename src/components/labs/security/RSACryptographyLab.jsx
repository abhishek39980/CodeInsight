import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  ShieldCheck,
  Key,
  Lock,
  Unlock,
  Eye,
  RotateCcw,
  Sparkles,
  Info,
  CheckCircle2,
  ArrowRight,
  ShieldAlert
} from 'lucide-react'
import { cn } from '../../../utils/cn'

// Modular Exponentiation (base^exp % mod)
function modPow(base, exp, mod) {
  let res = 1n
  let b = BigInt(base) % BigInt(mod)
  let e = BigInt(exp)
  let m = BigInt(mod)

  while (e > 0n) {
    if (e % 2n === 1n) res = (res * b) % m
    e = e / 2n
    b = (b * b) % m
  }
  return Number(res)
}

// Modular Inverse
function modInverse(e, phi) {
  let [m0, x0, x1] = [phi, 0, 1]
  if (phi === 1) return 0
  let a = e, b = phi
  while (a > 1) {
    let q = Math.floor(a / b)
    let t = b
    b = a % b
    a = t
    t = x0
    x0 = x1 - q * x0
    x1 = t
  }
  if (x1 < 0) x1 += m0
  return x1
}

export default function RSACryptographyLab() {
  const [p, setP] = useState(61)
  const [q, setQ] = useState(53)
  const [eVal, setEVal] = useState(17)
  const [inputText, setInputText] = useState('CODE')

  // Compute RSA parameters
  const { N, phi, dVal, isValidKey } = useMemo(() => {
    const modulus = p * q
    const totient = (p - 1) * (q - 1)
    let d = 0
    let valid = false

    try {
      d = modInverse(eVal, totient)
      valid = d > 0 && d !== eVal
    } catch {
      valid = false
    }

    return {
      N: modulus,
      phi: totient,
      dVal: d,
      isValidKey: valid
    }
  }, [p, q, eVal])

  // Encrypt and Decrypt
  const { encryptedBlocks, decryptedText } = useMemo(() => {
    if (!isValidKey || !inputText) return { encryptedBlocks: [], decryptedText: '' }

    const encrypted = []
    const chars = inputText.toUpperCase().slice(0, 8).split('')

    for (const char of chars) {
      const code = char.charCodeAt(0)
      const cipher = modPow(code, eVal, N)
      encrypted.push({ char, code, cipher })
    }

    const decrypted = encrypted
      .map(item => {
        const plainCode = modPow(item.cipher, dVal, N)
        return String.fromCharCode(plainCode)
      })
      .join('')

    return { encryptedBlocks: encrypted, decryptedText: decrypted }
  }, [inputText, isValidKey, eVal, dVal, N])

  return (
    <div className="space-y-6">
      {/* Overview Banner */}
      <div className="rounded-3xl border border-rose-500/30 bg-gradient-to-br from-atlas-surface via-atlas-elev to-atlas-surface p-6 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-rose-400">
            <ShieldCheck size={18} className="text-rose-400" />
            <span>Asymmetric Cryptography & Number Theory Simulation</span>
          </div>
          <h3 className="mt-1 text-xl font-bold text-atlas-text">Public-Key RSA Cryptography Lab</h3>
          <p className="text-xs text-atlas-muted mt-0.5 max-w-2xl">
            Simulates the mathematics of RSA public-key encryption: prime generation (p, q → N, φ), public key encryption (C = M^e mod N), and private key decryption (M = C^d mod N).
          </p>
        </div>

        {/* Keys Summary */}
        <div className="flex items-center gap-3 bg-atlas-bg0/80 p-3 rounded-2xl border border-atlas-muted/20">
          <div className="text-center px-2 font-mono">
            <span className="text-[10px] text-atlas-muted uppercase block">Public Key (e, N)</span>
            <span className="text-xs font-bold text-cyan-300">({eVal}, {N})</span>
          </div>
          <div className="h-7 w-px bg-atlas-muted/20" />
          <div className="text-center px-2 font-mono">
            <span className="text-[10px] text-atlas-muted uppercase block">Private Key (d, N)</span>
            <span className="text-xs font-bold text-rose-400">({dVal}, {N})</span>
          </div>
        </div>
      </div>

      {/* Control Strip */}
      <div className="rounded-2xl border border-atlas-muted/20 bg-atlas-surface/80 p-4 space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-4 flex-wrap">
            <div className="flex items-center gap-2">
              <span className="text-xs text-atlas-muted font-mono">Message:</span>
              <input
                type="text"
                maxLength={6}
                value={inputText}
                onChange={e => setInputText(e.target.value.toUpperCase())}
                className="h-8 w-28 rounded-lg bg-atlas-bg0 border border-atlas-muted/30 px-2.5 text-xs text-atlas-text font-mono focus:outline-none focus:border-rose-400"
              />
            </div>

            <div className="flex items-center gap-2 text-xs font-mono">
              <span className="text-atlas-muted">Primes (p, q):</span>
              <select
                value={`${p},${q}`}
                onChange={e => {
                  const [newP, newQ] = e.target.value.split(',').map(Number)
                  setP(newP)
                  setQ(newQ)
                }}
                className="h-8 rounded-lg bg-atlas-bg0 border border-atlas-muted/30 px-2 text-xs text-atlas-text font-mono focus:outline-none"
              >
                <option value="61,53">p=61, q=53 (N=3233)</option>
                <option value="47,59">p=47, q=59 (N=2773)</option>
                <option value="43,67">p=43, q=67 (N=2881)</option>
              </select>
            </div>
          </div>

          <button
            onClick={() => { setP(61); setQ(53); setEVal(17); setInputText('CODE') }}
            className="flex items-center gap-1 rounded-lg bg-atlas-elev hover:bg-atlas-bg0 border border-atlas-muted/20 px-3 py-1.5 text-xs font-medium text-atlas-muted hover:text-atlas-text transition"
          >
            <RotateCcw size={13} /> Reset RSA Params
          </button>
        </div>
      </div>

      {/* Cryptographic Transmission Pipeline */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left 8 Cols: Alice -> Wire -> Bob */}
        <div className="lg:col-span-8 space-y-4">
          <div className="rounded-2xl border border-atlas-muted/25 bg-atlas-surface/90 p-6 space-y-6">
            <h4 className="text-sm font-bold text-atlas-text">End-to-End Cryptographic Wire</h4>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
              {/* Alice (Sender) */}
              <div className="rounded-2xl border border-cyan-500/30 bg-cyan-500/10 p-4 space-y-2 text-center">
                <div className="flex items-center justify-center gap-1.5 text-xs font-bold text-cyan-300 font-mono">
                  <Lock size={14} /> Alice (Sender)
                </div>
                <div className="text-[11px] text-atlas-muted font-mono">Plaintext Input</div>
                <div className="text-xl font-bold font-mono text-atlas-text bg-atlas-bg0/80 p-2 rounded-xl border border-atlas-muted/20">
                  "{inputText}"
                </div>
                <div className="text-[10px] text-atlas-muted font-mono pt-1">
                  Encrypts with Bob's Public Key (e={eVal}, N={N})
                </div>
              </div>

              {/* Insecure Wire & Eavesdropper */}
              <div className="rounded-2xl border border-rose-500/30 bg-rose-500/10 p-4 space-y-2 text-center">
                <div className="flex items-center justify-center gap-1.5 text-xs font-bold text-rose-400 font-mono">
                  <Eye size={14} /> Insecure Wire (Eve)
                </div>
                <div className="text-[11px] text-atlas-muted font-mono">Ciphertext Stream</div>
                <div className="text-xs font-bold font-mono text-rose-300 bg-atlas-bg0/80 p-2 rounded-xl border border-atlas-muted/20 break-all">
                  [{encryptedBlocks.map(b => b.cipher).join(', ')}]
                </div>
                <div className="text-[10px] text-rose-300/70 font-mono pt-1">
                  Incomputable without Private Key 'd'
                </div>
              </div>

              {/* Bob (Receiver) */}
              <div className="rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-4 space-y-2 text-center">
                <div className="flex items-center justify-center gap-1.5 text-xs font-bold text-emerald-300 font-mono">
                  <Unlock size={14} /> Bob (Receiver)
                </div>
                <div className="text-[11px] text-atlas-muted font-mono">Decrypted Plaintext</div>
                <div className="text-xl font-bold font-mono text-emerald-300 bg-atlas-bg0/80 p-2 rounded-xl border border-atlas-muted/20">
                  "{decryptedText}"
                </div>
                <div className="text-[10px] text-atlas-muted font-mono pt-1">
                  Decrypted with Private Key (d={dVal}, N={N})
                </div>
              </div>
            </div>

            {/* Explainer Note */}
            <div className="rounded-xl bg-atlas-bg0/60 p-3 text-xs text-atlas-muted space-y-1 border border-atlas-muted/10">
              <div className="font-semibold text-atlas-text flex items-center gap-1.5">
                <Info size={13} className="text-rose-400" />
                <span>The Mathematical Trapdoor Function:</span>
              </div>
              <p className="text-[11px] leading-relaxed">
                RSA security relies on the <strong>prime factorization hardness problem</strong>. Multiplying two large primes N = p × q is instantaneous (O(1)), but computing p and q from N alone takes exponential time with classical computers.
              </p>
            </div>
          </div>
        </div>

        {/* Right 4 Cols: Mathematical Derivation Inspector */}
        <div className="lg:col-span-4 space-y-4">
          <div className="rounded-2xl border border-atlas-muted/25 bg-atlas-surface/90 p-5 space-y-4 font-mono text-xs">
            <h4 className="text-sm font-bold text-atlas-text font-sans">Number Theory Inspector</h4>

            <div className="rounded-xl bg-atlas-elev/70 p-3 border border-atlas-muted/15 space-y-1">
              <span className="text-[10px] text-atlas-muted uppercase block">Modulus Calculation</span>
              <span className="text-atlas-text">N = p × q = {p} × {q} = <strong className="text-cyan-300">{N}</strong></span>
            </div>

            <div className="rounded-xl bg-atlas-elev/70 p-3 border border-atlas-muted/15 space-y-1">
              <span className="text-[10px] text-atlas-muted uppercase block">Euler's Totient ϕ(N)</span>
              <span className="text-atlas-text">ϕ(N) = (p-1)(q-1) = {p-1} × {q-1} = <strong className="text-amber-300">{phi}</strong></span>
            </div>

            <div className="rounded-xl bg-atlas-elev/70 p-3 border border-atlas-muted/15 space-y-1">
              <span className="text-[10px] text-atlas-muted uppercase block">Private Exponent (d)</span>
              <span className="text-atlas-text">e × d ≡ 1 (mod ϕ(N)) ➔ <strong className="text-rose-400">d = {dVal}</strong></span>
            </div>

            <div className="rounded-xl bg-rose-500/10 p-3 border border-rose-500/30 space-y-1 text-rose-200 text-[11px]">
              <span className="font-bold block">Formulae:</span>
              <span>Encryption: C = M^{eVal} mod {N}</span><br />
              <span>Decryption: M = C^{dVal} mod {N}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
