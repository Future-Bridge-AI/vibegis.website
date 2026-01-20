import { createContext, useContext, useState, useCallback, ReactNode } from 'react'
import type { GeneratorData, BMADStep, GeneratorState } from './types'

interface GeneratorContextValue {
  state: GeneratorState
  updateData: (updates: Partial<GeneratorData>) => void
  setStep: (step: BMADStep) => void
  nextStep: () => void
  previousStep: () => void
  reset: () => void
}

const GeneratorContext = createContext<GeneratorContextValue | undefined>(undefined)

const STEPS: BMADStep[] = ['analyze', 'specify', 'architect', 'generate']

interface GeneratorProviderProps {
  children: ReactNode
}

export function GeneratorProvider({ children }: GeneratorProviderProps) {
  const [state, setState] = useState<GeneratorState>({
    currentStep: 'analyze',
    data: {},
    isLoading: false,
    error: null,
  })

  const updateData = useCallback((updates: Partial<GeneratorData>) => {
    setState((prev) => ({
      ...prev,
      data: {
        ...prev.data,
        ...updates,
        updatedAt: new Date().toISOString(),
      },
    }))
  }, [])

  const setStep = useCallback((step: BMADStep) => {
    setState((prev) => ({
      ...prev,
      currentStep: step,
    }))
  }, [])

  const nextStep = useCallback(() => {
    setState((prev) => {
      const currentIndex = STEPS.indexOf(prev.currentStep)
      if (currentIndex < STEPS.length - 1) {
        return {
          ...prev,
          currentStep: STEPS[currentIndex + 1],
        }
      }
      return prev
    })
  }, [])

  const previousStep = useCallback(() => {
    setState((prev) => {
      const currentIndex = STEPS.indexOf(prev.currentStep)
      if (currentIndex > 0) {
        return {
          ...prev,
          currentStep: STEPS[currentIndex - 1],
        }
      }
      return prev
    })
  }, [])

  const reset = useCallback(() => {
    setState({
      currentStep: 'analyze',
      data: {},
      isLoading: false,
      error: null,
    })
  }, [])

  const value: GeneratorContextValue = {
    state,
    updateData,
    setStep,
    nextStep,
    previousStep,
    reset,
  }

  return (
    <GeneratorContext.Provider value={value}>
      {children}
    </GeneratorContext.Provider>
  )
}

export function useGenerator() {
  const context = useContext(GeneratorContext)
  if (context === undefined) {
    throw new Error('useGenerator must be used within a GeneratorProvider')
  }
  return context
}
