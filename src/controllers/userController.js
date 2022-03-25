const collageModel = require("../model/collegeModel")
const internModel= require("../model/internModel")


const isValidRequestBody = function (data) {
  return Object.keys(data).length > 0
}




const createCollage = async function (req, res) {
  try {
    let  data = req.body
    if (!isValidRequestBody(data)) {
      return res.status(400).send({ status: false, message: "enter valid parameters" })
    }
    if (!(data.name)) {
      return res.status(400).send({ status: false, msg: "name required" })
    }
    
    if (!(data.fullName)) {
      return res.status(400).send({ status: false, msg: "fullName is required" })
    }
    if (!(data.logoLink)) {
      return res.status(400).send({ status: false, msg: "logoLink required" })
    }

    if (!(/(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-/]))?/.test(data.logoLink))) {
      return res.status(400).send({ status: false, message: "Logo link will be valid link " })
    }

    let collageData = await collageModel.create(data)
    if (collageData.isDeleted !== false) {
      return res.status(400).send({ status: false, msg: "isDeleted must be false" })
    }

    return res.status(201).send({ status:true,data: collageData })
  }
  catch (error) {
    return res.status(500).send({ msg: error.message })
  }
}





let getCollegeDetails = async function (req, res) {
  try {

    let collageName = req.query.name

    if (!collageName) {
      return res.status(400).send({ status: false, message: "name required,Bad request" })
    }
    let collageData = await collageModel.findOne({ name: collageName, isDeleted: false })

    if (!collageData) {
      return res.status(404).send({ status: false, message: "collage not found" })
    }

    let collageDetails = {
      name: collageData.name,
      fullName: collageData.fullName,
      logoLink: collageData.logoLink,
      interests: []
    }
    let id = collageData._id
    let internsDetails = await internModel.find({ collegeId: id, isDeleted: false }).select({ _id: 1, name: 1, email: 1, mobile: 1 })

    collageDetails.interests = internsDetails
    

    if(collageDetails.interests.length <= 0){
      return res.status(404).send({ERROR:`No Interns Are Available For ${collageName} College`})}
      return res.status(200).send({status:true, data: collageDetails})
  }
  catch (error) {
    res.status(500).send({ msg: error.message })
  }
}





module.exports.createCollage = createCollage
module.exports.getCollegeDetails = getCollegeDetails

