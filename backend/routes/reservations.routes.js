const express = require("express");
const router = express.Router();

const auth = require("../middleware/auth");
const admin = require("../middleware/admin");
const reservationController = require("../controllers/reservations.controller");

router.post("/", auth, reservationController.createReservation);
router.get("/my", auth, reservationController.myReservations);

router.get("/admin", auth, admin, reservationController.getAllReservations);
router.delete("/admin/:id", auth, admin, reservationController.deleteReservation);
router.put("/admin/:id", auth, admin, reservationController.updateReservation);

module.exports = router;
