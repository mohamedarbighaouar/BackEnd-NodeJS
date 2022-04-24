var express = require('express');
var router = express.Router();
const quizController = require('../controller/quizController')
const verifyToken = require('../utils/VerifyToken')

router.post("/ajoutQuiz",verifyToken, quizController.ajoutQuiz)

router.post("/getQuizByFormation",verifyToken,quizController.getQuizByFormation)

router.post("/getQuestionsByQuiz",verifyToken,quizController.getQuestionsByQuiz)

router.post("/deleteQuiz",verifyToken,quizController.deleteQuiz)

router.post("/createQuestion",verifyToken,quizController.createQuestion)

router.post("/createReponse",verifyToken,quizController.createReponse)
 
router.post("/finishQuiz",verifyToken,quizController.finishQuiz)


module.exports = router;