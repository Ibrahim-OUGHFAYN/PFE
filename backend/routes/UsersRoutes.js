const express = require("express");
const router = express.Router();
const {users,SupUserParId,UpdateUserById} =require("../controllers/Users.controller")
const authMiddleware = require("../middlware/authMiddleware");

router.get("/",users)
router.delete("/delete/:id",SupUserParId)
router.put("/Update/:id",UpdateUserById)

module.exports=router;

