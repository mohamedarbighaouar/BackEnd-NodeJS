var express = require('express');
var router = express.Router();
const categorieController = require('../controller/categorieController')
const verifyToken = require('../utils/VerifyToken')

// For ALL
router.get("/getAllCategories", categorieController.getAllCategories)
router.post("/postNewcategorie",categorieController.postNewCategorieAdmin)


module.exports = router;