const createTransporter = require('../config/email');

/**
 * Email service — sends transactional emails using Nodemailer.
 * All emails use inline HTML templates for zero external dependencies.
 */

const transporter = createTransporter();

const FROM = `"${process.env.EMAIL_FROM_NAME || 'Orbit Cloud IDE'}" <${process.env.EMAIL_FROM || 'noreply@orbit.dev'}>`;

/**
 * Base email template wrapper with Orbit branding.
 * @param {string} title - Email title.
 * @param {string} body - Inner HTML content.
 * @returns {string} Complete HTML email.
 */
const emailTemplate = (title, body) => `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title}</title>
</head>
<body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #0f0f23; color: #e2e8f0;">
  <div style="max-width: 600px; margin: 0 auto; padding: 40px 20px;">
    <!-- Header -->
    <div style="text-align: center; margin-bottom: 40px;">
      <div style="display: inline-block; background: linear-gradient(135deg, #6366f1, #8b5cf6); padding: 12px 24px; border-radius: 12px;">
        <span style="font-size: 24px; font-weight: 700; color: #ffffff; letter-spacing: 1px;">⟡ Orbit</span>
      </div>
    </div>

    <!-- Content Card -->
    <div style="background-color: #1a1a2e; border-radius: 16px; padding: 40px 32px; border: 1px solid #2d2d44;">
      <h1 style="color: #f8fafc; font-size: 24px; margin: 0 0 16px 0; font-weight: 600;">${title}</h1>
      ${body}
    </div>

    <!-- Footer -->
    <div style="text-align: center; margin-top: 32px; color: #64748b; font-size: 13px;">
      <p style="margin: 0 0 8px 0;">Orbit Cloud IDE — Code anywhere, build anything.</p>
      <p style="margin: 0;">© ${new Date().getFullYear()} Orbit. All rights reserved.</p>
    </div>
  </div>
</body>
</html>
`;

/**
 * Sends email verification link.
 * @param {string} to - Recipient email.
 * @param {string} name - User's name.
 * @param {string} token - Raw verification token.
 */
const sendVerificationEmail = async (to, name, token) => {
  const verificationUrl = `${process.env.CLIENT_URL}/verify-email/${token}`;

  const body = `
    <p style="color: #cbd5e1; font-size: 16px; line-height: 1.6; margin: 0 0 24px 0;">
      Hi ${name},
    </p>
    <p style="color: #cbd5e1; font-size: 16px; line-height: 1.6; margin: 0 0 24px 0;">
      Welcome to Orbit! Please verify your email address to get started.
    </p>
    <div style="text-align: center; margin: 32px 0;">
      <a href="${verificationUrl}" style="display: inline-block; background: linear-gradient(135deg, #6366f1, #8b5cf6); color: #ffffff; padding: 14px 32px; border-radius: 8px; text-decoration: none; font-size: 16px; font-weight: 600;">
        Verify Email Address
      </a>
    </div>
    <p style="color: #94a3b8; font-size: 14px; line-height: 1.6; margin: 0 0 8px 0;">
      Or copy this link into your browser:
    </p>
    <p style="color: #818cf8; font-size: 14px; word-break: break-all; margin: 0 0 24px 0;">
      ${verificationUrl}
    </p>
    <p style="color: #64748b; font-size: 13px; margin: 0;">
      This link expires in 24 hours. If you didn't create an account, you can safely ignore this email.
    </p>
  `;

  await transporter.sendMail({
    from: FROM,
    to,
    subject: 'Verify your Orbit account',
    html: emailTemplate('Verify Your Email', body),
  });
};

/**
 * Sends password reset link.
 * @param {string} to - Recipient email.
 * @param {string} name - User's name.
 * @param {string} token - Raw reset token.
 */
const sendPasswordResetEmail = async (to, name, token) => {
  const resetUrl = `${process.env.CLIENT_URL}/reset-password/${token}`;

  const body = `
    <p style="color: #cbd5e1; font-size: 16px; line-height: 1.6; margin: 0 0 24px 0;">
      Hi ${name},
    </p>
    <p style="color: #cbd5e1; font-size: 16px; line-height: 1.6; margin: 0 0 24px 0;">
      We received a request to reset your password. Click the button below to choose a new one.
    </p>
    <div style="text-align: center; margin: 32px 0;">
      <a href="${resetUrl}" style="display: inline-block; background: linear-gradient(135deg, #ef4444, #f97316); color: #ffffff; padding: 14px 32px; border-radius: 8px; text-decoration: none; font-size: 16px; font-weight: 600;">
        Reset Password
      </a>
    </div>
    <p style="color: #94a3b8; font-size: 14px; line-height: 1.6; margin: 0 0 8px 0;">
      Or copy this link into your browser:
    </p>
    <p style="color: #818cf8; font-size: 14px; word-break: break-all; margin: 0 0 24px 0;">
      ${resetUrl}
    </p>
    <p style="color: #64748b; font-size: 13px; margin: 0;">
      This link expires in 10 minutes. If you didn't request a password reset, please ignore this email and ensure your account is secure.
    </p>
  `;

  await transporter.sendMail({
    from: FROM,
    to,
    subject: 'Reset your Orbit password',
    html: emailTemplate('Reset Your Password', body),
  });
};

/**
 * Sends welcome email after successful verification.
 * @param {string} to - Recipient email.
 * @param {string} name - User's name.
 */
const sendWelcomeEmail = async (to, name) => {
  const dashboardUrl = `${process.env.CLIENT_URL}/dashboard`;

  const body = `
    <p style="color: #cbd5e1; font-size: 16px; line-height: 1.6; margin: 0 0 24px 0;">
      Hi ${name},
    </p>
    <p style="color: #cbd5e1; font-size: 16px; line-height: 1.6; margin: 0 0 24px 0;">
      Your email has been verified! You're all set to start building with Orbit.
    </p>
    <div style="text-align: center; margin: 32px 0;">
      <a href="${dashboardUrl}" style="display: inline-block; background: linear-gradient(135deg, #10b981, #059669); color: #ffffff; padding: 14px 32px; border-radius: 8px; text-decoration: none; font-size: 16px; font-weight: 600;">
        Go to Dashboard
      </a>
    </div>
    <div style="background-color: #16162a; border-radius: 12px; padding: 24px; margin: 24px 0; border: 1px solid #2d2d44;">
      <p style="color: #a5b4fc; font-size: 14px; font-weight: 600; margin: 0 0 12px 0;">🚀 Quick Start</p>
      <ul style="color: #94a3b8; font-size: 14px; line-height: 2; margin: 0; padding-left: 20px;">
        <li>Create your first workspace</li>
        <li>Import a Git repository</li>
        <li>Invite team members</li>
        <li>Start coding in the cloud</li>
      </ul>
    </div>
  `;

  await transporter.sendMail({
    from: FROM,
    to,
    subject: 'Welcome to Orbit! 🚀',
    html: emailTemplate('Welcome to Orbit!', body),
  });
};

module.exports = {
  sendVerificationEmail,
  sendPasswordResetEmail,
  sendWelcomeEmail,
};
