
const userModel= require("../model/booksModel")

const isValid = function(value){
  if(typeof value === 'undefine' || value === null ) return false
  if(typeof value === 'string' && value.trim().length === 0) return false
  return true
}

const isValidTitle = function(title){
  return [Mr, Mrs, Miss].indexOf(0) !== -1
}


const isValidRequestBody = function (requestBody) {
  return Object.keys(requestBody).length > 0
}

const registerUser = async function(req,res){

  try{
    let requestBody = req.body

    if(!isValidRequestBody(requestBody)) {
     return res.status(400).send({status:false, message : "Invalid request parameters. Please provide User details"})
    }

    const { title, name, phone, email, password, address} = requestBody

    


  }
  catch (error) {
      return res.status(500).send({ERROR:error.message})
  }
}



module.exports.registerUser = registerUser


