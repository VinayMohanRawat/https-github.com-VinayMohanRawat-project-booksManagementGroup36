const express = require('express');
const router = express.Router();
const collegeController = require("../controllers/collegeController")
const internController = require("../controllers/internController.js")


router.post('/functionUp/Colleges', collegeController.createCollage);


router.post('/functionUp/interns', internController.internCreate);


router.get('/functionup/getCollegeDetails', collegeController.getCollegeDetails);




module.exports = router;