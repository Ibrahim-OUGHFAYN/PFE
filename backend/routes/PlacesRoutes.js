const express = require("express");
const router = express.Router();
const {Places,SupLieuParId,AddPlace} =require("../controllers/Places.controller")
const authMiddleware = require("../middlware/authMiddleware");

const multer = require("multer");
const upload = multer({ dest: "uploads/" });

router.get("/",Places)
router.delete("/delete/:id",SupLieuParId)
router.post("/Add", upload.array('images', 10), AddPlace);




module.exports=router;

