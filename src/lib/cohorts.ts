/**
 * Cohort Management
 * Handles cohort dates, availability, and Stripe integration
 *
 * PRODUCTION CONFIG - Updated January 2026
 */

export interface Cohort {
  id: string;
  startDate: Date;
  endDate: Date;
  maxSeats: number;
  // In production, this would come from a database
  // For now, we'll use localStorage to simulate seat tracking
  label: string;
  stripeValue: string; // Value for Stripe dropdown (e.g., "Cohort 06-02-2026")
  status: 'open' | 'filling' | 'full' | 'started';
}

export interface PricingTier {
  id: string;
  name: string;
  description: string;
  price: number;
  originalPrice: number; // For showing strike-through
  currency: string;
  seats: number;
  features: string[];
  stripePriceId: string;
  stripePaymentLink: string;
}

// Stripe Configuration
export const STRIPE_CONFIG = {
  publishableKey: 'pk_live_51R6ulkHcmidQofV7t9nZcAf7f3YK8zK0LknT1rKgKcAAe5eKkbkQR04N1Eynfre2dsMSKJxsVmlgrOGrcIXAe1Fo00LOfmoVvs',
  successUrl: 'https://vibegis.com/training/success',
  cancelUrl: 'https://vibegis.com/training',
  cohortFieldKey: 'cohort',
};

// Pricing tiers with LAUNCH SPECIAL pricing
export const PRICING_TIERS: PricingTier[] = [
  {
    id: 'solo',
    name: 'Solo',
    description: 'Individual practitioner',
    price: 727, // LAUNCH SPECIAL
    originalPrice: 1497,
    currency: 'AUD',
    seats: 1,
    features: [
      '6 live sessions (recordings included)',
      'All playbooks and templates',
      '90-day recording access',
      'Community Slack channel',
    ],
    stripePriceId: 'price_1StBNLHcmidQofV7mN2kmjg5',
    stripePaymentLink: 'https://buy.stripe.com/14AbJ11Su0jB6wTeFF7wA03',
  },
  {
    id: 'team',
    name: 'Team',
    description: 'Small team (2-4 people)',
    price: 1747, // LAUNCH SPECIAL
    originalPrice: 3497,
    currency: 'AUD',
    seats: 4,
    features: [
      'Everything in Solo',
      'Up to 4 seats',
      'Team-specific exercises',
      '30-min onboarding call',
    ],
    stripePriceId: 'price_1StBSnHcmidQofV7OMLvRqGt',
    stripePaymentLink: 'https://buy.stripe.com/9B66oH9kWaYf6wT9ll7wA02',
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    description: 'Custom cohort',
    price: 0, // Contact for pricing
    originalPrice: 0,
    currency: 'AUD',
    seats: 10,
    features: [
      'Private cohort scheduling',
      'Custom curriculum focus',
      'Governance/compliance review',
      'Extended support window',
    ],
    stripePriceId: '',
    stripePaymentLink: '',
  },
];

// Generate cohorts starting from February 6th, 2026
// Weekly cohorts on Fridays, 6 weeks duration each
export function generateCohorts(count: number = 8): Cohort[] {
  const cohorts: Cohort[] = [];
  const firstCohortStart = new Date('2026-02-06T00:00:00'); // Friday, Feb 6, 2026

  for (let i = 0; i < count; i++) {
    const startDate = new Date(firstCohortStart);
    startDate.setDate(startDate.getDate() + (i * 7)); // Weekly cohorts

    const endDate = new Date(startDate);
    endDate.setDate(endDate.getDate() + (6 * 7) - 1); // 6 weeks duration

    const status = getCohortStatus(startDate, i);

    // Format for Stripe dropdown: "Cohort DD-MM-YYYY"
    const day = String(startDate.getDate()).padStart(2, '0');
    const month = String(startDate.getMonth() + 1).padStart(2, '0');
    const year = startDate.getFullYear();
    const stripeValue = `Cohort ${day}-${month}-${year}`;

    cohorts.push({
      id: stripeValue.toLowerCase().replace(/\s+/g, '-'),
      startDate,
      endDate,
      maxSeats: 10,
      label: `Cohort ${i + 1}`,
      stripeValue,
      status,
    });
  }

  return cohorts;
}

function getCohortStatus(startDate: Date, index: number): Cohort['status'] {
  const now = new Date();

  if (startDate < now) {
    return 'started';
  }

  // First available cohort is "filling fast"
  if (index === 0) {
    return 'filling';
  }

  return 'open';
}

// Format date for display
export function formatCohortDate(date: Date): string {
  return date.toLocaleDateString('en-AU', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

// Format date range
export function formatCohortDateRange(startDate: Date, endDate: Date): string {
  const startMonth = startDate.toLocaleDateString('en-AU', { month: 'short' });
  const endMonth = endDate.toLocaleDateString('en-AU', { month: 'short' });
  const startDay = startDate.getDate();
  const endDay = endDate.getDate();

  if (startMonth === endMonth) {
    return `${startMonth} ${startDay} - ${endDay}`;
  }
  return `${startMonth} ${startDay} - ${endMonth} ${endDay}`;
}

// Get available seats (simulated - in production this comes from database)
export function getAvailableSeats(cohortId: string): number {
  // Check localStorage for demo purposes
  const booked = localStorage.getItem(`cohort_seats_${cohortId}`);
  const bookedCount = booked ? parseInt(booked, 10) : 0;
  return Math.max(0, 10 - bookedCount);
}

// Simulate booking seats (for demo)
export function bookSeats(cohortId: string, count: number): boolean {
  const available = getAvailableSeats(cohortId);
  if (count > available) {
    return false;
  }

  const current = localStorage.getItem(`cohort_seats_${cohortId}`);
  const currentCount = current ? parseInt(current, 10) : 0;
  localStorage.setItem(`cohort_seats_${cohortId}`, String(currentCount + count));
  return true;
}

/**
 * Build Stripe Payment Link URL with prefilled cohort
 *
 * Stripe Payment Links support prefilling custom fields via URL params:
 * https://buy.stripe.com/xxx?prefilled_custom_field_[key]=[value]
 */
export function buildStripeCheckoutUrl(
  tier: PricingTier,
  cohort: Cohort,
  email?: string
): string {
  // Enterprise tier - redirect to email
  if (tier.id === 'enterprise' || !tier.stripePaymentLink) {
    const params = new URLSearchParams({
      subject: `VibeGIS Enterprise Training Enquiry`,
      body: `
Hi Craig,

I'm interested in the Enterprise training package.

Preferred Cohort: ${cohort.label} - Starting ${formatCohortDate(cohort.startDate)}

Please contact me to discuss our requirements.

Thanks!
      `.trim(),
    });
    return `mailto:craig@futurebridgeai.com.au?${params.toString()}`;
  }

  // Build Payment Link URL with prefilled cohort
  const url = new URL(tier.stripePaymentLink);

  // Prefill the cohort dropdown
  // Format: prefilled_custom_field_[key]=[value]
  url.searchParams.set(`prefilled_custom_field_${STRIPE_CONFIG.cohortFieldKey}`, cohort.stripeValue);

  // Prefill email if provided
  if (email) {
    url.searchParams.set('prefilled_email', email);
  }

  return url.toString();
}

/**
 * Get the Stripe Payment Link for a tier (without cohort prefill)
 * Useful for direct links that let users choose cohort in Stripe
 */
export function getPaymentLinkUrl(tier: PricingTier): string {
  return tier.stripePaymentLink;
}
