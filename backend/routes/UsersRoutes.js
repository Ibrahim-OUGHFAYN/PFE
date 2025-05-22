const express = require("express");
const router = express.Router();
const {users,SupUserParId,UpdateUserById} =require("../controllers/Users.controller")
const {getResbyVoyageurs}=require("../controllers/reservation.controller")
const authMiddleware = require("../middlware/authMiddleware");

router.get("/",users)
router.get("/reservations",authMiddleware,getResbyVoyageurs)
router.delete("/delete/:id",SupUserParId)
router.put("/Update/:id",authMiddleware,UpdateUserById)

module.exports=router;

