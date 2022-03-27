const mongoose = require('mongoose')
const validator = require('validator');
let moment=require("moment")


const booksSchema = new mongoose.Schema({
    title: {type:String,
         required:true,
          unique:true,
          trim:true
        },
    excerpt: {
        type:String, 
        required:true,
        trim:true
    }, 
    userId: {
        type:mongoose.Schema.Types.ObjectId, 
        required:true,
        ref:'User'
    },
    ISBN: {
        type:String,
         required:true,
        unique:true
        },
    category: {
        type:String,
         required:true,
         trim:true
        },
    subcategory: {
        type:[String],
         required:true,
         trim:true
        },
    reviews: {
        type:Number, 
        default: 0, 
        // comment: "Holds number of reviews of this book"
    },
    isDeleted: {
        type:Boolean, 
        default: false
    },
    deletedAt: {
        type:Date,
        default:null
    }, 
    
    releasedAt: {
        type:Date,
        Date : moment().format("YYYY-MM-DD[T]HH:mm:ss"),
         required:true

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