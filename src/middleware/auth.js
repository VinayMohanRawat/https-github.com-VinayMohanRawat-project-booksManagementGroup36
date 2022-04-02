const jwt = require("jsonwebtoken")



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
        req.userId=decodedToken.userId
        next()
    } catch (error) {
        res.status(500).send({ status: false, ERROR: error.message })
    }
}









module.exports.authenticateUser = authenticateUser
