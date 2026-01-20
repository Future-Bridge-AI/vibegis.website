import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Check, Code, Zap, Shield, Users, ChevronRight, X } from 'lucide-react';
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
  const [selectedPlan, setSelectedPlan] = useState('professional');
  const [isVideoOpen, setIsVideoOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const features: Feature[] = [
    {
      icon: <Zap className="w-6 h-6" />,
      title: "GIS-Native AI Agents",
      description: "Purpose-built agents that understand ArcGIS context, not generic code generators"
    },
    {
      icon: <Code className="w-6 h-6" />,
      title: "BMAD Methodology",
      description: "Structured workflow from business requirements to production-ready widgets"
    },
    {
      icon: <Shield className="w-6 h-6" />,
      title: "ExB 1.19 Ready",
      description: "Generate React 19 compatible widgets for the latest Experience Builder"
    },
    {
      icon: <Users className="w-6 h-6" />,
      title: "Context7 Integration",
      description: "Real-time access to ArcGIS documentation and best practices"
    }
  ];

  const pricingPlans: PricingPlan[] = [
    {
      name: "Free",
      price: "0",
      description: "Test the waters",
      features: [
        "1 widget generation per month",
        "Basic templates",
        "Community support",
        "ExB 1.19 compatible code"
      ],
      cta: "Start Free",
      highlight: false
    },
    {
      name: "Starter",
      price: "99",
      description: "For solo developers",
      features: [
        "10 widget generations per month",
        "All widget templates",
        "Priority support",
        "Custom styling options",
        "Project history"
      ],
      cta: "Start Building",
      highlight: false
    },
    {
      name: "Professional",
      price: "299",
      description: "For teams & agencies",
      features: [
        "Unlimited generations",
        "Advanced AI agents",
        "White-label exports",
        "Team collaboration",
        "Custom agent training",
        "API access"
      ],
      cta: "Go Pro",
      highlight: true
    },
    {
      name: "Enterprise",
      price: "Custom",
      description: "For organizations",
      features: [
        "Everything in Professional",
        "Dedicated support",
        "Custom integrations",
        "SLA guarantees",
        "On-premise deployment",
        "Training & onboarding"
      ],
      cta: "Contact Sales",
      highlight: false
    }
  ];

  const testimonials: Testimonial[] = [
    {
      quote: "Reduced our widget development time from days to minutes. VibeGIS gets ArcGIS in a way other AI tools don't.",
      author: "Sarah Chen",
      role: "GIS Developer, Resource Co.",
      avatar: "SC"
    },
    {
      quote: "Finally, an AI tool that doesn't fight with Jimu framework. The generated code just works.",
      author: "Marcus Rodriguez",
      role: "Solutions Architect, PowerGrid Systems",
      avatar: "MR"
    },
    {
      quote: "We've built 20+ custom widgets in a month. Our clients think we hired more developers.",
      author: "Aisha Patel",
      role: "Founder, GeoSolutions Agency",
      avatar: "AP"
    }
  ];

  const handleStartFree = () => {
    navigate('/generator');
  };

  const handleWatchDemo = () => {
    setIsVideoOpen(true);
  };

  return (
    <div className="min-h-screen bg-geodark text-gray-100 font-sans relative overflow-hidden">
      {/* Animated Grid Background */}
      <div 
        className="fixed inset-0 opacity-20 pointer-events-none"
        style={{
          backgroundImage: `
            linear-gradient(rgba(0, 255, 255, 0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0, 255, 255, 0.1) 1px, transparent 1px)
          `,
          backgroundSize: '50px 50px',
          transform: `translateY(${scrollY * 0.5}px)`
        }}
      />

      {/* Coordinate Overlay */}
      <div className="fixed top-4 left-4 font-mono text-xs text-neon-cyan opacity-40 pointer-events-none z-50">
        <div>LAT: -31.9505° S</div>
        <div>LON: 115.8605° E</div>
        <div>ZOOM: {Math.min(18, Math.floor(scrollY / 100) + 1)}</div>
      </div>

      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-neon-cyan/20 backdrop-blur-xl bg-geodark/80">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-neon-cyan to-neon-purple rounded-lg flex items-center justify-center font-black text-geodark text-xl relative">
              V
              <div className="absolute inset-0 bg-neon-cyan/20 animate-ping rounded-lg" />
            </div>
            <div>
              <div className="font-black text-xl tracking-tight">VibeGIS</div>
              <div className="text-[10px] text-neon-cyan font-mono tracking-wider">ARCGIS.AI</div>
            </div>
          </div>
          
          <div className="hidden md:flex items-center gap-8 font-mono text-sm">
            <a href="#features" className="text-gray-400 hover:text-neon-cyan transition-colors">Features</a>
            <a href="#pricing" className="text-gray-400 hover:text-neon-cyan transition-colors">Pricing</a>
            <a href="#testimonials" className="text-gray-400 hover:text-neon-cyan transition-colors">Proof</a>
            <button 
              onClick={handleStartFree}
              className="px-6 py-2 bg-neon-cyan text-geodark font-bold rounded hover:bg-neon-cyan/90 transition-all hover:shadow-glow-cyan"
            >
              Start Free
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-6 overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8 animate-fadeInUp">
              {/* Rebel Badge */}
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-neon-purple/20 to-neon-cyan/20 border border-neon-purple/30 rounded-full font-mono text-xs text-neon-purple">
                <div className="w-2 h-2 bg-neon-purple rounded-full animate-ping" />
                THE UNDERGROUND RAILROAD TO BETTER GIS DEV
              </div>

              <h1 className="text-6xl md:text-7xl font-black leading-[0.95] tracking-tight">
                Build ArcGIS Widgets
                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-neon-cyan via-neon-purple to-neon-pink mt-2">
                  Without the BS
                </span>
              </h1>

              <p className="text-xl text-gray-400 leading-relaxed max-w-xl">
                AI-powered assistant that guides you from idea to production-ready Experience Builder widgets. 
                <span className="text-neon-cyan font-semibold"> If not us, it'll be Big AI.</span> We're taking you with us.
              </p>

              <div className="flex flex-wrap gap-4">
                <button 
                  onClick={handleStartFree}
                  className="group px-8 py-4 bg-gradient-to-r from-neon-cyan to-neon-purple text-white font-bold rounded-lg hover:shadow-glow-cyan transition-all flex items-center gap-2"
                >
                  Generate Your First Widget
                  <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </button>
                <button 
                  onClick={handleWatchDemo}
                  className="px-8 py-4 border-2 border-neon-cyan/50 text-neon-cyan font-bold rounded-lg hover:bg-neon-cyan/10 transition-all"
                >
                  Watch Demo
                </button>
              </div>

              {/* Trust Signals */}
              <div className="flex items-center gap-6 pt-4 border-t border-gray-800">
                <div className="flex -space-x-3">
                  {['#0ea5e9', '#8b5cf6', '#ec4899', '#10b981'].map((color, i) => (
                    <div 
                      key={i}
                      className="w-10 h-10 rounded-full border-2 border-geodark flex items-center justify-center text-sm font-bold"
                      style={{ backgroundColor: color }}
                    >
                      {String.fromCharCode(65 + i)}
                    </div>
                  ))}
                </div>
                <div className="font-mono text-sm">
                  <div className="text-neon-cyan font-bold">2,847+ widgets</div>
                  <div className="text-gray-500 text-xs">generated this month</div>
                </div>
              </div>
            </div>

            {/* Code Preview */}
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-neon-cyan/20 to-neon-purple/20 blur-3xl" />
              <div className="relative bg-[#1a1f2e] border border-neon-cyan/30 rounded-lg p-6 shadow-2xl font-mono text-sm overflow-hidden">
                <div className="flex items-center gap-2 mb-4 pb-3 border-b border-gray-800">
                  <div className="w-3 h-3 bg-red-500 rounded-full" />
                  <div className="w-3 h-3 bg-yellow-500 rounded-full" />
                  <div className="w-3 h-3 bg-green-500 rounded-full" />
                  <span className="ml-2 text-gray-500 text-xs">widget.tsx</span>
                </div>
                <pre className="text-xs leading-relaxed text-gray-300">
{`import { React } from 'jimu-core'
import { JimuMapView } from 'jimu-arcgis'

const Widget = (props) => {
  const handleMapClick = async (view) => {
    const response = await view.hitTest(
      event
    )
    // AI-generated logic here
    showFeatureInfo(response.results[0])
  }

  return (
    <JimuMapView onClick={handleMapClick}>
      {/* Your custom UI */}
    </JimuMapView>
  )
}`}
                </pre>
                <div className="absolute bottom-4 right-4 px-3 py-1 bg-neon-cyan/20 border border-neon-cyan rounded text-neon-cyan text-xs font-bold">
                  GENERATED IN 47s
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 px-6 relative">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-block font-mono text-sm text-neon-cyan mb-4 px-4 py-1 border border-neon-cyan/30 rounded-full">
              BMAD METHODOLOGY
            </div>
            <h2 className="text-5xl font-black mb-4">
              From Idea to Code in <span className="text-transparent bg-clip-text bg-gradient-to-r from-neon-cyan to-neon-purple">4 Steps</span>
            </h2>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              GIS-aware AI agents guide you through a structured workflow that actually understands ArcGIS
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-6">
            {[
              { step: '01', title: 'ANALYZE', desc: 'Describe your widget idea. Our Analyst Agent asks GIS-specific questions.' },
              { step: '02', title: 'SPECIFY', desc: 'PM Agent generates PRD with functional requirements and UI specs.' },
              { step: '03', title: 'ARCHITECT', desc: 'Architect Agent defines Jimu structure and technical approach.' },
              { step: '04', title: 'GENERATE', desc: 'Developer Agent creates production-ready widget code. Download & install.' }
            ].map((phase, i) => (
              <div 
                key={i}
                className="bg-gradient-to-br from-[#1a1f2e] to-[#0f1419] border border-neon-cyan/20 rounded-lg p-6 hover:border-neon-cyan/50 transition-all group relative overflow-hidden"
                style={{ animationDelay: `${i * 0.1}s` }}
              >
                <div className="absolute top-0 right-0 text-[120px] font-black text-neon-cyan/5 leading-none">
                  {phase.step}
                </div>
                <div className="relative">
                  <div className="text-4xl font-black text-neon-cyan mb-3 font-mono">{phase.step}</div>
                  <h3 className="text-xl font-bold mb-2 group-hover:text-neon-cyan transition-colors">{phase.title}</h3>
                  <p className="text-gray-400 text-sm leading-relaxed">{phase.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="py-20 px-6 bg-gradient-to-b from-transparent to-[#0f1419]">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-black mb-4">
              Not Your Average <span className="text-transparent bg-clip-text bg-gradient-to-r from-neon-cyan to-neon-purple">Code Generator</span>
            </h2>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              Built by GIS developers who are tired of fighting with generic AI tools that don't understand Jimu
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, i) => (
              <div 
                key={i}
                className="bg-[#1a1f2e] border border-gray-800 rounded-lg p-6 hover:border-neon-cyan/50 transition-all group"
              >
                <div className="w-12 h-12 bg-gradient-to-br from-neon-cyan/20 to-neon-purple/20 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform text-neon-cyan">
                  {feature.icon}
                </div>
                <h3 className="text-lg font-bold mb-2">{feature.title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-block font-mono text-sm text-neon-cyan mb-4 px-4 py-1 border border-neon-cyan/30 rounded-full">
              SOCIAL PROOF
            </div>
            <h2 className="text-5xl font-black mb-4">
              Developers Who <span className="text-transparent bg-clip-text bg-gradient-to-r from-neon-cyan to-neon-purple">Get It</span>
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((testimonial, i) => (
              <div 
                key={i}
                className="bg-gradient-to-br from-[#1a1f2e] to-[#0f1419] border border-neon-cyan/20 rounded-lg p-6 hover:border-neon-cyan/50 transition-all"
              >
                <p className="text-gray-300 leading-relaxed mb-6 italic">"{testimonial.quote}"</p>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-neon-cyan to-neon-purple rounded-full flex items-center justify-center font-bold text-sm">
                    {testimonial.avatar}
                  </div>
                  <div>
                    <div className="font-bold">{testimonial.author}</div>
                    <div className="text-gray-500 text-sm">{testimonial.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-20 px-6 bg-gradient-to-b from-[#0f1419] to-transparent">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-block font-mono text-sm text-neon-cyan mb-4 px-4 py-1 border border-neon-cyan/30 rounded-full">
              TRANSPARENT PRICING
            </div>
            <h2 className="text-5xl font-black mb-4">
              Choose Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-neon-cyan to-neon-purple">Revolution</span>
            </h2>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              Start free. Scale when you're ready. No hidden fees. No vendor lock-in.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {pricingPlans.map((plan, i) => (
              <div 
                key={i}
                className={cn(
                  "relative bg-gradient-to-br rounded-lg p-6 hover:border-neon-cyan/50 transition-all",
                  plan.highlight 
                    ? 'from-neon-cyan/10 to-neon-purple/10 border-2 border-neon-cyan scale-105' 
                    : 'from-[#1a1f2e] to-[#0f1419] border border-gray-800'
                )}
              >
                {plan.highlight && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 bg-gradient-to-r from-neon-cyan to-neon-purple rounded-full text-xs font-bold">
                    MOST POPULAR
                  </div>
                )}
                <div className="mb-6">
                  <h3 className="text-2xl font-black mb-2">{plan.name}</h3>
                  <div className="flex items-baseline gap-1 mb-2">
                    {plan.price !== 'Custom' && <span className="text-gray-500 text-xl">$</span>}
                    <span className="text-5xl font-black">{plan.price}</span>
                    {plan.price !== 'Custom' && <span className="text-gray-500">/mo</span>}
                  </div>
                  <p className="text-gray-400 text-sm">{plan.description}</p>
                </div>

                <ul className="space-y-3 mb-6">
                  {plan.features.map((feature, j) => (
                    <li key={j} className="flex items-start gap-2 text-sm text-gray-300">
                      <Check className="w-5 h-5 text-neon-cyan flex-shrink-0 mt-0.5" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>

                <button 
                  onClick={plan.highlight ? handleStartFree : undefined}
                  className={cn(
                    "w-full py-3 rounded-lg font-bold transition-all",
                    plan.highlight 
                      ? 'bg-gradient-to-r from-neon-cyan to-neon-purple text-white hover:shadow-glow-cyan' 
                      : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                  )}
                >
                  {plan.cta}
                </button>
              </div>
            ))}
          </div>

          <div className="text-center">
            <p className="text-gray-500 text-sm mb-2">All plans include 14-day money-back guarantee</p>
            <p className="text-neon-cyan text-sm font-mono">Need volume pricing? <a href="#" className="underline">Let's talk</a></p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-neon-cyan/10 via-neon-purple/10 to-neon-pink/10" />
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <h2 className="text-5xl md:text-6xl font-black mb-6 leading-tight">
            The Monopoly is Breaking.
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-neon-cyan to-neon-purple mt-2">
              Are You In?
            </span>
          </h2>
          <p className="text-xl text-gray-400 mb-8 max-w-2xl mx-auto">
            Join 2,847+ GIS developers who refuse to wait for Big AI to eat the industry. 
            Build faster. Ship better. Stay human.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <button 
              onClick={handleStartFree}
              className="group px-10 py-5 bg-gradient-to-r from-neon-cyan to-neon-purple text-white text-lg font-bold rounded-lg hover:shadow-glow-cyan transition-all flex items-center gap-2"
            >
              Start Building Free
              <ChevronRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
            </button>
            <button className="px-10 py-5 border-2 border-neon-cyan/50 text-neon-cyan text-lg font-bold rounded-lg hover:bg-neon-cyan/10 transition-all">
              Book Demo
            </button>
          </div>

          <p className="text-gray-600 text-sm mt-6 font-mono">
            No credit card required • Generate your first widget in under 2 minutes
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-800 py-12 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 bg-gradient-to-br from-neon-cyan to-neon-purple rounded-lg flex items-center justify-center font-black text-geodark">
                  V
                </div>
                <span className="font-black text-lg">VibeGIS</span>
              </div>
              <p className="text-gray-500 text-sm leading-relaxed">
                The AI-powered ArcGIS development assistant that gets it.
              </p>
            </div>

            <div>
              <h4 className="font-bold mb-3 text-neon-cyan">Product</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="#features" className="hover:text-neon-cyan transition-colors">Features</a></li>
                <li><a href="#pricing" className="hover:text-neon-cyan transition-colors">Pricing</a></li>
                <li><a href="#" className="hover:text-neon-cyan transition-colors">Documentation</a></li>
                <li><a href="#" className="hover:text-neon-cyan transition-colors">Changelog</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold mb-3 text-neon-cyan">Resources</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="#" className="hover:text-neon-cyan transition-colors">BMAD Guide</a></li>
                <li><a href="#" className="hover:text-neon-cyan transition-colors">Widget Examples</a></li>
                <li><a href="#" className="hover:text-neon-cyan transition-colors">Blog</a></li>
                <li><a href="#" className="hover:text-neon-cyan transition-colors">Community</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold mb-3 text-neon-cyan">Company</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="#" className="hover:text-neon-cyan transition-colors">About</a></li>
                <li><a href="#" className="hover:text-neon-cyan transition-colors">Manifesto</a></li>
                <li><a href="#" className="hover:text-neon-cyan transition-colors">Contact</a></li>
                <li><a href="#" className="hover:text-neon-cyan transition-colors">Careers</a></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-gray-500 text-sm font-mono">
              © 2025 VibeGIS. Built by developers, for developers.
            </p>
            <div className="flex gap-6 text-sm text-gray-500">
              <a href="#" className="hover:text-neon-cyan transition-colors">Privacy</a>
              <a href="#" className="hover:text-neon-cyan transition-colors">Terms</a>
              <a href="#" className="hover:text-neon-cyan transition-colors">Security</a>
            </div>
          </div>
        </div>
      </footer>

      {/* Video Modal */}
      {isVideoOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="relative w-full max-w-4xl bg-[#1a1f2e] rounded-lg overflow-hidden border-2 border-neon-cyan/50">
            <button 
              onClick={() => setIsVideoOpen(false)}
              className="absolute top-4 right-4 z-10 w-10 h-10 bg-black/50 hover:bg-black/70 rounded-full flex items-center justify-center text-white transition-all"
            >
              <X className="w-6 h-6" />
            </button>
            <div className="aspect-video bg-gradient-to-br from-neon-cyan/20 to-neon-purple/20 flex items-center justify-center">
              <div className="text-center">
                <div className="w-20 h-20 bg-neon-cyan/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <div className="w-0 h-0 border-t-8 border-t-transparent border-l-12 border-l-neon-cyan border-b-8 border-b-transparent ml-1" />
                </div>
                <p className="text-gray-400 font-mono text-sm">Demo video coming soon</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
