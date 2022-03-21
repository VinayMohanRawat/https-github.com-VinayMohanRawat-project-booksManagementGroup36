const express = require('express');
const router = express.Router();
const collegeController = require("../controllers/collegeController")
const internController = require("../controllers/internController.js")


// API FOR COLLEGE CREATION
router.post('/functionUp/Colleges', collegeController.createCollage);

// API FOR INTERN CREATION
router.post('/functionUp/interns', internController.internCreate);




module.exports = router;