const express = require("express");
const router = express.Router();
const {users,SupUserParId} =require("../controllers/Users.controller")
const authMiddleware = require("../middlware/authMiddleware");



router.get("/",users)
router.delete("/delete/:id",SupUserParId)




module.exports=router;

