require('dotenv').config()
const bcrypt=require('bcryptjs')
const jwt=require('jsonwebtoken')
const User=require('../Model/User')

exports.createUser=async(req,res)=>{
    try{
        const{username,email,password,role}=req.body
        const hashedpassword=await bcrypt.hash(password, 10)
        const newUser=new User({username,email,password:hashedpassword,role})
        await newUser.save()
        res.status(200).json({message:"User registered successfully",user:newUser})
    }
    catch(error){
        res.status(500).json({message:error.message})
    }
}

exports.loginUser= async(req,res)=>{
    try{
        const {email,password} = req.body
        const user=await User.findOne({email})

        if(!user){
            return res.status(400).json({message:"User not found"})
        }

        const ismatch= await bcrypt.compare(password,user.password)

        if(!ismatch){
            return res.status(400).json({message:"Invalid password"})
        }
        const token=jwt.sign({
            userId:user._id,
            username:user.username,
            role:user.role,
        },process.env.JWT_SECRET)

        return res.status(200).json({message:"Login successful",token, user:{
            id:user._id,
            username:user.username,
            email:user.email,
            role:user.role
        }})
    }
    catch(error){
        res.status(500).json({message:error.message})
    }
}

exports.getProfile=(req,res)=>{
    return res.status(200).json({message:"Sucess",user:req.user})
}

exports.admindashboard=(req,res)=>{
    res.json({message:`Welcome Admin${req.user.username}`})
}

exports.userdashboard=(req,res)=>{
    res.json({message:`Welcome User, ${req.user.username}`})
}

exports.logoutuser=(req,res)=>{
    res.clearCookie("token")
    res.status(200).json({message:"Logged out successfully"})
}