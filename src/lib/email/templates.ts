import { PROFILE } from "@/lib/profile";
import { SITE_URL } from "@/lib/site";

/**
 * Email templates in the site's visual language: near-black canvas, monochrome
 * type, hairline rules, mono eyebrows led by a dash. Inline styles and table
 * layout only — the lowest common denominator email clients accept.
 *
 * Three things the page can do that an inbox cannot, and how each degrades:
 * - **The N-mark.** Gmail strips inline SVG and blocks data URIs, so the mark
 *   degrades to type. `N.` rather than `N`, because the dot is half the
 *   letterform (Logo.tsx). No container box — 4b/4c draw the mark bare.
 * - **Instrument Serif.** Not web-safe, and §3 confines the accent to three
 *   places on the page anyway. Left out entirely rather than substituted.
 * - **Gradients and blur.** Unreliable across clients; the identity is carried
 *   by hairlines and type weight instead.
 */

const bg = "#0a0a0b"; // --background
const card = "#101012";
const quote = "#0d0d0f";
const border = "#26262b"; // --border
const rule = "#4d4d55"; // the eyebrow dash — foreground/30 over the canvas
const fg = "#fafafa"; // --foreground
const muted = "#8f8f99"; // --muted-foreground
const body = "#c9c9d1";
const font =
  "-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif";
const mono = "ui-monospace,'SF Mono',Menlo,Consolas,monospace";

/**
 * The page's eyebrow: a 24px hairline, then mono caps. The `&nbsp;` at font-size
 * 0 is what stops Outlook collapsing a zero-content cell to nothing.
 */
function eyebrow(text: string, topMargin = 0): string {
  return `<table role="presentation" border="0" cellpadding="0" cellspacing="0" style="margin:${topMargin}px 0 16px;">
  <tr>
    <td style="width:24px;font-size:0;line-height:0;">
      <div style="height:1px;background:${rule};font-size:0;line-height:0;">&nbsp;</div>
    </td>
    <td style="padding-left:12px;font-family:${mono};font-size:10.5px;letter-spacing:2.6px;text-transform:uppercase;color:${muted};white-space:nowrap;">${text}</td>
  </tr>
</table>`;
}

/** Section heading inside the card — the h1 sizing follows the page's display scale. */
function heading(text: string): string {
  return `<h1 style="margin:0;font-family:${font};font-size:25px;line-height:1.2;font-weight:600;letter-spacing:-0.5px;color:${fg};">${text}</h1>`;
}

/** One label/value row on a hairline — the page's fact-ledger pattern. */
function row(label: string, value: string): string {
  return `<tr>
    <td style="padding:11px 16px 11px 0;border-top:1px solid ${border};font-family:${mono};font-size:10.5px;letter-spacing:2.2px;text-transform:uppercase;color:${muted};width:96px;vertical-align:top;white-space:nowrap;">${label}</td>
    <td style="padding:11px 0;border-top:1px solid ${border};font-family:${font};font-size:14.5px;line-height:1.5;color:${fg};vertical-align:top;">${value}</td>
  </tr>`;
}

/** Pill button. `fill` gives the inverted primary; otherwise it's the outline. */
function button(href: string, label: string, fill: boolean): string {
  const shell = fill
    ? `background:${fg};`
    : `border:1px solid ${border};background:${card};`;
  return `<table role="presentation" border="0" cellpadding="0" cellspacing="0"><tr>
    <td style="border-radius:999px;${shell}">
      <a href="${href}" style="display:inline-block;padding:13px 28px;font-family:${font};font-size:14px;font-weight:600;letter-spacing:-0.1px;color:${fill ? bg : fg};text-decoration:none;">${label}</a>
    </td>
  </tr></table>`;
}

function shell(content: string, preheader: string): string {
  return `<!DOCTYPE html>
<html lang="en">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="color-scheme" content="dark"><meta name="supported-color-schemes" content="dark"></head>
<body style="margin:0;padding:0;background:${bg};color:${fg};">
<!-- Preheader for the inbox preview line. Deliberately ONE hiding technique.
     The previous stack — display:none *plus* font-size:1px *plus* opacity:0
     *plus* a colour identical to the background — is the exact signature of
     keyword stuffing, and filters score each of those rules separately. -->
<div style="display:none;max-height:0;overflow:hidden;mso-hide:all;">${preheader}</div>
<table role="presentation" border="0" width="100%" cellpadding="0" cellspacing="0" style="background:${bg};padding:36px 16px;">
<tr><td align="center">
<table role="presentation" border="0" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;">

  <!-- Header: the mark bare, as the design draws it. Nothing on the right —
       the footer already carries the identity line, and a dateline beside the
       name was saying nothing twice. -->
  <tr><td style="padding:0 4px 18px;font-family:${font};font-size:17px;font-weight:600;letter-spacing:-0.4px;color:${fg};">
    N.<span style="padding-left:11px;font-size:14px;letter-spacing:-0.2px;">${PROFILE.name}</span>
  </td></tr>

  <!-- Card -->
  <tr><td style="background:${card};border:1px solid ${border};border-radius:22px;padding:38px 34px;">
    ${content}
  </td></tr>

  <!-- Footer, on its own hairline -->
  <tr><td style="padding:20px 4px 0;">
    <div style="height:1px;background:${border};font-size:0;line-height:0;">&nbsp;</div>
    <p style="margin:16px 0 0;font-family:${mono};font-size:10px;letter-spacing:2.2px;text-transform:uppercase;color:${muted};line-height:1.9;">
      <a href="${SITE_URL}" style="color:${muted};text-decoration:none;">navdeepbhanderi.dev</a>
      &nbsp;&middot;&nbsp; ${PROFILE.title}
      &nbsp;&middot;&nbsp; ${PROFILE.locationShort}
    </p>
  </td></tr>

</table>
</td></tr>
</table>
</body>
</html>`;
}

/**
 * The quoted message. One cell, not two: the old left-rule-as-its-own-`<td>`
 * needed `border-left:0` on the neighbour to hide a seam, and clients that drop
 * that rule rendered a broken join. A single cell with a 2px left border is the
 * same picture and survives everywhere.
 */
function messageQuote(message: string): string {
  return `<table role="presentation" border="0" width="100%" cellpadding="0" cellspacing="0">
  <tr>
    <td style="padding:16px 20px;background:${quote};border:1px solid ${border};border-left:2px solid ${fg};border-radius:4px 14px 14px 4px;font-family:${font};font-size:14.5px;line-height:1.75;color:#d6d6dc;white-space:pre-wrap;word-break:break-word;">${message}</td>
  </tr>
</table>`;
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export function ownerNotificationEmail(input: {
  name: string;
  email: string;
  message: string;
}): { subject: string; html: string; text: string } {
  const name = escapeHtml(input.name);
  const email = escapeHtml(input.email);
  const message = escapeHtml(input.message);
  const firstName = name.split(" ")[0];
  const when = new Intl.DateTimeFormat("en-IN", {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: "Asia/Kolkata",
  }).format(new Date());

  const html = shell(
    `
    ${eyebrow("New inquiry")}
    ${heading(`New message from ${name}`)}

    <table role="presentation" border="0" width="100%" cellpadding="0" cellspacing="0" style="margin:26px 0 0;">
      ${row("From", name)}
      ${row("Email", `<a href="mailto:${email}" style="color:${fg};text-decoration:none;border-bottom:1px solid ${border};">${email}</a>`)}
      ${row("Received", `${when} IST`)}
    </table>

    ${eyebrow("Message", 28)}
    ${messageQuote(message)}

    <div style="margin:30px 0 0;">${button(
      `mailto:${email}?subject=Re:%20Your%20message%20via%20navdeepbhanderi.dev`,
      `Reply to ${firstName}`,
      true
    )}</div>
  `,
    `${name} (${email}) — ${escapeHtml(input.message.slice(0, 90))}`
  );

  return {
    subject: `Portfolio inquiry — ${input.name}`,
    html,
    text: `New message from ${input.name} <${input.email}> (${when} IST)\n\n${input.message}`,
  };
}

export function autoReplyEmail(input: {
  name: string;
  message: string;
}): { subject: string; html: string; text: string } {
  const firstName = escapeHtml(input.name.trim().split(/\s+/)[0]);
  const message = escapeHtml(input.message);

  const html = shell(
    `
    ${eyebrow("Message received")}
    ${heading(`Thanks for reaching out, ${firstName}`)}

    <p style="margin:20px 0 0;font-family:${font};font-size:15px;line-height:1.75;color:${body};">
      Your message just landed in my inbox. I read every note personally, and
      I&rsquo;ll get back to you <strong style="color:${fg};font-weight:600;">within 24 hours</strong>.
    </p>

    ${eyebrow("Your message", 28)}
    ${messageQuote(message)}

    <p style="margin:28px 0 0;font-family:${font};font-size:15px;line-height:1.75;color:${body};">
      In the meantime, the work is all on the site &mdash; each project is written
      up as a short case study.
    </p>

    <div style="margin:22px 0 0;">${button(`${SITE_URL}/#projects`, "View projects &#8599;", false)}</div>

    <div style="margin:32px 0 0;">
      <div style="height:1px;background:${border};font-size:0;line-height:0;">&nbsp;</div>
      <p style="margin:18px 0 0;font-family:${font};font-size:15px;line-height:1.6;color:${body};">
        &mdash; ${PROFILE.name}<br>
        <span style="font-family:${mono};font-size:11px;letter-spacing:2px;text-transform:uppercase;color:${muted};">${PROFILE.title}</span>
      </p>
    </div>
  `,
    `Hi ${firstName}, your message landed in my inbox. I read every note personally and will reply within 24 hours.`
  );

  return {
    subject: "Your message is in — I'll reply within 24 hours",
    html,
    text: `Thanks for reaching out, ${firstName}!\n\nYour message landed in my inbox — I'll get back to you within 24 hours.\n\nYour message:\n${input.message}\n\n— ${PROFILE.name}\n${PROFILE.title}\n${SITE_URL}`,
  };
}
