import { NextResponse } from "next/server";
import nodemailer from "nodemailer";
import { ownerNotificationEmail, autoReplyEmail } from "@/lib/email/templates";
import { PROFILE } from "@/lib/profile";

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

// Best-effort in-memory rate limit (per serverless instance): 5 / hour / IP.
const WINDOW_MS = 60 * 60 * 1000;
const MAX_PER_WINDOW = 5;
const hits = new Map<string, number[]>();

function rateLimited(ip: string): boolean {
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < WINDOW_MS);
  if (recent.length >= MAX_PER_WINDOW) return true;
  recent.push(now);
  hits.set(ip, recent);
  if (hits.size > 5000) hits.clear(); // memory backstop
  return false;
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

  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  if (rateLimited(ip)) {
    return NextResponse.json(
      { ok: false, error: "Too many messages — please try again in a while." },
      { status: 429 }
    );
  }

  const user = process.env.GMAIL_USER;
  const pass = process.env.GMAIL_APP_PASSWORD;
  const to = process.env.CONTACT_TO ?? PROFILE.email;

  if (!user || !pass) {
    console.error("Contact form: GMAIL_USER / GMAIL_APP_PASSWORD not configured.");
    return NextResponse.json(
      {
        ok: false,
        error: `Email delivery isn't configured yet — please write to ${PROFILE.email} directly.`,
      },
      { status: 503 }
    );
  }

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: { user, pass },
  });

  const notification = ownerNotificationEmail(data);
  const autoReply = autoReplyEmail(data);

  const domain = to.split("@")[1] ?? "navdeepbhanderi.dev";
  const timestamp = Date.now();

  try {
    // The notification to Navdeep must succeed; it carries the lead.
    await transporter.sendMail({
      from: { name: `${PROFILE.name} — Portfolio`, address: user },
      to,
      replyTo: { name: data.name, address: data.email },
      subject: notification.subject,
      html: notification.html,
      text: notification.text,
      messageId: `<contact-${timestamp}-owner@${domain}>`,
      headers: {
        "X-Entity-Ref-ID": `portfolio-inquiry-${timestamp}`,
        "X-Contact-Form-Submission": "navdeepbhanderi.dev",
        Importance: "high",
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
    await transporter.sendMail({
      from: { name: PROFILE.name, address: user },
      to: data.email,
      replyTo: { name: PROFILE.name, address: to },
      subject: autoReply.subject,
      html: autoReply.html,
      text: autoReply.text,
      messageId: `<contact-${timestamp}-reply@${domain}>`,
      headers: {
        // Essential headers to stop automated replies from landing in visitor spam folders:
        "X-Auto-Response-Suppress": "OOF, DR, RN, NRN, AutoReply",
        "Auto-Submitted": "auto-replied",
        Precedence: "auto_reply",
        "X-Entity-Ref-ID": `portfolio-reply-${timestamp}`,
      },
    });
  } catch (err) {
    console.error("Contact form: auto-reply send failed:", err);
  }

  return NextResponse.json({ ok: true });
}
