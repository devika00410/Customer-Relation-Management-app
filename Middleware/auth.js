const jwt = require('jsonwebtoken')
const User = require('../Model/User')

exports.auth = async (req, res, next) => {
    console.log(" Auth middleware triggered")
    console.log(" Headers:", req.headers)

    try {
        const token = req.header('Authorization')?.replace('Bearer ', '')
        console.log("Token received:", token ? `Yes (length: ${token.length})` : 'No')

        if (!token) {
            console.log(' No token provided')
            return res.status(401).json({ message: "Authentication required" })
        }

        if (!process.env.JWT_SECRET) {
            console.error('JWT_SECRET missing in auth middleware!')
            return res.status(500).json({ message: "Server configuration error" })
        }

        console.log(' Verifying token with JWT_SECRET...')
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        console.log(" Token decoded successfully:", decoded)

        // Find user by ID
        const user = await User.findById(decoded.userId).select('-password')
        
        if (!user) {
            console.log(' User not found for ID:', decoded.userId)
            return res.status(401).json({ message: "User not found" })
        }

        req.user = user
        console.log("Authenticated user:", user.email)
        next()
    }
    catch (error) {
        console.log(" JWT verification error:", error.message)
        
        if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({ message: "Invalid token" })
        }
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({ message: "Token expired" })
        }
        
        res.status(401).json({ message: "Authentication failed" })
    }
}



exports.authorizeRoles = (...roles) => {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({ message: "Please login" })
        }

        if (!roles.includes(req.user.role)) {
            return res.status(403).json({ 
                message: "Access denied. Required roles: " + roles.join(', ') 
            })
        }
        next();
    }
}