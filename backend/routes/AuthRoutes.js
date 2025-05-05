const express = require("express");
const router = express.Router();
const {signup,getUser,logout,login} =require("../controllers/auth.controller")
const authMiddleware = require("../middlware/authMiddleware");


router.post("/signup",signup)
router.post("/login",login)
router.get("/me", authMiddleware, getUser)
router.post("/logout",authMiddleware,logout)

module.exports=router;

