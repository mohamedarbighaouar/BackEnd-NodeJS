var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
const questionReponseFormationController = require('../controller/questionReponseFormationController')
const verifyToken = require('../utils/VerifyToken')


router.post("/postNewQuestion",verifyToken, questionReponseFormationController.postNewQuestion)

router.post("/postNewReponse",verifyToken, questionReponseFormationController.postNewReponse)

router.post("/getAllQuestions",verifyToken, questionReponseFormationController.getAllQuestions)

router.post("/getQuestionById",verifyToken,questionReponseFormationController.getQuestionById)

router.post("/getReponsesOfQuestion",verifyToken, questionReponseFormationController.getReponsesOfQuestion)

router.post("/likeOrdislikeQuestion",verifyToken, questionReponseFormationController.likeOrdislikeQuestion)

router.post("/likeOrdislikeReponse",verifyToken, questionReponseFormationController.likeOrdislikeReponse) 

module.exports = router;