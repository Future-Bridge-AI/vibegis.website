/**
 * Onboarding Email Drip Edge Function
 * Called hourly via pg_cron to send scheduled onboarding emails
 *
 * Deploy: npx supabase functions deploy send-onboarding-emails --no-verify-jwt
 * Secrets: BREVO_API_KEY, SUPABASE_SERVICE_ROLE_KEY
 *
 * pg_cron setup (run in SQL editor after enabling pg_cron + pg_net extensions):
 *
 *   SELECT cron.schedule(
 *     'send-onboarding-emails',
 *     '0 * * * *',  -- every hour
 *     $$
 *     SELECT net.http_post(
 *       url := '<SUPABASE_URL>/functions/v1/send-onboarding-emails',
 *       headers := jsonb_build_object(
 *         'Authorization', 'Bearer <SUPABASE_ANON_KEY>',
 *         'Content-Type', 'application/json'
 *       ),
 *       body := '{}'
 *     );
 *     $$
 *   );
 */

import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const BREVO_API_KEY = Deno.env.get("BREVO_API_KEY")!;
const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

const FROM_ADDRESS = "Craig @ VibeGIS <craig@vibegis.com>";

// --- Email Templates ---

function buildSlackInviteEmailHtml(name: string): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Join the VibeGIS Community</title>
</head>
<body style="margin: 0; padding: 0; background-color: #f4f4f4; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">

<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color: #f4f4f4;">
<tr><td align="center" style="padding: 32px 16px;">

<table role="presentation" width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.06);">

  <!-- Header -->
  <tr>
    <td style="background-color: #2b3a42; padding: 36px 40px 28px;">
      <p style="margin: 0 0 6px; font-size: 14px; letter-spacing: 1.5px; color: #8ec8c8; text-transform: uppercase; font-weight: 600;">VibeGIS AI Training</p>
      <h1 style="margin: 0; font-size: 28px; line-height: 1.3; color: #ffffff; font-weight: 700;">Quick nudge${name ? `, ${name}` : ""}.</h1>
    </td>
  </tr>

  <!-- Body -->
  <tr>
    <td style="padding: 36px 40px 8px;">
      <p style="margin: 0 0 18px; font-size: 16px; line-height: 1.65; color: #333333;">
        Have you joined the VibeGIS Discord yet? It&rsquo;s where the real learning happens between live sessions &mdash; questions get answered, resources get shared, and you&rsquo;ll connect with the other participants in your cohort before we even start.
      </p>
      <p style="margin: 0 0 18px; font-size: 16px; line-height: 1.65; color: #333333;">
        Check your inbox for the Discord invite link. If you can&rsquo;t find it, try spam &mdash; or just reply to this email and I&rsquo;ll send a fresh one.
      </p>
    </td>
  </tr>

  <!-- What's in the Discord -->
  <tr>
    <td style="padding: 0 40px 8px;">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color: #f7fafa; border-radius: 6px; border: 1px solid #e0eded;">
        <tr><td style="padding: 20px 24px;">
          <p style="margin: 0 0 14px; font-size: 13px; letter-spacing: 1px; color: #3a8f8f; text-transform: uppercase; font-weight: 700;">Three channels, keep it simple</p>
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
            <tr>
              <td style="padding: 0 0 10px; font-size: 15px; line-height: 1.5; color: #333333;">
                <strong style="color: #2b3a42;">#announcements</strong> &mdash; Course updates and new resources from me. Read-only.
              </td>
            </tr>
            <tr>
              <td style="padding: 0 0 10px; font-size: 15px; line-height: 1.5; color: #333333;">
                <strong style="color: #2b3a42;">#general</strong> &mdash; Ask questions, share links, discuss anything agentic GIS.
              </td>
            </tr>
            <tr>
              <td style="padding: 0 0 4px; font-size: 15px; line-height: 1.5; color: #333333;">
                <strong style="color: #2b3a42;">#show-your-work</strong> &mdash; Share your CLAUDE.md files, pipelines, MCP servers, screenshots, and wins.
              </td>
            </tr>
          </table>
        </td></tr>
      </table>
    </td>
  </tr>

  <!-- Why join now -->
  <tr>
    <td style="padding: 16px 40px 8px;">
      <p style="margin: 0 0 18px; font-size: 16px; line-height: 1.65; color: #333333;">
        Even if your cohort hasn&rsquo;t started yet, jumping in now means you can introduce yourself, get early access to resources, and ask any questions before we kick off.
      </p>
    </td>
  </tr>

  <!-- Divider -->
  <tr><td style="padding: 0 40px;"><hr style="border: none; border-top: 1px solid #e8e8e8; margin: 16px 0 20px;"></td></tr>

  <!-- Closing -->
  <tr>
    <td style="padding: 0 40px 32px;">
      <p style="margin: 0 0 4px; font-size: 15px; line-height: 1.65; color: #333333;">
        Looking forward to seeing you in there.
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

<!-- Footer -->
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

</body>
</html>`;
}

function buildPreworkEmailHtml(name: string, cohortLabel: string, cohortDate: string): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Pre-work: Get Set Up for ${cohortLabel}</title>
</head>
<body style="margin: 0; padding: 0; background-color: #f4f4f4; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">

<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color: #f4f4f4;">
<tr><td align="center" style="padding: 32px 16px;">

<table role="presentation" width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.06);">

  <!-- Header -->
  <tr>
    <td style="background-color: #2b3a42; padding: 36px 40px 28px;">
      <p style="margin: 0 0 6px; font-size: 14px; letter-spacing: 1.5px; color: #8ec8c8; text-transform: uppercase; font-weight: 600;">VibeGIS AI Training</p>
      <h1 style="margin: 0; font-size: 28px; line-height: 1.3; color: #ffffff; font-weight: 700;">Time to get set up${name ? `, ${name}` : ""}.</h1>
    </td>
  </tr>

  <!-- Body -->
  <tr>
    <td style="padding: 36px 40px 8px;">
      <p style="margin: 0 0 18px; font-size: 16px; line-height: 1.65; color: #333333;">
        Your cohort kicks off on <strong>${cohortDate}</strong>. To make sure we hit the ground running in Session 1, please work through the setup checklist below before then.
      </p>
      <p style="margin: 0 0 18px; font-size: 16px; line-height: 1.65; color: #333333;">
        Most people get through this in <strong>15&ndash;20 minutes</strong>. If anything trips you up, drop a message in the Discord <strong>#general</strong> channel and I&rsquo;ll help out.
      </p>
    </td>
  </tr>

  <!-- Setup Checklist -->
  <tr>
    <td style="padding: 0 40px 8px;">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color: #f7fafa; border-radius: 6px; border: 1px solid #e0eded;">
        <tr><td style="padding: 20px 24px;">
          <p style="margin: 0 0 14px; font-size: 13px; letter-spacing: 1px; color: #3a8f8f; text-transform: uppercase; font-weight: 700;">Setup checklist</p>
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
            <tr>
              <td style="padding: 0 0 12px; font-size: 15px; line-height: 1.5; color: #333333;">
                <strong style="color: #2b3a42;">1. Python 3.8+</strong><br>
                <span style="font-size: 14px; color: #555555;">Check with <code style="background: #eef5f5; padding: 2px 6px; border-radius: 3px; font-size: 13px;">python --version</code> &mdash; install from <a href="https://python.org/downloads/" style="color: #3a8f8f; text-decoration: none;">python.org</a> if needed.</span>
              </td>
            </tr>
            <tr>
              <td style="padding: 0 0 12px; font-size: 15px; line-height: 1.5; color: #333333;">
                <strong style="color: #2b3a42;">2. Spatial Python libraries</strong><br>
                <span style="font-size: 14px; color: #555555;">Run: <code style="background: #eef5f5; padding: 2px 6px; border-radius: 3px; font-size: 13px;">pip install geopandas shapely fiona pyproj requests pandas matplotlib folium</code></span>
              </td>
            </tr>
            <tr>
              <td style="padding: 0 0 12px; font-size: 15px; line-height: 1.5; color: #333333;">
                <strong style="color: #2b3a42;">3. Node.js 18+</strong><br>
                <span style="font-size: 14px; color: #555555;">Download from <a href="https://nodejs.org/" style="color: #3a8f8f; text-decoration: none;">nodejs.org</a>. Required for Claude Code.</span>
              </td>
            </tr>
            <tr>
              <td style="padding: 0 0 12px; font-size: 15px; line-height: 1.5; color: #333333;">
                <strong style="color: #2b3a42;">4. Claude Code</strong><br>
                <span style="font-size: 14px; color: #555555;">Run: <code style="background: #eef5f5; padding: 2px 6px; border-radius: 3px; font-size: 13px;">npm install -g @anthropic-ai/claude-code</code></span>
              </td>
            </tr>
            <tr>
              <td style="padding: 0 0 12px; font-size: 15px; line-height: 1.5; color: #333333;">
                <strong style="color: #2b3a42;">5. Anthropic API key</strong><br>
                <span style="font-size: 14px; color: #555555;">Create one at <a href="https://console.anthropic.com/" style="color: #3a8f8f; text-decoration: none;">console.anthropic.com</a> &mdash; you&rsquo;ll need it on first run.</span>
              </td>
            </tr>
            <tr>
              <td style="padding: 0 0 4px; font-size: 15px; line-height: 1.5; color: #333333;">
                <strong style="color: #2b3a42;">6. Code editor</strong><br>
                <span style="font-size: 14px; color: #555555;"><a href="https://code.visualstudio.com/" style="color: #3a8f8f; text-decoration: none;">VS Code</a> or <a href="https://cursor.com/" style="color: #3a8f8f; text-decoration: none;">Cursor</a> recommended. Any editor works.</span>
              </td>
            </tr>
          </table>
        </td></tr>
      </table>
    </td>
  </tr>

  <!-- Verify -->
  <tr>
    <td style="padding: 16px 40px 8px;">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color: #f7fafa; border-radius: 6px; border: 1px solid #e0eded;">
        <tr><td style="padding: 20px 24px;">
          <p style="margin: 0 0 14px; font-size: 13px; letter-spacing: 1px; color: #3a8f8f; text-transform: uppercase; font-weight: 700;">Quick verify</p>
          <p style="margin: 0; font-size: 14px; line-height: 1.65; color: #333333;">
            Open a terminal, navigate to any folder, and run <code style="background: #eef5f5; padding: 2px 6px; border-radius: 3px; font-size: 13px;">claude</code>. If Claude Code starts up and responds to your prompt, you&rsquo;re good to go.
          </p>
        </td></tr>
      </table>
    </td>
  </tr>

  <!-- Session 1 Preview -->
  <tr>
    <td style="padding: 16px 40px 8px;">
      <p style="margin: 0 0 18px; font-size: 16px; line-height: 1.65; color: #333333;">
        In Session 1, we&rsquo;ll cover the paradigm shift from GUI-based GIS to agent-driven workflows, introduce the agentic stack, and you&rsquo;ll run your first spatial analysis entirely through Claude Code. No slides-only lectures &mdash; you&rsquo;ll be building from minute 55.
      </p>
    </td>
  </tr>

  <!-- Divider -->
  <tr><td style="padding: 0 40px;"><hr style="border: none; border-top: 1px solid #e8e8e8; margin: 16px 0 20px;"></td></tr>

  <!-- Closing -->
  <tr>
    <td style="padding: 0 40px 32px;">
      <p style="margin: 0 0 4px; font-size: 15px; line-height: 1.65; color: #333333;">
        See you on ${cohortDate}.
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

<!-- Footer -->
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

</body>
</html>`;
}

function buildReminderEmailHtml(name: string, cohortLabel: string, cohortDate: string): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${cohortLabel} starts in 2 days!</title>
</head>
<body style="margin: 0; padding: 0; background-color: #f4f4f4; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">

<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color: #f4f4f4;">
<tr><td align="center" style="padding: 32px 16px;">

<table role="presentation" width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.06);">

  <!-- Header -->
  <tr>
    <td style="background-color: #2b3a42; padding: 36px 40px 28px;">
      <p style="margin: 0 0 6px; font-size: 14px; letter-spacing: 1.5px; color: #8ec8c8; text-transform: uppercase; font-weight: 600;">VibeGIS AI Training</p>
      <h1 style="margin: 0; font-size: 28px; line-height: 1.3; color: #ffffff; font-weight: 700;">We start in 2 days${name ? `, ${name}` : ""}.</h1>
    </td>
  </tr>

  <!-- Body -->
  <tr>
    <td style="padding: 36px 40px 8px;">
      <p style="margin: 0 0 18px; font-size: 16px; line-height: 1.65; color: #333333;">
        Just a friendly heads-up &mdash; our first live session is on <strong>${cohortDate}</strong>. Here&rsquo;s what you need to know.
      </p>
    </td>
  </tr>

  <!-- Session 1 Details -->
  <tr>
    <td style="padding: 0 40px 8px;">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color: #f7fafa; border-radius: 6px; border: 1px solid #e0eded;">
        <tr><td style="padding: 20px 24px;">
          <p style="margin: 0 0 14px; font-size: 13px; letter-spacing: 1px; color: #3a8f8f; text-transform: uppercase; font-weight: 700;">Session 1 details</p>
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
            <tr>
              <td style="padding: 6px 0; font-size: 14px; color: #777777; width: 90px;">When</td>
              <td style="padding: 6px 0; font-size: 15px; color: #2b3a42; font-weight: 600;">${cohortDate}, 8:00 AM AWST</td>
            </tr>
            <tr>
              <td style="padding: 6px 0; font-size: 14px; color: #777777;">Duration</td>
              <td style="padding: 6px 0; font-size: 15px; color: #2b3a42; font-weight: 600;">90 minutes</td>
            </tr>
            <tr>
              <td style="padding: 6px 0; font-size: 14px; color: #777777;">Where</td>
              <td style="padding: 6px 0; font-size: 15px; color: #2b3a42; font-weight: 600;">Teams Meeting (link emailed separately and in Discord <strong>#announcements</strong>)</td>
            </tr>
            <tr>
              <td style="padding: 6px 0; font-size: 14px; color: #777777;">Topic</td>
              <td style="padding: 6px 0; font-size: 15px; color: #2b3a42; font-weight: 600;">Agent-Ready Workflow Basics</td>
            </tr>
          </table>
        </td></tr>
      </table>
    </td>
  </tr>

  <!-- What we'll cover -->
  <tr>
    <td style="padding: 16px 40px 8px;">
      <p style="margin: 0 0 18px; font-size: 16px; line-height: 1.65; color: #333333;">
        We&rsquo;ll cover the paradigm shift from clicking to thinking, introduce the agentic GIS stack, and you&rsquo;ll run your first spatial analysis entirely through Claude Code. Come ready to build.
      </p>
    </td>
  </tr>

  <!-- Pre-session checklist -->
  <tr>
    <td style="padding: 0 40px 8px;">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color: #f7fafa; border-radius: 6px; border: 1px solid #e0eded;">
        <tr><td style="padding: 20px 24px;">
          <p style="margin: 0 0 14px; font-size: 13px; letter-spacing: 1px; color: #3a8f8f; text-transform: uppercase; font-weight: 700;">Before we start</p>
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
            <tr>
              <td style="padding: 0 0 10px; font-size: 15px; line-height: 1.5; color: #333333;">
                &#9745; Python 3.8+ installed with spatial libraries
              </td>
            </tr>
            <tr>
              <td style="padding: 0 0 10px; font-size: 15px; line-height: 1.5; color: #333333;">
                &#9745; Claude Code installed and responding to prompts
              </td>
            </tr>
            <tr>
              <td style="padding: 0 0 10px; font-size: 15px; line-height: 1.5; color: #333333;">
                &#9745; Anthropic API key set up with available credits
              </td>
            </tr>
            <tr>
              <td style="padding: 0 0 4px; font-size: 15px; line-height: 1.5; color: #333333;">
                &#9745; Joined the Discord &mdash; say hello in <strong>#general</strong>
              </td>
            </tr>
          </table>
        </td></tr>
      </table>
    </td>
  </tr>

  <!-- Help -->
  <tr>
    <td style="padding: 16px 40px 8px;">
      <p style="margin: 0 0 18px; font-size: 16px; line-height: 1.65; color: #333333;">
        If anything isn&rsquo;t working, jump into Discord and I&rsquo;ll help you get sorted before the session.
      </p>
    </td>
  </tr>

  <!-- Divider -->
  <tr><td style="padding: 0 40px;"><hr style="border: none; border-top: 1px solid #e8e8e8; margin: 16px 0 20px;"></td></tr>

  <!-- Closing -->
  <tr>
    <td style="padding: 0 40px 32px;">
      <p style="margin: 0 0 4px; font-size: 15px; line-height: 1.65; color: #333333;">
        Excited to get started.
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

<!-- Footer -->
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

</body>
</html>`;
}

// --- Email Sender ---

async function sendEmail(to: string, subject: string, html: string): Promise<boolean> {
  const res = await fetch("https://api.brevo.com/v3/smtp/email", {
    method: "POST",
    headers: {
      "api-key": BREVO_API_KEY,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      sender: { name: "Craig @ VibeGIS", email: "craig@vibegis.com" },
      to: [{ email: to }],
      subject,
      htmlContent: html,
    }),
  });

  if (!res.ok) {
    const err = await res.text();
    console.error(`Brevo error for ${to}:`, err);
    return false;
  }
  return true;
}

// --- Main Handler ---

Deno.serve(async (_req: Request) => {
  const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
  const now = new Date();
  const results = { slack: 0, prework: 0, reminder: 0, errors: 0 };

  // --- 1. Slack Invite Nudge: 2+ days after enrollment, welcome sent, slack not sent ---
  {
    const twoDaysAgo = new Date(now);
    twoDaysAgo.setDate(twoDaysAgo.getDate() - 2);

    const { data: slackDue } = await supabase
      .from("enrollments")
      .select("id, email, customer_name")
      .eq("status", "active")
      .not("welcome_email_sent_at", "is", null)
      .is("slack_invite_sent_at", null)
      .lt("created_at", twoDaysAgo.toISOString());

    if (slackDue) {
      for (const enrollment of slackDue) {
        const firstName = enrollment.customer_name?.split(" ")[0] ?? "";
        const sent = await sendEmail(
          enrollment.email,
          "Have you joined the VibeGIS Discord yet?",
          buildSlackInviteEmailHtml(firstName)
        );
        if (sent) {
          await supabase
            .from("enrollments")
            .update({ slack_invite_sent_at: now.toISOString() })
            .eq("id", enrollment.id);
          results.slack++;
        } else {
          results.errors++;
        }
      }
    }
  }

  // --- 2. Pre-work Email: 7 days before cohort start, not yet sent ---
  {
    const sevenDaysFromNow = new Date(now);
    sevenDaysFromNow.setDate(sevenDaysFromNow.getDate() + 7);
    const sevenDaysDate = sevenDaysFromNow.toISOString().split("T")[0];

    const { data: preworkDue } = await supabase
      .from("enrollments")
      .select("id, email, customer_name, cohort_label, cohort_start_date")
      .eq("status", "active")
      .is("prework_email_sent_at", null)
      .not("cohort_start_date", "is", null)
      .lte("cohort_start_date", sevenDaysDate!);

    if (preworkDue) {
      for (const enrollment of preworkDue) {
        // Don't send if cohort already started
        if (enrollment.cohort_start_date && new Date(enrollment.cohort_start_date) < now) continue;

        const firstName = enrollment.customer_name?.split(" ")[0] ?? "";
        const cohortDate = enrollment.cohort_start_date
          ? new Date(enrollment.cohort_start_date + "T00:00:00").toLocaleDateString("en-AU", {
              weekday: "long",
              day: "numeric",
              month: "long",
            })
          : "TBC";

        const sent = await sendEmail(
          enrollment.email,
          `Pre-work for ${enrollment.cohort_label} - Get Set Up`,
          buildPreworkEmailHtml(firstName, enrollment.cohort_label, cohortDate)
        );
        if (sent) {
          await supabase
            .from("enrollments")
            .update({ prework_email_sent_at: now.toISOString() })
            .eq("id", enrollment.id);
          results.prework++;
        } else {
          results.errors++;
        }
      }
    }
  }

  // --- 3. Cohort Reminder: 2 days before cohort start, not yet sent ---
  {
    const twoDaysFromNow = new Date(now);
    twoDaysFromNow.setDate(twoDaysFromNow.getDate() + 2);
    const twoDaysDate = twoDaysFromNow.toISOString().split("T")[0];

    const { data: reminderDue } = await supabase
      .from("enrollments")
      .select("id, email, customer_name, cohort_label, cohort_start_date")
      .eq("status", "active")
      .is("reminder_email_sent_at", null)
      .not("cohort_start_date", "is", null)
      .lte("cohort_start_date", twoDaysDate!);

    if (reminderDue) {
      for (const enrollment of reminderDue) {
        // Don't send if cohort already started
        if (enrollment.cohort_start_date && new Date(enrollment.cohort_start_date) < now) continue;

        const firstName = enrollment.customer_name?.split(" ")[0] ?? "";
        const cohortDate = enrollment.cohort_start_date
          ? new Date(enrollment.cohort_start_date + "T00:00:00").toLocaleDateString("en-AU", {
              weekday: "long",
              day: "numeric",
              month: "long",
            })
          : "TBC";

        const sent = await sendEmail(
          enrollment.email,
          `Reminder: ${enrollment.cohort_label} starts in 2 days!`,
          buildReminderEmailHtml(firstName, enrollment.cohort_label, cohortDate)
        );
        if (sent) {
          await supabase
            .from("enrollments")
            .update({ reminder_email_sent_at: now.toISOString() })
            .eq("id", enrollment.id);
          results.reminder++;
        } else {
          results.errors++;
        }
      }
    }
  }

  console.log("Onboarding email run:", results);

  return new Response(JSON.stringify({ ok: true, ...results }), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
});
