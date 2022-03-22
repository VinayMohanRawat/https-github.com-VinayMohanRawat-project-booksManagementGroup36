
const collegeModel = require("../model/collegeModel")
const internModel = require("../model/internModel")
//const validator = require('validator');    


// const isValidRequestBody = function (data) {
//     return Object.keys(data).length > 0
//   }


const internCreate = async function(req,res){
    try{
        //let  data = req.body
        const createIntern={
            name:req.body.name,
            email:req.body.email,
            mobile:req.body.mobile,
            
            collegeId:req.body.collegeId
        }
    // if (!isValidRequestBody(data)) {
    //   return res.status(400).send({ status: false, message: "please provide intern details" })
    // }
    if (!(createIntern.name)) {
      return res.status(400).send({ status: false, msg: "name required" })
    }
    if (!(createIntern.email)) {
      return res.status(400).send({ status: false, msg: "email is required" })
    }
    // let emailCheck=await internModel.findOne({email:request.email})
    // if(emailCheck){
    //     return res.status(400).send({ status: false, msg: "email already present" })

    // }
    // if (!(data.mobile)) {
    //   return res.status(400).send({ status: false, msg: "mobile no is required" })
    // }
    



        // const createIntern={
        //     name:req.body.name,
        //     email:req.body.email,
        //     mobile:req.body.mobile,
        //     //collegeName:req.body.collegeName
        //     collegeId:req.body.collegeId
        // }
        const internCreate=await internModel.create(createIntern)
        res.status(201).send({status:true,data:internCreate})

    }catch(error){
        res.status(500).send({ msg: error.message })


    }
}



module.exports.internCreate=internCreate