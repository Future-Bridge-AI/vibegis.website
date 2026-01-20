/**
 * Application-wide constants
 */

export const APP_NAME = 'VibeGIS'
export const APP_TAGLINE = 'ARCGIS.AI'

// BMAD Methodology steps
export const BMAD_STEPS = [
  {
    step: '01',
    title: 'ANALYZE',
    description: 'Describe your widget idea. Our Analyst Agent asks GIS-specific questions.',
  },
  {
    step: '02',
    title: 'SPECIFY',
    description: 'PM Agent generates PRD with functional requirements and UI specs.',
  },
  {
    step: '03',
    title: 'ARCHITECT',
    description: 'Architect Agent defines Jimu structure and technical approach.',
  },
  {
    step: '04',
    title: 'GENERATE',
    description: 'Developer Agent creates production-ready widget code. Download & install.',
  },
] as const

// Brand colors (for reference, Tailwind handles most of this)
export const BRAND_COLORS = {
  dark: '#0a0e17',
  darkSecondary: '#1a1f2e',
  darkTertiary: '#0f1419',
  cyan: '#00ffff',
  purple: '#8b5cf6',
  pink: '#ec4899',
} as const
