const mongoose = require("mongoose")
const validator = require("validator")

const userSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, "Title is require"],
        enum: ['Mr', 'Mrs', 'Miss']
    },
    name: {
        type: String,
        required: [true, "Name is require"],
        trim: true
    },
    phone: {
        type: String,
        require: [true, "Phone Number is require"],
        unique: [true, "Phone No. should be Unique"],
        validate: {
            validator: function (phone) {
                return /^(?:(?:\+|0{0,2})91(\s*[\-]\s*)?|[0]?)?[6789]\d{9}$/.test(phone)
            },
            message: "Please fill valid phone number",
            isAsync: false
        }
    },
    email: {
        type: String,
        required: [true, "email is require"],
        unique: [true, "email should be Unique"],
        validate: {
            validator: validator.isEmail,
            message: `email is not a valid email`,
            isAsync: true
        }
    },
    password: {
        type: String,
        required: [true, "Password is required"],
        trim: true,
        minLength: [8, "Password Minimum Length should be 8"],
        maxLength: [15, "Password Maximum Length should be 15"]
    },
    address: {
        street: { type: String, trim: true },
        city: { type: String, trim: true },
        pincode: { type: String }
    },

}, { timestamps: true });

module.exports = mongoose.model("User", userSchema)


/**
{
    "title":"Mr",
    "name":"Manish Kumar",
    "phone" : "809809890909",
    "email" : "m@gmail.com",
    "password":"manish124",
    "address":  {
    "street" : "Sector 17",
    "city" : "New Delhi",
    "pincode" : "110001"
                }
}

**/
