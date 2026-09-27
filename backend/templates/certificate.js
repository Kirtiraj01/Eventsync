/**
 * Returns an HTML string for the certificate PDF. Puppeteer renders this
 * to a PDF in utils/generateCertificate.js.
 */
function certificateTemplate({ attendeeName, eventTitle, clubName, dateStr, verifyUrl, qrDataUrl }) {
  return `
<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8" />
<style>
  @page { size: A4 landscape; margin: 0; }
  body {
    margin: 0;
    font-family: 'Georgia', 'Times New Roman', serif;
    width: 297mm;
    height: 210mm;
    display: flex;
    align-items: center;
    justify-content: center;
    background: #f7f5ef;
  }
  .cert {
    width: 260mm;
    height: 175mm;
    border: 3px solid #1f2937;
    outline: 1px solid #1f2937;
    outline-offset: -10px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    text-align: center;
    padding: 20mm;
    box-sizing: border-box;
    position: relative;
  }
  .eyebrow {
    letter-spacing: 4px;
    font-size: 14px;
    color: #6b7280;
    text-transform: uppercase;
    margin-bottom: 10px;
  }
  h1 {
    font-size: 40px;
    margin: 0 0 20px 0;
    color: #111827;
  }
  .name {
    font-size: 34px;
    font-weight: bold;
    color: #1d4ed8;
    margin: 10px 0 20px 0;
    border-bottom: 2px solid #1d4ed8;
    padding-bottom: 8px;
    display: inline-block;
  }
  .body-text {
    font-size: 16px;
    color: #374151;
    max-width: 480px;
    line-height: 1.6;
  }
  .event-title {
    font-weight: bold;
    color: #111827;
  }
  .footer {
    position: absolute;
    bottom: 16mm;
    left: 20mm;
    right: 20mm;
    display: flex;
    justify-content: space-between;
    align-items: flex-end;
  }
  .club-name {
    font-size: 14px;
    color: #6b7280;
    text-align: left;
  }
  .qr-block {
    text-align: right;
  }
  .qr-block img {
    width: 70px;
    height: 70px;
  }
  .qr-caption {
    font-size: 9px;
    color: #9ca3af;
    margin-top: 4px;
  }
</style>
</head>
<body>
  <div class="cert">
    <div class="eyebrow">Certificate of Attendance</div>
    <h1>This certifies that</h1>
    <div class="name">${escapeHtml(attendeeName)}</div>
    <div class="body-text">
      successfully attended <span class="event-title">${escapeHtml(eventTitle)}</span>
      organized by ${escapeHtml(clubName)} on ${escapeHtml(dateStr)}.
    </div>
    <div class="footer">
      <div class="club-name">${escapeHtml(clubName)}<br/>Issued via EventSync</div>
      <div class="qr-block">
        <img src="${qrDataUrl}" />
        <div class="qr-caption">Scan to verify</div>
      </div>
    </div>
  </div>
</body>
</html>
`;
}

function escapeHtml(str = "") {
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

module.exports = { certificateTemplate };
