import { PROFILE } from "@/lib/profile";
import { SITE_URL } from "@/lib/site";

/**
 * Email templates in the site's visual language: near-black canvas,
 * monochrome type, silver accents, mono eyebrows. Inline styles +
 * table layout only — the lowest common denominator email clients accept.
 */

const bg = "#0a0a0b";
const card = "#111113";
const border = "#26262b";
const fg = "#fafafa";
const muted = "#8b8b96";
const font =
  "-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif";
const mono = "ui-monospace,'SF Mono',Menlo,Consolas,monospace";

function eyebrow(text: string): string {
  return `<p style="margin:0 0 14px;font-family:${mono};font-size:11px;letter-spacing:3px;text-transform:uppercase;color:${muted};">${text}</p>`;
}

function shell(content: string, preheader: string): string {
  return `<!DOCTYPE html>
<html lang="en">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="color-scheme" content="dark"></head>
<body style="margin:0;padding:0;background:${bg};color:${fg};">
<!-- Preheader text for inbox preview and lower SpamAssassin score -->
<div style="display:none;font-size:1px;color:#222222;line-height:1px;max-height:0px;max-width:0px;opacity:0;overflow:hidden;">${preheader}</div>
<table role="presentation" border="0" width="100%" cellpadding="0" cellspacing="0" style="background:${bg};padding:32px 16px;">
<tr><td align="center">
<table role="presentation" border="0" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;">

  <!-- Header -->
  <tr><td style="padding:0 8px 20px;">
    <table role="presentation" border="0" cellpadding="0" cellspacing="0"><tr>
      <td style="width:36px;height:36px;border:1px solid ${border};border-radius:10px;text-align:center;vertical-align:middle;font-family:${mono};font-size:14px;font-weight:600;color:${fg};">NB</td>
      <td style="padding-left:12px;font-family:${font};font-size:14px;font-weight:600;color:${fg};">${PROFILE.name}</td>
    </tr></table>
  </td></tr>

  <!-- Card -->
  <tr><td style="background:${card};border:1px solid ${border};border-radius:20px;padding:36px 32px;">
    ${content}
  </td></tr>

  <!-- Footer -->
  <tr><td style="padding:22px 8px 0;text-align:center;">
    <p style="margin:0;font-family:${mono};font-size:11px;letter-spacing:2px;text-transform:uppercase;color:${muted};">
      <a href="${SITE_URL}" style="color:${muted};text-decoration:none;">navdeepbhanderi.dev</a>
      &nbsp;·&nbsp; Software Engineer &nbsp;·&nbsp; Junagadh, IN
    </p>
  </td></tr>

</table>
</td></tr>
</table>
</body>
</html>`;
}

function messageQuote(message: string): string {
  return `<table role="presentation" border="0" width="100%" cellpadding="0" cellspacing="0" style="margin:18px 0 0;">
  <tr>
    <td style="width:3px;background:${fg};border-radius:99px;"></td>
    <td style="padding:14px 18px;background:#0d0d0f;border:1px solid ${border};border-left:0;border-radius:0 14px 14px 0;font-family:${font};font-size:14px;line-height:1.7;color:#d6d6dc;white-space:pre-wrap;">${message}</td>
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
  const when = new Intl.DateTimeFormat("en-IN", {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: "Asia/Kolkata",
  }).format(new Date());

  const html = shell(`
    ${eyebrow("New inquiry — portfolio")}
    <h1 style="margin:0;font-family:${font};font-size:24px;font-weight:700;letter-spacing:-0.5px;color:${fg};">New message from ${name}</h1>

    <table role="presentation" border="0" width="100%" cellpadding="0" cellspacing="0" style="margin:24px 0 0;">
      <tr>
        <td style="padding:10px 0;border-top:1px solid ${border};font-family:${mono};font-size:11px;letter-spacing:2px;text-transform:uppercase;color:${muted};width:90px;">From</td>
        <td style="padding:10px 0;border-top:1px solid ${border};font-family:${font};font-size:14px;color:${fg};">${name}</td>
      </tr>
      <tr>
        <td style="padding:10px 0;border-top:1px solid ${border};font-family:${mono};font-size:11px;letter-spacing:2px;text-transform:uppercase;color:${muted};">Email</td>
        <td style="padding:10px 0;border-top:1px solid ${border};font-family:${font};font-size:14px;"><a href="mailto:${email}" style="color:${fg};">${email}</a></td>
      </tr>
      <tr>
        <td style="padding:10px 0;border-top:1px solid ${border};font-family:${mono};font-size:11px;letter-spacing:2px;text-transform:uppercase;color:${muted};">Received</td>
        <td style="padding:10px 0;border-top:1px solid ${border};font-family:${font};font-size:14px;color:${fg};">${when} IST</td>
      </tr>
    </table>

    ${eyebrow("Message").replace("margin:0 0 14px", "margin:26px 0 0")}
    ${messageQuote(message)}

    <table role="presentation" border="0" cellpadding="0" cellspacing="0" style="margin:28px 0 0;"><tr>
      <td style="border-radius:999px;background:${fg};">
        <a href="mailto:${email}?subject=Re:%20Your%20message%20via%20navdeepbhanderi.dev" style="display:inline-block;padding:12px 26px;font-family:${font};font-size:14px;font-weight:600;color:#0a0a0b;text-decoration:none;">Reply to ${name.split(" ")[0]}</a>
      </td>
    </tr></table>
  `, `New inquiry from ${name} (${email}): "${escapeHtml(input.message.slice(0, 85))}..."`);

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

  const html = shell(`
    ${eyebrow("Message received")}
    <h1 style="margin:0;font-family:${font};font-size:24px;font-weight:700;letter-spacing:-0.5px;color:${fg};">Thanks for reaching out, ${firstName}</h1>

    <p style="margin:18px 0 0;font-family:${font};font-size:15px;line-height:1.75;color:#c9c9d1;">
      Your message just landed safely in my inbox. I read every note personally,
      and I&rsquo;ll get back to you <strong style="color:${fg};">within 24 hours</strong>.
    </p>

    ${eyebrow("Your message").replace("margin:0 0 14px", "margin:26px 0 0")}
    ${messageQuote(message)}

    <p style="margin:26px 0 0;font-family:${font};font-size:15px;line-height:1.75;color:#c9c9d1;">
      In the meantime, feel free to explore my work.
    </p>

    <table role="presentation" border="0" cellpadding="0" cellspacing="0" style="margin:20px 0 0;"><tr>
      <td style="border:1px solid ${border};border-radius:999px;">
        <a href="${SITE_URL}/#projects" style="display:inline-block;padding:12px 26px;font-family:${font};font-size:14px;font-weight:600;color:${fg};text-decoration:none;">View projects &#8599;</a>
      </td>
    </tr></table>

    <p style="margin:30px 0 0;font-family:${font};font-size:15px;line-height:1.6;color:#c9c9d1;">
      &mdash; ${PROFILE.name}<br>
      <span style="font-family:${mono};font-size:12px;letter-spacing:1px;color:${muted};">Software Engineer</span>
    </p>
  `, `Hi ${firstName}, your message landed safely in my inbox. I read every note personally and will get back to you within 24 hours.`);

  return {
    subject: "Your message is in — I'll reply within 24 hours",
    html,
    text: `Thanks for reaching out, ${firstName}!\n\nYour message landed safely in my inbox — I'll get back to you within 24 hours.\n\nYour message:\n${input.message}\n\n— ${PROFILE.name}\n${SITE_URL}`,
  };
}
