// GuidesRoutes.js
const express = require("express");
const router = express.Router();
const {Guides, getGuideById, updateGuideProfile} = require("../controllers/Guide.controller");
const {updateDisponibilitesGuide} = require("../controllers/despo.controller");
const authMiddleware = require("../middlware/authMiddleware");
const multer = require("multer");

// Configure multer for memory storage (since you use streamifier)
const upload = multer({ storage: multer.memoryStorage() });

router.get("/", Guides);
router.get("/:id", getGuideById);
router.put("/update", authMiddleware, upload.single('file'), updateGuideProfile);
router.put("/despo", authMiddleware, updateDisponibilitesGuide);

module.exports = router;