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



// Add this after your CORS setup in index.js
app.use((req, res, next) => {
  console.log('=== INCOMING REQUEST ===');
  console.log('Method:', req.method);
  console.log('URL:', req.url);
  console.log('Authorization Header:', req.headers.authorization);
  console.log('=== END REQUEST ===');
  next();
});

// Add this before your other routes in index.js
// app.get('/api/test', (req, res) => {
//   console.log('✅ Test route hit - No auth required');
//   res.json({ message: "Test route working - no authentication" });
// });

// app.get('/api/test-protected', (req, res) => {
//   console.log('🔐 Test protected route hit');
//   console.log('Authorization Header:', req.headers.authorization);
  
//   const token = req.headers.authorization?.replace('Bearer ', '');
//   if (!token) {
//     return res.status(401).json({ message: "Authentication required" });
//   }
  
//   res.json({ message: "Protected route working", tokenReceived: true });
// });

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