const reviewModel = require('../model/reviewModel')

const bookModel = require('../model/booksModel')
const mongoose = require('mongoose')

const isValid = function (value) {
    if (typeof value === "undefined" || value === null) return false
    if (typeof value === 'string' && value.trim().length === 0) return false
    return true
}


const isValidRequestBody = function (requestBody) {
    return Object.keys(requestBody).length > 0
}

const validObjectId = function (ObjectId) {
    return mongoose.Types.ObjectId.isValid(ObjectId)
}


const createReview = async function (req, res){
try{

let bookIdByParam = req.params.bookId
if (!isValid(bookIdByParam)) return res.status(400).send({status:false, msg:"bookId is required"})

if (!validObjectId(bookIdByParam)) return res.status(400).send({status:false, msg:"bookId should be valid"})

const data = req.body

if (!isValidRequestBody(data)) return res.status(400).send({status:false, msg:"data is required in body"})

const {bookId, reviewedBy, reviewedAt, rating, review} =data

if (!isValid(bookId)) return res.status(400).send({status:false, msg:"bookId should be valid"})

if (!validObjectId(bookId)) return res.status(400).send({status:false, msg:"bookId is invalid"})

if (bookId != bookIdByParam) {
    return res.status(400).send({ status: false, msg: "book id in params and book id in body both are different" })
}

if (!isValid(reviewedBy)) return res.status(400).send({status:false, msg:"reviewedBy is required"})

if (!isValid(reviewedAt)) return res.status(400).send({status:false, msg:" reviewedAt is required"})

if (!isValid(rating)) return res.status(400).send({status:false, msg:" rating is required"})
if(rating<1 || rating>5) return res.status(400).send({status:false, msg:"rating should inbetween one and five"})

if (!isValid(review)) return res.status(400).send({status:false, msg:" rating is required"})


const bookIdExists = await bookModel.findOne({_id:bookId, isDeleted:false})

if (!bookIdExists) return res.status(404).send({status:false, msg:"no any book exists in this id"})

const reviewsData = await reviewModel.create(data)

let reviewCount = await bookModel.findOneAndUpdate({_id:bookId},{$inc:{reviews:1}})

res.status(200).send({status:true, data:reviewsData})

}catch (err){
    res.status(500).send({status:false, msg:err.message})
}


}




module.exports.createReview= createReview