import { NextResponse } from "next/server";
import nodemailer from "nodemailer";
import { ownerNotificationEmail, autoReplyEmail } from "@/lib/email/templates";
import { PROFILE } from "@/lib/profile";
import { createRateLimiter, clientIp } from "@/lib/rate-limit";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const LIMITS = {
  name: { min: 2, max: 80 },
  email: { max: 254 },
  message: { min: 10, max: 3000 },
} as const;

// Pragmatic RFC-ish check: something@something.tld
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

type FieldErrors = Partial<Record<"name" | "email" | "message", string>>;

function validate(body: Record<string, unknown>): {
  errors: FieldErrors;
  data: { name: string; email: string; message: string };
} {
  const name = typeof body.name === "string" ? body.name.trim() : "";
  const email = typeof body.email === "string" ? body.email.trim() : "";
  const message = typeof body.message === "string" ? body.message.trim() : "";

  const errors: FieldErrors = {};
  if (name.length < LIMITS.name.min) errors.name = "Please tell me your name.";
  else if (name.length > LIMITS.name.max)
    errors.name = `Name must be under ${LIMITS.name.max} characters.`;

  if (!email) errors.email = "An email address is required so I can reply.";
  else if (email.length > LIMITS.email.max || !EMAIL_RE.test(email))
    errors.email = "That email address doesn't look right.";

  if (message.length < LIMITS.message.min)
    errors.message = "Give me a little more to go on — at least 10 characters.";
  else if (message.length > LIMITS.message.max)
    errors.message = `Message must be under ${LIMITS.message.max} characters.`;

  return { errors, data: { name, email, message } };
}

// 5 messages / hour / IP.
const rateLimited = createRateLimiter({ windowMs: 60 * 60 * 1000, max: 5 });

type Mail = {
  from: string; // "Name <address>"
  to: string;
  replyTo?: string;
  subject: string;
  html: string;
  text: string;
  headers?: Record<string, string>;
};

/**
 * Delivery backends, preferred first:
 * - Resend (RESEND_API_KEY + MAIL_FROM): sends from the custom domain with
 *   SPF/DKIM alignment — the reliable way to stay out of spam.
 * - Gmail SMTP (GMAIL_USER + GMAIL_APP_PASSWORD): works out of the box but a
 *   personal address has weaker sender reputation.
 */
function getTransport():
  | { kind: "resend"; apiKey: string; from: string }
  | { kind: "gmail"; user: string; pass: string }
  | null {
  const resendKey = process.env.RESEND_API_KEY;
  const mailFrom = process.env.MAIL_FROM;
  if (resendKey && mailFrom) return { kind: "resend", apiKey: resendKey, from: mailFrom };

  const user = process.env.GMAIL_USER;
  const pass = process.env.GMAIL_APP_PASSWORD;
  if (user && pass) return { kind: "gmail", user, pass };

  return null;
}

async function deliver(
  transport: NonNullable<ReturnType<typeof getTransport>>,
  mail: Mail
): Promise<void> {
  if (transport.kind === "resend") {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${transport.apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: mail.from,
        to: [mail.to],
        reply_to: mail.replyTo,
        subject: mail.subject,
        html: mail.html,
        text: mail.text,
        headers: mail.headers,
      }),
      signal: AbortSignal.timeout(15_000),
    });
    if (!res.ok) {
      throw new Error(`Resend API ${res.status}: ${await res.text()}`);
    }
    return;
  }

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: { user: transport.user, pass: transport.pass },
  });
  await transporter.sendMail({
    from: mail.from,
    to: mail.to,
    replyTo: mail.replyTo,
    subject: mail.subject,
    html: mail.html,
    text: mail.text,
    headers: mail.headers,
  });
}

export async function POST(req: Request) {
  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid request." }, { status: 400 });
  }

  // Honeypot: bots fill every field. Pretend success, send nothing.
  if (typeof body.company === "string" && body.company.trim() !== "") {
    return NextResponse.json({ ok: true });
  }

  const { errors, data } = validate(body);
  if (Object.keys(errors).length > 0) {
    return NextResponse.json({ ok: false, errors }, { status: 400 });
  }

  if (rateLimited(clientIp(req))) {
    return NextResponse.json(
      { ok: false, error: "Too many messages — please try again in a while." },
      { status: 429 }
    );
  }

  const transport = getTransport();
  const to = process.env.CONTACT_TO ?? PROFILE.email;

  if (!transport) {
    console.error(
      "Contact form: no mail transport configured (RESEND_API_KEY+MAIL_FROM or GMAIL_USER+GMAIL_APP_PASSWORD)."
    );
    return NextResponse.json(
      {
        ok: false,
        error: `Email delivery isn't configured yet — please write to ${PROFILE.email} directly.`,
      },
      { status: 503 }
    );
  }

  // Gmail must send from the authenticated address; Resend from the domain.
  const fromAddress =
    transport.kind === "resend" ? transport.from : `${PROFILE.name} <${transport.user}>`;

  const notification = ownerNotificationEmail(data);
  const autoReply = autoReplyEmail(data);

  const timestamp = Date.now();

  try {
    // The owner notification must succeed. No custom Message-ID or priority
    // headers — the provider's own Message-ID stays aligned with the sender.
    await deliver(transport, {
      from: fromAddress,
      to,
      replyTo: `${data.name} <${data.email}>`,
      subject: notification.subject,
      html: notification.html,
      text: notification.text,
      headers: {
        // Unique per-submission so Gmail never threads separate inquiries.
        "X-Entity-Ref-ID": `portfolio-inquiry-${timestamp}`,
      },
    });
  } catch (err) {
    console.error("Contact form: notification send failed:", err);
    return NextResponse.json(
      {
        ok: false,
        error: `Something went wrong sending your message — please email ${PROFILE.email} directly.`,
      },
      { status: 502 }
    );
  }

  try {
    // Auto-reply is best-effort — the lead is already delivered.
    await deliver(transport, {
      from: fromAddress,
      to: data.email,
      replyTo: `${PROFILE.name} <${to}>`,
      subject: autoReply.subject,
      html: autoReply.html,
      text: autoReply.text,
      headers: {
        // RFC 3834 loop prevention for automated responses.
        "X-Auto-Response-Suppress": "OOF, DR, RN, NRN, AutoReply",
        "Auto-Submitted": "auto-replied",
        "X-Entity-Ref-ID": `portfolio-reply-${timestamp}`,
      },
    });
  } catch (err) {
    console.error("Contact form: auto-reply send failed:", err);
  }

  return NextResponse.json({ ok: true });
}
