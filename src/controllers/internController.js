const internsModel= require('../model/internModel')
const collageModel=require('../model/collegeModel')
const internModel = require('../model/internModel')

const internCreate = async function(req,res){
    try{
        const createIntern={
            name:req.body.name,
            email:req.body.email,
            mobile:req.body.mobile,
            collegeName:req.body
        }
        const internCreate=await internModel.create(createIntern)
        res.status(201).send({status:true,data:internCreate})

    }catch(error){
        res.status(500).send({ msg: error.message })


    }
}



module.exports.internCreate=internCreate