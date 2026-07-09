const express = require("express");
const router = express.Router();

const {
    register,
    login,
    getAllUsers,
    deleteUser,
    adminCreateUser
} = require("../controllers/auth.controller.js");

const auth = require("../middleware/auth.js");
const admin = require("../middleware/admin.js");

router.post("/register", register);
router.post("/login", login);

router.get("/me", auth, (req, res) => {
    return res.json({
        user: req.user
    });
});

router.get("/admin/users", auth, admin, getAllUsers);
router.post("/admin/users", auth, admin, adminCreateUser);
router.delete("/admin/users/:id", auth, admin, deleteUser);

module.exports = router;
