-- VibeGIS Training Enrollments Schema
-- Captures Stripe checkout completions and tracks onboarding email delivery

-- Enrollment status enum
CREATE TYPE enrollment_status AS ENUM ('active', 'cancelled', 'completed', 'no_show');

-- Main enrollments table
CREATE TABLE enrollments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Customer info
  email TEXT NOT NULL,
  customer_name TEXT,

  -- Stripe identifiers
  stripe_checkout_session_id TEXT NOT NULL UNIQUE,
  stripe_customer_id TEXT,
  stripe_payment_intent_id TEXT,

  -- Enrollment details
  tier TEXT NOT NULL CHECK (tier IN ('solo', 'team', 'enterprise')),
  cohort_label TEXT NOT NULL,
  cohort_start_date DATE,
  seats INTEGER NOT NULL DEFAULT 1,

  -- Payment details
  amount_total INTEGER NOT NULL,  -- in smallest currency unit (cents)
  currency TEXT NOT NULL DEFAULT 'aud',

  -- Status
  status enrollment_status NOT NULL DEFAULT 'active',

  -- Email tracking timestamps
  welcome_email_sent_at TIMESTAMPTZ,
  slack_invite_sent_at TIMESTAMPTZ,
  prework_email_sent_at TIMESTAMPTZ,
  reminder_email_sent_at TIMESTAMPTZ,

  -- Timestamps
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Auto-update updated_at
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER enrollments_updated_at
  BEFORE UPDATE ON enrollments
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

-- Indexes
CREATE INDEX idx_enrollments_email ON enrollments (email);
CREATE INDEX idx_enrollments_cohort ON enrollments (cohort_label);
CREATE INDEX idx_enrollments_status ON enrollments (status);
CREATE INDEX idx_enrollments_cohort_start ON enrollments (cohort_start_date);

-- Aggregated seat counts per cohort (for the client to query)
CREATE VIEW cohort_seat_counts AS
SELECT
  cohort_label,
  cohort_start_date,
  SUM(seats) AS booked_seats
FROM enrollments
WHERE status = 'active'
GROUP BY cohort_label, cohort_start_date;

-- Row Level Security
ALTER TABLE enrollments ENABLE ROW LEVEL SECURITY;

-- Only service_role can read/write enrollments (webhook uses service_role key)
-- No policies = no access for anon/authenticated, only service_role bypasses RLS

-- The view is readable by anon (for seat counts on the website)
GRANT SELECT ON cohort_seat_counts TO anon;
GRANT SELECT ON cohort_seat_counts TO authenticated;
