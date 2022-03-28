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
        default: 'Guest'
        
    },
    reviewedAt: {
        type: Date,
        required: true
    },
    rating: {
        type: Number,
        min: 1,
        max: 5,
        required: true
    },
    review: {
        type: String,
        optional: true
    },
    isDeleted: {
        type: Boolean,
        default: false
    }
}, { timestamps: true })


module.exports = mongoose.model("Reviews", reviewSchema)