require('dotenv').config()
const bcrypt=require('bcryptjs')
const jwt=require('jsonwebtoken')
const User=require('../Model/User')

exports.createUser = async (req, res) => {
    try {
        const {username, email, password, role} = req.body
        console.log('User registration attempt:', { username, email, role })
        
        const existingUser = await User.findOne({ 
            $or: [{ email }, { username }] 
        });
        
        if (existingUser) {
            console.log('User already exists:', existingUser.email);
            return res.status(400).json({ 
                message: "User with this email or username already exists" 
            });
        }
        
        const hashedpassword = await bcrypt.hash(password, 10)
        const newUser = new User({username, email, password: hashedpassword, role})
        await newUser.save()
        
        console.log(' User registered successfully:', newUser.email)
        res.status(201).json({ 
            message: "User registered successfully", 
            user: {
                id: newUser._id,
                username: newUser.username,
                email: newUser.email,
                role: newUser.role
            }
        })
    }
    catch(error) {
        console.error(' Registration error:', error)
        res.status(500).json({message: error.message})
    }
}
exports.loginUser= async(req,res)=>{
    try{
        const {email,password} = req.body
        console.log('Login attempt for email:', email)
        
        
        if (!process.env.JWT_SECRET) {
            console.error('CRITICAL: JWT_SECRET is not defined in environment variables!')
            return res.status(500).json({message:"Server configuration error"})
        }
        
        const user=await User.findOne({email})
        
        if(!user){
            console.log('User not found:', email)
            return res.status(400).json({message:"User not found"})
        }

        console.log('User found:', user.email)
        const ismatch= await bcrypt.compare(password,user.password)

        if(!ismatch){
            console.log('Password mismatch for user:', user.email)
            return res.status(400).json({message:"Invalid password"})
        }

        console.log('Password correct, generating token...')
        
        const tokenPayload = {
            userId: user._id.toString(),
            username: user.username,
            email: user.email,
            role: user.role
        }
        
        console.log('Token payload:', tokenPayload)
        
        const token = jwt.sign(
            tokenPayload, 
            process.env.JWT_SECRET, 
            { expiresIn: '24h' }
        )

        console.log('Token generated successfully. Length:', token.length)
        console.log('Token (first 50 chars):', token.substring(0, 50) + '...')

        return res.status(200).json({
            message:"Login successful",
            token, 
            user:{
                id:user._id,
                username:user.username,
                email:user.email,
                role:user.role
            }
        })
    }
    catch(error){
        console.error(' Login error:', error)
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