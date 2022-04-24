var express = require('express');
var router = express.Router();
const userController = require('../controller/userController')
const verifyToken = require('../utils/VerifyToken')

// For IOS
router.post('/updateUser',verifyToken, userController.updateUser);

// For ALL
router.post('/getFormateur',verifyToken, userController.getFormateur);
router.post('/getFormationsByFormateur',verifyToken, userController.getFormationsByFormateur);
router.post('/subscribeOrUnsubscribeFormateur',verifyToken, userController.subscribeOrUnsubscribeFormateur);
router.post('/changePassword',verifyToken, userController.changePassword);
router.post('/SearchForFormateur',verifyToken, userController.SearchForFormateur);

//For Android
router.post('/updateUserOnlyImage',verifyToken, userController.updateUserOnlyImage);
router.post('/updateUserOnlyWithoutImage',verifyToken, userController.updateUserOnlyWithoutImage);



module.exports = router;