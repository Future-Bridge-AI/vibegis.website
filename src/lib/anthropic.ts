import Anthropic from '@anthropic-ai/sdk'

/**
 * Anthropic Claude API Client
 * Handles all AI agent interactions for BMAD workflow
 */

const anthropic = new Anthropic({
  apiKey: import.meta.env.VITE_ANTHROPIC_API_KEY || '',
})

if (!import.meta.env.VITE_ANTHROPIC_API_KEY) {
  console.warn(
    '⚠️ Anthropic API key not set. ' +
    'Please set VITE_ANTHROPIC_API_KEY in your .env file'
  )
}

export interface AgentMessage {
  role: 'user' | 'assistant'
  content: string
}

export interface AgentResponse {
  content: string
  usage?: {
    input_tokens: number
    output_tokens: number
  }
}

/**
 * Analyst Agent - Analyzes widget idea and asks GIS-specific questions
 */
export async function analyzeWidgetIdea(
  widgetIdea: string,
  context?: string
): Promise<AgentResponse> {
  const systemPrompt = `You are an Analyst Agent specialized in ArcGIS Experience Builder widgets.
Your role is to analyze widget ideas and ask clarifying GIS-specific questions.
Focus on:
- Map interactions and user workflows
- Data sources and feature layers
- ArcGIS API requirements
- Jimu framework considerations
- User experience patterns

Be concise and technical. Ask 3-5 targeted questions.`

  const response = await anthropic.messages.create({
    model: 'claude-3-5-sonnet-20241022',
    max_tokens: 1024,
    system: systemPrompt,
    messages: [
      {
        role: 'user',
        content: `Analyze this widget idea and ask clarifying questions:\n\n${widgetIdea}${context ? `\n\nContext: ${context}` : ''}`,
      },
    ],
  })

  const content = response.content[0]
  if (!content || content.type !== 'text') {
    throw new Error('Unexpected response type from Anthropic API')
  }

  return {
    content: content.text,
    usage: response.usage,
  }
}

/**
 * PM Agent - Generates Product Requirements Document
 */
export async function generatePRD(
  widgetIdea: string,
  analysis: string
): Promise<AgentResponse> {
  const systemPrompt = `You are a PM Agent specialized in ArcGIS Experience Builder widgets.
Generate a comprehensive Product Requirements Document (PRD) in Markdown format.
Include:
- Functional requirements
- UI/UX specifications
- Technical constraints
- ArcGIS integration points
- Jimu framework structure
- User stories

Be detailed and actionable.`

  const response = await anthropic.messages.create({
    model: 'claude-3-5-sonnet-20241022',
    max_tokens: 2048,
    system: systemPrompt,
    messages: [
      {
        role: 'user',
        content: `Generate a PRD for this widget:\n\nIdea: ${widgetIdea}\n\nAnalysis: ${analysis}`,
      },
    ],
  })

  const content = response.content[0]
  if (!content || content.type !== 'text') {
    throw new Error('Unexpected response type from Anthropic API')
  }

  return {
    content: content.text,
    usage: response.usage,
  }
}

/**
 * Architect Agent - Defines technical architecture
 */
export async function generateArchitecture(
  prd: string
): Promise<AgentResponse> {
  const systemPrompt = `You are an Architect Agent specialized in ArcGIS Experience Builder widgets.
Define the technical architecture in Markdown format.
Include:
- Jimu framework structure (file organization)
- Component architecture
- State management approach
- ArcGIS API integration points
- TypeScript types
- Build configuration

Be specific about Jimu patterns and ExB 1.19 compatibility.`

  const response = await anthropic.messages.create({
    model: 'claude-3-5-sonnet-20241022',
    max_tokens: 2048,
    system: systemPrompt,
    messages: [
      {
        role: 'user',
        content: `Define architecture based on this PRD:\n\n${prd}`,
      },
    ],
  })

  const content = response.content[0]
  if (!content || content.type !== 'text') {
    throw new Error('Unexpected response type from Anthropic API')
  }

  return {
    content: content.text,
    usage: response.usage,
  }
}

/**
 * Developer Agent - Generates production-ready widget code
 */
export async function generateWidgetCode(
  architecture: string,
  prd: string
): Promise<AgentResponse> {
  const systemPrompt = `You are a Developer Agent specialized in ArcGIS Experience Builder widgets.
Generate production-ready React 19 + TypeScript code for ExB 1.19.
Requirements:
- Use Jimu framework patterns
- TypeScript strict mode
- React 19 hooks and patterns
- ArcGIS API v4.x integration
- Clean, maintainable code
- Proper error handling
- Type safety

Output only the widget.tsx code, no explanations.`

  const response = await anthropic.messages.create({
    model: 'claude-3-5-sonnet-20241022',
    max_tokens: 4096,
    system: systemPrompt,
    messages: [
      {
        role: 'user',
        content: `Generate widget code based on:\n\nArchitecture:\n${architecture}\n\nPRD:\n${prd}`,
      },
    ],
  })

  const content = response.content[0]
  if (!content || content.type !== 'text') {
    throw new Error('Unexpected response type from Anthropic API')
  }

  return {
    content: content.text,
    usage: response.usage,
  }
}

export default anthropic
