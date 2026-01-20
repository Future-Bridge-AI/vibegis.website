import { GeneratorProvider, useGenerator } from './GeneratorContext'
import AnalyzeStep from './steps/AnalyzeStep'
import SpecifyStep from './steps/SpecifyStep'
import ArchitectStep from './steps/ArchitectStep'
import GenerateStep from './steps/GenerateStep'

/**
 * Main BMAD Widget Generator Orchestrator
 * Manages the 4-step workflow: Analyze → Specify → Architect → Generate
 */
function GeneratorContent() {
  const { state, updateData, nextStep, previousStep } = useGenerator()

  const stepComponents = {
    analyze: AnalyzeStep,
    specify: SpecifyStep,
    architect: ArchitectStep,
    generate: GenerateStep,
  }

  const CurrentStep = stepComponents[state.currentStep]

  return (
    <div className="min-h-screen bg-geodark">
      {/* Header */}
      <div className="border-b border-cyan-500/20 bg-geodark-secondary/50 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-black mb-1">Widget Generator</h1>
              <p className="text-sm text-gray-400 font-mono">BMAD Methodology</p>
            </div>
            <div className="flex items-center gap-2">
              {(['analyze', 'specify', 'architect', 'generate'] as const).map((step, index) => (
                <div key={step} className="flex items-center">
                  <div
                    className={`w-10 h-10 rounded-lg flex items-center justify-center font-mono text-sm font-bold transition-all ${
                      state.currentStep === step
                        ? 'bg-gradient-to-br from-cyan-500 to-purple-600 text-white'
                        : state.currentStep && ['analyze', 'specify', 'architect', 'generate'].indexOf(state.currentStep) > index
                        ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30'
                        : 'bg-gray-800 text-gray-500 border border-gray-700'
                    }`}
                  >
                    {String(index + 1).padStart(2, '0')}
                  </div>
                  {index < 3 && (
                    <div
                      className={`w-8 h-0.5 ${
                        state.currentStep && ['analyze', 'specify', 'architect', 'generate'].indexOf(state.currentStep) > index
                          ? 'bg-cyan-500/50'
                          : 'bg-gray-800'
                      }`}
                    />
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Step Content */}
      <div className="max-w-5xl mx-auto px-6 py-12">
        <CurrentStep
          onNext={nextStep}
          onBack={previousStep}
          data={state.data}
          updateData={updateData}
        />
      </div>
    </div>
  )
}

export default function Generator() {
  return (
    <GeneratorProvider>
      <GeneratorContent />
    </GeneratorProvider>
  )
}
