const fs = require("fs");
const path = require("path");
const puppeteer = require("puppeteer");
const { nanoid } = require("nanoid");
const { certificateTemplate } = require("../templates/certificate");
const { generateQRDataUrl } = require("./generateQR");

const CERT_DIR = path.join(__dirname, "..", "certificates");
if (!fs.existsSync(CERT_DIR)) fs.mkdirSync(CERT_DIR, { recursive: true });

// Short, URL-safe, uppercase-ish public certificate ID (e.g. "9F3A8821")
function makeCertificateId() {
  return nanoid(8).toUpperCase().replace(/[^A-Z0-9]/g, "X");
}

/**
 * Renders and saves a certificate PDF for a Registration.
 * Returns { certificateId, certificateUrl (relative path on disk) }.
 */
async function generateCertificate({ registration, event, club }) {
  const certificateId = makeCertificateId();
  const verifyUrl = `${process.env.PUBLIC_APP_URL || "http://localhost:5173"}/verify/${certificateId}`;
  const qrDataUrl = await generateQRDataUrl(verifyUrl);

  const dateStr = new Date(event.eventDate).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const html = certificateTemplate({
    attendeeName: registration.attendeeName,
    eventTitle: event.title,
    clubName: club.name,
    dateStr,
    verifyUrl,
    qrDataUrl,
  });

  const browser = await puppeteer.launch({
    headless: "new",
    executablePath: process.env.PUPPETEER_EXECUTABLE_PATH || undefined,
    args: ["--no-sandbox", "--disable-setuid-sandbox", "--disable-dev-shm-usage", "--disable-gpu"],
  });

  let filePath;
  try {
    const page = await browser.newPage();
    await page.setContent(html, { waitUntil: "networkidle0" });

    const fileName = `${certificateId}.pdf`;
    filePath = path.join(CERT_DIR, fileName);

    await page.pdf({
      path: filePath,
      landscape: true,
      printBackground: true,
      format: "A4",
    });
  } finally {
    await browser.close();
  }

  return {
    certificateId,
    certificateUrl: `/certificates/${certificateId}.pdf`, // served statically
    filePath,
  };
}

module.exports = { generateCertificate, CERT_DIR };
