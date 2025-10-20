const jwt =require('jsonwebtoken')
const User=require('../Model/User')

exports.auth=async(req,res,next)=>{
    console.log("Auth middleware worked")

    try{
        const token=req.header('Authorization')?.replace('Bearer ', '')
        console.log("Token:",token)

        if(!token){
            return res.status(401).json({message:"Authentication required"})
        }

        const decoded = jwt.verify(token,process.env.JWT_SECRET)

        const user= await User.findById(decoded.userId).select('-password')
        
        if(!user){
            return res.status(401).json({message:"User not found"})
        }

        req.user=user
        console.log("Authenticated user:", req.user)
        next()
    }
    catch(error){
        console.log("JWT verification error:",error.message)
        res.status(401).json({message:"Invalid token"})
    }

}

exports.authorizeRoles =(...roles)=>{
    return (req,res,next)=>{
        if(!req.user){
            return res.status(401).json({message:"Please login"})
        }

        if(!roles.includes(req.user.role)){
            return res.status(403).json({message:"Access denied.Required roles :" + roles.join(', ')})
        }
        next();
    }
}