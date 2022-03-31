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


const createReview = async function (req, res) {
    try {

        let bookIdByParam = req.params.bookId
        if (!isValid(bookIdByParam)) return res.status(400).send({ status: false, msg: "bookId is required" })

        if (!validObjectId(bookIdByParam)) return res.status(400).send({ status: false, msg: "bookId should be valid" })

        const data = req.body

        if (!isValidRequestBody(data)) return res.status(400).send({ status: false, msg: "data is required in body" })

        const { bookId, reviewedBy, rating, review } = data

        if (!isValid(bookId)) return res.status(400).send({ status: false, msg: "bookId should be valid" })

        if (!validObjectId(bookId)) return res.status(400).send({ status: false, msg: "bookId is invalid" })

        if (bookId != bookIdByParam) {
            return res.status(400).send({ status: false, msg: "Params bookId and body's bookId are not matching" })
        }

        if (!isValid(reviewedBy)) return res.status(400).send({ status: false, msg: "reviewedBy is required" })

        if (!isValid(rating)) return res.status(400).send({ status: false, msg: " rating is required" })

        if (rating < 1 || rating > 5) return res.status(400).send({ status: false, msg: "rating should be inbetween 1 and 5" })

        const bookIdExists = await bookModel.findOne({ _id: bookId, isDeleted: false })

        if (!bookIdExists) return res.status(404).send({ status: false, msg: "Book is not exist" })

        const reviewsData = await reviewModel.create(data)

        let reviewCount = await bookModel.findOneAndUpdate({ _id: bookId }, { $inc: { reviews: 1 } })

        return res.status(201).send({
            status: true, data: {
                bookId: reviewsData.bookId,
                reviewedBy: reviewsData.reviewedBy,
                reviewedAt: reviewsData.reviewedAt,
                rating: reviewsData.rating,
                review: reviewsData.review
            }
        })

    } catch (err) {
        res.status(500).send({ status: false, msg: err.message })
    }
}




const updateReview = async function (req, res) {
    try {
        let bookId = req.params.bookId
        let reviewId = req.params.reviewId

        if (!isValid(bookId)) {
            return res.status(400).send({ status: false, msg: "bookId is not valid" })
        }

        if (!validObjectId(bookId)) {
            return res.status(400).send({ status: false, msg: "bookId is not in valid format" })
        }

        const checkbookIdExist = await bookModel.findOne({ _id: bookId, isDeleted: false })
        if (!checkbookIdExist) {
            return res.status(400).send({ status: false, msg: "book you are searching does not exist" })
        }

        if (!isValid(reviewId)) {
            return res.status(400).send({ status: false, msg: " reviewId is not valid" })
        }

        if (!validObjectId(reviewId)) {
            return res.status(400).send({ status: false, msg: "reviewId is not in valid format" })
        }

        const checkReviewIdExist = await reviewModel.findOne({ _id: reviewId, isDeleted: false })
        if (!checkReviewIdExist) {
            return res.status(400).send({ status: false, msg: "review does not exist" })
        }


        let data = req.body
        if (Object.keys(data).length == 0) {
            return res.status(400).send({ status: false, msg: "data is missing from the body" })
        }

        const { reviewersName, rating, review } = data
        let obj = {}

        if (reviewersName) {
            if (!isValid(reviewersName)) {
                return res.status(400).send({ status: false, msg: "name is not in valid format" })
            }
            obj.reviewedBy = reviewersName.trim()
        }

        if (rating) {
            if (!isValid(rating)) {
                return res.status(400).send({ status: false, msg: "rating is not in valid format" })
            }
            if (rating < 1 || rating > 5) return res.status(400).send({ status: false, msg: "rating should be inbetween 1 and 5" })
            obj.rating = rating
        }

        if (review) {
            if (!isValid(review)) {
                return res.status(400).send({ status: false, msg: "review is not in valid format" })
            }

            obj.review = review.trim()
        }

        const updatedReview = await reviewModel.findOneAndUpdate(
            { _id: reviewId },
            { $set: obj }, { new: true }
        )

        const bookDetailsAfterUpdate = await bookModel.findById({ _id: bookId }).select({
            _id: 1, title: 1, excerpt: 1,
            userId: 1, category: 1, subcategory: 1, deleted: 1, reviews: 1, releasedAt: 1, createdAt: 1, updatedAt: 1
        })

        const allReviewrs = await reviewModel.find({ bookId: bookId }).select({
            _id: 1, bookId: 1, reviewedBy: 1,
            reviewedAt: 1, rating: 1, review: 1
        })

        const { ...data1 } = bookDetailsAfterUpdate
        data1._doc.reviewsData = allReviewrs

        return res.status(200).send({ status: true, msg: "updated", data: data1._doc })

    } catch (err) {
        return res.status(500).send({ status: false, msg: err.message })
    }

}




const deleteReview = async function (req, res) {
    try {

        let bookId = req.params.bookId
        let reviewId = req.params.reviewId

        if (!isValid(bookId)) {
            return res.status(400).send({ status: false, msg: "book id is not valid" })
        }

        if (!validObjectId(bookId)) {
            return res.status(400).send({ status: false, msg: "book id is not in valid format" })
        }

        const checkbookIdExist = await bookModel.findOne({ _id: bookId, isDeleted: false })
        if (!checkbookIdExist) {
            return res.status(404).send({ status: false, msg: "book you are searching does not exist" })
        }


        if (!isValid(reviewId)) {
            return res.status(400).send({ status: false, msg: " review id is not valid" })
        }

        if (!validObjectId(reviewId)) {
            return res.status(400).send({ status: false, msg: "review id is not in valid format" })
        }

        const checkReviewIdExist = await reviewModel.findOne({ _id: reviewId, isDeleted: false })
        if (!checkReviewIdExist) {
            return res.status(404).send({ status: false, msg: "review does not exist" })
        }
        if (bookId != checkReviewIdExist.bookId) { return res.status(400).send({ status: false, message: "This reviewId not belongs to  bookId" }) }
        

        const deletedReview = await reviewModel.findOneAndUpdate(
            { _id: reviewId },
            { $set: { isDeleted: true } }
        )

        const decreaseReviewValue = await bookModel.findOneAndUpdate(
            { _id: bookId },
            { $inc: { reviews: -1 } },
            { new: true }
        )

        return res.status(200).send({ status: true, msg: "success" })

    } catch (err) {
        return res.status(500).send({ status: false, msg: err.message })
    }
}




module.exports.createReview = createReview
module.exports.deleteReview = deleteReview
module.exports.updateReview = updateReview


