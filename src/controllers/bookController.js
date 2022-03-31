const bookModel = require("../model/booksModel")
const userModel = require('../model/userModel')
let reviewModel = require('../model/reviewModel')
const mongoose = require('mongoose')
let moment = require("moment")


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


const createBook = async function (req, res) {

    try {
        let requestBody = req.body

        if (!isValidRequestBody(requestBody)) {
            return res.status(400).send({ status: false, message: "Invalid request parameters. Please provide User details" })
        }

        const { title, excerpt, userId, ISBN, category, subcategory, reviews, releasedAt } = requestBody

        if (!isValid(title)) { return res.status(400).send({ status: false, message: "Title is required" }) }

        let dupTitle = await bookModel.findOne({ title })
        if (dupTitle) {
            return res.status(400).send({ status: false, message: "Title already exist" })
        }

        if (!isValid(excerpt)) { return res.status(400).send({ status: false, message: "Excerpt is required" }) }

        if (!isValid(userId)) { return res.status(400).send({ status: false, message: "UserId is required" }) }
        if (!validObjectId(userId)) {
            return res.status(400).send({ status: false, message: "Invalid userId" })
        }

        let user_id = await userModel.findOne({ _id: userId })
        if (!user_id) {
            return res.status(404).send({ status: false, message: "User not found in user collection" })
        }

        if (!isValid(ISBN)) { return res.status(400).send({ status: false, message: "ISBN is required" }) }
        let dupIsbn = await bookModel.findOne({ ISBN })
        if (dupIsbn) {
            return res.status(400).send({ status: false, message: "ISBN already exist" })
        }
        if (!isValid(category)) { return res.status(400).send({ status: false, message: "Category is required" }) }

        if (!isValid(subcategory)) { return res.status(400).send({ status: false, message: "SubCategory is required" }) }

        if (!isValid(reviews)) { return res.status(400).send({ status: false, message: "Reviews is required" }) }

        if (!isValid(releasedAt)) { return res.status(400).send({ status: false, message: "ReleasedAt is required" }) }

        let date = moment(releasedAt).toISOString()
        if (!date) { return res.status(400).send({ status: false, message: "not valid date format" }) }
        const createBook = await bookModel.create({ title, excerpt, userId, ISBN, category, subcategory, reviews, releasedAt: date })

        res.status(201).send({ status: true, message: 'Success', data: createBook })

    }
    catch (error) {
        return res.status(500).send({ ERROR: error.message })
    }
}




const getBooks = async function (req, res) {
    try {
        const QueryParam = req.query
        const { userId, category, subcategory } = QueryParam
        if (!isValidRequestBody(QueryParam)) {
            const booksNotDeleted = await bookModel.find({ isDeleted: false })
                .select({ _id: 1, title: 1, excerpt: 1, userId: 1, category: 1, releasedAt: 1, reviews: 1 })
                .sort({ title: 1 })
            console.log(booksNotDeleted)
            return res.status(200).send({ status: true, data: booksNotDeleted })
        }

        const books = await bookModel
            .find({
                $or: [{ userId: userId, category: category },
                { userId: userId, subcategory: subcategory },
                { category: category, subcategory: subcategory }]
            })
            .select({ _id: 1, title: 1, excerpt: 1, userId: 1, category: 1, releasedAt: 1, reviews: 1 })
            .sort({ title: 1 })


        if (Array.isArray(books) && books.length === 0) {                          //Books data comes in array
            return res.status(404).send({ status: false, message: "No Book Exist, Please try combinations" })
        }   //(Array.isArray(book)) it represent data in array or not

        res.status(200).send({ status: true, message: 'Books list', data: books })

    } catch (err) {
        res.status(500).send({ status: false, msg: err.message })
    }
}

const getBooksData = async function (req, res) {
    try {
        const bookId = req.params.bookId
        if (!isValid(bookId)) return res.status(400).send({ status: false, msg: "bookid is required" })

        if (!validObjectId(bookId)) return res.status(400).send({ status: false, msg: "invalid bookId" })

        const getBookDetail = await bookModel.findById({ _id: bookId }).select({
            _id: 1, title: 1, excerpt: 1, userId: 1, category: 1, subcategory: 1, deleted: 1,
            reviews: 1, releasedAt: 1, createdAt: 1, updatedAt: 1
        })

        if (!getBookDetail) return res.status(404).send({ status: false, msg: "bookId is must be present" })

        const getReviews = await reviewModel.find({ bookId: bookId,isDeleted:false }).select({
            _id: 1, bookId: 1, reviewedBy: 1,
            reviewedAt: 1, rating: 1, review: 1
        })

        const { ...data1 } = getBookDetail
        data1._doc.reviewsData = getReviews

        return res.status(200).send({ status: true, message: 'Books list', data: data1._doc })

    } catch (err) {
        res.status(500).send({ status: false, msg: err.message });
    }
};




let updatedBook = async function (req, res) {
    try {
        let bookId = req.params.bookId
        let data = req.body
        if (!isValid(bookId)) { return res.status(400).send({ status: false, message: "BookId is required" }) }

        if (!validObjectId(bookId)) { return res.status(400).send({ status: false, message: "Enter valid book id" }) }

        let bookData = await bookModel.findOne({ _id: bookId, isDeleted: false })
        if (!bookData) { return res.status(404).send({ status: false, message: "BookData not found in the collection" }) }

        const { title, excerpt, releasedAt, ISBN } = data
        let updatedData = {}
        if (!isValidRequestBody(data)) { return res.status(400).send({ status: false, message: "Enter valid parameters" }) }

        if (title) {
            if (!isValid(title)) {
                return res.status(400).send({ status: false, msg: "title is not in valid format" })
            }
            let dupTitle = await bookModel.findOne({ title })
            if (dupTitle) {
                return res.status(400).send({ status: false, message: "Title already present" })
            }
            updatedData['title'] = title
        }


        if (excerpt) {
            if (!isValid(excerpt)) {
                return res.status(400).send({ status: false, msg: "excerpt is not in valid format" })
            }
            updatedData['excerpt'] = excerpt
        }


        if (releasedAt) {
            if (!isValid(releasedAt)) {
                return res.status(400).send({ status: false, msg: "releasedAt is not in valid format" })
            }
            let date = moment(releasedAt).toISOString()
            if (!date) { return res.status(400).send({ status: false, message: "not valid date format" }) }

            updatedData['releasedAt'] = releasedAt
        }


        if (ISBN) {
            if (!isValid(ISBN)) {
                return res.status(400).send({ status: false, msg: "releasedAt is not in valid format" })
            }
            let dupIsbn = await bookModel.findOne({ ISBN })
            if (dupIsbn) {
                return res.status(400).send({ status: false, message: "ISBN already present" })
            }
            updatedData['ISBN'] = ISBN
        }


        let updatedBookDetails = await bookModel.findOneAndUpdate({ _id: bookId }, { $set: updatedData }, { new: true })
        return res.status(200).send({ status: true, message: "Data updated succesfully", data: updatedBookDetails })
    }
    catch (err) {
        res.status(500).send({ status: false, msg: err.message })
    }
}





const deleteBook = async function (req, res) {

    try {
        const getBookId = req.params.bookId

        const deletedDate = moment().format("YYYY-MM-DD[T]HH:mm:ss")

        if (!isValidRequestBody(getBookId)) {
            return res.status(400).send({ status: false, message: "Invalid request parameters. Please provide bookId" })
        }

        if (!validObjectId(getBookId)) {
            return res.status(400).send({ status: false, message: "Invalid bookId." })
        }


        const checkBookIdIsDeleted = await bookModel.findById({ _id: getBookId })
        if (checkBookIdIsDeleted.isDeleted == true) return res.status(400).send({ status: false, message: "These book is already deleted" })
        if (!checkBookIdIsDeleted) { return res.status(404).send({ status: false, message: `This (${getBookId}) bookId is not exist` }) }

        const bookIdDeleted = await bookModel.findByIdAndUpdate(getBookId, { isDeleted: true, deletedAt: deletedDate })

        res.status(200).send({ status: true, message: `This (${getBookId}) bookId is Deleted Successfully` })

    }
    catch (error) {
        return res.status(500).send({ ERROR: error.message })
    }
}




module.exports.createBook = createBook
module.exports.getBooks = getBooks
module.exports.getBooksData = getBooksData
module.exports.updatedBook = updatedBook
module.exports.deleteBook = deleteBook














