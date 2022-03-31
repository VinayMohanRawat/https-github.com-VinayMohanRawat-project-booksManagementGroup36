const jwt = require("jsonwebtoken")
const booksModel = require("../model/booksModel")
const userModel = require("../model/userModel")


let authenticateUser = function (req, res, next) {
    try {
        token = req.headers['x-api-key']
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





let authorizedUser = async function (req, res, next) {
    try {
        let token = req.headers["x-api-key"]
        let decodedToken = jwt.verify(token, "room_no-36")
        let bookId = req.params.bookId
        if (bookId) {
            if (!bookId) { return res.status(400).send({ status: false, message: "user not found" }) }

            let bookData = await booksModel.findById(bookId).select({ userId: 1 })
            if (!bookData) { return res.status(404).send({ status: false, message: "user not found" }) }

            userId = bookData.userId
            if (userId != decodedToken.userId) {
                return res.status(403).send({ status: false, message: "user not authorized" })
            }
        }
        else {
            let userId = req.body.userId
            if (!userId) { return res.status(400).send({ status: false, message: "userid required" }) }

            let userData = await userModel.findById({ _id: userId }).select({ _id: 1 })
            if (!userData) { return res.status(404).send({ status: false, message: "user not found" }) }

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