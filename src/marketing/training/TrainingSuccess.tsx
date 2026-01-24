/**
 * Training Success Page
 * Shown after successful Stripe checkout for training enrollment
 */

import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle, Calendar, Mail, ArrowRight, BookOpen } from 'lucide-react';

export default function TrainingSuccess() {
  const [showConfetti, setShowConfetti] = useState(true);

  useEffect(() => {
    // Hide confetti after animation
    const timer = setTimeout(() => setShowConfetti(false), 3000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen bg-[#f5f3eb] relative overflow-hidden">
      {/* Confetti Animation */}
      {showConfetti && (
        <div className="fixed inset-0 pointer-events-none z-50">
          {[...Array(50)].map((_, i) => (
            <div
              key={i}
              className="absolute animate-confetti"
              style={{
                left: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 0.5}s`,
                backgroundColor: ['#00D9D5', '#FF006E', '#FF6B35', '#2563eb'][Math.floor(Math.random() * 4)],
                width: '10px',
                height: '10px',
                borderRadius: Math.random() > 0.5 ? '50%' : '0',
              }}
            />
          ))}
        </div>
      )}

      {/* Blueprint Grid Background */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `
            linear-gradient(#1e3a5f 1px, transparent 1px),
            linear-gradient(90deg, #1e3a5f 1px, transparent 1px)
          `,
          backgroundSize: '40px 40px',
        }}
      />

      {/* Content */}
      <div className="relative z-10 min-h-screen flex items-center justify-center px-4 py-16">
        <div className="max-w-2xl w-full">
          {/* Success Card */}
          <div className="bg-white rounded-lg border-2 border-[#1e3a5f]/20 shadow-xl p-8 md:p-12 text-center">
            {/* Success Icon */}
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-emerald-100 mb-6">
              <CheckCircle className="w-12 h-12 text-emerald-600" />
            </div>

            {/* Heading */}
            <h1
              className="text-3xl md:text-4xl font-bold text-[#1e3a5f] mb-4"
              style={{ fontFamily: "'Instrument Serif', serif" }}
            >
              You're In!
            </h1>

            <p
              className="text-xl text-[#1e3a5f]/70 mb-8"
              style={{ fontFamily: "'IBM Plex Mono', monospace" }}
            >
              Welcome to the VibeGIS Training cohort
            </p>

            {/* What Happens Next */}
            <div className="bg-[#f5f3eb] rounded-lg p-6 mb-8 text-left">
              <h2
                className="text-lg font-semibold text-[#1e3a5f] mb-4 flex items-center gap-2"
                style={{ fontFamily: "'IBM Plex Mono', monospace" }}
              >
                <Calendar className="w-5 h-5 text-[#00D9D5]" />
                What happens next
              </h2>

              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-[#1e3a5f] text-white text-sm flex items-center justify-center font-medium">1</span>
                  <div>
                    <p className="text-[#1e3a5f] font-medium">Check your email</p>
                    <p className="text-[#1e3a5f]/60 text-sm">You'll receive a confirmation with your receipt and cohort details within 5 minutes.</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-[#1e3a5f] text-white text-sm flex items-center justify-center font-medium">2</span>
                  <div>
                    <p className="text-[#1e3a5f] font-medium">Join the Slack community</p>
                    <p className="text-[#1e3a5f]/60 text-sm">You'll get an invite to our private Slack workspace where you can connect with fellow participants.</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-[#1e3a5f] text-white text-sm flex items-center justify-center font-medium">3</span>
                  <div>
                    <p className="text-[#1e3a5f] font-medium">Pre-work materials</p>
                    <p className="text-[#1e3a5f]/60 text-sm">One week before your cohort starts, you'll receive preparation materials and setup instructions.</p>
                  </div>
                </li>
              </ul>
            </div>

            {/* Contact Info */}
            <div className="flex items-center justify-center gap-2 text-[#1e3a5f]/60 mb-8">
              <Mail className="w-4 h-4" />
              <span style={{ fontFamily: "'IBM Plex Mono', monospace" }}>
                Questions? <a href="mailto:craig@futurebridgeai.com.au" className="text-[#00D9D5] hover:underline">craig@futurebridgeai.com.au</a>
              </span>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-[#1e3a5f] text-white rounded-lg hover:bg-[#1e3a5f]/90 transition-colors"
                style={{ fontFamily: "'IBM Plex Mono', monospace" }}
              >
                <BookOpen className="w-4 h-4" />
                Explore VibeGIS
              </Link>
              <a
                href="https://docs.vibegis.com"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 border-2 border-[#1e3a5f]/20 text-[#1e3a5f] rounded-lg hover:border-[#1e3a5f]/40 transition-colors"
                style={{ fontFamily: "'IBM Plex Mono', monospace" }}
              >
                Read the Docs
                <ArrowRight className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Footer Note */}
          <p
            className="text-center text-[#1e3a5f]/50 mt-8 text-sm"
            style={{ fontFamily: "'IBM Plex Mono', monospace" }}
          >
            A receipt has been sent to your email address.
          </p>
        </div>
      </div>

      {/* Confetti Animation Styles */}
      <style>{`
        @keyframes confetti-fall {
          0% {
            transform: translateY(-100vh) rotate(0deg);
            opacity: 1;
          }
          100% {
            transform: translateY(100vh) rotate(720deg);
            opacity: 0;
          }
        }
        .animate-confetti {
          animation: confetti-fall 3s ease-out forwards;
        }
      `}</style>
    </div>
  );
}
