const express = require("express");
const router = express.Router();
const {getAvisByGuideId,createAvis} =require("../controllers/Avis.controller")
const authMiddleware = require("../middlware/authMiddleware");

router.get("/:id",getAvisByGuideId)
router.post("/saveavis",createAvis)

module.exports=router;

