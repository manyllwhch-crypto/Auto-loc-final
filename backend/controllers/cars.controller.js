const Car = require("../models/car");

exports.getCars = async (req, res) => {
    try {
        const cars = await Car.getAll();
        res.json(cars);
    } catch (err) {
        console.error("GET CARS ERROR:", err);
        res.status(500).json({
            message: "Erreur récupération voitures"
        });
    }
};

exports.createCar = async (req, res) => {
    try {
        await Car.create(req.body);

        res.status(201).json({
            message: "Voiture ajoutée"
        });
    } catch (err) {
        console.error("CREATE CAR ERROR:", err);
        res.status(500).json({
            message: "Erreur création voiture"
        });
    }
};
