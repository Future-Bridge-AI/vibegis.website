/**
 * Types for the BMAD widget generator workflow
 */

export interface GeneratorStepProps {
  onNext?: () => void
  onBack?: () => void
  data?: GeneratorData
  updateData: (updates: Partial<GeneratorData>) => void
}

export interface GeneratorData {
  // Step 01: Analyze
  widgetIdea?: string
  analysis?: string
  
  // Step 02: Specify
  prd?: string
  
  // Step 03: Architect
  architecture?: string
  
  // Step 04: Generate
  generatedCode?: string
  config?: WidgetConfig
  
  // Metadata
  widgetName?: string
  createdAt?: string
  updatedAt?: string
}

export interface WidgetConfig {
  name?: string
  description?: string
  version?: string
  [key: string]: unknown
}

export type BMADStep = 'analyze' | 'specify' | 'architect' | 'generate'

export interface GeneratorState {
  currentStep: BMADStep
  data: GeneratorData
  isLoading: boolean
  error: string | null
}
