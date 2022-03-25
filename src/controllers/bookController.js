const bookModel = require("../model/booksModel")
const userModel = require('../model/userModel')
const mongoose = require('mongoose')
let moment=require("moment")

const isValid = function (value) {
    if (typeof value === "undefined" || value === null) return false
    if (typeof value === 'string' && value.trim().length === 0) return false
    return true
}


const isValidRequestBody = function (requestBody) {
    return Object.keys(requestBody).length > 0
}

const validObjectId = function (ObjectId) {
    return mongoose.Types.ObjectId(ObjectId)
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

        let user_id = await userModel.find({userId} )
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

        if (!releasedAt) { return res.status(400).send({ status: false, message: "ReleasedAt is required" }) }
        let Date = moment().format("YYYY-MM-DD[T]HH:mm:ss")
        req.body.releasedAt = Date


        const createBook = await bookModel.create(requestBody)

        res.status(201).send({ status: true, message: 'Success', data: createBook })

    }
    catch (error) {
        return res.status(500).send({ ERROR: error.message })
    }
}


module.exports.createBook = createBook