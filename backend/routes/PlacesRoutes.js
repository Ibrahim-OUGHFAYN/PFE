const express = require("express");
const router = express.Router();
const {
  Places,
  SupLieuParId,
  AddPlace,
  updatePlace,
  getPlaceById
} = require("../controllers/Places.controller");

const authMiddleware = require("../middlware/authMiddleware");

const multer = require("multer");
const upload = multer({ dest: "uploads/" });

// GET all places
router.get("/", Places);

// DELETE a place by ID
router.delete("/delete/:id", SupLieuParId);

// POST a new place
router.post("/add", upload.array('images', 30), AddPlace);

// PUT update an existing place
router.put("/update/:id", upload.array('images', 30), updatePlace);
router.get("/:id",getPlaceById)

module.exports = router;
