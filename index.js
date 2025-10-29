const express=require("express")
const app=express()
const PORT=process.env.PORT|| 3001
const connectDB=require('./Config/db')
const cookieParser = require('cookie-parser')
const cors = require('cors')  
require('dotenv').config()

connectDB()

// Middleware
app.use(express.json())
app.use(cookieParser())



app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:5173', 'http://localhost:5174'],
  credentials: true
}))




app.use((req, res, next) => {
  console.log('=== INCOMING REQUEST ===');
  console.log('Method:', req.method);
  console.log('URL:', req.url);
  console.log('Authorization Header:', req.headers.authorization);
  console.log('=== END REQUEST ===');
  next();
});


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