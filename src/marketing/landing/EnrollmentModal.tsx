/**
 * Enrollment Modal
 * Multi-step flow: Select Cohort → Select Tier → Checkout
 */

import { useState, useEffect, useCallback } from 'react';
import {
  X,
  Calendar,
  Users,
  Check,
  ArrowRight,
  ArrowLeft,
  AlertCircle,
  Loader2,
} from 'lucide-react';
import {
  generateCohorts,
  formatCohortDate,
  getAvailableSeats,
  PRICING_TIERS,
  buildStripeCheckoutUrl,
  type Cohort,
  type PricingTier,
} from '@/lib/cohorts';

interface EnrollmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialTier?: string;
}

type Step = 'cohort' | 'tier' | 'checkout';

// Analytics tracking
const track = (event: string, data?: Record<string, unknown>) => {
  console.log('[Analytics]', event, data);
  // TODO: Wire to actual analytics
};

export function EnrollmentModal({ isOpen, onClose, initialTier }: EnrollmentModalProps) {
  const [step, setStep] = useState<Step>('cohort');
  const [selectedCohort, setSelectedCohort] = useState<Cohort | null>(null);
  const [selectedTier, setSelectedTier] = useState<PricingTier | null>(
    initialTier ? PRICING_TIERS.find((t) => t.id === initialTier) ?? null : null
  );
  const [cohorts, setCohorts] = useState<Cohort[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState('');

  // Load cohorts on mount
  useEffect(() => {
    setCohorts(generateCohorts(6));
  }, []);

  // Reset when modal opens
  useEffect(() => {
    if (isOpen) {
      setStep('cohort');
      setSelectedCohort(null);
      if (initialTier) {
        setSelectedTier(PRICING_TIERS.find((t) => t.id === initialTier) ?? null);
      }
      track('enrollment_modal_open', { initialTier });
    }
  }, [isOpen, initialTier]);

  // Handle escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  const handleCohortSelect = useCallback((cohort: Cohort) => {
    setSelectedCohort(cohort);
    track('cohort_selected', { cohortId: cohort.id, startDate: cohort.startDate.toISOString() });
  }, []);

  const handleTierSelect = useCallback((tier: PricingTier) => {
    setSelectedTier(tier);
    track('tier_selected', { tierId: tier.id, price: tier.price });
  }, []);

  const handleNext = useCallback(() => {
    if (step === 'cohort' && selectedCohort) {
      setStep('tier');
    } else if (step === 'tier' && selectedTier) {
      setStep('checkout');
    }
  }, [step, selectedCohort, selectedTier]);

  const handleBack = useCallback(() => {
    if (step === 'tier') {
      setStep('cohort');
    } else if (step === 'checkout') {
      setStep('tier');
    }
  }, [step]);

  const handleCheckout = useCallback(() => {
    if (!selectedCohort || !selectedTier) return;

    setIsLoading(true);
    track('checkout_initiated', {
      cohortId: selectedCohort.id,
      tierId: selectedTier.id,
      email,
    });

    // For enterprise, send email directly
    if (selectedTier.id === 'enterprise') {
      const subject = encodeURIComponent('VibeGIS Enterprise Training Enquiry');
      const body = encodeURIComponent(`
Hi Craig,

I'm interested in the Enterprise training package for my organisation.

Preferred Cohort: ${selectedCohort.label} - Starting ${formatCohortDate(selectedCohort.startDate)}

Please contact me to discuss our requirements.

Thanks!
      `.trim());
      window.location.href = `mailto:craig@futurebridgeai.com.au?subject=${subject}&body=${body}`;
      setIsLoading(false);
      return;
    }

    // Build Stripe Payment Link URL with prefilled cohort and email
    const checkoutUrl = buildStripeCheckoutUrl(selectedTier, selectedCohort, email || undefined);

    // Redirect to Stripe
    setTimeout(() => {
      window.location.href = checkoutUrl;
      // Note: Don't reset loading since we're navigating away
    }, 300);
  }, [selectedCohort, selectedTier, email]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="enrollment-title"
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal */}
      <div
        className="relative w-full max-w-[600px] max-h-[90vh] overflow-y-auto"
        style={{
          background: 'var(--paper)',
          border: '2px solid var(--ink)',
          boxShadow: '8px 8px 0 var(--ink)',
        }}
      >
        {/* Header */}
        <div
          className="sticky top-0 z-10 flex items-center justify-between px-6 py-4 border-b"
          style={{ background: 'var(--paper)', borderColor: 'var(--border)' }}
        >
          <div>
            <h2
              id="enrollment-title"
              className="text-[1.1rem] font-semibold"
              style={{ fontFamily: 'var(--serif)' }}
            >
              {step === 'cohort' && 'Select Your Cohort'}
              {step === 'tier' && 'Choose Your Plan'}
              {step === 'checkout' && 'Complete Enrolment'}
            </h2>
            <p className="text-[0.72rem]" style={{ color: 'var(--ink-faded)' }}>
              {step === 'cohort' && 'Each cohort has 10 seats maximum'}
              {step === 'tier' && 'All plans include 6 live sessions'}
              {step === 'checkout' && 'Review and proceed to payment'}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 transition-colors hover:bg-[var(--paper-warm)]"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" style={{ color: 'var(--ink-faded)' }} />
          </button>
        </div>

        {/* Progress Steps */}
        <div className="px-6 py-3 border-b" style={{ borderColor: 'var(--border)' }}>
          <div className="flex items-center gap-2 text-[0.68rem]">
            {['cohort', 'tier', 'checkout'].map((s, i) => (
              <div key={s} className="flex items-center gap-2">
                <span
                  className="w-5 h-5 flex items-center justify-center text-[0.6rem] font-semibold"
                  style={{
                    background:
                      step === s
                        ? 'var(--pencil)'
                        : i < ['cohort', 'tier', 'checkout'].indexOf(step)
                          ? 'var(--success)'
                          : 'var(--paper-lines)',
                    color:
                      step === s || i < ['cohort', 'tier', 'checkout'].indexOf(step)
                        ? 'white'
                        : 'var(--ink-faded)',
                  }}
                >
                  {i < ['cohort', 'tier', 'checkout'].indexOf(step) ? (
                    <Check className="w-3 h-3" />
                  ) : (
                    i + 1
                  )}
                </span>
                <span
                  style={{
                    color: step === s ? 'var(--ink)' : 'var(--ink-faded)',
                    fontWeight: step === s ? 600 : 400,
                  }}
                >
                  {s === 'cohort' && 'Cohort'}
                  {s === 'tier' && 'Plan'}
                  {s === 'checkout' && 'Checkout'}
                </span>
                {i < 2 && (
                  <span className="mx-2" style={{ color: 'var(--border)' }}>
                    →
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Step 1: Cohort Selection */}
          {step === 'cohort' && (
            <div className="space-y-3">
              {cohorts.map((cohort) => {
                const availableSeats = getAvailableSeats(cohort.id);
                const isAvailable = cohort.status !== 'started' && cohort.status !== 'full';
                const isSelected = selectedCohort?.id === cohort.id;

                return (
                  <button
                    key={cohort.id}
                    onClick={() => isAvailable && handleCohortSelect(cohort)}
                    disabled={!isAvailable}
                    className={`w-full p-4 text-left transition-all ${
                      isAvailable ? 'cursor-pointer' : 'cursor-not-allowed opacity-50'
                    }`}
                    style={{
                      background: isSelected ? 'var(--pencil-light)' : 'var(--paper)',
                      border: `2px solid ${isSelected ? 'var(--pencil)' : 'var(--border)'}`,
                    }}
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-start gap-3">
                        <div
                          className="w-10 h-10 flex items-center justify-center shrink-0"
                          style={{
                            background: isSelected ? 'var(--pencil)' : 'var(--paper-warm)',
                            color: isSelected ? 'white' : 'var(--pencil)',
                          }}
                        >
                          <Calendar className="w-5 h-5" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span
                              className="font-semibold"
                              style={{ fontFamily: 'var(--serif)', color: 'var(--ink)' }}
                            >
                              {cohort.label}
                            </span>
                            {cohort.status === 'filling' && (
                              <span
                                className="px-1.5 py-0.5 text-[0.6rem] font-semibold"
                                style={{ background: 'var(--highlight)', color: 'var(--ink)' }}
                              >
                                Filling Fast
                              </span>
                            )}
                            {cohort.status === 'started' && (
                              <span
                                className="px-1.5 py-0.5 text-[0.6rem]"
                                style={{ background: 'var(--paper-lines)', color: 'var(--ink-faded)' }}
                              >
                                Already Started
                              </span>
                            )}
                          </div>
                          <p className="text-[0.78rem]" style={{ color: 'var(--ink-faded)' }}>
                            Starts {formatCohortDate(cohort.startDate)}
                          </p>
                          <p className="text-[0.72rem] mt-1" style={{ color: 'var(--ink-ghost)' }}>
                            6 weeks • Fridays 8:00 AM AWST
                          </p>
                        </div>
                      </div>
                      <div className="text-right shrink-0">
                        <div className="flex items-center gap-1 text-[0.78rem]" style={{ color: 'var(--ink-soft)' }}>
                          <Users className="w-4 h-4" />
                          <span
                            style={{
                              fontFamily: 'var(--handwritten)',
                              fontSize: '1.1rem',
                              color: availableSeats <= 3 ? 'var(--redline)' : 'var(--pencil)',
                            }}
                          >
                            {availableSeats}
                          </span>
                          <span className="text-[0.68rem]" style={{ color: 'var(--ink-ghost)' }}>
                            / 10
                          </span>
                        </div>
                        <p className="text-[0.68rem]" style={{ color: 'var(--ink-ghost)' }}>
                          seats left
                        </p>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          )}

          {/* Step 2: Tier Selection */}
          {step === 'tier' && (
            <div className="space-y-3">
              {PRICING_TIERS.map((tier) => {
                const isSelected = selectedTier?.id === tier.id;

                return (
                  <button
                    key={tier.id}
                    onClick={() => handleTierSelect(tier)}
                    className="w-full p-4 text-left transition-all cursor-pointer"
                    style={{
                      background: isSelected ? 'var(--pencil-light)' : 'var(--paper)',
                      border: `2px solid ${isSelected ? 'var(--pencil)' : 'var(--border)'}`,
                    }}
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span
                            className="font-semibold text-[1rem]"
                            style={{ fontFamily: 'var(--serif)', color: 'var(--ink)' }}
                          >
                            {tier.name}
                          </span>
                          {tier.id === 'team' && (
                            <span
                              className="px-1.5 py-0.5 text-[0.6rem] font-semibold"
                              style={{ background: 'var(--redline)', color: 'white' }}
                            >
                              Best Value
                            </span>
                          )}
                          {tier.originalPrice > tier.price && (
                            <span
                              className="px-1.5 py-0.5 text-[0.6rem] font-semibold"
                              style={{ background: 'var(--highlight)', color: 'var(--ink)' }}
                            >
                              Launch Special
                            </span>
                          )}
                        </div>
                        <p className="text-[0.78rem] mb-2" style={{ color: 'var(--ink-faded)' }}>
                          {tier.description}
                        </p>
                        <ul className="space-y-1">
                          {tier.features.slice(0, 3).map((feature, i) => (
                            <li
                              key={i}
                              className="flex items-center gap-2 text-[0.72rem]"
                              style={{ color: 'var(--ink-soft)' }}
                            >
                              <Check className="w-3 h-3" style={{ color: 'var(--success)' }} />
                              {feature}
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div className="text-right shrink-0">
                        {tier.price > 0 ? (
                          <>
                            {tier.originalPrice > tier.price && (
                              <div
                                className="text-[0.85rem] line-through"
                                style={{ color: 'var(--ink-ghost)' }}
                              >
                                ${tier.originalPrice.toLocaleString()}
                              </div>
                            )}
                            <div
                              className="text-[1.5rem] font-bold leading-none"
                              style={{ fontFamily: 'var(--handwritten)', color: 'var(--pencil)' }}
                            >
                              ${tier.price.toLocaleString()}
                            </div>
                            <div className="text-[0.68rem]" style={{ color: 'var(--ink-ghost)' }}>
                              {tier.currency}
                            </div>
                            {tier.seats > 1 && (
                              <div className="text-[0.68rem] mt-1" style={{ color: 'var(--ink-faded)' }}>
                                ~${Math.round(tier.price / tier.seats)} / seat
                              </div>
                            )}
                          </>
                        ) : (
                          <div
                            className="text-[1rem] font-semibold"
                            style={{ fontFamily: 'var(--handwritten)', color: 'var(--pencil)' }}
                          >
                            Contact Us
                          </div>
                        )}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          )}

          {/* Step 3: Checkout Summary */}
          {step === 'checkout' && selectedCohort && selectedTier && (
            <div className="space-y-4">
              {/* Summary Card */}
              <div
                className="p-4"
                style={{ background: 'var(--paper-warm)', border: '1px solid var(--border)' }}
              >
                <h3 className="text-[0.72rem] uppercase tracking-wider mb-3" style={{ color: 'var(--ink-ghost)' }}>
                  Order Summary
                </h3>

                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-[0.85rem]" style={{ color: 'var(--ink-soft)' }}>
                      {selectedTier.name} Plan
                    </span>
                    <span className="font-semibold" style={{ color: 'var(--ink)' }}>
                      {selectedTier.price > 0 ? `$${selectedTier.price.toLocaleString()} ${selectedTier.currency}` : 'Contact'}
                    </span>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-[0.85rem]" style={{ color: 'var(--ink-soft)' }}>
                      Cohort
                    </span>
                    <span style={{ color: 'var(--ink)' }}>
                      {selectedCohort.label}
                    </span>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-[0.85rem]" style={{ color: 'var(--ink-soft)' }}>
                      Start Date
                    </span>
                    <span style={{ color: 'var(--ink)' }}>
                      {formatCohortDate(selectedCohort.startDate)}
                    </span>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-[0.85rem]" style={{ color: 'var(--ink-soft)' }}>
                      Seats
                    </span>
                    <span style={{ color: 'var(--ink)' }}>
                      {selectedTier.seats}
                    </span>
                  </div>

                  {selectedTier.price > 0 && (
                    <div
                      className="pt-3 mt-3 flex justify-between border-t"
                      style={{ borderColor: 'var(--border)' }}
                    >
                      <span className="font-semibold" style={{ color: 'var(--ink)' }}>
                        Total
                      </span>
                      <span
                        className="text-[1.2rem] font-bold"
                        style={{ fontFamily: 'var(--handwritten)', color: 'var(--pencil)' }}
                      >
                        ${selectedTier.price.toLocaleString()} {selectedTier.currency}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Email Input */}
              <div>
                <label
                  className="block text-[0.72rem] uppercase tracking-wider mb-2"
                  style={{ color: 'var(--ink-ghost)' }}
                >
                  Your Email
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@company.com"
                  className="input w-full"
                />
              </div>

              {/* Guarantee */}
              <div
                className="flex items-start gap-3 p-3"
                style={{ background: 'var(--highlight-light)', border: '1px dashed var(--highlight)' }}
              >
                <AlertCircle className="w-5 h-5 shrink-0" style={{ color: 'var(--pencil)' }} />
                <p className="text-[0.78rem]" style={{ color: 'var(--ink-soft)' }}>
                  <strong>14-day money-back guarantee.</strong> If the training isn't right for you,
                  get a full refund within 14 days of the first session.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div
          className="sticky bottom-0 flex items-center justify-between gap-4 px-6 py-4 border-t"
          style={{ background: 'var(--paper)', borderColor: 'var(--border)' }}
        >
          {step !== 'cohort' ? (
            <button
              onClick={handleBack}
              className="btn btn-secondary"
            >
              <ArrowLeft className="w-4 h-4" />
              Back
            </button>
          ) : (
            <div />
          )}

          {step === 'checkout' ? (
            <button
              onClick={handleCheckout}
              disabled={isLoading}
              className="btn btn-primary"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Processing...
                </>
              ) : selectedTier?.id === 'enterprise' ? (
                <>
                  Contact Craig
                  <ArrowRight className="w-4 h-4" />
                </>
              ) : (
                <>
                  Proceed to Payment
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          ) : (
            <button
              onClick={handleNext}
              disabled={
                (step === 'cohort' && !selectedCohort) ||
                (step === 'tier' && !selectedTier)
              }
              className="btn btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Continue
              <ArrowRight className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default EnrollmentModal;
