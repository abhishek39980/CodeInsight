import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, X, Terminal, PlayCircle, Cpu, Layers } from 'lucide-react';
import { useOnboardingHint } from '../hooks/useOnboardingHint';

const TOUR_STEPS = [
  {
    target: 'editor',
    title: 'The Code Editor',
    text: 'Write your code here. Supported languages execute entirely in-browser with real-time feedback.',
    position: { top: '35%', left: '20%', x: '-50%', y: '-50%' },
    icon: Terminal
  },
  {
    target: 'controls',
    title: 'Execution Controls',
    text: 'Run your code, step through line-by-line, and control playback speed.',
    position: { top: '15%', left: '50%', x: '-50%', y: '-50%' },
    icon: PlayCircle
  },
  {
    target: 'memory',
    title: 'Memory & Call Stack',
    text: 'Watch variables mutate, pointers shift, and frames push/pop as you step through the execution.',
    position: { top: '35%', left: '80%', x: '-50%', y: '-50%' },
    icon: Cpu
  },
  {
    target: 'timeline',
    title: 'Timeline & Recursion',
    text: 'Scrub through time, visually inspect recursive calls, and debug complex data flows instantly.',
    position: { top: '75%', left: '50%', x: '-50%', y: '-50%' },
    icon: Layers
  }
];

export default function OnboardingFlow() {
  const { showHint, dismissHint } = useOnboardingHint();
  const [step, setStep] = useState(0);

  if (!showHint) return null;

  const currentStep = TOUR_STEPS[step];
  const Icon = currentStep?.icon;

  const handleNext = () => {
    if (step < TOUR_STEPS.length - 1) {
      setStep(step + 1);
    } else {
      dismissHint();
    }
  };

  const currentProgress = ((step + 1) / TOUR_STEPS.length) * 100;

  return (
    <div className="pointer-events-none fixed inset-0 z-50">
      <AnimatePresence mode="wait">
        <motion.div
          key={step}
          initial={{ opacity: 0, scale: 0.9, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: -10 }}
          transition={{ type: "spring", stiffness: 300, damping: 25 }}
          style={currentStep.position}
          className="pointer-events-auto absolute w-80 rounded-2xl border border-white/10 bg-[#0a0d13]/95 p-5 shadow-[0_20px_80px_rgba(0,0,0,0.8)] backdrop-blur-xl"
        >
          {/* Progress Bar */}
          <div className="absolute top-0 left-0 h-1 w-full overflow-hidden rounded-t-2xl bg-white/5">
            <motion.div
              className="h-full bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.8)]"
              initial={{ width: `${(step / TOUR_STEPS.length) * 100}%` }}
              animate={{ width: `${currentProgress}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>

          <button
            onClick={dismissHint}
            className="absolute right-3 top-3 rounded-full p-1 text-zinc-500 transition hover:bg-white/10 hover:text-white"
          >
            <X className="h-4 w-4" />
          </button>

          <div className="mb-3 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-500/20 text-blue-400">
              {Icon && <Icon className="h-5 w-5" />}
            </div>
            <h3 className="text-lg font-semibold text-zinc-100">{currentStep.title}</h3>
          </div>
          
          <p className="mb-6 text-sm leading-relaxed text-zinc-400">
            {currentStep.text}
          </p>

          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-zinc-500">
              Step {step + 1} of {TOUR_STEPS.length}
            </span>
            <button
              onClick={handleNext}
              className="flex items-center gap-1 rounded-full bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-500 active:scale-95 shadow-[0_0_15px_rgba(37,99,235,0.4)]"
            >
              {step === TOUR_STEPS.length - 1 ? 'Finish' : 'Next'}
              {step < TOUR_STEPS.length - 1 && <ChevronRight className="h-4 w-4" />}
            </button>
          </div>
        </motion.div>
      </AnimatePresence>
      
      {/* Background Dim (Optional) - Only slightly dim to keep UI visible */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="absolute inset-0 z-[-1] bg-black/20 backdrop-blur-[1px]" 
      />
    </div>
  );
}
