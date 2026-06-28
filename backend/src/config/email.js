const nodemailer = require('nodemailer');

/**
 * Creates and returns a configured Nodemailer transporter.
 * Supports any SMTP provider via environment variables.
 * In development, works with Mailtrap; in production, use SendGrid/SES/etc.
 */
const createTransporter = () => {
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT, 10) || 587,
    secure: parseInt(process.env.SMTP_PORT, 10) === 465,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  return transporter;
};

module.exports = createTransporter;
