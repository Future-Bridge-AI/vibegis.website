# Project Architecture

This document describes the merged architecture after consolidating vibegis.agent functionality into vibegis.website.

## Directory Structure

```
vibegis.website/
├── src/
│   ├── app/                         # Application routes
│   │   ├── generator/               # Widget generator route
│   │   │   └── index.tsx            # WorkflowWizard mount point
│   │   ├── dashboard/               # User dashboard (placeholder)
│   │   └── widgets/                 # Widget management (placeholder)
│   │
│   ├── features/                    # Feature modules
│   │   └── workflow/                # BMAD workflow feature
│   │       ├── types.ts             # Workflow type definitions
│   │       ├── store.ts             # Zustand state management
│   │       ├── WorkflowWizard.tsx   # Main wizard container
│   │       └── phases/              # Workflow phase components
│   │           ├── AnalyzePhase.tsx
│   │           ├── SpecifyPhase.tsx
│   │           ├── ArchitectPhase.tsx
│   │           └── GeneratePhase.tsx
│   │
│   ├── components/                  # Shared components
│   │   └── ui/
│   │       └── StepIndicator.tsx    # Workflow step indicator
│   │
│   ├── lib/                         # Core utilities
│   │   ├── generator/               # Widget code generation
│   │   │   ├── index.ts             # Barrel export
│   │   │   ├── templates.ts         # Code templates
│   │   │   ├── generateWidget.ts    # Widget code generator
│   │   │   └── packageWidget.ts     # ZIP packaging
│   │   ├── anthropic.ts             # Claude API client
│   │   ├── supabase.ts              # Supabase client
│   │   ├── widget-builder.ts        # Enhanced widget builder
│   │   ├── constants.ts             # App constants
│   │   └── utils.ts                 # Utility functions
│   │
│   ├── marketing/                   # Public marketing pages
│   │   └── landing/
│   │       └── LandingPage.tsx
│   │
│   ├── hooks/                       # Custom React hooks
│   ├── types/                       # TypeScript types
│   └── styles/
│       └── globals.css              # Global styles + utilities
│
├── docs/                            # Documentation
│   ├── BMAD-WORKFLOW.md
│   └── ARCHITECTURE.md
│
├── tailwind.config.js               # Tailwind + GeoPunk design system
├── vite.config.ts                   # Vite configuration
├── tsconfig.json                    # TypeScript configuration
└── package.json
```

## Key Components

### Workflow State Management

The workflow uses Zustand for state management (`src/features/workflow/store.ts`):

```typescript
interface WorkflowState {
  currentPhase: WorkflowPhase;
  widgetBrief: WidgetBrief;
  widgetPRD: WidgetPRD;
  widgetArchitecture: WidgetArchitecture;
  generatedCode: string;
}
```

### Code Generation Pipeline

1. **Templates** (`templates.ts`) - Define file templates with token placeholders
2. **Generator** (`generateWidget.ts`) - Replaces tokens based on workflow state
3. **Packager** (`packageWidget.ts`) - Creates ZIP bundle with JSZip

### Design System

GeoPunk design tokens in `tailwind.config.js`:

```javascript
colors: {
  fiesta: { turquoise, pink, orange },
  geodark: { DEFAULT, secondary, tertiary },
  wizard: { bg, card, border, accent }
}
```

Utility classes in `globals.css`:
- `.wizard-input` - Form input styling
- `.wizard-card` - Card container styling
- `.wizard-section-title` - Section title styling

## Routes

| Route | Component | Description |
|-------|-----------|-------------|
| `/` | LandingPage | Marketing landing page |
| `/generator` | WorkflowWizard | BMAD widget generator |
| `/dashboard` | (placeholder) | User dashboard |
| `/widgets` | (placeholder) | Widget management |

## Dependencies

### Core
- React 19
- TypeScript 5.7
- Vite 6
- Zustand 5

### UI
- Tailwind CSS 3.4
- Lucide React (icons)
- Monaco Editor (code display)

### Utilities
- JSZip (ZIP packaging)
- clsx + tailwind-merge (class utilities)

### Backend
- Supabase (auth, database)
- Anthropic Claude API (AI agents)
