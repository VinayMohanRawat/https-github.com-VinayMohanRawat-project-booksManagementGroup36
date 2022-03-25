const mongoose = require('mongoose')
const validator = require('validator');


const booksSchema = new mongoose.Schema({
  
}, { timestamps: true })
module.exports = mongoose.model('Books', booksSchema)