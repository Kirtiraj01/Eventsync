const nodemailer = require("nodemailer");

let transporter = null;

function getTransporter() {
  if (transporter) return transporter;

  if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
    // No SMTP configured — fall back to a console-logging "transport" so
    // local dev works without real credentials.
    transporter = {
      sendMail: async (opts) => {
        console.log("\n[email:mock] ---------------------------------");
        console.log(`To: ${opts.to}`);
        console.log(`Subject: ${opts.subject}`);
        console.log(`Attachments: ${(opts.attachments || []).map((a) => a.filename).join(", ") || "none"}`);
        console.log("-----------------------------------------------\n");
        return { messageId: "mock-" + Date.now() };
      },
    };
    return transporter;
  }

  transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT) || 587,
    secure: Number(process.env.SMTP_PORT) === 465,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  return transporter;
}

/**
 * Sends an email. `attachments` follows nodemailer's format:
 * [{ filename, content, contentType }]
 */
async function sendEmail({ to, subject, html, attachments = [] }) {
  const mailer = getTransporter();
  return mailer.sendMail({
    from: process.env.EMAIL_FROM || "ClubHub <no-reply@clubhub.app>",
    to,
    subject,
    html,
    attachments,
  });
}

module.exports = { sendEmail };
