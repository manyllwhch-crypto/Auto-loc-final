const path = require("path");
require("dotenv").config();

const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");

const authRoutes = require("./routes/auth.routes");
const carRoutes = require("./routes/cars.routes");
const reservationRoutes = require("./routes/reservations.routes");

const app = express();
app.set("trust proxy", 1);
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Helmet peut bloquer certaines ressources externes si la config par défaut est trop stricte.
// Cette configuration garde les protections utiles sans casser ton frontend statique.
app.use(
    helmet({
        contentSecurityPolicy: false
    })
);

app.use(
    rateLimit({
        windowMs: 15 * 60 * 1000,
        max: 100
    })
);

// Frontend statique
app.use(express.static(path.join(__dirname, "../front-end")));

// Images du dossier src
app.use(
    "/src",
    express.static(path.join(__dirname, "../src"))
);

app.use("/uploads", express.static(path.join(__dirname, "../uploads")));

// API
app.use("/api/auth", authRoutes);
app.use("/api/cars", carRoutes);
app.use("/api/reservations", reservationRoutes);

// Healthcheck Railway
app.get("/health", (req, res) => {
    res.json({ status: "ok" });
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
