var express = require('express');
var router = express.Router();
const certificationController = require('../controller/certificationController')
const verifyToken = require('../utils/VerifyToken')

router.post("/createCertification",verifyToken, certificationController.createCertification)
router.post("/getCertifications",verifyToken, certificationController.getCertifications)

module.exports = router;
