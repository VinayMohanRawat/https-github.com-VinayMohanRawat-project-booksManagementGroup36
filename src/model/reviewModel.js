const mongoose = require('mongoose')

let reviewSchema = new mongoose.Schema({

    bookId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Books'
    },
    reviewedBy: {
        type: String,
        required: true,
        default: 'Guest',
        trim:true 
    },
    reviewedAt: {
        type: Date,
        default:Date.now()
    },
    rating: {
        type: Number,
        min: 1,
        max: 5,
        required: true
    },
    review: {
        type: String,
        trim:true
    },
    isDeleted: {
        type: Boolean,
        default: false
    }
}, { timestamps: true })


module.exports = mongoose.model("Reviews", reviewSchema)

