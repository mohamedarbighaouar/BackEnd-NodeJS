var express = require('express');
var router = express.Router();
const chatController = require('../controller/chatController')
const verifyToken = require('../utils/VerifyToken')

router.post("/getMessages",verifyToken, chatController.getMessages)
router.post("/getDiscussions",verifyToken ,chatController.getDiscussions)

module.exports = router;