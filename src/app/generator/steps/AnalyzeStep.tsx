import { useState } from 'react'
import { Zap } from 'lucide-react'
import type { GeneratorStepProps } from '../types'

/**
 * Step 01: ANALYZE
 * Analyst Agent UI - Collects widget idea and asks GIS-specific questions
 */
export default function AnalyzeStep({ onNext, onBack, data, updateData }: GeneratorStepProps) {
  const [widgetIdea, setWidgetIdea] = useState(data?.widgetIdea || '')
  const [isAnalyzing, setIsAnalyzing] = useState(false)

  const handleSubmit = async () => {
    if (!widgetIdea.trim()) return

    setIsAnalyzing(true)
    // TODO: Call Analyst Agent API
    // const analysis = await analyzeWidgetIdea(widgetIdea)
    
    updateData({
      widgetIdea,
      // analysis,
    })

    // Simulate analysis delay
    setTimeout(() => {
      setIsAnalyzing(false)
      onNext?.()
    }, 1500)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 bg-gradient-to-br from-cyan-500/20 to-purple-600/20 rounded-lg flex items-center justify-center text-cyan-400">
          <Zap className="w-6 h-6" />
        </div>
        <div>
          <div className="text-sm font-mono text-cyan-400 mb-1">STEP 01</div>
          <h2 className="text-2xl font-black">ANALYZE</h2>
          <p className="text-gray-400 text-sm">Describe your widget idea. Our Analyst Agent asks GIS-specific questions.</p>
        </div>
      </div>

      <div className="bg-geodark-secondary border border-cyan-500/20 rounded-lg p-6">
        <label className="block text-sm font-bold mb-3 text-gray-300">
          What widget do you want to build?
        </label>
        <textarea
          value={widgetIdea}
          onChange={(e) => setWidgetIdea(e.target.value)}
          placeholder="e.g., A widget that shows real-time weather data on a map with clickable markers that display detailed forecasts..."
          className="w-full h-32 bg-geodark-tertiary border border-gray-800 rounded-lg p-4 text-gray-100 font-mono text-sm focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/20 resize-none"
        />
        <p className="text-xs text-gray-500 mt-2 font-mono">
          Be specific about map interactions, data sources, and user workflows.
        </p>
      </div>

      <div className="flex items-center justify-between pt-4 border-t border-gray-800">
        <button
          onClick={onBack}
          className="px-6 py-3 border border-gray-800 text-gray-400 rounded-lg hover:border-gray-700 hover:text-gray-300 transition-colors font-bold"
        >
          Back
        </button>
        <button
          onClick={handleSubmit}
          disabled={!widgetIdea.trim() || isAnalyzing}
          className="px-8 py-3 bg-gradient-to-r from-cyan-500 to-purple-600 text-white rounded-lg hover:shadow-neon-cyan-lg transition-all font-bold disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
        >
          {isAnalyzing ? (
            <>
              <span className="animate-spin">⟳</span>
              Analyzing...
            </>
          ) : (
            <>
              Analyze Widget Idea
              <span className="text-xs">→</span>
            </>
          )}
        </button>
      </div>
    </div>
  )
}
