# VibeGIS - AI-Powered ArcGIS Widget Generator

SaaS product that guides GIS developers through building custom ArcGIS Experience Builder widgets using BMAD methodology (Business → Manage → Architect → Develop).

## Quick Start

```bash
# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Edit .env with your Supabase and Anthropic credentials

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the app.

## Routes

| Route | Description |
|-------|-------------|
| `/` | Landing page |
| `/generator` | BMAD Widget Generator wizard |

## Tech Stack

- **React 19** - UI framework
- **TypeScript** - Type safety (strict mode)
- **Vite** - Build tool
- **Tailwind CSS** - Styling with GeoPunk design system
- **Zustand** - State management
- **React Router** - Client-side routing
- **Monaco Editor** - Code display
- **JSZip** - Widget packaging
- **Supabase** - Backend (auth, database)
- **Anthropic API** - AI agents

## Project Structure

```
src/
├── app/                    # Application routes
│   └── generator/          # BMAD widget generator
├── features/               # Feature modules
│   └── workflow/           # BMAD workflow (types, store, phases)
├── marketing/              # Public marketing pages
├── components/             # Shared components
│   └── ui/                 # UI components (StepIndicator)
├── lib/                    # Core utilities
│   ├── generator/          # Widget code generation
│   ├── anthropic.ts        # Claude API client
│   └── supabase.ts         # Supabase client
├── hooks/                  # Custom React hooks
├── types/                  # TypeScript types
└── styles/                 # Global styles
```

## BMAD Workflow

The widget generator follows a 4-phase workflow:

1. **Analyze** - Capture widget concept, audience, and data sources
2. **Specify** - Define functional requirements and UI expectations
3. **Architect** - Plan component structure and integrations
4. **Generate** - Produce downloadable widget code package

See [docs/BMAD-WORKFLOW.md](docs/BMAD-WORKFLOW.md) for detailed methodology.

## Design System

**GeoPunk Aesthetic:**
- Dark backgrounds: `#0a0e17` (geodark)
- Neon accents: Cyan `#00D9D5`, Pink `#FF006E`, Orange `#FF6B35`
- Fonts: Orbitron (headings), IBM Plex Mono (body)
- Technical brutalism meets cyberpunk GIS

See `tailwind.config.js` for full color palette and utilities.

## Path Aliases

- `@/` → `src/`
- `@components/` → `src/components/`
- `@app/` → `src/app/`
- `@marketing/` → `src/marketing/`
- `@lib/` → `src/lib/`
- `@hooks/` → `src/hooks/`
- `@types/` → `src/types/`

## Commands

```bash
npm run dev       # Start dev server on port 3000
npm run build     # TypeScript check + Vite build
npm run lint      # ESLint with zero warnings tolerance
npm run preview   # Preview production build
```

## Documentation

- [BMAD Workflow](docs/BMAD-WORKFLOW.md) - Methodology explanation
- [Architecture](docs/ARCHITECTURE.md) - Project structure

## License

Proprietary - VibeGIS
