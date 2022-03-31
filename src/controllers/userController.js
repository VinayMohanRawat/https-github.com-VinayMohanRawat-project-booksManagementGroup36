const jwt = require('jsonwebtoken')
const userModel = require("../model/userModel")

const isValid = function (value) {
  if (typeof value === 'undefine' || value === null) return false
  if (typeof value === 'string' && value.trim().length === 0) return false
  return true
}

const isValidTitle = function (title) {
  return ["Mr", "Mrs", "Miss"].indexOf(title) !== -1
}


const isValidRequestBody = function (requestBody) {
  return Object.keys(requestBody).length > 0
}


const registerUser = async function (req, res) {

  try {
    let requestBody = req.body

    if (!isValidRequestBody(requestBody)) {
      return res.status(400).send({ status: false, message: "Invalid request parameters. Please provide User details" })
    }

    const { title, name, phone, email, password, address } = requestBody

    const { street, city, pincode } = address
    if (!isValid(title)) { return res.status(400).send({ status: false, message: "title is Require" }) }
    if (!isValidTitle(title)) {
      return res.status(400).send({ status: false, message: "Title Should be one of Mr, Mrs, Miss" })
    }

    if (!isValid(name)) { return res.status(400).send({ status: false, message: "Name is Require" }) }
    if (!(/^[A-Za-z\s]+$/).test(name)) {
      return res.status(400).send({ status: false, message: "Please mention valid Name" })
    }

    if (typeof name !== 'string') { return res.status(400).send({ status: false, message: "Name should be String" }) }


    if (!isValid(phone)) { return res.status(400).send({ status: false, message: "Phone No. is require" }) }

    if (!(/^(?:(?:\+|0{0,2})91(\s*[\-]\s*)?|[0]?)?[6789]\d{9}$/).test(phone)) {
      return res.status(400).send({ status: false, message: "Please mention valid Phone Number" })
    }

    let duplicatePhone = await userModel.findOne({ phone })
    if (duplicatePhone) { return res.status(400).send({ status: false, message: "phone number already exist" }) }


    if (!isValid(email)) { return res.status(400).send({ status: false, message: "Email is require" }) }
    let duplicateEmail = await userModel.findOne({ email })
    if (duplicateEmail) { return res.status(400).send({ status: false, message: "email already exist" }) }

    if (!(/^\w+([\.-]?\w+)@\w+([\.-]?\w+)(\.\w{2,3})+$/).test(email)) {
      return res.status(400).send({ status: false, message: "Please mention valid Email" })
    }

    if (!isValid(password)) { return res.status(400).send({ status: false, message: "Password is require" }) }
    if (password.length < 8 || password.length > 15) {
      return res.status(400).send({ status: false, message: "Password length should not be less than 8 and greater than 15" })
    }

    if (!isValidRequestBody(address)) {
      return res.status(400).send({ status: false, message: "Please Provide address details" })
    }

    if (!isValid(street)) { return res.status(400).send({ status: false, message: "Street is Require" }) }

    if (typeof street !== 'string') { return res.status(400).send({ status: false, message: "Street should be String" }) }

    if (!isValid(city)) { return res.status(400).send({ status: false, message: "City is Require" }) }

    if (typeof city !== 'string') { return res.status(400).send({ status: false, message: "City should be String" }) }

    if (!isValid(pincode)) { return res.status(400).send({ status: false, message: "Pincode is Require" }) }

    if (typeof pincode !== 'string') { return res.status(400).send({ status: false, message: "Pincode should be String" }) }

    const createUser = await userModel.create(requestBody)

    return res.status(201).send({ status: true, message: 'Success', data: createUser })

  }
  catch (error) {
    return res.status(500).send({ ERROR: error.message })
  }
}




const login = async function (req, res) {
  try {

    let requestBody = req.body;

    if (!isValidRequestBody(requestBody)) return res.status(400).send({ status: false, msg: "email and password must be required" })

    const { email, password } = requestBody;

    if (!email) { return res.status(400).send({ status: false, message: "email is required" }) }

    if (!password) { return res.status(400).send({ status: false, message: "Password is require" }) }

    const user = await userModel.findOne({ email, password })

    if (!email) return res.status(404).send({ status: false, msg: "email must be present in body" })
    if (!password) return res.status(404).send({ status: false, msg: "password must be present in body" })

    if (!user) return res.status(401).send({ status: false, msg: "invalid crendential" })

    const token = jwt.sign({
      userId: user._id,
      iat: Math.floor(Date.now() / 1000),
      exp: Math.floor(Date.now() / 1000) + (60 * 60) / 2
    },
      "room_no-36"
    )

    res.header("x-api-key", token)

    res.status(200).send({ status: true, msg: "userLogin successfully", data: token })

  } catch (err) {
    res.status(500).send({ status: false, msg: err.message })

  }
}


module.exports.registerUser = registerUser
module.exports.login = login


