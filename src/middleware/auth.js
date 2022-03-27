const jwt = require("jsonwebtoken")

let validUser = function (req, res, next) {
    try {
        let userId = req.body.userId
        // if(!userId) userId = req.query.userId
        // if (!userId) userId = req.params.userId
    
        let token = req.headers['X-Api-Key']
        if (!token) {
            token = req.headers['x-api-key']
        }
        if (!token) {
            return res.status(401).send({ status: false, message: "token required" })
        }

        
        let decodedToken = jwt.verify(token, 'room_no-36')

        if(!userId) userId = decodedToken.userId
            
        
        if (!userId) {
            return res.status(400).send({ status: false, msg: "UserId required" })
        }

         
        // if (decodedToken.exp) {
        //     return res.status(401).send({ status: false, message: "Token expired" })
        // }
        if (!decodedToken) {
            return res.status(401).send({ status: false, message: "token is invalid" })
        }
        if (decodedToken.userId != userId) {
            res.status(403).send({ status: false, msg: "Unauthorized access" })
        }

        next()
    } catch (error) {
        res.status(500).send({ ERROR: error.message })
    }
}

// let authorizedUser= function (req, res, next) {
//     try {
//         let userId = req.body.userId
//         if (!userId) {
//             return res.status(400).send({ status: false, msg: "authorId required" })
//         }
//         let token = req.headers["x-api-key"]
//         let decodedToken = jwt.verify(token, "room_no-36")
//         if (decodedToken.userId != userId) {
//             res.status(403).send({ status: false, msg: "Unauthorized access" })
//         }
//         // req.userId = userId
//         next()

//     }
//     catch (error) {
//         res.status(500).send({ status: false, msg: error.message })
//     }
// }


module.exports.validUser = validUser
// module.exports.authorizedUser = authorizedUser