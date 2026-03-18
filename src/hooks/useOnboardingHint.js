import { useState } from 'react'

const STORAGE_KEY = 'codeinsight-onboarded'

export const useOnboardingHint = () => {
  const [showHint, setShowHint] = useState(() => !localStorage.getItem(STORAGE_KEY))

  const dismissHint = () => {
    localStorage.setItem(STORAGE_KEY, '1')
    setShowHint(false)
  }

  return { showHint, dismissHint }
}

