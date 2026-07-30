import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Award, CheckCircle2, HelpCircle, Flame, RefreshCw, Zap } from 'lucide-react'
import { cn } from '../../utils/cn'

const challenges = [
  {
    id: 'ch-binary-search-mid',
    title: 'Binary Search: Calculate Mid Pointer',
    difficulty: 'Easy',
    category: 'searching',
    description: 'Fill in the blank to correctly compute the middle index between low and high pointers.',
    codeSnippet: `let low = 0;
let high = arr.length - 1;

while (low <= high) {
  let mid = ____________; // TODO: Fill in formula
  if (arr[mid] === target) return mid;
}`,
    correctAnswer: 'Math.floor((low + high) / 2)',
    options: [
      'Math.floor((low + high) / 2)',
      '(low + high) * 2',
      'low + high',
      'Math.floor(high / 2)',
    ],
    explanation: 'Mid index is calculated as the average of low and high, rounded down with Math.floor.',
  },
  {
    id: 'ch-stack-pop',
    title: 'Stack LIFO: Pop Top Element',
    difficulty: 'Easy',
    category: 'stacks-queues',
    description: 'Which built-in array method pops the last element added to a Stack in LIFO order?',
    codeSnippet: `let stack = [10, 20, 30];
let topValue = stack.________(); // TODO: Call method`,
    correctAnswer: 'pop',
    options: ['pop', 'shift', 'unshift', 'push'],
    explanation: 'pop() removes and returns the last element added to an array, mimicking LIFO Stack behavior.',
  },
  {
    id: 'ch-reverse-link',
    title: 'Linked List Reversal Pointer Update',
    difficulty: 'Medium',
    category: 'linked-lists',
    description: 'What is the correct assignment inside the loop to reverse a node pointer?',
    codeSnippet: `while (curr !== null) {
  let nextNode = curr.next;
  curr.next = ________; // TODO: Reverse pointer
  prev = curr;
  curr = nextNode;
}`,
    correctAnswer: 'prev',
    options: ['prev', 'curr', 'nextNode', 'head'],
    explanation: 'Setting curr.next = prev reverses the link direction to point to the previously visited node.',
  },
]

export default function AtlasChallengePanel({ currentStep, onSelectExample }) {
  const [selectedChallengeId, setSelectedChallengeId] = useState(challenges[0].id)
  const [selectedOption, setSelectedOption] = useState(null)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [streak, setStreak] = useState(0)

  const activeChallenge = useMemo(
    () => challenges.find((c) => c.id === selectedChallengeId) || challenges[0],
    [selectedChallengeId],
  )

  const isCorrect = selectedOption === activeChallenge.correctAnswer

  const handleSubmit = (option) => {
    setSelectedOption(option)
    setIsSubmitted(true)
    if (option === activeChallenge.correctAnswer) {
      setStreak((prev) => prev + 1)
    } else {
      setStreak(0)
    }
  }

  const handleNextChallenge = () => {
    const nextIdx = (challenges.findIndex((c) => c.id === selectedChallengeId) + 1) % challenges.length
    setSelectedChallengeId(challenges[nextIdx].id)
    setSelectedOption(null)
    setIsSubmitted(false)
  }

  return (
    <div className="atlas-surface flex min-h-[520px] flex-col p-4">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <div className="rounded-lg border border-atlas-ember/40 bg-atlas-ember/15 p-2 text-atlas-ember">
            <Zap size={18} />
          </div>
          <div>
            <p className="text-[11px] uppercase tracking-[0.16em] text-atlas-muted">Interactive Arena</p>
            <h2 className="text-lg font-semibold text-atlas-text">Visual LeetCode Challenge Arena</h2>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 rounded-full border border-atlas-ember/40 bg-atlas-ember/15 px-3 py-1 text-xs text-atlas-ember">
            <Flame size={14} className="fill-current" />
            <span className="font-semibold">Streak: {streak}</span>
          </div>
        </div>
      </div>

      <div className="grid flex-1 gap-4 lg:grid-cols-[1fr_320px]">
        {/* Main Challenge Box */}
        <div className="atlas-elevated flex flex-col justify-between p-5">
          <div>
            <div className="flex items-center justify-between">
              <span className="rounded-md border border-atlas-muted/30 bg-atlas-surface px-2.5 py-1 text-xs font-mono text-atlas-muted">
                {activeChallenge.difficulty} • {activeChallenge.category}
              </span>
              <span className="text-xs text-atlas-muted">Challenge 1 of {challenges.length}</span>
            </div>

            <h3 className="mt-3 text-base font-semibold text-atlas-text">{activeChallenge.title}</h3>
            <p className="mt-1 text-xs text-atlas-muted">{activeChallenge.description}</p>

            <div className="mt-4 rounded-xl border border-atlas-muted/25 bg-atlas-bg0/90 p-4 font-mono text-xs text-atlas-text leading-relaxed">
              <pre className="whitespace-pre-wrap">{activeChallenge.codeSnippet}</pre>
            </div>

            <div className="mt-5 space-y-2">
              <p className="text-xs font-medium text-atlas-muted">Select the correct code fill-in:</p>
              <div className="grid gap-2 sm:grid-cols-2">
                {activeChallenge.options.map((option) => {
                  const isThisSelected = selectedOption === option
                  const isThisCorrect = option === activeChallenge.correctAnswer

                  return (
                    <button
                      key={option}
                      type="button"
                      disabled={isSubmitted}
                      onClick={() => handleSubmit(option)}
                      className={cn(
                        'rounded-xl border px-3 py-2.5 text-left font-mono text-xs transition',
                        isSubmitted
                          ? isThisCorrect
                            ? 'border-atlas-loop/60 bg-atlas-loop/20 text-atlas-text'
                            : isThisSelected
                              ? 'border-atlas-error/60 bg-atlas-error/20 text-atlas-text'
                              : 'border-atlas-muted/20 bg-atlas-surface/50 text-atlas-muted'
                          : 'border-atlas-muted/30 bg-atlas-surface/80 text-atlas-text hover:border-atlas-brand/50 hover:bg-atlas-elev',
                      )}
                    >
                      {option}
                    </button>
                  )
                })}
              </div>
            </div>
          </div>

          <AnimatePresence mode="wait">
            {isSubmitted && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className={cn(
                  'mt-5 rounded-xl border p-4 text-xs',
                  isCorrect ? 'border-atlas-loop/40 bg-atlas-loop/15' : 'border-atlas-error/40 bg-atlas-error/15',
                )}
              >
                <div className="flex items-center gap-2 font-semibold text-atlas-text">
                  {isCorrect ? <CheckCircle2 size={16} className="text-atlas-loop" /> : <HelpCircle size={16} className="text-atlas-error" />}
                  <span>{isCorrect ? 'Correct! Excellent problem solving.' : 'Not quite right.'}</span>
                </div>
                <p className="mt-1 text-atlas-muted">{activeChallenge.explanation}</p>

                <div className="mt-3 flex justify-end">
                  <button
                    type="button"
                    onClick={handleNextChallenge}
                    className="inline-flex items-center gap-1.5 rounded-lg border border-atlas-brand/40 bg-atlas-brand/20 px-3 py-1.5 text-xs text-atlas-text transition hover:bg-atlas-brand/30"
                  >
                    Next Challenge <RefreshCw size={12} />
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Sidebar Challenge Selector */}
        <div className="atlas-elevated p-4">
          <h4 className="mb-3 text-xs font-semibold uppercase tracking-wider text-atlas-muted">Challenge Library</h4>
          <div className="space-y-2">
            {challenges.map((c) => {
              const active = c.id === selectedChallengeId
              return (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => {
                    setSelectedChallengeId(c.id)
                    setSelectedOption(null)
                    setIsSubmitted(false)
                  }}
                  className={cn(
                    'w-full rounded-xl border p-3 text-left transition',
                    active
                      ? 'border-atlas-ember/50 bg-atlas-ember/15 text-atlas-text'
                      : 'border-atlas-muted/20 bg-atlas-surface/60 text-atlas-muted hover:border-atlas-muted/40 hover:text-atlas-text',
                  )}
                >
                  <p className="text-xs font-semibold">{c.title}</p>
                  <span className="mt-1 inline-block text-[10px] text-atlas-muted">{c.category}</span>
                </button>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}
