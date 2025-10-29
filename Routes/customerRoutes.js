const express = require("express")
const router = express.Router();
const customerController = require('../Controller/customerController')
const {auth, authorizeRoles} = require('../Middleware/auth')

router.get('/customers/:id', customerController.getCustomerById)
router.get('/customers', customerController.getCustomers)
router.post('/customers', auth,authorizeRoles('admin'), customerController.addCustomer)
router.patch('/customers/:id', customerController.updateCustomer)
router.delete('/customers/:id', authorizeRoles("admin"), customerController.deleteCustomer)


module.exports = router;