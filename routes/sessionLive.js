var express = require('express');
var router = express.Router();
const sessionLiveController = require('../controller/sessionLiveController')
const verifyToken = require('../utils/VerifyToken')

router.post("/getAllSessionliveBySubscription",verifyToken, sessionLiveController.getAllSessionliveBySubscription)

module.exports = router;