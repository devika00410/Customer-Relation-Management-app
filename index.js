const express=require("express")
const app=express()
const PORT=process.env.PORT|| 3000
const connectDB=require('./Config/db')
require('dotenv').config()



connectDB()

// Middleware
app.use(express.json())



// Routes
app.use('/api',require('./Routes/customerRoutes'))
app.use('/api',require('./Routes/caseRoutes'))
app.use('/api/auth',require('./Routes/authRoutes'))

// Basic routes
app.get('/',(req,res)=>{
    res.json({message:"CRM backend API is running"})
})





app.listen(PORT,()=>{
console.log(`Server running on port ${PORT}`)
})