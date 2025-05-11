const express = require("express");
const router = express.Router();
const {Guides} =require("../controllers/Guide.controller")
const authMiddleware = require("../middlware/authMiddleware");

router.get("/",Guides)

module.exports=router;

