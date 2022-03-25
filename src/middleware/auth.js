const jwt = require("jsonwebtoken")

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
        res.status(500).send({ ERROR: error.message })
    }
}

// let authorization = function (req, res, next) {
//     try {
//         // let userId = req.params.userId
//         // if (!userId) {
//         //     return res.status(400).send({ status: false, msg: "authorId required" })
//         // }
//         let token = req.headers["x-api-key"]
//         let decodedToken = jwt.verify(token, "Room No-36")
//         if (decodedToken.authorId != userId) {
//             res.status(403).send({ status: false, msg: "unAthorized access" })
//         }
//         req.authorId = authorId
//         next()

//     }
//     catch (error) {
//         res.status(500).send({ status: false, msg: error.message })
//     }
// }


module.exports.authenticateUser = authenticateUser
// module.exports.authorization = authorization