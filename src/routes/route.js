const express = require('express');
const router = express.Router();
const userController = require("../controllers/userController")
const middleware=require('../middleware/auth')

router.get('/testme',middleware.authenticateUser,function(req,res){
    res.send({message:"it is working"})
})

router.post('/register', userController.registerUser);

router.post('/login', userController.login);






module.exports = router;