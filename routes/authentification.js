var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
const authController = require('../controller/authController')


router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());

router.use(function (user, req, res, next) {
    res.status(200).send(user);
});

router.post("/login", authController.login)

router.post("/googleSignUp", authController.googleLinkedInSignUp)
router.post("/googleSignIn", authController.googleLinkedInSignIn)

router.post('/checkUser', authController.checkUserExistance)

router.post('/signup', authController.signup)

router.get("/VerifyEmail/:idcode/:iduser/:code", authController.VerifyEmail)

router.post("/ResetPassword", authController.resetPassword)

router.post("/CheckResetPassword", authController.checkResetPassword)

router.put("/UpdatePassword", authController.updatePassword)

module.exports = router;