# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

VibeGIS is a SaaS product that guides GIS developers through building custom ArcGIS Experience Builder widgets using BMAD methodology (Business → Manage → Architect → Develop). AI agents walk users from idea to production-ready, downloadable widget code.

## Commands

```bash
# Development
npm run dev          # Start dev server on port 3000

# Build
npm run build        # TypeScript check + Vite build

# Lint
npm run lint         # ESLint with zero warnings tolerance

# Preview production build
npm run preview
```

## Architecture

### Tech Stack
- React 19 + TypeScript (strict mode)
- Vite for build tooling
- Tailwind CSS with GeoPunk design system
- Supabase for backend (auth, database)
- Anthropic Claude API for AI agents
- Zustand for state management
- React Router for client-side routing
- Monaco Editor for code display
- JSZip for widget packaging

### Source Structure
```
src/
├── app/                         # Application routes
│   ├── generator/               # Widget generator route
│   │   └── index.tsx            # WorkflowWizard mount point
│   ├── dashboard/               # User dashboard (placeholder)
│   └── widgets/                 # Widget management (placeholder)
│
├── features/                    # Feature modules
│   └── workflow/                # BMAD workflow feature
│       ├── types.ts             # Workflow type definitions
│       ├── store.ts             # Zustand state management
│       ├── WorkflowWizard.tsx   # Main wizard container
│       └── phases/              # Workflow phase components
│           ├── AnalyzePhase.tsx
│           ├── SpecifyPhase.tsx
│           ├── ArchitectPhase.tsx
│           └── GeneratePhase.tsx
│
├── components/                  # Shared components
│   └── ui/
│       └── StepIndicator.tsx    # Workflow step indicator
│
├── lib/                         # Core utilities
│   ├── generator/               # Widget code generation
│   │   ├── index.ts             # Barrel export
│   │   ├── templates.ts         # Code templates
│   │   ├── generateWidget.ts    # Widget code generator
│   │   └── packageWidget.ts     # ZIP packaging
│   ├── anthropic.ts             # Claude API client
│   ├── supabase.ts              # Supabase client
│   ├── widget-builder.ts        # Enhanced widget builder
│   ├── constants.ts             # App constants
│   └── utils.ts                 # Utility functions
│
├── marketing/                   # Public marketing pages
│   └── landing/
│       └── LandingPage.tsx
│
├── hooks/                       # Custom React hooks
├── types/                       # TypeScript types
└── styles/
    └── globals.css              # Global styles + utilities
```

### Path Aliases (configured in tsconfig.json and vite.config.ts)
- `@/` → `src/`
- `@components/` → `src/components/`
- `@app/` → `src/app/`
- `@marketing/` → `src/marketing/`
- `@lib/` → `src/lib/`
- `@hooks/` → `src/hooks/`
- `@types/` → `src/types/`

### BMAD Workflow (`src/features/workflow/`)

The core feature is a 4-phase wizard:

1. **Analyze** (`AnalyzePhase.tsx`): Capture widget concept, audience, and data sources
2. **Specify** (`SpecifyPhase.tsx`): Define functional requirements and UI expectations
3. **Architect** (`ArchitectPhase.tsx`): Plan component structure and integrations
4. **Generate** (`GeneratePhase.tsx`): Produce downloadable widget code package

State is managed via Zustand (`store.ts`). Types defined in `types.ts`:
- `WorkflowPhase`: 'analyze' | 'specify' | 'architect' | 'generate'
- `WidgetBrief`: Widget concept from Analyze phase
- `WidgetPRD`: Product requirements from Specify phase
- `WidgetArchitecture`: Technical structure from Architect phase
- `WorkflowState`: Combined state across all phases

### Code Generation Pipeline (`src/lib/generator/`)

1. **Templates** (`templates.ts`) - Define file templates with token placeholders ({{WIDGET_NAME}}, {{WIDGET_LABEL}}, etc.)
2. **Generator** (`generateWidget.ts`) - Replaces tokens based on workflow state
3. **Packager** (`packageWidget.ts`) - Creates ZIP bundle with JSZip

Generated files:
- `manifest.json` - Widget metadata and dependencies
- `config.ts` - Configuration interface and defaults
- `runtime/widget.tsx` - Main widget component
- `setting/setting.tsx` - Settings panel (if configured)
- `translations/default.ts` - Localization strings

### AI Agents (`src/lib/anthropic.ts`)

Four specialized Claude agents using claude-3-5-sonnet-20241022:
- `analyzeWidgetIdea()`: Analyst Agent - asks clarifying GIS questions
- `generatePRD()`: PM Agent - creates Product Requirements Document
- `generateArchitecture()`: Architect Agent - defines technical structure
- `generateWidgetCode()`: Developer Agent - outputs production widget.tsx

## Design System: GeoPunk

Technical Brutalism meets Cyberpunk GIS aesthetic.

**Colors** (in `tailwind.config.js`):
- Dark backgrounds: `geodark` (#0a0e17), `geodark-secondary` (#1a1f2e), `geodark-tertiary` (#0f1419)
- Neon accents: `fiesta-turquoise` (#00D9D5), `fiesta-pink` (#FF006E), `fiesta-orange` (#FF6B35)
- Wizard tokens: `wizard-bg`, `wizard-card`, `wizard-border`, `wizard-accent`

**Typography:**
- Headings: Orbitron (font-sans)
- Body/Code: IBM Plex Mono (font-mono)

**Custom utilities** (in `globals.css`):
- `.wizard-input` - Form input styling with border and focus states
- `.wizard-card` - Card container with border and background
- `.wizard-section-title` - Uppercase tracking label in turquoise
- `.bg-grid-animated` - Coordinate grid background
- `.glow-cyan`, `.glow-cyan-lg`, `.glow-cyan-xl` - Neon glow effects
- `.animate-fade-in-up`, `.animate-ping-slow` - Animations

**Box Shadows:**
- `wizard-card` - Deep shadow for card depth
- `wizard-glow` - Turquoise glow effect

Use the `cn()` utility from `@lib/utils` for merging Tailwind classes.

## Environment Variables

Required in `.env`:
```
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_ANTHROPIC_API_KEY=your_anthropic_api_key
```

## TypeScript Configuration

Strict mode enabled with additional checks:
- `noUnusedLocals`, `noUnusedParameters`
- `noFallthroughCasesInSwitch`
- `noUncheckedIndexedAccess`
- `noImplicitReturns`
- `forceConsistentCasingInFileNames`

## Target Output

Generated widgets target ArcGIS Experience Builder 1.19+ with:
- Jimu framework patterns
- React 19 hooks
- ArcGIS API v4.x integration
- TypeScript strict mode

## Documentation

- [BMAD Workflow](docs/BMAD-WORKFLOW.md) - Methodology explanation
- [Architecture](docs/ARCHITECTURE.md) - Project structure
