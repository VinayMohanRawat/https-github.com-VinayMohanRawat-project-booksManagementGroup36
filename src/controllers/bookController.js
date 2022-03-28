const bookModel = require("../model/booksModel")
const userModel = require('../model/userModel')
const mongoose = require('mongoose')
let moment = require("moment")
const { format } = require("express/lib/response")

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
// const isObjectId = function (isObjectId) {
//     let result = ObjectId.isValid(isObjectId)
//     return result
// }


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

        let user_id = await userModel.find({ userId })
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
        // let Date = moment().format("YYYY-MM-DD")
        // req.body.releasedAt = Date
        // if(releasedAt!==("YYYY-MM-DD")){return res.status(400).send({status:false,message:"realesedAt date format must be YYYY-MM-DD"})}

        const createBook = await bookModel.create(requestBody)

        res.status(201).send({ status: true, message: 'Success', data: createBook })

    }
    catch (error) {
        return res.status(500).send({ ERROR: error.message })
    }
}


const getBooks = async function (req, res) {
    try {

        const bookQuery = { isDeleted: false }
        const QueryParam = req.query
        if (!isValidRequestBody(QueryParam)) {
            const booksNotDeleted = await bookModel.find({ isDeleted: false })
                .select({ _id: 1, title: 1, excerpt: 1, userId: 1, category: 1, releasedAt: 1, reviews: 1 })
                .sort({ title: -1 })

            console.log(booksNotDeleted)
            return res.status(200).send({ status: true, data: booksNotDeleted })
        }

        const { userId, category, subcategory } = QueryParam

        if (isValid(userId)) {
            bookQuery["userId"] = userId
        }


        if (isValid(category)) {
            bookQuery["category"] = category.trim();
        }


        if (isValid(subcategory)) {
            bookQuery["subcategory"] = subcategory.trim()
        }


        const books = await bookModel.find(bookQuery)
            .select({ _id: 1, title: 1, excerpt: 1, userId: 1, category: 1, releasedAt: 1, reviews: 1 })
            .sort({ title: -1 })
        console.log(books)

        if (Array.isArray(books) && books.length === 0) {                          //Books data comes in array
            return res.status(404).send({ status: false, message: "No Book Exist" })
        }   //(Array.isArray(book)) it represent data in array or not

        res.status(200).send({ status: true, data: books })

    } catch (err) {
        res.status(500).send({ status: false, msg: err.message })
    }
}






const deleteBook = async function (req, res) {

    try {
        const getBookId = req.params.bookId

        const deletedDate = moment().format("YYYY-MM-DD[T]HH:mm:ss")

        if(!isValidRequestBody(getBookId)) {
            return res.status(400).send({status:false, message :"Invalid request parameters. Please provide bookId"})
        }

        if (!validObjectId(getBookId)) {
            return res.status(400).send({ status: false, message: "Invalid bookId." })
        }        


       const checkBookIdIsDeleted = await bookModel.findOne({_id:getBookId, isDeleted:false})

       if(!checkBookIdIsDeleted){return res.status(404).send({status:false, message:`This (${getBookId}) bookId is not exist`})}

       const bookIdDeleted = await bookModel.findByIdAndUpdate(getBookId , {isDeleted : true, deletedAt : deletedDate})

        res.status(200).send({status:true, message : `This (${getBookId}) bookId is Deleted Successfully`})
        
        }
    catch (error) {
            return res.status(500).send({ ERROR: error.message })
        }
    }




    module.exports.createBook = createBook
    module.exports.getBooks = getBooks
    module.exports.deleteBook = deleteBook




 // if (!validObjectId(userId)) { return res.status(400).send({ status: false, message: "Invalid Userid" }) }
// let user_id = await userModel.findOne({ _id: userId })
        // if (!user_id) { return res.status(404).send({ status: false, message: "user id not found" }) }

         // let varifyCategory = await bookModel.findOne({category:category })
        // if (!varifyCategory) { return res.status(404).send({ status: false, message: "category not found" }) }

         // let varifySubCategory = await bookModel.findOne({subcategory:subcategory })
        // if (!varifySubCategory) { return res.status(404).send({ status: false, message: "Subcategory not found" }) }









