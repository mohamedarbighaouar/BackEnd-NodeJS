var express = require('express');
var router = express.Router();
const centreInteretController = require('../controller/centreInteretController')
const verifyToken = require('../utils/VerifyToken')


//For IOS
router.post("/updateCentreInteret",verifyToken, centreInteretController.updateCentreInteret)
router.post("/addCentreInteret",verifyToken, centreInteretController.addCentreInteret)

//For Android
router.post("/updateCentreInteretAutre",verifyToken, centreInteretController.updateCentreInteretAutre)



//For All
router.get("/getMyCentreInteret",verifyToken,centreInteretController.getMyCentreInteret)

module.exports = router;
