// GuidesRoutes.js
const express = require("express");
const router = express.Router();
const {createReservation,updateReservationStatus} = require("../controllers/reservation.controller");
const authMiddleware = require("../middlware/authMiddleware");

router.post("/add",authMiddleware,createReservation);
router.put("/:id/status",updateReservationStatus)


module.exports = router;