const express=require('express')
const router=express.Router();
const authController=require('../Controller/authController')
const{auth,authorizeRoles} = require('../Middleware/auth')

router.post('/register',authController.createUser)
router.post('/login',authController.loginUser)
router.post('/logout',authController.logoutuser)

router.get('/profile',auth,authController.getProfile);
router.get('/admin-dashboard',auth,authorizeRoles("admin"),authController.admindashboard)
router.get('/user-dashboard',auth,authorizeRoles('admin','user'),authController.userdashboard)

module.exports=router;