const express= require("express");
const {authenticate}= require("../middleware/authMiddileware");
const {authorize}=require("../middleware/authorizationMiddileware");

const userController=require("../controllers/userController");


//check user permission and roles

const router= express.Router();


//Current logged-in user
router.get("/my",authenticate,userController.getCurrentUser);

//user List Requires USER_READ permission
router.get("/",authenticate,authorize("USER_READ"),userController.getUsers);

module.exports=router;