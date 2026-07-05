const nodemailer = require('nodemailer');

/**
 * Creates a reusable SMTP transporter from environment variables.
 * Falls back to Ethereal (test account) if SMTP_HOST is not set.
 */
const createTransporter = () => {
  if (process.env.SMTP_HOST) {
    return nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT, 10) || 587,
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });
  }

  /* Development fallback — logs the email to console */
  return {
    sendMail: async (options) => {
      console.log('📧 [DEV] Email would be sent:');
      console.log(`   To: ${options.to}`);
      console.log(`   Subject: ${options.subject}`);
      console.log(`   Text: ${options.text || '(html only)'}`);
      return { messageId: 'dev-mode' };
    },
  };
};

/**
 * Send an email.
 * @param {Object} options - { to, subject, text, html }
 */
const sendEmail = async ({ to, subject, text, html }) => {
  const transporter = createTransporter();

  const mailOptions = {
    from: `"Stock Analyzer" <${process.env.FROM_EMAIL || 'noreply@stockanalyzer.com'}>`,
    to,
    subject,
    text,
    html,
  };

  const info = await transporter.sendMail(mailOptions);
  console.log(`✅ Email sent: ${info.messageId}`);
  return info;
};

/**
 * Send password-reset email with a tokenised link.
 */
const sendPasswordResetEmail = async (email, resetToken) => {
  const resetUrl = `${process.env.FRONTEND_URL || 'http://localhost:5173'}/reset-password/${resetToken}`;

  await sendEmail({
    to: email,
    subject: 'Password Reset — Stock Analyzer',
    text: `You requested a password reset. Click this link to reset your password: ${resetUrl}\n\nThis link expires in 1 hour.\n\nIf you did not request this, please ignore this email.`,
    html: `
      <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;padding:20px">
        <h2 style="color:#3b82f6">Stock Analyzer</h2>
        <p>You requested a password reset.</p>
        <a href="${resetUrl}" style="display:inline-block;background:#3b82f6;color:#fff;padding:12px 32px;border-radius:8px;text-decoration:none;font-weight:bold;margin:16px 0">
          Reset Password
        </a>
        <p style="color:#666;font-size:14px">This link expires in 1 hour.</p>
        <p style="color:#999;font-size:12px">If you did not request this, please ignore this email.</p>
      </div>
    `,
  });
};

module.exports = { sendEmail, sendPasswordResetEmail };
