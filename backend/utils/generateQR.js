const QRCode = require("qrcode");

/**
 * Generates a QR code as a PNG Buffer encoding the given text (usually a
 * ticket JWT string or a certificate verify URL).
 */
async function generateQRBuffer(text) {
  return QRCode.toBuffer(text, {
    type: "png",
    errorCorrectionLevel: "M",
    margin: 2,
    width: 400,
  });
}

/**
 * Generates a QR code as a base64 data URL — handy for embedding directly
 * in an HTML template (e.g. the certificate PDF).
 */
async function generateQRDataUrl(text) {
  return QRCode.toDataURL(text, {
    errorCorrectionLevel: "M",
    margin: 2,
    width: 300,
  });
}

module.exports = { generateQRBuffer, generateQRDataUrl };
