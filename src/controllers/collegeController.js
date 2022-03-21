const collageModel = require("../model/collegeModel")


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
    return res.status(201).send({ status:true,data: collageData })
  }
  catch (error) {
    return res.status(500).send({ msg: error.message })
  }
}





module.exports.createCollage = createCollage