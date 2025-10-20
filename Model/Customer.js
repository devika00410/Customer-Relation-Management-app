const mongoose=require("mongoose")

const customerSchema=new mongoose.Schema({
    name:{type:String,required:true},
    email:{type:String,required:true,unique:true},
    phone:{type:String,required:true},
    status:{type:String,enum:['Active','Inactive'],default:'Active'},
    createdAt:{type:String,default:Date.now()}
})


module.exports=mongoose.model('Customer',customerSchema)
