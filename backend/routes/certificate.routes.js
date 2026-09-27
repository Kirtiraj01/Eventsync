const express = require("express");
const router = express.Router();

const { downloadCertificate, verifyCertificate } = require("../controllers/certificate.controller");

// GET /api/certificates/verify/:certificateId — public (defined first: more specific than /:registrationId)
router.get("/verify/:certificateId", verifyCertificate);

// GET /api/certificates/:registrationId — public (Student), only once attended = true
router.get("/:registrationId", downloadCertificate);

module.exports = router;
