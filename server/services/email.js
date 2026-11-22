import nodemailer from 'nodemailer';
import crypto from 'node:crypto';

// Cached transporter instance
let cachedTransporter = null;

export function getEmailTransporter() {
  if (cachedTransporter) return cachedTransporter;

  const host = process.env.SMTP_HOST;
  const port = parseInt(process.env.SMTP_PORT || '587', 10);
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS || process.env.SMTP_PASSWORD;
  const secure = process.env.SMTP_SECURE === 'true' || port === 465;

  if (host && user && pass) {
    cachedTransporter = nodemailer.createTransport({
      host,
      port,
      secure,
      auth: { user, pass },
      tls: { rejectUnauthorized: false },
    });
  }

  return cachedTransporter;
}

export function getDefaultFromAddress() {
  if (process.env.EMAIL_FROM) {
    return process.env.EMAIL_FROM;
  }
  if (process.env.RESEND_API_KEY) {
    return process.env.RESEND_FROM || 'Trishul Metals & Alloys <onboarding@resend.dev>';
  }
  if (process.env.SMTP_USER) {
    return `"Trishul Metals & Alloys" <${process.env.SMTP_USER}>`;
  }
  return '"Trishul Metals & Alloys" <export@trishulmetal.com>';
}

/**
 * Centralized public production domain helper.
 * Strictly avoids localhost in customer-facing emails.
 */
export function getPublicAppUrl(req) {
  if (process.env.APP_URL) return process.env.APP_URL.replace(/\/+$/, '');
  if (process.env.BASE_URL) return process.env.BASE_URL.replace(/\/+$/, '');
  if (process.env.SITE_URL) return process.env.SITE_URL.replace(/\/+$/, '');
  if (process.env.VERCEL_PROJECT_PRODUCTION_URL) return `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`;
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`;

  if (req) {
    const origin = req.headers?.origin || (req.headers?.referer ? new URL(req.headers.referer).origin : null);
    if (origin && !origin.includes('localhost') && !origin.includes('127.0.0.1')) {
      return origin.replace(/\/+$/, '');
    }
  }

  return 'https://trishul-website.vercel.app';
}

/**
 * Universal real email dispatch service.
 * Delivers via Resend REST API or Nodemailer SMTP (e.g. Gmail / Google Workspace / custom SMTP).
 * Returns real success/failure without terminal simulation masquerading as delivery.
 */
export async function sendEmail({ to, subject, html, text }) {
  const from = getDefaultFromAddress();

  const recipientList = Array.isArray(to) ? to.filter(Boolean) : [to].filter(Boolean);
  if (recipientList.length === 0) {
    return { success: false, error: 'Recipient email address is missing or invalid.', mode: 'invalid_recipient' };
  }
  const cleanTo = recipientList.length === 1 ? recipientList[0] : recipientList;

  // 1. Resend REST API
  const resendApiKey = process.env.RESEND_API_KEY;
  if (resendApiKey) {
    try {
      const resp = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${resendApiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from,
          to: Array.isArray(cleanTo) ? cleanTo : [cleanTo],
          subject,
          html,
          text: text || html.replace(/<[^>]+>/g, ' '),
        }),
      });

      const data = await resp.json();
      if (resp.ok) {
        console.log(`[Email Service] Delivered via Resend to ${Array.isArray(cleanTo) ? cleanTo.join(', ') : cleanTo}: ${data.id}`);
        return { success: true, messageId: data.id, mode: 'resend' };
      } else {
        const errorMsg = data?.message || JSON.stringify(data);
        console.error(`[Email Service Error] Resend API rejected email to ${cleanTo}:`, errorMsg);
        return { success: false, error: `Resend API Error: ${errorMsg}`, mode: 'resend_failed' };
      }
    } catch (err) {
      console.error(`[Email Service Error] Resend fetch exception:`, err.message);
      return { success: false, error: `Resend Network Error: ${err.message}`, mode: 'resend_failed' };
    }
  }

  // 2. Nodemailer SMTP (supports Gmail, Google Workspace, SendGrid, Amazon SES, cPanel)
  const transporter = getEmailTransporter();
  if (transporter) {
    try {
      const info = await transporter.sendMail({
        from,
        to: cleanTo,
        subject,
        html,
        text: text || html.replace(/<[^>]+>/g, ' '),
      });
      console.log(`[Email Service] Delivered via SMTP to ${cleanTo}: ${info.messageId}`);
      return { success: true, messageId: info.messageId, mode: 'smtp' };
    } catch (err) {
      console.error(`[Email Service Error] SMTP delivery failure to ${cleanTo}:`, err.message);
      return { success: false, error: `SMTP Delivery Error: ${err.message}`, mode: 'smtp_failed' };
    }
  }

  // 3. NO EMAIL SERVICE CONFIGURED: Return actual failure status (never simulate fake delivery)
  const unconfiguredMsg = 'Email delivery provider is not configured. Please configure SMTP credentials (SMTP_HOST, SMTP_USER, SMTP_PASS) or RESEND_API_KEY in server environment variables.';
  console.error(`[Email Service Error] Delivery aborted to ${cleanTo}: ${unconfiguredMsg}`);

  return {
    success: false,
    error: unconfiguredMsg,
    mode: 'unconfigured',
  };
}

/**
 * Common HTML Email wrapper template matching Trishul Metals & Alloys brand
 */
function renderBrandedEmailTemplate({ title, greeting, intro, contentHtml, actionButton, footerNotes }) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title}</title>
  <style>
    body { margin: 0; padding: 0; background-color: #0b0d11; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #e4e4e7; }
    .container { max-width: 600px; margin: 30px auto; background-color: #12151b; border: 1px solid #272a31; border-radius: 6px; overflow: hidden; }
    .header { background: linear-gradient(135deg, #181c24 0%, #0e1014 100%); padding: 24px 32px; border-bottom: 2px solid #d4af37; }
    .brand-title { font-size: 20px; font-weight: 700; color: #ffffff; letter-spacing: 0.5px; margin: 0; }
    .brand-subtitle { font-size: 11px; color: #d4af37; text-transform: uppercase; letter-spacing: 1.5px; margin-top: 4px; }
    .content { padding: 32px; }
    .greeting { font-size: 15px; font-weight: 600; color: #ffffff; margin-bottom: 16px; }
    .paragraph { font-size: 14px; line-height: 1.6; color: #d1d5db; margin-bottom: 16px; }
    .box { background-color: #1a1e26; border: 1px solid #2e3440; border-radius: 4px; padding: 18px; margin: 20px 0; }
    .status-badge { display: inline-block; padding: 4px 12px; border-radius: 12px; font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.8px; }
    .status-pending { background-color: rgba(56, 189, 248, 0.15); color: #38bdf8; border: 1px solid rgba(56, 189, 248, 0.3); }
    .status-progress { background-color: rgba(245, 158, 11, 0.15); color: #fbbf24; border: 1px solid rgba(245, 158, 11, 0.3); }
    .status-resolved { background-color: rgba(16, 185, 129, 0.15); color: #34d399; border: 1px solid rgba(16, 185, 129, 0.3); }
    .status-rejected { background-color: rgba(239, 68, 68, 0.15); color: #f87171; border: 1px solid rgba(239, 68, 68, 0.3); }
    .status-awaiting { background-color: rgba(168, 85, 247, 0.15); color: #c084fc; border: 1px solid rgba(168, 85, 247, 0.3); }
    .btn { display: inline-block; background-color: #d4af37; color: #0b0d11 !important; text-decoration: none; padding: 12px 28px; border-radius: 4px; font-size: 13px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; margin: 20px 0; }
    .footer { background-color: #0c0e12; padding: 24px 32px; border-top: 1px solid #20242c; font-size: 12px; color: #71717a; line-height: 1.5; }
    .footer a { color: #d4af37; text-decoration: none; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1 class="brand-title">Trishul Metals &amp; Alloys</h1>
      <div class="brand-subtitle">Specialist Exporter · CRA Piping &amp; Flanges</div>
    </div>
    <div class="content">
      <div class="greeting">${greeting}</div>
      ${intro ? `<div class="paragraph">${intro}</div>` : ''}
      ${contentHtml}
      ${actionButton ? `<div style="text-align: center;"><a href="${actionButton.url}" class="btn">${actionButton.label}</a></div>` : ''}
      ${footerNotes ? `<div class="paragraph" style="font-size: 12px; color: #9ca3af; margin-top: 24px;">${footerNotes}</div>` : ''}
    </div>
    <div class="footer">
      <strong>Trishul Metals &amp; Alloys</strong><br>
      Plot No. 1818, Road No. 23, Kalamboli Warehouse Complex (KWC), Navi Mumbai 410218, India<br>
      Tel: +91 79772 81567 · Email: <a href="mailto:export@trishulmetal.com">export@trishulmetal.com</a> · Web: <a href="https://www.trishulmetal.com">www.trishulmetal.com</a>
    </div>
  </div>
</body>
</html>`;
}

/**
 * 1. Password Reset Email
 */
export async function sendPasswordResetEmail({ to, customerName, resetToken, baseUrl, req }) {
  const publicUrl = baseUrl || getPublicAppUrl(req);
  const resetUrl = `${publicUrl.replace(/\/+$/, '')}/reset-password?token=${encodeURIComponent(resetToken)}`;
  const subject = 'Reset Your Trishul Metals Account Password';

  const html = renderBrandedEmailTemplate({
    title: 'Reset Your Password — Trishul Metals & Alloys',
    greeting: `Hello ${customerName || 'Customer'},`,
    intro: 'We received a request to reset the password for your Trishul Metals & Alloys account.',
    contentHtml: `
      <div class="box">
        <p class="paragraph" style="margin: 0;">Click the button below to establish a new password for your work email (<strong>${to}</strong>):</p>
      </div>
    `,
    actionButton: {
      label: 'Reset Password',
      url: resetUrl,
    },
    footerNotes: `This link is valid for <strong>30 minutes</strong> and can only be used once. If you did not request a password change, you can safely ignore this email — your existing password remains completely secure.<br><br>Direct link: <a href="${resetUrl}" style="color: #d4af37; word-break: break-all;">${resetUrl}</a>`,
  });

  const text = `Hello ${customerName || 'Customer'},

We received a request to reset the password for your Trishul Metals & Alloys account.

Click the secure link below to create a new password:
${resetUrl}

This link is valid for 30 minutes and can only be used once.

If you did not request this change, you can safely ignore this email.

Regards,
Trishul Metals & Alloys
export@trishulmetal.com | +91 79772 81567`;

  return sendEmail({ to, subject, html, text });
}

/**
 * 2. Email A — Request Received
 */
export async function sendRequestReceivedEmail({ to, customerName, reference, summary, baseUrl, req }) {
  const publicUrl = baseUrl || getPublicAppUrl(req);
  const portalUrl = `${publicUrl.replace(/\/+$/, '')}/portal`;
  const subject = `Your Request Has Been Received — Trishul Metals & Alloys [${reference}]`;

  const html = renderBrandedEmailTemplate({
    title: 'Your Request Has Been Received — Trishul Metals & Alloys',
    greeting: `Hello ${customerName || 'Customer'},`,
    intro: 'Thank you for contacting Trishul Metals & Alloys. We have successfully received your request.',
    contentHtml: `
      <div class="box">
        <div style="margin-bottom: 10px;">
          <strong style="color: #ffffff;">Request Reference:</strong> <span style="font-family: monospace; color: #d4af37; font-size: 14px;">${reference}</span>
        </div>
        <div style="margin-bottom: 10px;">
          <strong style="color: #ffffff;">Current Status:</strong> <span class="status-badge status-pending">Pending</span>
        </div>
        ${summary ? `<div style="margin-top: 12px; padding-top: 12px; border-top: 1px solid #2e3440; font-size: 13px; color: #9ca3af;"><strong>Details:</strong> ${summary}</div>` : ''}
      </div>
      <p class="paragraph">Our engineering and export desk will review your technical specifications, grade requirements, and delivery schedule. A technical representative will be in touch shortly.</p>
    `,
    actionButton: {
      label: 'View Request in Dashboard',
      url: portalUrl,
    },
    footerNotes: 'You can track real-time status and view documentation anytime in your Customer Portal.',
  });

  const text = `Hello ${customerName || 'Customer'},

Thank you for contacting Trishul Metals & Alloys.
We have successfully received your request.

Request ID: ${reference}
Current Status: Pending
${summary ? `Details: ${summary}\n` : ''}
Our team will review your request and get back to you.

Regards,
Trishul Metals & Alloys
export@trishulmetal.com | +91 79772 81567`;

  return sendEmail({ to, subject, html, text });
}

/**
 * 3. Email B, C, D, E — Status Change & Admin Action Notifications
 */
export async function sendRequestStatusUpdateEmail({
  to,
  customerName,
  reference,
  oldStatus,
  newStatus,
  adminMessage,
  baseUrl,
  req,
}) {
  const publicUrl = baseUrl || getPublicAppUrl(req);
  const portalUrl = `${publicUrl.replace(/\/+$/, '')}/portal`;
  const normalizedStatus = (newStatus || '').toLowerCase().trim();

  const formattedDate = new Date().toLocaleString('en-IN', {
    timeZone: 'Asia/Kolkata',
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  }) + ' IST';

  let subject = `Your Request ${reference} Has Been Updated – Trishul Metals & Alloys`;
  let badgeClass = 'status-pending';
  let statusHeadline = `Your request has been marked as <strong>${newStatus}</strong>.`;

  if (normalizedStatus === 'pending') {
    badgeClass = 'status-pending';
    statusHeadline = 'Your request has been logged and is awaiting technical review.';
  } else if (normalizedStatus.includes('review')) {
    badgeClass = 'status-progress';
    statusHeadline = 'Your request is currently under technical review by our engineering desk.';
  } else if (normalizedStatus.includes('progress')) {
    badgeClass = 'status-progress';
    statusHeadline = 'Your request is actively in progress with our technical team.';
  } else if (normalizedStatus.includes('approved')) {
    badgeClass = 'status-resolved';
    statusHeadline = 'Your quotation or request has been approved.';
  } else if (
    normalizedStatus.includes('completed') ||
    normalizedStatus.includes('closed') ||
    normalizedStatus.includes('resolved')
  ) {
    badgeClass = 'status-resolved';
    statusHeadline = `Your request has been marked as <strong>${newStatus}</strong>.`;
  } else if (normalizedStatus.includes('reject') || normalizedStatus.includes('cancel')) {
    badgeClass = 'status-rejected';
    statusHeadline = `Your request status has been updated to <strong>${newStatus}</strong>.`;
  }

  const html = renderBrandedEmailTemplate({
    title: subject,
    greeting: `Hello ${customerName || 'Customer'},`,
    intro: statusHeadline,
    contentHtml: `
      <div class="box">
        <table style="width: 100%; border-collapse: collapse; font-size: 13px;">
          <tr>
            <td style="padding: 6px 0; color: #a1a1aa; width: 140px;">Request ID:</td>
            <td style="padding: 6px 0; font-family: monospace; font-weight: 700; color: #d4af37; font-size: 14px;">${reference}</td>
          </tr>
          ${oldStatus ? `
          <tr>
            <td style="padding: 6px 0; color: #a1a1aa;">Previous Status:</td>
            <td style="padding: 6px 0; color: #71717a;">${oldStatus}</td>
          </tr>` : ''}
          <tr>
            <td style="padding: 6px 0; color: #a1a1aa;">Current Status:</td>
            <td style="padding: 6px 0;"><span class="status-badge ${badgeClass}">${newStatus}</span></td>
          </tr>
          <tr>
            <td style="padding: 6px 0; color: #a1a1aa;">Date &amp; Time:</td>
            <td style="padding: 6px 0; color: #e4e4e7;">${formattedDate}</td>
          </tr>
        </table>
        ${adminMessage ? `
        <div style="margin-top: 14px; padding-top: 14px; border-top: 1px solid #2e3440;">
          <strong style="color: #ffffff; display: block; margin-bottom: 6px;">Message from Technical Desk:</strong>
          <div style="background-color: #12151b; padding: 12px; border-left: 3px solid #d4af37; border-radius: 2px; font-size: 13px; color: #e4e4e7; line-height: 1.6;">
            ${adminMessage.replace(/\n/g, '<br>')}
          </div>
        </div>` : ''}
      </div>
      <p class="paragraph">You can track your request anytime through your customer dashboard.</p>
    `,
    actionButton: {
      label: 'Track Your Request',
      url: portalUrl,
    },
    footerNotes: `Direct dashboard link: <a href="${portalUrl}" style="color: #d4af37; word-break: break-all;">${portalUrl}</a>`,
  });

  const text = `Hello ${customerName || 'Customer'},

Your request has been marked as ${newStatus}.

Request ID: ${reference}
${oldStatus ? `Previous Status: ${oldStatus}\n` : ''}Current Status: ${newStatus}
Date: ${formattedDate}
${adminMessage ? `\nMessage from Technical Desk:\n${adminMessage}\n` : ''}
You can track your request anytime through your customer dashboard:
${portalUrl}

Regards,
Trishul Metals & Alloys
export@trishulmetal.com | +91 79772 81567`;

  return sendEmail({ to, subject, html, text });
}

/**
 * 4. Email F — Admin Reply / Customer Message
 */
export async function sendAdminReplyEmail({
  to,
  customerName,
  reference,
  currentStatus = 'In Progress',
  adminMessage,
  baseUrl,
  req,
}) {
  const publicUrl = baseUrl || getPublicAppUrl(req);
  const portalUrl = `${publicUrl.replace(/\/+$/, '')}/portal`;
  const subject = `New Response to Your Trishul Metals & Alloys Request [${reference}]`;

  const html = renderBrandedEmailTemplate({
    title: subject,
    greeting: `Hello ${customerName || 'Customer'},`,
    intro: 'A technical representative from Trishul Metals & Alloys has posted an official response regarding your request.',
    contentHtml: `
      <div class="box">
        <div style="margin-bottom: 10px;">
          <strong style="color: #ffffff;">Request Reference:</strong> <span style="font-family: monospace; color: #d4af37; font-size: 14px;">${reference}</span>
        </div>
        <div style="margin-bottom: 12px;">
          <strong style="color: #ffffff;">Current Status:</strong> <span class="status-badge status-progress">${currentStatus}</span>
        </div>
        <div style="margin-top: 14px; padding-top: 14px; border-top: 1px solid #2e3440;">
          <strong style="color: #ffffff; display: block; margin-bottom: 6px;">Desk Response:</strong>
          <div style="background-color: #12151b; padding: 12px; border-left: 3px solid #d4af37; border-radius: 2px; font-size: 13px; color: #e4e4e7; line-height: 1.6;">
            ${adminMessage.replace(/\n/g, '<br>')}
          </div>
        </div>
      </div>
    `,
    actionButton: {
      label: 'View in Portal & Respond',
      url: portalUrl,
    },
    footerNotes: `Direct link: <a href="${portalUrl}" style="color: #d4af37; word-break: break-all;">${portalUrl}</a>`,
  });

  const text = `Hello ${customerName || 'Customer'},

A technical representative from Trishul Metals & Alloys has posted an official response regarding your request.

Request ID: ${reference}
Current Status: ${currentStatus}

Desk Response:
${adminMessage}

View and reply via your customer portal:
${portalUrl}

Regards,
Trishul Metals & Alloys
export@trishulmetal.com | +91 79772 81567`;

  return sendEmail({ to, subject, html, text });
}
