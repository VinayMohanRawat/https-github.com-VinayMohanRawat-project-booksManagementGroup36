const mongoose = require('mongoose')
const validator = require('validator');
let moment = require("moment")


const booksSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    excerpt: {
        type: String,
        required: true,
        trim: true
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    ISBN: {
        type: String,
        required: true,
        unique: true
    },
    category: {
        type: String,
        required: true,
        trim: true
    },
    subcategory: {
        type: [String],
        required: true,
        trim: true
    },
    reviews: {
        type: Number,
        default: 0,
    },
    isDeleted: {
        type: Boolean,
        default: false
    },
    deletedAt: {
        type: Date
    },

    releasedAt: {
        type: Date,
        required: true,
        trim: true
    }

}, { timestamps: true })

module.exports = mongoose.model('Books', booksSchema)


// {
//     "title":"mistakes",
//     "excerpt":"ghdf",
//     "userId":"",
//     "ISBN":"",
//     "category":"",
//     "subcategory":"",
//     "reviews":,
//     "releasedAt":
// }