# VibeGIS - AI-Powered ArcGIS Widget Generator

SaaS product that guides GIS developers through building custom ArcGIS Experience Builder widgets using BMAD methodology (Business → Manage → Architect → Develop).

## Tech Stack

- **React 19** - UI framework
- **TypeScript** - Type safety
- **Vite** - Build tool
- **Tailwind CSS** - Styling with GeoPunk design system
- **React Router** - Client-side routing
- **Supabase** - Backend (auth, database)
- **Anthropic API** - AI agents

## Project Structure

```
src/
├── app/              # Authenticated app (dashboard, widget generator)
├── marketing/        # Public marketing pages
├── components/       # Shared components
├── lib/              # Utilities & configs (Supabase, constants)
├── hooks/            # Custom React hooks
├── types/            # TypeScript types
└── styles/           # Global styles
```

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm/yarn/pnpm

### Installation

```bash
# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Edit .env with your Supabase and Anthropic credentials

# Start development server
npm run dev
```

## Design System

**GeoPunk Aesthetic:**
- Dark navy backgrounds (`#0a0e17`)
- Neon cyan/purple/pink accents
- Animated coordinate grids
- Inter + JetBrains Mono fonts
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

## License

Proprietary - VibeGIS
