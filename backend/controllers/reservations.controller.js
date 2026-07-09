const Reservation = require("../models/reservation");
const Car = require("../models/car");

exports.createReservation = async (req, res) => {
    try {
        const { car_id, start_date, end_date, pickup_location } = req.body;

        if (!car_id || !start_date || !end_date) {
            return res.status(400).json({
                message: "Voiture et dates obligatoires"
            });
        }

        const car = await Car.getById(car_id);

        if (!car) {
            return res.status(404).json({
                message: "Voiture introuvable"
            });
        }

        const days = Math.ceil(
            (new Date(end_date) - new Date(start_date)) / 86400000
        );

        if (days <= 0) {
            return res.status(400).json({
                message: "La date de retour doit être après la date de départ"
            });
        }

        const total_price = days * Number(car.price_per_day);

        await Reservation.create({
            user_id: req.user.id,
            car_id,
            start_date,
            end_date,
            pickup_location,
            total_price
        });

        res.status(201).json({
            message: "Réservation créée"
        });

    } catch (err) {
        console.error("CREATE RESERVATION ERROR:", err);
        res.status(500).json({
            message: "Erreur création réservation"
        });
    }
};

exports.myReservations = async (req, res) => {
    try {
        const reservations = await Reservation.getByUser(req.user.id);

        const result = reservations.map(r => ({
            id: r.id,
            start_date: r.start_date,
            end_date: r.end_date,
            total_price: r.total_price,
            status: r.status,
            pickup_location: r.pickup_location,
            fullname: r.fullname || null,
            email: r.email || null,
            brand: r.brand,
            model: r.model
        }));

        res.json(result);

    } catch (err) {
        console.error("MY RESERVATIONS ERROR:", err);
        res.status(500).json({
            message: "Erreur serveur"
        });
    }
};

exports.getAllReservations = async (req, res) => {
    try {
        const reservations = await Reservation.getAll();

        const result = reservations.map(r => ({
            id: r.id,
            start_date: r.start_date,
            end_date: r.end_date,
            total_price: r.total_price,
            status: r.status,
            pickup_location: r.pickup_location,
            fullname: r.fullname,
            email: r.email,
            brand: r.brand,
            model: r.model
        }));

        res.json(result);

    } catch (err) {
        console.error("GET ALL RESERVATIONS ERROR:", err);
        res.status(500).json({
            message: "Erreur récupération réservations"
        });
    }
};

exports.deleteReservation = async (req, res) => {
    try {
        await Reservation.delete(req.params.id);

        res.json({
            message: "Réservation supprimée"
        });

    } catch (err) {
        console.error("DELETE RESERVATION ERROR:", err);
        res.status(500).json({
            message: "Erreur suppression réservation"
        });
    }
};

exports.updateReservation = async (req, res) => {
    try {
        await Reservation.update(req.params.id, req.body);

        res.json({
            message: "Réservation modifiée"
        });

    } catch (err) {
        console.error("UPDATE RESERVATION ERROR:", err);
        res.status(500).json({
            message: "Erreur modification réservation"
        });
    }
};
