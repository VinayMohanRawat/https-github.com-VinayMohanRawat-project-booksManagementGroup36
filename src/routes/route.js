const express = require('express');
const router = express.Router();
const userController = require("../controllers/userController")
const bookController = require('../controllers/bookController')
const middleware = require('../middleware/auth')



router.post('/register', userController.registerUser);

router.post('/login', userController.login);

router.post('/books', bookController.createBook)

router.get('/books', bookController.getBooks)

router.get('/books', bookController.getBooks)

router.put('/books/:bookId', bookController.updatedBook)

router.delete('/books/:bookId', bookController.deleteBook)








module.exports = router;