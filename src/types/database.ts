/**
 * Supabase Database Types
 *
 * These types match the schema in supabase/migrations/001_create_enrollments.sql.
 * Replace with auto-generated types when available:
 *   npx supabase gen types typescript --project-id <id> > src/types/database.ts
 */

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type EnrollmentStatus = 'active' | 'cancelled' | 'completed' | 'no_show'

export interface Database {
  public: {
    Tables: {
      enrollments: {
        Row: {
          id: string
          email: string
          customer_name: string | null
          stripe_checkout_session_id: string
          stripe_customer_id: string | null
          stripe_payment_intent_id: string | null
          tier: 'solo' | 'team' | 'enterprise'
          cohort_label: string
          cohort_start_date: string | null
          seats: number
          amount_total: number
          currency: string
          status: EnrollmentStatus
          welcome_email_sent_at: string | null
          slack_invite_sent_at: string | null
          prework_email_sent_at: string | null
          reminder_email_sent_at: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          email: string
          customer_name?: string | null
          stripe_checkout_session_id: string
          stripe_customer_id?: string | null
          stripe_payment_intent_id?: string | null
          tier: 'solo' | 'team' | 'enterprise'
          cohort_label: string
          cohort_start_date?: string | null
          seats?: number
          amount_total: number
          currency?: string
          status?: EnrollmentStatus
          welcome_email_sent_at?: string | null
          slack_invite_sent_at?: string | null
          prework_email_sent_at?: string | null
          reminder_email_sent_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          customer_name?: string | null
          stripe_checkout_session_id?: string
          stripe_customer_id?: string | null
          stripe_payment_intent_id?: string | null
          tier?: 'solo' | 'team' | 'enterprise'
          cohort_label?: string
          cohort_start_date?: string | null
          seats?: number
          amount_total?: number
          currency?: string
          status?: EnrollmentStatus
          welcome_email_sent_at?: string | null
          slack_invite_sent_at?: string | null
          prework_email_sent_at?: string | null
          reminder_email_sent_at?: string | null
          created_at?: string
          updated_at?: string
        }
      }
    }
    Views: {
      cohort_seat_counts: {
        Row: {
          cohort_label: string
          cohort_start_date: string | null
          booked_seats: number
        }
      }
    }
    Functions: Record<string, never>
    Enums: {
      enrollment_status: EnrollmentStatus
    }
  }
}
