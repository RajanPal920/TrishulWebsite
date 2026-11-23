import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

// Manually parse .env if present
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const envPath = path.resolve(__dirname, '../../.env');

if (fs.existsSync(envPath)) {
  const content = fs.readFileSync(envPath, 'utf8');
  for (const line of content.split('\n')) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const eqIdx = trimmed.indexOf('=');
    if (eqIdx > 0) {
      const key = trimmed.slice(0, eqIdx).trim();
      let val = trimmed.slice(eqIdx + 1).trim();
      if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
        val = val.slice(1, -1);
      }
      if (!process.env[key]) {
        process.env[key] = val;
      }
    }
  }
}

import { sendEmail, getEmailConfigStatus, maskEmail } from '../services/email.js';

async function main() {
  const targetEmail = process.argv[2] || 'rajanp9209022@gmail.com';
  console.log('====================================================');
  console.log('TRISHUL METALS & ALLOYS - REAL EMAIL DIAGNOSTIC TEST');
  console.log('====================================================');
  console.log(`Target Recipient: ${maskEmail(targetEmail)} (${targetEmail})`);

  const config = getEmailConfigStatus();
  console.log('\n[Provider Status]:', {
    configured: config.configured,
    activeProvider: config.provider,
    fromAddress: config.fromAddress,
    smtpHost: config.smtpHost,
    hasResendKey: config.hasResendKey,
    hasSmtpUser: config.hasSmtpUser,
  });

  if (!config.configured) {
    console.log('\n[CRITICAL]: Email delivery provider is UNCONFIGURED.');
    console.log('To enable real delivery to Gmail, configure ONE of the following options in .env or Vercel:\n');
    console.log('OPTION 1 (Recommended for Vercel): Resend REST API');
    console.log('  RESEND_API_KEY=re_your_api_key_here');
    console.log('  RESEND_FROM="Trishul Metals & Alloys" <notifications@trishulmetal.com>\n');
    console.log('OPTION 2: Gmail SMTP with App Password');
    console.log('  SMTP_HOST=smtp.gmail.com');
    console.log('  SMTP_PORT=465');
    console.log('  SMTP_USER=your_gmail_address@gmail.com');
    console.log('  SMTP_PASS=your_16_character_app_password');
    console.log('  SMTP_SECURE=true');
    console.log('  EMAIL_FROM="Trishul Metals & Alloys" <your_gmail_address@gmail.com>\n');
    console.log('OPTION 3: Custom Corporate SMTP');
    console.log('  SMTP_HOST=mail.trishulmetal.com');
    console.log('  SMTP_PORT=587');
    console.log('  SMTP_USER=export@trishulmetal.com');
    console.log('  SMTP_PASS=your_smtp_password');
    console.log('  SMTP_SECURE=false');
    console.log('  EMAIL_FROM="Trishul Metals & Alloys" <export@trishulmetal.com>');
    process.exit(1);
  }

  console.log(`\nAttempting real email dispatch to ${maskEmail(targetEmail)}...`);
  const result = await sendEmail({
    to: targetEmail,
    subject: 'Diagnostic Verification – Trishul Metals & Alloys',
    html: `
      <div style="font-family: sans-serif; background: #0b0d11; color: #fff; padding: 24px; border-radius: 6px;">
        <h2 style="color: #d4af37; margin-top: 0;">Trishul Metals &amp; Alloys</h2>
        <p>This is a real diagnostic verification email confirming that email delivery is active and functional.</p>
        <p style="color: #a1a1aa; font-size: 13px;">Timestamp: ${new Date().toISOString()}</p>
      </div>
    `,
    text: `Trishul Metals & Alloys - Real email delivery test successful at ${new Date().toISOString()}`,
    emailType: 'DIAGNOSTIC_TEST',
  });

  console.log('\nDispatch Result:');
  console.log(JSON.stringify(result, null, 2));

  if (result.success) {
    console.log('\n[SUCCESS]: Real email accepted by provider!');
  } else {
    console.log('\n[FAILED]: Email provider rejected delivery.');
  }
}

main().catch(console.error);
