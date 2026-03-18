export const motionTokens = {
  microSpring: { type: 'spring', stiffness: 420, damping: 32, mass: 0.5 },
  sceneSpring: { type: 'spring', stiffness: 210, damping: 28, mass: 0.8 },
  scrubFollow: { type: 'tween', duration: 0.18, ease: [0.22, 1, 0.36, 1] },
  dockSlide: { type: 'spring', stiffness: 260, damping: 26, mass: 0.72 },
}

export const prefersReducedMotion = () =>
  typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
