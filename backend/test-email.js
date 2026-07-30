require('dotenv').config();
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT, 10) || 587,
  secure: parseInt(process.env.SMTP_PORT, 10) === 465,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

async function test() {
  try {
    const info = await transporter.sendMail({
      from: `"${process.env.EMAIL_FROM_NAME}" <${process.env.EMAIL_FROM}>`,
      to: "praneetshukla601@gmail.com",
      subject: "Test Email",
      text: "This is a test email.",
    });
    console.log("Email sent successfully:", info.messageId);
  } catch (error) {
    console.error("Failed to send email:");
    console.error(error);
  }
}

test();
