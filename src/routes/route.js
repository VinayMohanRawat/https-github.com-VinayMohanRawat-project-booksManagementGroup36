const express = require('express');
const router = express.Router();
const userController = require("../controllers/userController")
const bookController=require('../controllers/bookController')
const middleware=require('../middleware/auth')



router.post('/register', userController.registerUser);

router.post('/login', userController.login);

router.post('/books',middleware.validUser,bookController.createBook)

router.get('/books',middleware.validUser,bookController.getBooks)







module.exports = router;