const express=require("express")
const router=express.Router();
const caseController=require("../Controller/caseController")
const {auth,authorizeRoles}=require('../Middleware/auth')


router.get('/cases',caseController.getCases)
router.post('/cases',caseController.addCase)
router.patch('/cases/:id',caseController.updateCase)
router.delete('/cases/:id',caseController.deleteCase)


router.get('/cases',auth,caseController.getCases)
router.post('/cases',auth, authorizeRoles('admin','user'),caseController.addCase)
router.patch('/cases/:id',auth,caseController.updateCase)
router.delete('/cases/:id',auth,authorizeRoles("admin"),caseController.deleteCase)


module.exports=router;