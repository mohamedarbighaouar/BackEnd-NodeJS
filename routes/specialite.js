var express = require('express');
var router = express.Router();
const specialiteController = require('../controller/specialiteController')
const verifyToken = require('../utils/VerifyToken')

router.post("/updateSpecialte",verifyToken, specialiteController.updateSpecialte)
router.get("/getAllspecialite",verifyToken, specialiteController.getAllSpecialite)

module.exports = router;
