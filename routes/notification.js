var express = require('express');
var router = express.Router();
const notificationController = require('../controller/notificationController')
const verifyToken = require('../utils/VerifyToken')

//router.post("/sendNotificationToTopic", notificationController.sendNotificationToTopic)

router.post("/updateNotification", verifyToken, notificationController.updateNotification)
router.post("/deleteNotification", verifyToken, notificationController.deleteNotification)
router.post("/getAllNotification", verifyToken, notificationController.getAllNotification)

module.exports = router;
