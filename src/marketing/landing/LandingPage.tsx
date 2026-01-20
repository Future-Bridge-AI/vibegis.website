import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Check, Code, Zap, Shield, Users, ChevronRight, X, Terminal, Cpu, Layers } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Feature {
  icon: React.ReactNode;
  title: string;
  description: string;
}

interface PricingPlan {
  name: string;
  price: string;
  description: string;
  features: string[];
  cta: string;
  highlight: boolean;
}

interface Testimonial {
  quote: string;
  author: string;
  role: string;
  avatar: string;
}

export default function LandingPage() {
  const navigate = useNavigate();
  const [scrollY, setScrollY] = useState(0);
  const [isVideoOpen, setIsVideoOpen] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    
    window.addEventListener('scroll', handleScroll);
    window.addEventListener('mousemove', handleMouseMove);
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  const features: Feature[] = [
    {
      icon: <Terminal className="w-7 h-7" />,
      title: "GIS-Native Agents",
      description: "AI that actually knows Jimu from jQuery. Built by devs who've shipped widgets in production."
    },
    {
      icon: <Layers className="w-7 h-7" />,
      title: "BMAD Framework",
      description: "No more prompt roulette. Structured workflow from vague idea to deployable code."
    },
    {
      icon: <Cpu className="w-7 h-7" />,
      title: "ExB 1.19 Native",
      description: "React 19, Jimu patterns, manifest.json structure. Ships ready for Developer Edition."
    },
    {
      icon: <Code className="w-7 h-7" />,
      title: "Context7 Powered",
      description: "Live ArcGIS docs in-context. No more 47 tabs of Esri documentation."
    }
  ];

  const pricingPlans: PricingPlan[] = [
    {
      name: "Sandbox",
      price: "0",
      description: "Kick the tires",
      features: [
        "1 widget/month",
        "Basic templates",
        "Community Discord",
        "Code exports"
      ],
      cta: "Start Free",
      highlight: false
    },
    {
      name: "Builder",
      price: "99",
      description: "Solo devs",
      features: [
        "10 widgets/month",
        "All templates",
        "Priority support",
        "Custom styles",
        "Version history"
      ],
      cta: "Go Builder",
      highlight: false
    },
    {
      name: "Studio",
      price: "299",
      description: "Teams & agencies",
      features: [
        "Unlimited widgets",
        "White-label exports",
        "Team workspaces",
        "Custom training",
        "API access",
        "Advanced agents"
      ],
      cta: "Go Studio",
      highlight: true
    },
    {
      name: "Enterprise",
      price: "Custom",
      description: "Orgs",
      features: [
        "Everything in Studio",
        "SLA guarantees",
        "On-premise deploy",
        "Dedicated support",
        "Custom integrations",
        "Training programs"
      ],
      cta: "Let's Talk",
      highlight: false
    }
  ];

  const testimonials: Testimonial[] = [
    {
      quote: "Went from 3 days per widget to 47 minutes. VibeGIS understands the Jimu lifecycle in ways ChatGPT never will.",
      author: "Sarah Chen",
      role: "Senior GIS Dev",
      avatar: "SC"
    },
    {
      quote: "First AI tool that doesn't hallucinate ArcGIS APIs. The generated code actually compiles and runs.",
      author: "Marcus Rodriguez", 
      role: "Solutions Architect",
      avatar: "MR"
    },
    {
      quote: "Built 23 widgets in January. Clients think we hired an offshore team. Nope, just VibeGIS.",
      author: "Aisha Patel",
      role: "Agency Founder",
      avatar: "AP"
    }
  ];

  const handleStartFree = () => {
    navigate('/generator');
  };

  return (
    <div className="min-h-screen bg-black text-gray-100 font-sans relative overflow-hidden">
      {/* Diagonal Fiesta Stripes Background */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div 
          className="absolute w-[200%] h-[200%] -top-1/2 -left-1/2 opacity-[0.07]"
          style={{
            background: `repeating-linear-gradient(
              45deg,
              #00D9D5 0px,
              #00D9D5 80px,
              #FF006E 80px,
              #FF006E 160px,
              #FF6B35 160px,
              #FF6B35 240px,
              transparent 240px,
              transparent 320px
            )`,
            transform: `rotate(45deg) translateY(${scrollY * 0.3}px)`
          }}
        />
      </div>

      {/* Scan Lines Effect */}
      <div 
        className="fixed inset-0 pointer-events-none opacity-[0.03]"
        style={{
          backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0, 217, 213, 0.3) 2px, rgba(0, 217, 213, 0.3) 4px)',
          animation: 'scan 8s linear infinite'
        }}
      />

      {/* Cursor Glow */}
      <div 
        className="fixed w-96 h-96 pointer-events-none z-50 transition-opacity duration-300"
        style={{
          left: mousePosition.x - 192,
          top: mousePosition.y - 192,
          background: 'radial-gradient(circle, rgba(0, 217, 213, 0.15) 0%, transparent 70%)',
          opacity: mousePosition.x > 0 ? 1 : 0
        }}
      />

      {/* Terminal Coordinates */}
      <div className="fixed top-6 left-6 font-mono text-xs text-fiesta-turquoise/60 z-50 pointer-events-none">
        <div className="flex items-center gap-2 mb-1">
          <div className="w-2 h-2 bg-fiesta-turquoise rounded-full animate-pulse" />
          <span>SYSTEM_ONLINE</span>
        </div>
        <div>LAT: -31.9505° S</div>
        <div>LON: 115.8605° E</div>
        <div>WIDGETS: {2847 + Math.floor(scrollY / 10)}</div>
      </div>

      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-40 border-b border-fiesta-turquoise/10 backdrop-blur-xl bg-black/70">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="relative">
                <div className="w-12 h-12 bg-gradient-to-br from-fiesta-turquoise via-fiesta-pink to-fiesta-orange rounded flex items-center justify-center font-black text-2xl text-black relative overflow-hidden">
                  V
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer" />
                </div>
              </div>
              <div>
                <div className="font-black text-2xl tracking-tighter" style={{ fontFamily: 'Orbitron, sans-serif' }}>
                  VibeGIS
                </div>
                <div className="text-[9px] font-mono text-fiesta-turquoise tracking-[0.2em]">ARCGIS.REBEL</div>
              </div>
            </div>
            
            <div className="hidden md:flex items-center gap-8">
              <a href="#features" className="text-sm font-mono text-gray-400 hover:text-fiesta-turquoise transition-colors relative group">
                Features
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-fiesta-turquoise group-hover:w-full transition-all" />
              </a>
              <a href="#pricing" className="text-sm font-mono text-gray-400 hover:text-fiesta-pink transition-colors relative group">
                Pricing
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-fiesta-pink group-hover:w-full transition-all" />
              </a>
              <a href="#proof" className="text-sm font-mono text-gray-400 hover:text-fiesta-orange transition-colors relative group">
                Proof
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-fiesta-orange group-hover:w-full transition-all" />
              </a>
              <button 
                onClick={handleStartFree}
                className="px-6 py-2.5 bg-fiesta-turquoise text-black font-bold font-mono text-sm rounded hover:bg-fiesta-pink transition-all hover:scale-105 hover:shadow-[0_0_30px_rgba(0,217,213,0.6)] relative overflow-hidden group"
              >
                <span className="relative z-10">START_FREE</span>
                <div className="absolute inset-0 bg-gradient-to-r from-fiesta-pink to-fiesta-orange opacity-0 group-hover:opacity-100 transition-opacity" />
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section - Asymmetric Layout */}
      <section className="relative pt-32 pb-24 px-6 min-h-screen flex items-center">
        {/* Large Diagonal Stripe Accent */}
        <div 
          className="absolute top-0 right-0 w-[600px] h-[600px] opacity-20"
          style={{
            background: 'linear-gradient(135deg, transparent 40%, #00D9D5 40%, #00D9D5 45%, #FF006E 45%, #FF006E 50%, #FF6B35 50%, #FF6B35 55%, transparent 55%)',
            transform: `rotate(${-20 + scrollY * 0.05}deg)`,
            transition: 'transform 0.1s ease-out'
          }}
        />

        <div className="max-w-7xl mx-auto w-full">
          <div className="grid lg:grid-cols-12 gap-12 items-center">
            {/* Left: Content - Takes 7 columns */}
            <div className="lg:col-span-7 space-y-8 relative z-10">
              {/* Status Badge */}
              <div className="inline-flex items-center gap-3 px-4 py-2 bg-fiesta-turquoise/10 border border-fiesta-turquoise/30 rounded-sm font-mono text-xs text-fiesta-turquoise">
                <Terminal className="w-4 h-4" />
                <span className="tracking-wider">ANTI_MONOPOLY_COALITION</span>
              </div>

              {/* Main Headline */}
              <h1 
                className="text-7xl md:text-8xl font-black leading-[0.9] tracking-tighter"
                style={{ fontFamily: 'Orbitron, sans-serif' }}
              >
                <span className="block text-white">BUILD</span>
                <span className="block text-white">ARCGIS</span>
                <span className="block" style={{
                  background: 'linear-gradient(135deg, #00D9D5 0%, #FF006E 50%, #FF6B35 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text'
                }}>
                  WIDGETS
                </span>
              </h1>

              {/* Subheadline */}
              <div className="max-w-xl">
                <p className="text-2xl font-mono text-gray-300 leading-relaxed">
                  AI agents that understand{' '}
                  <span className="text-fiesta-turquoise font-bold">Jimu</span>,{' '}
                  <span className="text-fiesta-pink font-bold">MapView</span>, and{' '}
                  <span className="text-fiesta-orange font-bold">manifest.json</span>
                  {' '}— not just generic React.
                </p>
                <p className="text-lg text-gray-500 mt-4 font-mono">
                  If not us, Big AI eats the industry. We're building the escape route.
                </p>
              </div>

              {/* CTAs */}
              <div className="flex flex-wrap gap-4">
                <button 
                  onClick={handleStartFree}
                  className="group px-10 py-5 bg-fiesta-turquoise text-black font-black text-lg rounded hover:bg-fiesta-pink transition-all hover:scale-105 hover:shadow-[0_0_40px_rgba(0,217,213,0.8)] relative overflow-hidden"
                  style={{ fontFamily: 'Orbitron, sans-serif' }}
                >
                  <span className="relative z-10 flex items-center gap-2">
                    GENERATE WIDGET
                    <ChevronRight className="w-6 h-6 group-hover:translate-x-2 transition-transform" />
                  </span>
                  <div className="absolute inset-0 bg-gradient-to-r from-fiesta-pink to-fiesta-orange opacity-0 group-hover:opacity-100 transition-opacity" />
                </button>
                
                <button 
                  onClick={() => setIsVideoOpen(true)}
                  className="px-10 py-5 border-2 border-fiesta-turquoise text-fiesta-turquoise font-bold text-lg rounded hover:bg-fiesta-turquoise/10 transition-all font-mono"
                >
                  WATCH_DEMO
                </button>
              </div>

              {/* Social Proof */}
              <div className="flex items-center gap-6 pt-6">
                <div className="flex -space-x-4">
                  {[
                    { bg: '#00D9D5', letter: 'S' },
                    { bg: '#FF006E', letter: 'M' },
                    { bg: '#FF6B35', letter: 'A' },
                    { bg: '#00D9D5', letter: 'R' }
                  ].map((avatar, i) => (
                    <div 
                      key={i}
                      className="w-12 h-12 rounded-full border-4 border-black flex items-center justify-center text-sm font-black text-black"
                      style={{ backgroundColor: avatar.bg }}
                    >
                      {avatar.letter}
                    </div>
                  ))}
                </div>
                <div className="font-mono text-sm">
                  <div className="text-fiesta-turquoise font-bold text-lg">2,847 widgets</div>
                  <div className="text-gray-500 text-xs">shipped this month</div>
                </div>
              </div>
            </div>

            {/* Right: Terminal Code Block - Takes 5 columns */}
            <div className="lg:col-span-5 relative">
              {/* Retro Terminal */}
              <div className="relative">
                {/* CRT Glow */}
                <div className="absolute inset-0 bg-fiesta-turquoise/20 blur-3xl" />
                
                <div className="relative bg-[#0a0a0a] border-2 border-fiesta-turquoise/50 rounded-lg overflow-hidden shadow-[0_0_50px_rgba(0,217,213,0.3)]">
                  {/* Terminal Header */}
                  <div className="flex items-center gap-3 px-4 py-3 bg-fiesta-turquoise/10 border-b border-fiesta-turquoise/30">
                    <div className="flex gap-2">
                      <div className="w-3 h-3 rounded-full bg-fiesta-pink" />
                      <div className="w-3 h-3 rounded-full bg-fiesta-orange" />
                      <div className="w-3 h-3 rounded-full bg-fiesta-turquoise" />
                    </div>
                    <span className="font-mono text-xs text-fiesta-turquoise">widget.tsx</span>
                  </div>
                  
                  {/* Code Content */}
                  <div className="p-6 font-mono text-sm">
                    <pre className="text-gray-300 leading-relaxed whitespace-pre overflow-x-auto">
                      <code>
                        <span className="text-fiesta-pink">import</span>{' '}
                        <span className="text-white">{'{'} React {'}'}</span>{' '}
                        <span className="text-fiesta-pink">from</span>{' '}
                        <span className="text-fiesta-orange">'jimu-core'</span>{'\n'}
                        <span className="text-fiesta-pink">import</span>{' '}
                        <span className="text-white">{'{'} JimuMapView {'}'}</span>{' '}
                        <span className="text-fiesta-pink">from</span>{' '}
                        <span className="text-fiesta-orange">'jimu-arcgis'</span>{'\n\n'}
                        <span className="text-fiesta-pink">const</span>{' '}
                        <span className="text-fiesta-turquoise">Widget</span>{' '}
                        = <span className="text-white">(props)</span>{' '}
                        <span className="text-fiesta-pink">=</span><span className="text-fiesta-pink">{'>'}</span> {'{'}{'\n'}
                        {'  '}<span className="text-fiesta-pink">const</span>{' '}
                        <span className="text-white">handleClick</span>{' '}
                        = <span className="text-fiesta-pink">async</span>{' '}
                        (view) <span className="text-fiesta-pink">=</span><span className="text-fiesta-pink">{'>'}</span> {'{'}{'\n'}
                        {'    '}<span className="text-gray-500">// AI-generated logic</span>{'\n'}
                        {'    '}<span className="text-fiesta-pink">const</span>{' '}
                        hit = <span className="text-fiesta-pink">await</span>{' '}
                        view.<span className="text-fiesta-turquoise">hitTest</span>(event){'\n'}
                        {'    '}<span className="text-white">showInfo</span>
                        (hit.results[<span className="text-fiesta-orange">0</span>]){'\n'}
                        {'  '}{'}'}{'\n\n'}
                        {'  '}<span className="text-fiesta-pink">return</span> ({'\n'}
                        {'    '}{'<'}<span className="text-fiesta-turquoise">JimuMapView</span>{' '}
                        <span className="text-white">onClick</span>={'{'}handleClick{'}'}{'>'}{'\n'}
                        {'      '}<span className="text-gray-500">{'{'}/* Your UI */{'}'}</span>{'\n'}
                        {'    '}{'</'}<span className="text-fiesta-turquoise">JimuMapView</span>{'>'}{'\n'}
                        {'  '}){'\n'}
                        {'}'}
                      </code>
                    </pre>
                  </div>
                  
                  {/* Generation Badge */}
                  <div className="absolute bottom-4 right-4 px-4 py-2 bg-black/80 border border-fiesta-turquoise rounded font-mono text-xs text-fiesta-turquoise flex items-center gap-2">
                    <div className="w-2 h-2 bg-fiesta-turquoise rounded-full animate-pulse" />
                    GENERATED: 47s
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* BMAD Process - Bold Diagonal Cards */}
      <section className="py-32 px-6 relative">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-fiesta-pink/10 border border-fiesta-pink/30 rounded-sm font-mono text-xs text-fiesta-pink mb-6">
              <Layers className="w-4 h-4" />
              <span className="tracking-wider">METHODOLOGY</span>
            </div>
            <h2 
              className="text-6xl md:text-7xl font-black mb-6 tracking-tighter"
              style={{ fontFamily: 'Orbitron, sans-serif' }}
            >
              <span className="text-white">4 STEPS</span>
              <br />
              <span style={{
                background: 'linear-gradient(135deg, #00D9D5 0%, #FF006E 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent'
              }}>
                IDEA → CODE
              </span>
            </h2>
          </div>

          {/* Diagonal Step Cards */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { 
                step: '01', 
                title: 'ANALYZE', 
                desc: 'Tell us what you need. Agent asks GIS-specific questions.',
                color: 'fiesta-turquoise',
                delay: '0ms'
              },
              { 
                step: '02', 
                title: 'SPECIFY', 
                desc: 'PM Agent writes the PRD. Requirements, UI specs, data flow.',
                color: 'fiesta-pink',
                delay: '100ms'
              },
              { 
                step: '03', 
                title: 'ARCHITECT', 
                desc: 'Technical design. Jimu components, state management, patterns.',
                color: 'fiesta-orange',
                delay: '200ms'
              },
              { 
                step: '04', 
                title: 'GENERATE', 
                desc: 'Download production code. Install in Developer Edition. Ship.',
                color: 'fiesta-turquoise',
                delay: '300ms'
              }
            ].map((phase, i) => (
              <div 
                key={i}
                className="group relative"
                style={{ animationDelay: phase.delay }}
              >
                {/* Diagonal Accent */}
                <div 
                  className={`absolute -top-4 -right-4 w-32 h-32 opacity-20 group-hover:opacity-40 transition-opacity`}
                  style={{
                    background: `linear-gradient(135deg, transparent 40%, var(--${phase.color}) 40%, var(--${phase.color}) 60%, transparent 60%)`,
                    transform: 'rotate(15deg)'
                  }}
                />
                
                <div className="relative bg-zinc-900/50 border border-zinc-800 hover:border-zinc-700 p-8 rounded-lg h-full transition-all group-hover:translate-y-[-4px]">
                  <div className={`text-6xl font-black font-mono text-${phase.color} mb-4 opacity-20`}>
                    {phase.step}
                  </div>
                  <h3 
                    className="text-2xl font-black mb-3 tracking-tight"
                    style={{ fontFamily: 'Orbitron, sans-serif' }}
                  >
                    {phase.title}
                  </h3>
                  <p className="text-gray-400 font-mono text-sm leading-relaxed">
                    {phase.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features - Asymmetric Grid */}
      <section id="features" className="py-32 px-6 relative bg-zinc-950/50">
        <div className="max-w-7xl mx-auto">
          <div className="mb-20">
            <h2 
              className="text-6xl md:text-7xl font-black mb-6 tracking-tighter max-w-3xl"
              style={{ fontFamily: 'Orbitron, sans-serif' }}
            >
              NOT YOUR
              <span className="block text-fiesta-pink">AVERAGE</span>
              <span className="block text-fiesta-turquoise">CODE GEN</span>
            </h2>
            <p className="text-xl text-gray-400 font-mono max-w-2xl">
              Built by GIS devs tired of explaining Jimu to ChatGPT for the 47th time.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {features.map((feature, i) => (
              <div 
                key={i}
                className="group relative bg-black border border-zinc-800 hover:border-fiesta-turquoise/50 p-10 rounded-lg transition-all hover:translate-y-[-4px]"
              >
                <div className="flex items-start gap-6">
                  <div className="w-16 h-16 bg-gradient-to-br from-fiesta-turquoise/20 to-fiesta-pink/20 rounded flex items-center justify-center text-fiesta-turquoise group-hover:scale-110 transition-transform flex-shrink-0">
                    {feature.icon}
                  </div>
                  <div>
                    <h3 className="text-2xl font-black mb-3 tracking-tight" style={{ fontFamily: 'Orbitron, sans-serif' }}>
                      {feature.title}
                    </h3>
                    <p className="text-gray-400 font-mono text-sm leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="proof" className="py-32 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-fiesta-orange/10 border border-fiesta-orange/30 rounded-sm font-mono text-xs text-fiesta-orange mb-6">
              <Users className="w-4 h-4" />
              <span className="tracking-wider">TESTIMONIALS</span>
            </div>
            <h2 
              className="text-6xl font-black tracking-tighter"
              style={{ fontFamily: 'Orbitron, sans-serif' }}
            >
              <span style={{
                background: 'linear-gradient(135deg, #FF6B35 0%, #FF006E 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent'
              }}>
                REAL DEVS
              </span>
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, i) => (
              <div 
                key={i}
                className="bg-zinc-900/50 border border-zinc-800 p-8 rounded-lg hover:border-zinc-700 transition-all"
              >
                <p className="text-gray-300 font-mono text-sm leading-relaxed mb-8 italic">
                  "{testimonial.quote}"
                </p>
                <div className="flex items-center gap-4">
                  <div 
                    className="w-14 h-14 rounded-full flex items-center justify-center font-black text-lg text-black"
                    style={{ 
                      background: i % 3 === 0 ? '#00D9D5' : i % 3 === 1 ? '#FF006E' : '#FF6B35'
                    }}
                  >
                    {testimonial.avatar}
                  </div>
                  <div>
                    <div className="font-bold">{testimonial.author}</div>
                    <div className="text-gray-500 text-sm font-mono">{testimonial.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-32 px-6 bg-zinc-950/50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-fiesta-turquoise/10 border border-fiesta-turquoise/30 rounded-sm font-mono text-xs text-fiesta-turquoise mb-6">
              <Terminal className="w-4 h-4" />
              <span className="tracking-wider">PRICING</span>
            </div>
            <h2 
              className="text-6xl md:text-7xl font-black mb-6 tracking-tighter"
              style={{ fontFamily: 'Orbitron, sans-serif' }}
            >
              PICK YOUR
              <span className="block text-fiesta-pink">TIER</span>
            </h2>
            <p className="text-xl text-gray-400 font-mono">
              Start free. Scale when ready. Cancel anytime.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {pricingPlans.map((plan, i) => (
              <div 
                key={i}
                className={cn(
                  "relative rounded-lg p-8 transition-all hover:translate-y-[-4px]",
                  plan.highlight 
                    ? 'bg-gradient-to-br from-fiesta-turquoise/10 to-fiesta-pink/10 border-2 border-fiesta-turquoise' 
                    : 'bg-zinc-900/50 border border-zinc-800 hover:border-zinc-700'
                )}
              >
                {plan.highlight && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-fiesta-turquoise text-black font-black text-xs rounded-sm font-mono">
                    POPULAR
                  </div>
                )}
                
                <div className="mb-8">
                  <h3 className="text-2xl font-black mb-2" style={{ fontFamily: 'Orbitron, sans-serif' }}>
                    {plan.name}
                  </h3>
                  <div className="flex items-baseline gap-1 mb-2">
                    {plan.price !== 'Custom' && <span className="text-gray-500 text-xl font-mono">$</span>}
                    <span className="text-5xl font-black font-mono">{plan.price}</span>
                    {plan.price !== 'Custom' && <span className="text-gray-500 font-mono">/mo</span>}
                  </div>
                  <p className="text-gray-400 text-sm font-mono">{plan.description}</p>
                </div>

                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature, j) => (
                    <li key={j} className="flex items-start gap-3 text-sm font-mono text-gray-300">
                      <Check className="w-5 h-5 text-fiesta-turquoise flex-shrink-0 mt-0.5" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>

                <button 
                  onClick={plan.highlight ? handleStartFree : undefined}
                  className={cn(
                    "w-full py-3 rounded font-bold font-mono transition-all",
                    plan.highlight 
                      ? 'bg-fiesta-turquoise text-black hover:bg-fiesta-pink hover:shadow-[0_0_30px_rgba(0,217,213,0.6)]' 
                      : 'bg-zinc-800 text-gray-300 hover:bg-zinc-700'
                  )}
                >
                  {plan.cta}
                </button>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <p className="text-gray-500 text-sm font-mono mb-2">14-day money-back • No lock-in</p>
          </div>
        </div>
      </section>

      {/* Final CTA - Bold */}
      <section className="py-32 px-6 relative overflow-hidden">
        {/* Massive Diagonal Stripe */}
        <div 
          className="absolute inset-0 opacity-10"
          style={{
            background: 'linear-gradient(135deg, transparent 30%, #00D9D5 30%, #00D9D5 35%, #FF006E 35%, #FF006E 40%, #FF6B35 40%, #FF6B35 45%, transparent 45%)'
          }}
        />
        
        <div className="max-w-5xl mx-auto text-center relative z-10">
          <h2 
            className="text-6xl md:text-8xl font-black mb-8 leading-[0.9] tracking-tighter"
            style={{ fontFamily: 'Orbitron, sans-serif' }}
          >
            <span className="text-white">MONOPOLY</span>
            <br />
            <span style={{
              background: 'linear-gradient(135deg, #00D9D5 0%, #FF006E 50%, #FF6B35 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}>
              BREAKING
            </span>
          </h2>
          
          <p className="text-2xl text-gray-300 font-mono mb-12 max-w-3xl mx-auto">
            2,847 devs building widgets without begging Esri for features.
            <br />
            <span className="text-fiesta-turquoise">You in or out?</span>
          </p>
          
          <div className="flex flex-wrap gap-6 justify-center">
            <button 
              onClick={handleStartFree}
              className="group px-14 py-6 bg-fiesta-turquoise text-black font-black text-xl rounded hover:bg-fiesta-pink transition-all hover:scale-105 hover:shadow-[0_0_50px_rgba(0,217,213,0.8)] relative overflow-hidden"
              style={{ fontFamily: 'Orbitron, sans-serif' }}
            >
              <span className="relative z-10 flex items-center gap-3">
                START FREE NOW
                <ChevronRight className="w-7 h-7 group-hover:translate-x-2 transition-transform" />
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-fiesta-pink to-fiesta-orange opacity-0 group-hover:opacity-100 transition-opacity" />
            </button>
          </div>

          <p className="text-gray-600 text-sm font-mono mt-8">
            No credit card • First widget in &lt;2min
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-zinc-900 py-12 px-6 bg-black">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-gradient-to-br from-fiesta-turquoise to-fiesta-pink rounded flex items-center justify-center font-black text-xl text-black">
                  V
                </div>
                <span className="font-black text-xl" style={{ fontFamily: 'Orbitron, sans-serif' }}>VibeGIS</span>
              </div>
              <p className="text-gray-500 text-sm font-mono leading-relaxed">
                AI-powered ExB widget generator that doesn't hallucinate.
              </p>
            </div>

            {[
              {
                title: 'Product',
                links: ['Features', 'Pricing', 'Docs', 'Changelog']
              },
              {
                title: 'Resources',
                links: ['BMAD Guide', 'Templates', 'Blog', 'Discord']
              },
              {
                title: 'Company',
                links: ['About', 'Manifesto', 'Contact', 'Careers']
              }
            ].map((section, i) => (
              <div key={i}>
                <h4 className="font-bold mb-3 text-fiesta-turquoise font-mono text-sm">{section.title}</h4>
                <ul className="space-y-2">
                  {section.links.map((link, j) => (
                    <li key={j}>
                      <a href="#" className="text-sm text-gray-400 hover:text-fiesta-turquoise transition-colors font-mono">
                        {link}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="border-t border-zinc-900 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-gray-500 text-sm font-mono">
              © 2025 VibeGIS • Built by devs, for devs
            </p>
            <div className="flex gap-6 text-sm text-gray-500 font-mono">
              <a href="#" className="hover:text-fiesta-turquoise transition-colors">Privacy</a>
              <a href="#" className="hover:text-fiesta-turquoise transition-colors">Terms</a>
              <a href="#" className="hover:text-fiesta-turquoise transition-colors">Security</a>
            </div>
          </div>
        </div>
      </footer>

      {/* Video Modal */}
      {isVideoOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-sm p-4">
          <div className="relative w-full max-w-4xl bg-zinc-900 rounded-lg overflow-hidden border-2 border-fiesta-turquoise">
            <button 
              onClick={() => setIsVideoOpen(false)}
              className="absolute top-4 right-4 z-10 w-12 h-12 bg-black/70 hover:bg-fiesta-turquoise/20 border border-fiesta-turquoise rounded flex items-center justify-center text-white transition-all"
            >
              <X className="w-6 h-6" />
            </button>
            <div className="aspect-video bg-gradient-to-br from-fiesta-turquoise/20 to-fiesta-pink/20 flex items-center justify-center">
              <div className="text-center">
                <div className="w-24 h-24 bg-fiesta-turquoise/20 rounded-full flex items-center justify-center mx-auto mb-4 border-2 border-fiesta-turquoise">
                  <div className="w-0 h-0 border-t-12 border-t-transparent border-l-16 border-l-fiesta-turquoise border-b-12 border-b-transparent ml-2" />
                </div>
                <p className="text-gray-400 font-mono text-sm">Demo coming soon</p>
              </div>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;500;600;700;800;900&family=IBM+Plex+Mono:wght@400;500;600;700&display=swap');
        
        :root {
          --fiesta-turquoise: #00D9D5;
          --fiesta-pink: #FF006E;
          --fiesta-orange: #FF6B35;
        }
        
        @keyframes scan {
          0% { transform: translateY(0); }
          100% { transform: translateY(100%); }
        }
        
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        
        .animate-shimmer {
          animation: shimmer 3s infinite;
        }
      `}</style>
    </div>
  );
}
