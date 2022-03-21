const mongoose = require('mongoose')
const validator = require('validator');


const internSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        trim: true,
        lowercase: true,
        unique: true,
        required: 'Email address is required',
        validate:{
            validator: validator.isEmail,
            message: '{VALUE} is not a valid email',
            isAsync: false
          }
    },
    mobile: {
        type: String,
        required: true,
        unique: true,
        
    },
    collegeId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'College',
        required: true
    },
    isDeleted: {
        type: Boolean,
        default: false
    }
}, { timestamps: true })
module.exports = mongoose.model('Intern', internSchema)