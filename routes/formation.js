var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
const formationController = require('../controller/formationController')
const verifyToken = require('../utils/VerifyToken')

//For All
router.get("/getAllFormations",verifyToken,formationController.getAllFormations)
router.get("/getMyFavoriteFormations",verifyToken,formationController.getMyFavoriteFormations)
router.get("/getAllFormationsBySubscription",verifyToken, formationController.getAllFormationsBySubscription)
router.post("/postNewFormation",verifyToken, formationController.postNewFormation)
router.post("/postNewVideoFormation", formationController.postNewVideoFormation)
router.post("/getContenu", formationController.getContenu)
router.post("/getFormationEnCours",verifyToken, formationController.getFormationEnCours)
router.post("/getFormationEnCoursOnlyOne",verifyToken, formationController.getFormationEnCoursOnlyOne)
router.post("/updateOrAddContenuHist",verifyToken, formationController.updateOrAddContenuHist)
router.post("/makeVideoFav",verifyToken, formationController.makeVideoFav)
router.post("/getAllFormationsOptimized",verifyToken, formationController.getAllFormationsOptimized)
router.post("/buyFormation",verifyToken, formationController.buyFormation)
router.post("/SearchForFormation",verifyToken, formationController.SearchForFormation)
router.post("/getDernierAjoutFormation",verifyToken,formationController.getDernierAjoutFormation)

router.get("/getOneFormation/:idformation",verifyToken,formationController.getOneFormation)

module.exports = router;
