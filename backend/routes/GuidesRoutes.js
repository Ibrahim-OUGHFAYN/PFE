const express = require("express");
const router = express.Router();
const {Guides,getGuideById} =require("../controllers/Guide.controller")
const authMiddleware = require("../middlware/authMiddleware");

router.get("/",Guides)
router.get("/:id",getGuideById)

module.exports=router;

