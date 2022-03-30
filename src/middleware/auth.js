const jwt = require("jsonwebtoken")
const mongoose = require('mongoose')
const booksModel = require("../model/booksModel")

const validObjectId = function (ObjectId) {
    return mongoose.Types.ObjectId.isValid(ObjectId)
}



let authenticateUser = function (req, res, next) {
    try {
        let token = req.headers['X-Api-Key']
        if (!token) {
            token = req.headers['x-api-key']
        }
        if (!token) {
            return res.status(401).send({ status: false, message: "token required" })
        }
        let decodedToken = jwt.verify(token, 'room_no-36')
        if (!decodedToken) {
            return res.status(401).send({ status: false, message: "token is invalid" })
        }
        next()
    } catch (error) {
        res.status(500).send({ status: false, ERROR: error.message })
    }
}





let authorizedUser =async  function (req, res, next) {
            try {
                let token = req.headers["x-api-key"]
                let decodedToken = jwt.verify(token, "room_no-36")
                let bookId = req.params.bookId
                if (bookId) {
                    let bookData = await booksModel.findById(bookId).select({ userId: 1 })
                    userId = bookData.userId
                    if (userId != decodedToken.userId) {
                        return res.status(403).send({ status: false, message: "user not authorized" })
                    }
                }
                else {
                    let userId = req.body.userId
                    if (decodedToken.userId != userId) {
                        return res.status(403).send({ status: false, message: "user not authorized " })
                    }
                }
                next()
            }
    catch (error) {
        res.status(500).send({ status: false, msg: error.message })
    }
}




module.exports.authenticateUser = authenticateUser
module.exports.authorizedUser = authorizedUser