import { useParams, useNavigate, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowLeft } from 'lucide-react'
import WebsiteJourney from '../components/journeys/WebsiteJourney'
import AIInferenceJourney from '../components/journeys/AIInferenceJourney'
import PhotoUploadJourney from '../components/journeys/PhotoUploadJourney'
import DatabaseQueryJourney from '../components/journeys/DatabaseQueryJourney'
import { getJourneyById } from '../data/journeysRegistry'

const JOURNEY_COMPONENTS = {
  'open-website': WebsiteJourney,
  'ai-inference': AIInferenceJourney,
  'photo-upload': PhotoUploadJourney,
  'db-query': DatabaseQueryJourney
}

export default function JourneyDetailView() {
  const { journeyId } = useParams()
  const navigate = useNavigate()
  const journey = getJourneyById(journeyId)

  const ComponentToRender = JOURNEY_COMPONENTS[journeyId] || WebsiteJourney

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      className="mx-auto max-w-[1580px] px-4 py-6 sm:px-6 lg:px-8 space-y-6"
    >
      {/* Top Bar */}
      <div className="flex items-center justify-between border-b border-atlas-muted/15 pb-4">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/journeys')}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-atlas-muted hover:text-atlas-text hover:bg-atlas-elev transition border border-atlas-muted/15"
            title="Back to Journeys"
          >
            <ArrowLeft size={15} />
          </button>
          <div>
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-atlas-brand">
              Technology Journey Walkthrough
            </span>
            <h1 className="text-base font-bold text-atlas-text">
              {journey ? journey.title : 'Journey Walkthrough'}
            </h1>
          </div>
        </div>

        <Link
          to="/journeys"
          className="text-xs font-mono text-atlas-muted hover:text-atlas-text transition"
        >
          ← All Journeys
        </Link>
      </div>

      {/* Render matching journey component */}
      <div>
        <ComponentToRender />
      </div>
    </motion.div>
  )
}
