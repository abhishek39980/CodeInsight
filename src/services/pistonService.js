/**
 * Piston API integration for multi-language code execution.
 * Uses the public Piston instance: https://emkc.org/api/v2/piston
 */

const PISTON_BASE = 'https://emkc.org/api/v2/piston'

/**
 * Execute code via Piston API.
 * @param {string} language  - Piston language id (e.g., 'python', 'java', 'c++')
 * @param {string} version   - Runtime version string (e.g., '3.10.0')
 * @param {string} code      - Source code to execute
 * @param {string} stdin     - Optional stdin input
 * @returns {Promise<{ stdout, stderr, exitCode, error }>}
 */
export async function pistonExecute(language, version, code, stdin = '') {
  try {
    const res = await fetch(`${PISTON_BASE}/execute`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        language,
        version,
        files: [{ name: 'main', content: code }],
        stdin,
        compile_timeout: 10000,
        run_timeout: 5000,
      }),
    })

    if (!res.ok) {
      const text = await res.text()
      return { stdout: '', stderr: `HTTP ${res.status}: ${text}`, exitCode: 1, error: null }
    }

    const data = await res.json()
    const run = data.run || {}
    return {
      stdout: run.stdout ?? '',
      stderr: run.stderr ?? '',
      exitCode: run.code ?? 0,
      error: null,
    }
  } catch (err) {
    return {
      stdout: '',
      stderr: '',
      exitCode: 1,
      error: err.message ?? 'Network error — Piston API unavailable',
    }
  }
}

/**
 * Fetch available runtimes from Piston.
 */
export async function pistonRuntimes() {
  try {
    const res = await fetch(`${PISTON_BASE}/runtimes`)
    if (!res.ok) return []
    return res.json()
  } catch {
    return []
  }
}
