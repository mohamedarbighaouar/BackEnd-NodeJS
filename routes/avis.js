var express = require('express');
var router = express.Router();
const avisController = require('../controller/avisController')
const verifyToken = require('../utils/VerifyToken')

router.post("/getAllAvisByFormation",verifyToken, avisController.getAllAvisByFormation)
router.post("/addOrUpdateAvis",verifyToken, avisController.addOrUpdateAvis)

module.exports = router;