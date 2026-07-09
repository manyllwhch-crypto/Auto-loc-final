const express = require("express");
const router = express.Router();

const {
    getCars,
    createCar
} = require("../controllers/cars.controller");

const auth = require("../middleware/auth");
const admin = require("../middleware/admin");

router.get("/", getCars);
router.post("/", auth, admin, createCar);

module.exports = router;
