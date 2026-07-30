import LZString from 'lz-string'

export const encodePermalink = (state) => {
  try {
    const payload = JSON.stringify({
      c: state.code || '',
      l: state.language || 'javascript',
      i: state.input || '',
      s: state.stepIndex || 0,
    })
    const compressed = LZString.compressToEncodedURIComponent(payload)
    return `${window.location.origin}${window.location.pathname}?state=${compressed}`
  } catch (err) {
    console.error('Permalink encode error:', err)
    return window.location.href
  }
}

export const decodePermalink = () => {
  try {
    if (typeof window === 'undefined') return null
    const params = new URLSearchParams(window.location.search)
    const compressed = params.get('state')
    if (!compressed) return null

    const decompressed = LZString.decompressFromEncodedURIComponent(compressed)
    if (!decompressed) return null

    const parsed = JSON.parse(decompressed)
    return {
      code: parsed.c || '',
      language: parsed.l || 'javascript',
      input: parsed.i || '',
      stepIndex: parsed.s || 0,
    }
  } catch (err) {
    console.error('Permalink decode error:', err)
    return null
  }
}
