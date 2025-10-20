const express = require("express")
const router = express.Router();
const customerController = require('../Controller/customerController')
const {auth,authorizeRoles}=require('../Middleware/auth')

router.get('/customers',customerController.getCustomers)
router.post('/customers',customerController.addCustomer)
router.patch('/customers/:id',customerController.updateCustomer)
router.delete('/customers/:id',customerController.deleteCustomer)


router.get('/customers',auth,customerController.getCustomers)
router.post('/customers',auth, authorizeRoles('admin'),customerController.addCustomer)
router.patch('/customers/:id',auth,customerController.updateCustomer)
router.delete('/customers/:id',auth,authorizeRoles("admin"),customerController.deleteCustomer)


module.exports=router;