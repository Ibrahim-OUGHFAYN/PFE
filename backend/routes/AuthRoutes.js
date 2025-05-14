const express = require("express");
const router = express.Router();
const {signup,getUser,logout,login,completeGuideProfile} =require("../controllers/auth.controller")
const authMiddleware = require("../middlware/authMiddleware");
const multer = require("multer");
const storage = multer.memoryStorage(); // store in memory if uploading to Cloudinary
const upload = multer({ storage });


router.post("/signup",signup)
router.post("/login",login)
router.get("/me", authMiddleware, getUser)
router.post("/logout",authMiddleware,logout)
router.post("/complete-guide-profile",upload.single("image"),completeGuideProfile)

module.exports=router;