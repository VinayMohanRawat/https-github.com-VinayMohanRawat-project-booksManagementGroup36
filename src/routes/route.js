const express = require('express');
const router = express.Router();
const userController = require("../controllers/userController")
const internController = require("../controllers/bookController.js")


router.post('/register', userController.registerUser);

router.post('/login', );






module.exports = router;