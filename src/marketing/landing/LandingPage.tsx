import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Check,
  ChevronRight,
  ArrowRight,
  GraduationCap,
  Cpu,
  Mail,
  Calendar,
  Shield,
  Users,
  Zap,
  BookOpen,
  GitBranch,
  Database,
  RefreshCw,
  Layers,
  Terminal,
} from 'lucide-react';
import { EnrollmentModal } from './EnrollmentModal';
import { generateCohorts, formatCohortDate, getAvailableSeats, type Cohort } from '@/lib/cohorts';

// ============================================
// TYPES
// ============================================
type Product = 'training' | 'agent';

interface FAQItem {
  question: string;
  product: Product | 'both';
}

// ============================================
// ANALYTICS STUBS
// ============================================
const track = (event: string, data?: Record<string, unknown>) => {
  console.log('[Analytics]', event, data);
  // TODO: Wire to actual analytics
};

// ============================================
// MAIN COMPONENT
// ============================================
export default function LandingPage() {
  const navigate = useNavigate();
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [waitlistEmail, setWaitlistEmail] = useState('');
  const [cohorts, setCohorts] = useState<Cohort[]>([]);
  const [isEnrollmentOpen, setIsEnrollmentOpen] = useState(false);
  const [selectedTier, setSelectedTier] = useState<string | undefined>(undefined);

  // Load cohorts
  useEffect(() => {
    setCohorts(generateCohorts(6));
  }, []);

  // Get the next available cohort
  const nextCohort = cohorts.find((c) => c.status === 'open' || c.status === 'filling');
  const nextCohortDate = nextCohort
    ? `${formatCohortDate(nextCohort.startDate)} • 8:00 AM AWST`
    : 'Loading...';
  const nextCohortSeats = nextCohort ? getAvailableSeats(nextCohort.id) : 10;

  const handleFaqToggle = (index: number) => {
    track('faq_open', { index });
    setOpenFaq(openFaq === index ? null : index);
  };

  const handleEnrolClick = (tier?: string) => {
    track('click_enrol_training', { tier });
    setSelectedTier(tier);
    setIsEnrollmentOpen(true);
  };

  const handleWaitlistSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    track('click_waitlist_agent', { email: waitlistEmail });
    window.location.href = `mailto:craig@futurebridgeai.com.au?subject=VibeGIS%20Coding%20Agent%20Waitlist&body=Please add me to the waitlist. Email: ${waitlistEmail}`;
  };

  const handleTryGenerator = () => {
    navigate('/generator');
  };

  // FAQ Data
  const faqs: (FAQItem & { answer: string })[] = [
    {
      question: 'Do I need to be a developer?',
      answer:
        "No. You need basic technical comfort (terminal, file paths, config files), but you don't need to be a software engineer. The course teaches you how to use coding agents safely — the focus is workflow architecture, not syntax.",
      product: 'training',
    },
    {
      question: 'ArcGIS or open source — does it matter?',
      answer:
        "The patterns work across both. Examples reference common stacks (QGIS, PostGIS, ArcGIS Pro), but the core skill is agentic workflows — planning, execution, and validation. Your tooling choice doesn't lock you out.",
      product: 'both',
    },
    {
      question: 'Can I use this at work (governance / data sensitivity)?',
      answer:
        'Yes, with care. We cover where AI assistants fit in enterprise workflows, including data boundaries, audit trails, and approval gates. The human-in-the-loop model is designed for environments where you can\'t just "ship and see".',
      product: 'both',
    },
    {
      question: 'What will I have built by the end of training?',
      answer:
        'A repeatable workflow pattern you can apply to your own GIS context: Plan → Execute → Review → Package. Plus a working ETL pipeline, a self-healing script, a spatial SQL workflow, and an MCP server stub. Real artefacts, not just notes.',
      product: 'training',
    },
    {
      question: 'How much time per week for training?',
      answer:
        'Plan for 2–3 hours: a 90-minute live session plus ~1 hour of hands-on work between sessions. Recordings are available if you miss a session.',
      product: 'training',
    },
    {
      question: 'How does the Coding Agent handle sensitive data?',
      answer:
        'The agent operates locally on your machine. Your data never leaves your environment unless you explicitly choose to send it. All AI interactions can be audited, and you control what context the agent sees.',
      product: 'agent',
    },
    {
      question: 'What GIS tools does the Coding Agent support?',
      answer:
        'Initial release focuses on ArcGIS Experience Builder widgets. Roadmap includes QGIS plugins, PostGIS workflows, and general Python/GeoPandas automation. The MCP architecture means new tools can be added modularly.',
      product: 'agent',
    },
    {
      question: 'When will the Coding Agent be available?',
      answer:
        "We're rolling out early access over the coming weeks. Waitlist members get priority access. Enterprise enquiries for private deployments are welcome — email Craig directly.",
      product: 'agent',
    },
  ];

  // Training modules
  const modules = [
    {
      num: '01',
      title: 'Agent-Ready GIS Workflow Basics',
      outcome: "Set up projects, prompts, repo structure, and review loops that don't fall apart.",
      build: 'A working project scaffold with CLAUDE.md, tests, and CI hooks.',
      icon: <GitBranch className="w-5 h-5" />,
    },
    {
      num: '02',
      title: 'Autonomous Data Retrieval & ETL',
      outcome: 'Ingest, transform, and validate layers reliably — CRS, schema, joins, metadata.',
      build: 'A repeatable ETL pipeline for a real data source.',
      icon: <Database className="w-5 h-5" />,
    },
    {
      num: '03',
      title: 'Self-Healing Pipelines',
      outcome: 'Handle broken endpoints, schema drift, retries, alerts, and idempotent runs.',
      build: 'A pipeline that diagnoses failures and resumes without restarting.',
      icon: <RefreshCw className="w-5 h-5" />,
    },
    {
      num: '04',
      title: 'Spatial SQL at Scale (Safely)',
      outcome: 'PostGIS/warehouse patterns + AI-assisted query generation with guardrails.',
      build: 'A decomposition workflow — entity → schema → logic → SQL → validation.',
      icon: <Terminal className="w-5 h-5" />,
    },
    {
      num: '05',
      title: 'Desktop-to-Automation Bridge',
      outcome: 'Where QGIS/ArcGIS still fits; when to automate; exporting repeatable steps.',
      build: 'A hybrid workflow that bridges desktop and code-first environments.',
      icon: <Layers className="w-5 h-5" />,
    },
    {
      num: '06',
      title: 'Interoperability: MCP & "USB-C for GIS"',
      outcome: 'Connect tools cleanly; design tool contracts; reduce glue-code chaos.',
      build: 'An MCP server that exposes GIS tools to agents consistently.',
      icon: <Zap className="w-5 h-5" />,
    },
  ];

  // Agent roadmap
  const roadmap = [
    'ArcGIS Experience Builder widget generation',
    'QGIS plugin scaffolding',
    'PostGIS workflow automation',
    'Python/GeoPandas script generation',
    'Self-documenting code with inline specs',
    'Team collaboration features',
  ];

  return (
    <div className="min-h-screen" style={{ fontFamily: "var(--mono)" }}>
      {/* Skip link for accessibility */}
      <a href="#main-content" className="skip-link">
        Skip to main content
      </a>

      {/* Paper backgrounds */}
      <div className="paper-grid" aria-hidden="true" />
      <div className="paper-texture" aria-hidden="true" />

      {/* Draft stamp */}
      <div className="draft-stamp" aria-hidden="true">
        <div className="draft-stamp-inner">Early Access</div>
      </div>

      {/* ==================== NAV ==================== */}
      <header
        className="sticky top-0 z-50 border-b"
        style={{
          background: 'rgba(245, 243, 239, 0.94)',
          backdropFilter: 'blur(8px)',
          borderColor: 'var(--border)',
        }}
      >
        <div className="max-w-[960px] mx-auto px-6">
          <nav className="flex items-center justify-between py-4 gap-4">
            {/* Brand */}
            <a href="#start" className="flex items-center gap-2 no-underline">
              <span
                className="w-[30px] h-[30px] border-2 flex items-center justify-center text-[0.6rem] font-semibold"
                style={{
                  borderColor: 'var(--pencil)',
                  color: 'var(--pencil)',
                  background: 'var(--paper)',
                }}
              >
                V.G
              </span>
              <span
                className="text-[1.35rem] font-bold"
                style={{ fontFamily: 'var(--handwritten)', color: 'var(--ink)' }}
              >
                VibeGIS
              </span>
            </a>

            {/* Nav links */}
            <div className="flex items-center gap-0.5">
              <a
                href="#training"
                className="hidden md:inline-block px-2.5 py-2 text-[0.72rem] no-underline transition-colors"
                style={{ color: 'var(--ink-faded)' }}
                onMouseOver={(e) => (e.currentTarget.style.color = 'var(--pencil)')}
                onMouseOut={(e) => (e.currentTarget.style.color = 'var(--ink-faded)')}
              >
                Training
              </a>
              <a
                href="#agent"
                className="hidden md:inline-block px-2.5 py-2 text-[0.72rem] no-underline transition-colors"
                style={{ color: 'var(--ink-faded)' }}
                onMouseOver={(e) => (e.currentTarget.style.color = 'var(--pencil)')}
                onMouseOut={(e) => (e.currentTarget.style.color = 'var(--ink-faded)')}
              >
                Coding Agent
              </a>
              <a
                href="#how-it-works"
                className="hidden md:inline-block px-2.5 py-2 text-[0.72rem] no-underline transition-colors"
                style={{ color: 'var(--ink-faded)' }}
                onMouseOver={(e) => (e.currentTarget.style.color = 'var(--pencil)')}
                onMouseOut={(e) => (e.currentTarget.style.color = 'var(--ink-faded)')}
              >
                How It Works
              </a>
              <a
                href="#faq"
                className="hidden md:inline-block px-2.5 py-2 text-[0.72rem] no-underline transition-colors"
                style={{ color: 'var(--ink-faded)' }}
                onMouseOver={(e) => (e.currentTarget.style.color = 'var(--pencil)')}
                onMouseOut={(e) => (e.currentTarget.style.color = 'var(--ink-faded)')}
              >
                FAQ
              </a>
              <a
                href="#training"
                className="btn btn-primary ml-2"
              >
                Enrol Now
              </a>
            </div>
          </nav>
        </div>
      </header>

      {/* ==================== MAIN ==================== */}
      <main id="main-content" className="relative z-10">
        {/* ==================== HERO WITH WORKFLOW IMAGE ==================== */}
        <section
          id="start"
          className="relative overflow-hidden border-b"
          style={{ borderColor: 'var(--border)' }}
        >
          {/* Hero Image Background */}
          <div className="relative w-full">
            <img
              src="/images/hero-workflow.jpg"
              alt="VibeGIS Workflow: Spec → Agent → Validate → Output with Human in the Loop"
              className="w-full h-auto object-cover"
              style={{
                maxHeight: '70vh',
                minHeight: '400px',
                objectPosition: 'center center'
              }}
            />
            {/* Gradient overlay for text readability on left */}
            <div
              className="absolute inset-0 hidden md:block"
              style={{
                background: 'linear-gradient(90deg, rgba(245,243,239,0.95) 0%, rgba(245,243,239,0.8) 25%, rgba(245,243,239,0.3) 45%, transparent 60%)'
              }}
            />
            {/* Mobile overlay - more coverage */}
            <div
              className="absolute inset-0 md:hidden"
              style={{
                background: 'linear-gradient(180deg, rgba(245,243,239,0.9) 0%, rgba(245,243,239,0.7) 50%, rgba(245,243,239,0.9) 100%)'
              }}
            />

            {/* Hero Content Overlay */}
            <div className="absolute inset-0 flex items-center">
              <div className="max-w-[960px] mx-auto px-6 w-full">
                <div className="max-w-[420px]">
                  <p
                    className="text-[0.72rem] mb-2"
                    style={{ color: 'var(--ink-faded)' }}
                  >
                    Built for GIS practitioners in utilities, resources, and government.
                  </p>

                  <h1
                    className="text-[clamp(1.9rem,5vw,2.75rem)] font-normal leading-[1.1] mb-4"
                    style={{ fontFamily: 'var(--serif)' }}
                  >
                    Ship faster.
                    <br />
                    Stay <em style={{ fontStyle: 'italic', color: 'var(--pencil)' }}>in control</em>.
                  </h1>

                  <p
                    className="text-[0.88rem] mb-6 leading-relaxed"
                    style={{ color: 'var(--ink-soft)' }}
                  >
                    Learn to architect agentic GIS workflows —{' '}
                    <b className="highlight-text">without handing over the keys</b>. Delegate mechanical
                    work to AI agents while keeping humans in charge.
                  </p>

                  {/* CTA Buttons */}
                  <div className="flex flex-wrap gap-3 mb-4">
                    <button
                      className="btn btn-primary"
                      onClick={() => handleEnrolClick()}
                    >
                      <GraduationCap className="w-4 h-4" />
                      Enrol Now
                      <span className="badge badge-live ml-1" style={{ fontSize: '0.5rem', padding: '1px 4px' }}>Live</span>
                    </button>
                    <a
                      href="#agent"
                      className="btn btn-secondary"
                      onClick={() => track('click_hero_agent')}
                    >
                      <Cpu className="w-4 h-4" />
                      Coding Agent
                    </a>
                  </div>

                  {/* Proof points */}
                  <div className="flex flex-wrap gap-3 text-[0.68rem]" style={{ color: 'var(--ink-faded)' }}>
                    <span className="flex items-center gap-1">
                      <span style={{ color: 'var(--pencil)' }}>•</span> Early access
                    </span>
                    <span className="flex items-center gap-1">
                      <span style={{ color: 'var(--pencil)' }}>•</span> WA-based
                    </span>
                    <span className="flex items-center gap-1">
                      <span style={{ color: 'var(--pencil)' }}>•</span> Human-in-the-loop
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ==================== PRODUCT CHOOSER ==================== */}
        <section
          className="py-12 border-b"
          style={{ borderColor: 'var(--border)', background: 'var(--paper-warm)' }}
        >
          <div className="max-w-[960px] mx-auto px-6">
            <div className="sec-label">Choose Your Path</div>
            <h2 className="sec-title mb-6">
              Training <em>or</em> tooling — start where you are.
            </h2>

            <div className="grid md:grid-cols-2 gap-4 max-w-[700px]">
              {/* Training Card */}
              <div
                className="card card-featured p-5 relative cursor-pointer group"
                onClick={() => handleEnrolClick()}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => e.key === 'Enter' && handleEnrolClick()}
              >
                <span className="badge badge-live absolute -top-2 right-4">Live</span>
                <div className="flex items-center gap-3 mb-3">
                  <div
                    className="w-10 h-10 rounded flex items-center justify-center"
                    style={{ background: 'var(--pencil-light)' }}
                  >
                    <GraduationCap className="w-5 h-5" style={{ color: 'var(--pencil)' }} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-[0.95rem]" style={{ color: 'var(--ink)' }}>
                      AI Training
                    </h3>
                    <p className="text-[0.72rem]" style={{ color: 'var(--ink-faded)' }}>
                      Skills + playbooks + cohort
                    </p>
                  </div>
                </div>
                <p className="text-[0.78rem] mb-4" style={{ color: 'var(--ink-soft)' }}>
                  6-week live cohort teaching you to design, execute, and validate agentic GIS
                  workflows with guardrails.
                </p>
                <span className="btn btn-primary w-full justify-center group-hover:translate-y-[-2px]">
                  Enrol in AI Training
                  <ArrowRight className="w-4 h-4" />
                </span>
              </div>

              {/* Agent Card */}
              <div
                className="card p-5 relative cursor-pointer group"
                onClick={() => document.getElementById('agent')?.scrollIntoView({ behavior: 'smooth' })}
                role="button"
                tabIndex={0}
                onKeyDown={(e) =>
                  e.key === 'Enter' &&
                  document.getElementById('agent')?.scrollIntoView({ behavior: 'smooth' })
                }
              >
                <span className="badge badge-coming absolute -top-2 right-4">Coming Soon</span>
                <div className="flex items-center gap-3 mb-3">
                  <div
                    className="w-10 h-10 rounded flex items-center justify-center"
                    style={{ background: 'var(--redline-light)' }}
                  >
                    <Cpu className="w-5 h-5" style={{ color: 'var(--redline)' }} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-[0.95rem]" style={{ color: 'var(--ink)' }}>
                      Coding Agent
                    </h3>
                    <p className="text-[0.72rem]" style={{ color: 'var(--ink-faded)' }}>
                      Tool with guardrails
                    </p>
                  </div>
                </div>
                <p className="text-[0.78rem] mb-4" style={{ color: 'var(--ink-soft)' }}>
                  AI-powered GIS coding assistant that generates widgets, pipelines, and automation
                  with human-in-the-loop validation.
                </p>
                <span className="btn btn-secondary w-full justify-center group-hover:border-[var(--pencil)] group-hover:text-[var(--pencil)]">
                  Join Waitlist
                  <ChevronRight className="w-4 h-4" />
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* ==================== THE SHIFT ==================== */}
        <section
          id="shift"
          className="py-16 border-b section-alt"
          style={{ borderColor: 'var(--border)' }}
        >
          <div className="max-w-[960px] mx-auto px-6">
            <div className="sec-label">SEC. 01</div>
            <h2 className="sec-title">
              GIS is becoming <em>machine-readable</em>.
            </h2>
            <p className="sec-lead">
              The discipline is shifting from human-centric to machine-assisted. That's an
              opportunity — if you have guardrails.
            </p>

            <div className="grid gap-4 mt-8 max-w-[580px]">
              {[
                {
                  num: '1',
                  text: (
                    <>
                      <b>GUI workflows don't scale.</b> Point-and-click is fine for one-offs, but it
                      breaks down with volume, complexity, or handoffs.
                    </>
                  ),
                },
                {
                  num: '2',
                  text: (
                    <>
                      <b>Data and tooling are fragmented.</b> CRS mismatches, schema drift, broken
                      endpoints — the glue-code is where projects die.
                    </>
                  ),
                },
                {
                  num: '3',
                  text: (
                    <>
                      <b>AI agents help — with guardrails.</b> Delegation only works if you define
                      "done", validate outputs, and keep humans in the review loop.
                    </>
                  ),
                },
              ].map((point, i) => (
                <div
                  key={i}
                  className="flex gap-4 items-start p-4"
                  style={{ background: 'var(--paper)', border: '1px solid var(--border)' }}
                >
                  <span
                    className="text-[1.4rem] font-bold leading-none min-w-[24px]"
                    style={{ fontFamily: 'var(--handwritten)', color: 'var(--pencil)' }}
                  >
                    {point.num}
                  </span>
                  <p className="text-[0.85rem] leading-relaxed" style={{ color: 'var(--ink-soft)' }}>
                    {point.text}
                  </p>
                </div>
              ))}
            </div>

            <div className="principle-box mt-8 max-w-[480px]">
              <p>
                <strong>Human-in-the-loop</strong> isn't a slogan — it's the operating model. Agents
                execute. Humans verify. That's how you ship without losing sleep.
              </p>
            </div>
          </div>
        </section>

        {/* ==================== HOW IT WORKS ==================== */}
        <section
          id="how-it-works"
          className="py-16 border-b"
          style={{ borderColor: 'var(--border)' }}
        >
          <div className="max-w-[960px] mx-auto px-6">
            <div className="sec-label">SEC. 02</div>
            <h2 className="sec-title">
              The operating system: <em>Specs → Agents → Validation</em>
            </h2>
            <p className="sec-lead">
              Every workflow follows the same pattern. Define what "done" means, delegate execution,
              then verify the output.
            </p>

            {/* System diagram */}
            <div
              className="grid md:grid-cols-3 my-12 border-2"
              style={{ borderColor: 'var(--ink)', background: 'var(--paper)' }}
              role="img"
              aria-label="Three-step workflow: Write spec, delegate to agents, validate outputs"
            >
              {[
                {
                  num: '1',
                  title: 'Write a Feature Spec',
                  desc: 'Define inputs, outputs, constraints, and what "done" looks like.',
                },
                {
                  num: '2',
                  title: 'Delegate to Agents',
                  desc: 'Claude Code, Codex, or your stack. Let them handle the mechanical work.',
                },
                {
                  num: '3',
                  title: 'Validate Outputs',
                  desc: 'Tests, QA checks, spatial sanity checks. Humans sign off.',
                },
              ].map((step, i, arr) => (
                <div
                  key={i}
                  className="p-6 text-center relative"
                  style={{
                    borderRight: i < arr.length - 1 ? '1px dashed var(--border)' : 'none',
                  }}
                >
                  {i < arr.length - 1 && (
                    <span
                      className="absolute right-[-11px] top-1/2 -translate-y-1/2 px-1 hidden md:block"
                      style={{
                        fontFamily: 'var(--handwritten)',
                        fontSize: '1.4rem',
                        color: 'var(--pencil)',
                        background: 'var(--paper)',
                      }}
                    >
                      →
                    </span>
                  )}
                  <div
                    className="text-[1.8rem] font-bold mb-2"
                    style={{ fontFamily: 'var(--handwritten)', color: 'var(--paper-lines)' }}
                  >
                    {step.num}
                  </div>
                  <div className="text-[0.95rem] mb-2" style={{ fontFamily: 'var(--serif)' }}>
                    {step.title}
                  </div>
                  <div className="text-[0.72rem]" style={{ color: 'var(--ink-faded)' }}>
                    {step.desc}
                  </div>
                </div>
              ))}
            </div>

            <div
              className="p-4 flex gap-4 items-start max-w-[600px]"
              style={{ background: 'var(--paper-warm)', border: '1px solid var(--border)' }}
            >
              <div
                className="w-14 h-14 border-2 flex items-center justify-center shrink-0"
                style={{
                  background: 'var(--pencil-light)',
                  borderColor: 'var(--pencil)',
                  fontFamily: 'var(--handwritten)',
                  fontSize: '1.3rem',
                  fontWeight: 700,
                  color: 'var(--pencil)',
                }}
              >
                CM
              </div>
              <p className="text-[0.82rem] leading-relaxed" style={{ color: 'var(--ink-soft)' }}>
                <strong style={{ color: 'var(--ink)' }}>Built in WA by Craig McDonnell.</strong>{' '}
                Nearly 20 years in GIS across utilities, resources, and government. Escaping brittle
                busywork. Building tools that keep humans in charge.
              </p>
            </div>

            <p className="mt-6 text-[0.82rem]" style={{ color: 'var(--ink-faded)' }}>
              <strong style={{ color: 'var(--pencil)' }}>Training</strong> teaches the pattern.{' '}
              <strong style={{ color: 'var(--redline)' }}>Coding Agent</strong> operationalises it.
            </p>
          </div>
        </section>

        {/* ==================== TRAINING SECTION ==================== */}
        <section
          id="training"
          className="py-16 border-b section-alt"
          style={{ borderColor: 'var(--border)' }}
        >
          <div className="max-w-[960px] mx-auto px-6">
            <div className="sec-label">SEC. 03 / TRAINING</div>
            <h2 className="sec-title">
              Six modules. Real work. <em>Repeatable playbooks.</em>
            </h2>
            <p className="sec-lead">
              Each module is outcome-led. You'll leave with patterns you can apply immediately — not
              "cool demos", but production-ready habits.
            </p>

            {/* Module grid */}
            <div
              className="grid md:grid-cols-2 mt-12 border"
              style={{ borderColor: 'var(--border)' }}
            >
              {modules.map((mod, i) => (
                <div
                  key={i}
                  className="p-6 relative group transition-colors"
                  style={{
                    background: 'var(--paper)',
                    borderBottom:
                      i < modules.length - 2 ||
                      (i === modules.length - 2 && modules.length % 2 === 0)
                        ? '1px solid var(--border)'
                        : 'none',
                    borderRight: i % 2 === 0 ? '1px solid var(--border)' : 'none',
                  }}
                  onMouseOver={(e) => (e.currentTarget.style.background = 'var(--paper-warm)')}
                  onMouseOut={(e) => (e.currentTarget.style.background = 'var(--paper)')}
                >
                  <div
                    className="absolute top-0 left-0 w-full h-[3px] scale-x-0 origin-left transition-transform group-hover:scale-x-100"
                    style={{ background: 'var(--pencil)' }}
                  />
                  <div
                    className="text-[1.6rem] font-bold mb-2 transition-colors"
                    style={{ fontFamily: 'var(--handwritten)', color: 'var(--paper-lines)' }}
                  >
                    {mod.num}
                  </div>
                  <div
                    className="text-[0.95rem] mb-2 leading-tight"
                    style={{ fontFamily: 'var(--serif)' }}
                  >
                    {mod.title}
                  </div>
                  <div className="text-[0.78rem] mb-2" style={{ color: 'var(--ink-faded)' }}>
                    {mod.outcome}
                  </div>
                  <div className="text-[0.72rem] italic" style={{ color: 'var(--ink-ghost)' }}>
                    Build: {mod.build}
                  </div>
                </div>
              ))}
            </div>

            {/* Launch Special Banner */}
            <div
              className="mt-8 mb-6 p-3 text-center"
              style={{ background: 'var(--highlight)', border: '2px dashed var(--ink)' }}
            >
              <p className="text-[0.85rem] font-semibold" style={{ color: 'var(--ink)' }}>
                🚀 <strong>Launch Special</strong> — Over 50% off for early adopters. Limited time only.
              </p>
            </div>

            {/* Pricing */}
            <div className="grid md:grid-cols-3 gap-4">
              {/* Solo */}
              <div className="card p-6 flex flex-col">
                <div className="flex items-center justify-between mb-2">
                  <div className="text-[0.62rem] uppercase tracking-wider" style={{ color: 'var(--ink-ghost)' }}>
                    Solo
                  </div>
                  <span
                    className="px-1.5 py-0.5 text-[0.55rem] font-semibold"
                    style={{ background: 'var(--highlight)', color: 'var(--ink)' }}
                  >
                    Launch Special
                  </span>
                </div>
                <div className="text-[1.15rem] mb-2" style={{ fontFamily: 'var(--serif)' }}>
                  Individual
                </div>
                <div
                  className="text-[0.72rem] pb-4 mb-4"
                  style={{ color: 'var(--ink-faded)', borderBottom: '1px dashed var(--border)' }}
                >
                  For practitioners learning on their own time.
                </div>
                <div className="mb-2">
                  <span className="text-[1rem] line-through mr-2" style={{ color: 'var(--ink-ghost)' }}>
                    $1,497
                  </span>
                  <span
                    className="text-[2rem] font-bold leading-none"
                    style={{ fontFamily: 'var(--handwritten)', color: 'var(--pencil)' }}
                  >
                    $727
                  </span>
                  <small className="text-[0.75rem] font-normal ml-1" style={{ color: 'var(--ink-ghost)' }}>AUD</small>
                </div>
                <ul className="flex-1 my-4 space-y-1">
                  {['6 live sessions (recordings included)', 'All playbooks and templates', '90-day recording access', 'Community Slack channel'].map((item, i) => (
                    <li key={i} className="flex items-start gap-2 text-[0.75rem]" style={{ color: 'var(--ink-soft)' }}>
                      <Check className="w-4 h-4 shrink-0" style={{ color: 'var(--success)' }} />
                      {item}
                    </li>
                  ))}
                </ul>
                <button
                  onClick={() => handleEnrolClick('solo')}
                  className="btn btn-primary w-full justify-center"
                >
                  Reserve your spot
                </button>
              </div>

              {/* Team (Featured) */}
              <div className="card card-featured p-6 flex flex-col relative">
                <span className="badge badge-redline absolute -top-1 right-4">Best value</span>
                <div className="flex items-center justify-between mb-2">
                  <div className="text-[0.62rem] uppercase tracking-wider" style={{ color: 'var(--ink-ghost)' }}>
                    Team
                  </div>
                  <span
                    className="px-1.5 py-0.5 text-[0.55rem] font-semibold"
                    style={{ background: 'var(--highlight)', color: 'var(--ink)' }}
                  >
                    Launch Special
                  </span>
                </div>
                <div className="text-[1.15rem] mb-2" style={{ fontFamily: 'var(--serif)' }}>
                  Small Team (2–4)
                </div>
                <div
                  className="text-[0.72rem] pb-4 mb-4"
                  style={{ color: 'var(--ink-faded)', borderBottom: '1px dashed var(--border)' }}
                >
                  For teams upskilling together. Includes group exercises.
                </div>
                <div className="mb-2">
                  <span className="text-[1rem] line-through mr-2" style={{ color: 'var(--ink-ghost)' }}>
                    $3,497
                  </span>
                  <span
                    className="text-[2rem] font-bold leading-none"
                    style={{ fontFamily: 'var(--handwritten)', color: 'var(--pencil)' }}
                  >
                    $1,747
                  </span>
                  <small className="text-[0.75rem] font-normal ml-1" style={{ color: 'var(--ink-ghost)' }}>AUD</small>
                </div>
                <ul className="flex-1 my-4 space-y-1">
                  {['Everything in Solo', 'Up to 4 seats', 'Team-specific exercises', '30-min onboarding call'].map((item, i) => (
                    <li key={i} className="flex items-start gap-2 text-[0.75rem]" style={{ color: 'var(--ink-soft)' }}>
                      <Check className="w-4 h-4 shrink-0" style={{ color: 'var(--success)' }} />
                      {item}
                    </li>
                  ))}
                </ul>
                <button
                  onClick={() => handleEnrolClick('team')}
                  className="btn btn-primary w-full justify-center"
                >
                  Reserve your spots
                </button>
                <p className="text-center mt-2 text-[0.68rem]" style={{ color: 'var(--ink-ghost)' }}>
                  ~$437 per seat
                </p>
              </div>

              {/* Enterprise */}
              <div className="card p-6 flex flex-col">
                <div className="text-[0.62rem] uppercase tracking-wider mb-2" style={{ color: 'var(--ink-ghost)' }}>
                  Enterprise
                </div>
                <div className="text-[1.15rem] mb-2" style={{ fontFamily: 'var(--serif)' }}>
                  Custom Cohort
                </div>
                <div
                  className="text-[0.72rem] pb-4 mb-4"
                  style={{ color: 'var(--ink-faded)', borderBottom: '1px dashed var(--border)' }}
                >
                  For organisations with specific requirements.
                </div>
                <div
                  className="text-[2rem] font-bold leading-none mb-2"
                  style={{ fontFamily: 'var(--handwritten)', color: 'var(--pencil)' }}
                >
                  Contact<small className="text-[0.75rem] font-normal" style={{ color: 'var(--ink-ghost)' }}> for pricing</small>
                </div>
                <ul className="flex-1 my-4 space-y-1">
                  {['Private cohort scheduling', 'Custom curriculum focus', 'Governance/compliance review', 'Extended support window'].map((item, i) => (
                    <li key={i} className="flex items-start gap-2 text-[0.75rem]" style={{ color: 'var(--ink-soft)' }}>
                      <Check className="w-4 h-4 shrink-0" style={{ color: 'var(--success)' }} />
                      {item}
                    </li>
                  ))}
                </ul>
                <button
                  onClick={() => handleEnrolClick('enterprise')}
                  className="btn btn-secondary w-full justify-center"
                >
                  Contact Craig
                </button>
              </div>
            </div>

            {/* Cohort info */}
            <div
              className="mt-8 p-4 max-w-[520px]"
              style={{
                background: 'var(--paper-warm)',
                border: '1px dashed var(--pencil)',
              }}
            >
              <div className="flex items-center justify-between mb-3">
                <p className="text-[0.82rem]" style={{ color: 'var(--ink-soft)' }}>
                  <strong style={{ color: 'var(--pencil)' }}>Next cohort:</strong> {nextCohortDate}
                </p>
                <div className="flex items-center gap-1.5">
                  <Users className="w-4 h-4" style={{ color: 'var(--pencil)' }} />
                  <span
                    className="text-[1rem] font-bold"
                    style={{
                      fontFamily: 'var(--handwritten)',
                      color: nextCohortSeats <= 3 ? 'var(--redline)' : 'var(--pencil)',
                    }}
                  >
                    {nextCohortSeats}
                  </span>
                  <span className="text-[0.68rem]" style={{ color: 'var(--ink-ghost)' }}>
                    seats left
                  </span>
                </div>
              </div>
              <p className="text-[0.82rem] mb-2" style={{ color: 'var(--ink-soft)' }}>
                <strong style={{ color: 'var(--pencil)' }}>Cadence:</strong> 6 weekly sessions, Fridays 8:00 AM AWST
              </p>
              <p className="text-[0.82rem] mb-3" style={{ color: 'var(--ink-soft)' }}>
                <strong style={{ color: 'var(--pencil)' }}>Guarantee:</strong> Full refund within 14 days if it's not right for you.
              </p>
              <button
                onClick={() => handleEnrolClick()}
                className="btn btn-primary"
              >
                <Calendar className="w-4 h-4" />
                Select a Cohort
              </button>
            </div>
          </div>
        </section>

        {/* ==================== CODING AGENT SECTION ==================== */}
        <section
          id="agent"
          className="py-16 border-b"
          style={{ borderColor: 'var(--border)' }}
        >
          <div className="max-w-[960px] mx-auto px-6">
            <div className="sec-label">SEC. 04 / CODING AGENT</div>
            <h2 className="sec-title">
              AI that ships GIS code — <em>with guardrails</em>
            </h2>
            <p className="sec-lead">
              Generate widgets, pipelines, and automation scripts. Human-in-the-loop validation
              ensures nothing ships without your sign-off.
            </p>

            <div className="grid md:grid-cols-2 gap-8 mt-8">
              {/* What it does */}
              <div>
                <h3
                  className="text-[1rem] font-semibold mb-4 flex items-center gap-2"
                  style={{ color: 'var(--ink)' }}
                >
                  <Cpu className="w-5 h-5" style={{ color: 'var(--redline)' }} />
                  What it does
                </h3>
                <ul className="space-y-3">
                  {[
                    'Generates ArcGIS Experience Builder widgets from natural language specs',
                    'Scaffolds pipelines with built-in validation checkpoints',
                    'Suggests spatial queries with schema awareness',
                    'Documents code automatically as it generates',
                  ].map((item, i) => (
                    <li key={i} className="flex items-start gap-3 text-[0.85rem]" style={{ color: 'var(--ink-soft)' }}>
                      <span style={{ color: 'var(--redline)' }}>→</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Who it's for */}
              <div>
                <h3
                  className="text-[1rem] font-semibold mb-4 flex items-center gap-2"
                  style={{ color: 'var(--ink)' }}
                >
                  <Users className="w-5 h-5" style={{ color: 'var(--pencil)' }} />
                  Who it's for
                </h3>
                <ul className="space-y-3">
                  {[
                    'GIS developers who want to ship faster without cowboy coding',
                    'Teams building custom widgets for enterprise deployments',
                    'Analysts automating repetitive spatial workflows',
                    'Organisations needing auditable AI-assisted development',
                  ].map((item, i) => (
                    <li key={i} className="flex items-start gap-3 text-[0.85rem]" style={{ color: 'var(--ink-soft)' }}>
                      <span style={{ color: 'var(--pencil)' }}>→</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Roadmap */}
            <div className="mt-12">
              <h3
                className="text-[1rem] font-semibold mb-4 flex items-center gap-2"
                style={{ color: 'var(--ink)' }}
              >
                <BookOpen className="w-5 h-5" style={{ color: 'var(--pencil)' }} />
                Roadmap (what's coming)
              </h3>
              <div
                className="grid md:grid-cols-2 gap-2 p-4"
                style={{ background: 'var(--paper-warm)', border: '1px solid var(--border)' }}
              >
                {roadmap.map((item, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-2 text-[0.82rem]"
                    style={{ color: 'var(--ink-soft)' }}
                  >
                    <span
                      className="w-5 h-5 flex items-center justify-center text-[0.6rem] font-semibold"
                      style={{
                        background: i === 0 ? 'var(--success)' : 'var(--pencil-light)',
                        color: i === 0 ? 'white' : 'var(--pencil)',
                      }}
                    >
                      {i === 0 ? '✓' : (i + 1)}
                    </span>
                    {item}
                  </div>
                ))}
              </div>
            </div>

            {/* Waitlist form */}
            <div
              className="mt-12 p-6 max-w-[500px]"
              style={{ background: 'var(--paper)', border: '2px solid var(--redline)' }}
            >
              <h3
                className="text-[1.1rem] font-semibold mb-2"
                style={{ fontFamily: 'var(--serif)' }}
              >
                Join the early access waitlist
              </h3>
              <p className="text-[0.82rem] mb-4" style={{ color: 'var(--ink-faded)' }}>
                Rolling invites over the coming weeks. Waitlist members get priority access.
              </p>
              <form onSubmit={handleWaitlistSubmit} className="flex gap-2">
                <input
                  type="email"
                  value={waitlistEmail}
                  onChange={(e) => setWaitlistEmail(e.target.value)}
                  placeholder="your@email.com"
                  required
                  className="input flex-1"
                />
                <button type="submit" className="btn btn-redline shrink-0">
                  <Mail className="w-4 h-4" />
                  Join
                </button>
              </form>
            </div>

            {/* Try the generator preview */}
            <div className="mt-8">
              <button
                onClick={handleTryGenerator}
                className="btn btn-secondary"
              >
                <Terminal className="w-4 h-4" />
                Preview the Widget Generator
              </button>
              <p className="mt-2 text-[0.72rem]" style={{ color: 'var(--ink-ghost)' }}>
                Early prototype — feedback welcome
              </p>
            </div>
          </div>
        </section>

        {/* ==================== FAQ ==================== */}
        <section
          id="faq"
          className="py-16 border-b section-alt"
          style={{ borderColor: 'var(--border)' }}
        >
          <div className="max-w-[960px] mx-auto px-6">
            <div className="sec-label">SEC. 05</div>
            <h2 className="sec-title">
              FAQ, trust, and <em>boundaries</em>
            </h2>
            <p className="sec-lead">Honest answers to the questions you're probably asking.</p>

            <div className="grid gap-3 mt-8 max-w-[640px]">
              {faqs.map((faq, i) => (
                <div key={i} className={`faq-item ${openFaq === i ? 'open' : ''}`}>
                  <button
                    className="faq-question"
                    onClick={() => handleFaqToggle(i)}
                    aria-expanded={openFaq === i}
                  >
                    <span className="flex items-center gap-2">
                      {faq.question}
                      {faq.product === 'training' && (
                        <span className="badge badge-live" style={{ fontSize: '0.5rem', padding: '1px 4px' }}>Training</span>
                      )}
                      {faq.product === 'agent' && (
                        <span className="badge badge-coming" style={{ fontSize: '0.5rem', padding: '1px 4px' }}>Agent</span>
                      )}
                    </span>
                  </button>
                  <div className="faq-answer">
                    <div className="faq-answer-inner">{faq.answer}</div>
                  </div>
                </div>
              ))}
            </div>

            {/* Trust signals */}
            <div className="flex flex-wrap gap-6 mt-12">
              {[
                { icon: <Shield className="w-4 h-4" />, text: 'Local data processing' },
                { icon: <Users className="w-4 h-4" />, text: 'Human-in-the-loop' },
                { icon: <Calendar className="w-4 h-4" />, text: '14-day refund guarantee' },
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-2 text-[0.78rem]" style={{ color: 'var(--ink-faded)' }}>
                  <span style={{ color: 'var(--pencil)' }}>{item.icon}</span>
                  {item.text}
                </div>
              ))}
            </div>

            {/* Contact */}
            <div className="principle-box mt-8 max-w-[380px]">
              <p>
                Questions?{' '}
                <a
                  href="mailto:craig@futurebridgeai.com.au"
                  style={{ color: 'var(--pencil)', fontWeight: 600 }}
                >
                  Email Craig directly
                </a>{' '}
                — usually responds within 24 hours.
              </p>
            </div>
          </div>
        </section>
      </main>

      {/* ==================== FOOTER ==================== */}
      <footer
        className="relative z-10 py-12 border-t"
        style={{ borderColor: 'var(--border)', background: 'var(--paper)' }}
      >
        <div className="max-w-[960px] mx-auto px-6">
          <div className="grid md:grid-cols-3 gap-8">
            <div>
              <div
                className="text-[1.2rem] font-bold mb-2"
                style={{ fontFamily: 'var(--handwritten)' }}
              >
                VibeGIS
              </div>
              <p className="text-[0.78rem] max-w-[260px]" style={{ color: 'var(--ink-faded)' }}>
                A Future Bridge AI product. Built in Western Australia. Helping GIS practitioners
                move from manual execution to reasoning design.
              </p>
            </div>
            <div>
              <h4
                className="text-[0.68rem] uppercase tracking-wider mb-3"
                style={{ color: 'var(--ink-ghost)' }}
              >
                Links
              </h4>
              <a href="#training" className="block text-[0.78rem] py-1" style={{ color: 'var(--ink-faded)', textDecoration: 'none' }}>
                Training
              </a>
              <a href="#agent" className="block text-[0.78rem] py-1" style={{ color: 'var(--ink-faded)', textDecoration: 'none' }}>
                Coding Agent
              </a>
              <a href="#faq" className="block text-[0.78rem] py-1" style={{ color: 'var(--ink-faded)', textDecoration: 'none' }}>
                FAQ
              </a>
            </div>
            <div>
              <h4
                className="text-[0.68rem] uppercase tracking-wider mb-3"
                style={{ color: 'var(--ink-ghost)' }}
              >
                Contact
              </h4>
              <a
                href="mailto:craig@futurebridgeai.com.au"
                className="block text-[0.78rem] py-1"
                style={{ color: 'var(--ink-faded)', textDecoration: 'none' }}
              >
                craig@futurebridgeai.com.au
              </a>
              <a
                href="https://spatial.properties"
                className="block text-[0.78rem] py-1"
                style={{ color: 'var(--ink-faded)', textDecoration: 'none' }}
              >
                spatial.properties
              </a>
            </div>
          </div>

          <div
            className="mt-8 pt-4 flex flex-wrap justify-between gap-4 text-[0.72rem]"
            style={{ borderTop: '1px dashed var(--border)', color: 'var(--ink-ghost)' }}
          >
            <span>© {new Date().getFullYear()} Future Bridge AI • Perth, WA • ABN 59 573 864 982</span>
            <span>REF: VIBE-DUAL-001</span>
          </div>
        </div>
      </footer>

      {/* Enrollment Modal */}
      <EnrollmentModal
        isOpen={isEnrollmentOpen}
        onClose={() => setIsEnrollmentOpen(false)}
        initialTier={selectedTier}
      />
    </div>
  );
}
