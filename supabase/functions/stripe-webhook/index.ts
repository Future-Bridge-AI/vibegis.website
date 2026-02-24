/**
 * Stripe Webhook Edge Function
 * Handles checkout.session.completed events from Stripe
 *
 * Deploy: npx supabase functions deploy stripe-webhook --no-verify-jwt
 * Secrets: STRIPE_WEBHOOK_SECRET, BREVO_API_KEY, SUPABASE_SERVICE_ROLE_KEY
 */

import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const STRIPE_WEBHOOK_SECRET = Deno.env.get("STRIPE_WEBHOOK_SECRET")!;
const BREVO_API_KEY = Deno.env.get("BREVO_API_KEY")!;
const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

// --- Webhook Signature Verification (Web Crypto, no Stripe SDK) ---

async function verifyStripeSignature(
  payload: string,
  signature: string,
  secret: string
): Promise<boolean> {
  const parts = signature.split(",").reduce(
    (acc, part) => {
      const [key, value] = part.split("=");
      if (key === "t") acc.timestamp = value!;
      if (key === "v1") acc.signatures.push(value!);
      return acc;
    },
    { timestamp: "", signatures: [] as string[] }
  );

  if (!parts.timestamp || parts.signatures.length === 0) return false;

  // Reject events older than 5 minutes
  const tolerance = 300;
  const now = Math.floor(Date.now() / 1000);
  if (now - parseInt(parts.timestamp, 10) > tolerance) return false;

  const signedPayload = `${parts.timestamp}.${payload}`;
  const encoder = new TextEncoder();

  const key = await crypto.subtle.importKey(
    "raw",
    encoder.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );

  const signatureBytes = await crypto.subtle.sign(
    "HMAC",
    key,
    encoder.encode(signedPayload)
  );

  const expectedSig = Array.from(new Uint8Array(signatureBytes))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");

  return parts.signatures.some((sig) => sig === expectedSig);
}

// --- Email Template ---

function buildWelcomeEmailHtml(name: string, cohortLabel: string, cohortDate: string, tier: string): string {
  const seatsText = tier === "team" ? "up to 4 seats" : "1 seat";
  const tierDisplay = tier.charAt(0).toUpperCase() + tier.slice(1);
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Welcome to VibeGIS AI Training</title>
</head>
<body style="margin: 0; padding: 0; background-color: #f4f4f4; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">

<!-- Outer wrapper -->
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color: #f4f4f4;">
<tr><td align="center" style="padding: 32px 16px;">

<!-- Email container -->
<table role="presentation" width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.06);">

  <!-- Header band -->
  <tr>
    <td style="background-color: #2b3a42; padding: 36px 40px 28px;">
      <p style="margin: 0 0 6px; font-size: 14px; letter-spacing: 1.5px; color: #8ec8c8; text-transform: uppercase; font-weight: 600;">VibeGIS AI Training</p>
      <h1 style="margin: 0; font-size: 28px; line-height: 1.3; color: #ffffff; font-weight: 700;">Welcome aboard${name ? `, ${name}` : ""}.</h1>
    </td>
  </tr>

  <!-- Intro -->
  <tr>
    <td style="padding: 36px 40px 8px;">
      <p style="margin: 0 0 18px; font-size: 16px; line-height: 1.65; color: #333333;">
        Thanks for enrolling &mdash; you&rsquo;re now part of the first cohort of GIS professionals learning to architect agentic workflows with AI. That&rsquo;s a genuinely exciting place to be, and I&rsquo;m glad you&rsquo;re here.
      </p>
      <p style="margin: 0 0 18px; font-size: 16px; line-height: 1.65; color: #333333;">
        This course is built around one idea: <strong>delegate the mechanical work to AI agents, but keep humans firmly in control.</strong> Everything we cover follows the same operating pattern &mdash; <em>Specs &rarr; Agents &rarr; Validation</em> &mdash; so you&rsquo;ll walk away with repeatable playbooks, not just cool demos.
      </p>
    </td>
  </tr>

  <!-- Collaborative note -->
  <tr>
    <td style="padding: 0 40px 8px;">
      <p style="margin: 0 0 18px; font-size: 16px; line-height: 1.65; color: #333333;">
        A quick note on how this course works. Agentic GIS is a genuinely new discipline &mdash; nobody has all the answers yet, myself included. I&rsquo;ve designed the curriculum around the patterns and playbooks I&rsquo;ve found most effective across nearly two decades of GIS work, but some of the best insights will come from your own experience and the problems you&rsquo;re solving day to day. These sessions are built to be collaborative &mdash; I&rsquo;ll bring the structure and frameworks, and I&rsquo;m counting on you to bring the questions, the edge cases, and the &ldquo;yeah but what about...&rdquo; moments. That&rsquo;s where the real learning happens.
      </p>
    </td>
  </tr>

  <!-- Enrolment Details -->
  <tr>
    <td style="padding: 8px 40px 4px;">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color: #f7fafa; border-radius: 6px; border: 1px solid #e0eded;">
        <tr><td style="padding: 20px 24px;">
          <p style="margin: 0 0 14px; font-size: 13px; letter-spacing: 1px; color: #3a8f8f; text-transform: uppercase; font-weight: 700;">Your Enrolment</p>
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
            <tr>
              <td style="padding: 6px 0; font-size: 14px; color: #777;">Cohort</td>
              <td style="padding: 6px 0; font-size: 14px; color: #2b3a42; text-align: right; font-weight: 600;">${cohortLabel}</td>
            </tr>
            <tr>
              <td style="padding: 6px 0; font-size: 14px; color: #777;">Start Date</td>
              <td style="padding: 6px 0; font-size: 14px; color: #2b3a42; text-align: right; font-weight: 600;">${cohortDate}</td>
            </tr>
            <tr>
              <td style="padding: 6px 0; font-size: 14px; color: #777;">Plan</td>
              <td style="padding: 6px 0; font-size: 14px; color: #2b3a42; text-align: right; font-weight: 600;">${tierDisplay} (${seatsText})</td>
            </tr>
          </table>
        </td></tr>
      </table>
    </td>
  </tr>

  <!-- What happens next -->
  <tr>
    <td style="padding: 24px 40px 4px;">
      <h2 style="margin: 0 0 16px; font-size: 18px; color: #2b3a42; font-weight: 700;">What happens next</h2>
    </td>
  </tr>
  <tr>
    <td style="padding: 0 40px 8px;">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
        <tr>
          <td width="28" valign="top" style="padding-top: 2px; color: #3a8f8f; font-size: 18px; font-weight: bold;">1</td>
          <td style="padding: 0 0 14px; font-size: 15px; line-height: 1.6; color: #333333;">
            <strong>Join the Discord</strong> &mdash; an invite to the VibeGIS Community Discord server will arrive in a separate email within 48 hours.
          </td>
        </tr>
        <tr>
          <td width="28" valign="top" style="padding-top: 2px; color: #3a8f8f; font-size: 18px; font-weight: bold;">2</td>
          <td style="padding: 0 0 14px; font-size: 15px; line-height: 1.6; color: #333333;">
            <strong>Pre-work materials</strong> &mdash; one week before your cohort starts, you&rsquo;ll receive setup instructions and preparation materials.
          </td>
        </tr>
        <tr>
          <td width="28" valign="top" style="padding-top: 2px; color: #3a8f8f; font-size: 18px; font-weight: bold;">3</td>
          <td style="padding: 0 0 14px; font-size: 15px; line-height: 1.6; color: #333333;">
            <strong>Session 1</strong> &mdash; we kick off on ${cohortDate} at 8:00 AM AWST (Fridays).
          </td>
        </tr>
      </table>
    </td>
  </tr>

  <!-- Divider -->
  <tr><td style="padding: 0 40px;"><hr style="border: none; border-top: 1px solid #e8e8e8; margin: 12px 0 20px;"></td></tr>

  <!-- What you'll build -->
  <tr>
    <td style="padding: 8px 40px 4px;">
      <h2 style="margin: 0 0 16px; font-size: 18px; color: #2b3a42; font-weight: 700;">What we&rsquo;ll cover across six sessions</h2>
    </td>
  </tr>

  <!-- Module grid — 2 columns, 3 rows -->
  <tr>
    <td style="padding: 0 40px;">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0">

        <!-- Row 1 -->
        <tr>
          <td width="48%" valign="top" style="padding: 0 8px 16px 0;">
            <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color: #f7fafa; border-radius: 6px; border-left: 3px solid #3a8f8f;">
              <tr><td style="padding: 14px 16px;">
                <p style="margin: 0 0 2px; font-size: 11px; color: #3a8f8f; font-weight: 700; letter-spacing: 0.5px;">MODULE 01</p>
                <p style="margin: 0 0 6px; font-size: 14px; font-weight: 600; color: #2b3a42;">Agent-Ready Workflow Basics</p>
                <p style="margin: 0; font-size: 13px; line-height: 1.5; color: #555;">Projects, prompts, repo structure &amp; review loops.</p>
              </td></tr>
            </table>
          </td>
          <td width="4%"></td>
          <td width="48%" valign="top" style="padding: 0 0 16px;">
            <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color: #f7fafa; border-radius: 6px; border-left: 3px solid #3a8f8f;">
              <tr><td style="padding: 14px 16px;">
                <p style="margin: 0 0 2px; font-size: 11px; color: #3a8f8f; font-weight: 700; letter-spacing: 0.5px;">MODULE 02</p>
                <p style="margin: 0 0 6px; font-size: 14px; font-weight: 600; color: #2b3a42;">Autonomous Data Retrieval &amp; ETL</p>
                <p style="margin: 0; font-size: 13px; line-height: 1.5; color: #555;">Ingest, transform &amp; validate layers &mdash; CRS, schema, joins.</p>
              </td></tr>
            </table>
          </td>
        </tr>

        <!-- Row 2 -->
        <tr>
          <td width="48%" valign="top" style="padding: 0 8px 16px 0;">
            <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color: #f7fafa; border-radius: 6px; border-left: 3px solid #3a8f8f;">
              <tr><td style="padding: 14px 16px;">
                <p style="margin: 0 0 2px; font-size: 11px; color: #3a8f8f; font-weight: 700; letter-spacing: 0.5px;">MODULE 03</p>
                <p style="margin: 0 0 6px; font-size: 14px; font-weight: 600; color: #2b3a42;">Self-Healing Pipelines</p>
                <p style="margin: 0; font-size: 13px; line-height: 1.5; color: #555;">Broken endpoints, schema drift, retries &amp; alerts.</p>
              </td></tr>
            </table>
          </td>
          <td width="4%"></td>
          <td width="48%" valign="top" style="padding: 0 0 16px;">
            <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color: #f7fafa; border-radius: 6px; border-left: 3px solid #3a8f8f;">
              <tr><td style="padding: 14px 16px;">
                <p style="margin: 0 0 2px; font-size: 11px; color: #3a8f8f; font-weight: 700; letter-spacing: 0.5px;">MODULE 04</p>
                <p style="margin: 0 0 6px; font-size: 14px; font-weight: 600; color: #2b3a42;">Spatial SQL at Scale (Safely)</p>
                <p style="margin: 0; font-size: 13px; line-height: 1.5; color: #555;">PostGIS patterns + AI-assisted query generation.</p>
              </td></tr>
            </table>
          </td>
        </tr>

        <!-- Row 3 -->
        <tr>
          <td width="48%" valign="top" style="padding: 0 8px 16px 0;">
            <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color: #f7fafa; border-radius: 6px; border-left: 3px solid #3a8f8f;">
              <tr><td style="padding: 14px 16px;">
                <p style="margin: 0 0 2px; font-size: 11px; color: #3a8f8f; font-weight: 700; letter-spacing: 0.5px;">MODULE 05</p>
                <p style="margin: 0 0 6px; font-size: 14px; font-weight: 600; color: #2b3a42;">Desktop-to-Automation Bridge</p>
                <p style="margin: 0; font-size: 13px; line-height: 1.5; color: #555;">Where QGIS/ArcGIS fits; when to automate.</p>
              </td></tr>
            </table>
          </td>
          <td width="4%"></td>
          <td width="48%" valign="top" style="padding: 0 0 16px;">
            <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color: #f7fafa; border-radius: 6px; border-left: 3px solid #3a8f8f;">
              <tr><td style="padding: 14px 16px;">
                <p style="margin: 0 0 2px; font-size: 11px; color: #3a8f8f; font-weight: 700; letter-spacing: 0.5px;">MODULE 06</p>
                <p style="margin: 0 0 6px; font-size: 14px; font-weight: 600; color: #2b3a42;">Interoperability: MCP</p>
                <p style="margin: 0; font-size: 13px; line-height: 1.5; color: #555;">&lsquo;USB-C for GIS&rsquo; &mdash; connect tools cleanly, reduce glue-code.</p>
              </td></tr>
            </table>
          </td>
        </tr>

      </table>
    </td>
  </tr>

  <!-- Divider -->
  <tr><td style="padding: 0 40px;"><hr style="border: none; border-top: 1px solid #e8e8e8; margin: 8px 0 20px;"></td></tr>

  <!-- Logistics -->
  <tr>
    <td style="padding: 8px 40px 4px;">
      <h2 style="margin: 0 0 16px; font-size: 18px; color: #2b3a42; font-weight: 700;">Before we start</h2>
      <p style="margin: 0 0 14px; font-size: 15px; line-height: 1.65; color: #333333;">
        Here are a few things to have on your radar ahead of our first session:
      </p>
    </td>
  </tr>

  <!-- Checklist-style items -->
  <tr>
    <td style="padding: 0 40px 8px;">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
        <tr>
          <td width="28" valign="top" style="padding-top: 2px; color: #3a8f8f; font-size: 16px; font-weight: bold;">&#10003;</td>
          <td style="padding: 0 0 12px; font-size: 15px; line-height: 1.6; color: #333333;">
            <strong>Session schedule:</strong> Six weekly live sessions, starting ${cohortDate} at 8:00 AM AWST. Calendar invites are on their way.
          </td>
        </tr>
        <tr>
          <td width="28" valign="top" style="padding-top: 2px; color: #3a8f8f; font-size: 16px; font-weight: bold;">&#10003;</td>
          <td style="padding: 0 0 12px; font-size: 15px; line-height: 1.6; color: #333333;">
            <strong>Recordings:</strong> Every session is recorded and available for 90 days, so don&rsquo;t worry if you can&rsquo;t make one live.
          </td>
        </tr>
        <tr>
          <td width="28" valign="top" style="padding-top: 2px; color: #3a8f8f; font-size: 16px; font-weight: bold;">&#10003;</td>
          <td style="padding: 0 0 12px; font-size: 15px; line-height: 1.6; color: #333333;">
            <strong>What to bring:</strong> Basic comfort with a terminal and file paths is all you need. We&rsquo;ll set up the tooling together in Module 01 &mdash; no prior AI coding experience required.
          </td>
        </tr>
        <tr>
          <td width="28" valign="top" style="padding-top: 2px; color: #3a8f8f; font-size: 16px; font-weight: bold;">&#10003;</td>
          <td style="padding: 0 0 12px; font-size: 15px; line-height: 1.6; color: #333333;">
            <strong>Community:</strong> You&rsquo;ll get access to the VibeGIS Discord server where you can ask questions, share progress, and connect with other participants between sessions.
          </td>
        </tr>
      </table>
    </td>
  </tr>

  <!-- Divider -->
  <tr><td style="padding: 0 40px;"><hr style="border: none; border-top: 1px solid #e8e8e8; margin: 8px 0 20px;"></td></tr>

  <!-- Closing -->
  <tr>
    <td style="padding: 8px 40px 32px;">
      <p style="margin: 0 0 18px; font-size: 15px; line-height: 1.65; color: #333333;">
        If you have any questions before we kick off, just reply to this email. I&rsquo;m happy to help you hit the ground running.
      </p>
      <p style="margin: 0 0 4px; font-size: 15px; line-height: 1.65; color: #333333;">
        Looking forward to working with you.
      </p>
      <p style="margin: 18px 0 0; font-size: 15px; color: #333333; font-weight: 600;">
        Craig McDonnell
      </p>
      <p style="margin: 2px 0 0; font-size: 13px; color: #777777;">
        VibeGIS &middot; <a href="https://vibegis.com" style="color: #3a8f8f; text-decoration: none;">vibegis.com</a> &middot; <a href="mailto:craig@futurebridgeai.com.au" style="color: #3a8f8f; text-decoration: none;">craig@futurebridgeai.com.au</a>
      </p>
    </td>
  </tr>

</table>
<!-- /Email container -->

<!-- Footer note -->
<table role="presentation" width="600" cellpadding="0" cellspacing="0">
  <tr>
    <td style="padding: 20px 40px; text-align: center;">
      <p style="margin: 0; font-size: 12px; color: #999999; line-height: 1.5;">
        You&rsquo;re receiving this because you enrolled in VibeGIS AI Training.<br>
        &copy; ${new Date().getFullYear()} FutureBridge AI &middot; Perth, Western Australia
      </p>
    </td>
  </tr>
</table>

</td></tr>
</table>
<!-- /Outer wrapper -->

</body>
</html>`;
}

// --- Cohort Date Parser ---

function parseCohortDate(stripeValue: string): { label: string; startDate: string | null } {
  // Format 1: "Cohort DD-MM-YYYY" (live Payment Link)
  const hyphenated = stripeValue.match(/Cohort\s+(\d{2})-(\d{2})-(\d{4})/i);
  if (hyphenated) {
    const [, day, month, year] = hyphenated;
    return {
      label: stripeValue,
      startDate: `${year}-${month}-${day}`,
    };
  }

  // Format 2: "cohortDDMMYYYY" (compact, e.g. "cohort27022026")
  const compact = stripeValue.match(/cohort(\d{2})(\d{2})(\d{4})/i);
  if (compact) {
    const [, day, month, year] = compact;
    const date = new Date(`${year}-${month}-${day}T00:00:00`);
    const formattedLabel = `Cohort ${day}-${month}-${year}`;
    // Validate the date is real
    if (!isNaN(date.getTime())) {
      return {
        label: formattedLabel,
        startDate: `${year}-${month}-${day}`,
      };
    }
  }

  return { label: stripeValue || "Unknown", startDate: null };
}

// --- Main Handler ---

Deno.serve(async (req: Request) => {
  if (req.method !== "POST") {
    return new Response("Method not allowed", { status: 405 });
  }

  const body = await req.text();
  const signature = req.headers.get("stripe-signature");

  if (!signature) {
    return new Response("Missing signature", { status: 400 });
  }

  // Verify webhook signature
  const isValid = await verifyStripeSignature(body, signature, STRIPE_WEBHOOK_SECRET);
  if (!isValid) {
    console.error("Invalid webhook signature");
    return new Response("Invalid signature", { status: 400 });
  }

  const event = JSON.parse(body);

  // Only handle checkout.session.completed
  if (event.type !== "checkout.session.completed") {
    return new Response(JSON.stringify({ received: true }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  }

  const session = event.data.object;

  try {
    // Extract customer info
    const email = session.customer_details?.email ?? session.customer_email ?? "";
    const customerName = session.customer_details?.name ?? "";
    const amountTotal = session.amount_total ?? 0;
    const currency = session.currency ?? "aud";

    // Extract cohort from custom_fields dropdown
    let cohortDropdownValue = "";
    if (session.custom_fields && Array.isArray(session.custom_fields)) {
      const cohortField = session.custom_fields.find(
        (f: { key: string }) => f.key === "cohort"
      );
      if (cohortField?.dropdown?.value) {
        cohortDropdownValue = cohortField.dropdown.value;
      }
    }

    const { label: cohortLabel, startDate: cohortStartDate } =
      parseCohortDate(cohortDropdownValue);

    // Determine tier from amount (amounts are in cents)
    // Team tier is $1747 AUD = 174700 cents; solo is $727 = 72700 cents
    const tier = amountTotal > 150000 ? "team" : "solo";
    const seats = tier === "team" ? 4 : 1;

    // Insert enrollment
    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

    const { error: insertError } = await supabase.from("enrollments").insert({
      email,
      customer_name: customerName,
      stripe_checkout_session_id: session.id,
      stripe_customer_id: session.customer ?? null,
      stripe_payment_intent_id: session.payment_intent ?? null,
      tier,
      cohort_label: cohortLabel,
      cohort_start_date: cohortStartDate,
      seats,
      amount_total: amountTotal,
      currency,
    });

    if (insertError) {
      // Duplicate session ID means we already processed this event
      if (insertError.code === "23505") {
        console.log("Duplicate checkout session, skipping:", session.id);
        return new Response(JSON.stringify({ received: true, duplicate: true }), {
          status: 200,
          headers: { "Content-Type": "application/json" },
        });
      }
      throw insertError;
    }

    // Format cohort date for email
    const cohortDateDisplay = cohortStartDate
      ? new Date(cohortStartDate + "T00:00:00").toLocaleDateString("en-AU", {
          weekday: "long",
          day: "numeric",
          month: "long",
          year: "numeric",
        })
      : "TBC";

    // Send welcome email via Brevo
    const emailHtml = buildWelcomeEmailHtml(
      customerName.split(" ")[0] ?? "",
      cohortLabel,
      cohortDateDisplay,
      tier
    );

    const brevoRes = await fetch("https://api.brevo.com/v3/smtp/email", {
      method: "POST",
      headers: {
        "api-key": BREVO_API_KEY,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        sender: { name: "Craig @ VibeGIS", email: "craig@vibegis.com" },
        to: [{ email, name: customerName }],
        subject: `Welcome to VibeGIS Training - ${cohortLabel}`,
        htmlContent: emailHtml,
      }),
    });

    if (brevoRes.ok) {
      // Update welcome_email_sent_at
      await supabase
        .from("enrollments")
        .update({ welcome_email_sent_at: new Date().toISOString() })
        .eq("stripe_checkout_session_id", session.id);

      console.log("Welcome email sent to:", email);
    } else {
      const brevoErr = await brevoRes.text();
      console.error("Brevo error:", brevoErr);
      // Don't fail the webhook - email can be retried
    }

    return new Response(JSON.stringify({ received: true, enrollment: email }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("Webhook processing error:", err);
    // Still return 200 to prevent Stripe retries on our application errors
    return new Response(JSON.stringify({ received: true, error: "processing_failed" }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  }
});
