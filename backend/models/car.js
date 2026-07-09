const db = require("../config/db");

exports.getAll = async () => {
    const [rows] = await db.query("SELECT * FROM cars");
    return rows;
};

exports.getById = async (id) => {
    const [rows] = await db.query(
        "SELECT * FROM cars WHERE id = ?",
        [id]
    );

    return rows[0];
};

exports.create = async (car) => {
    const [result] = await db.query(
        `
        INSERT INTO cars
        (
            brand,
            model,
            description,
            price_per_day,
            seats,
            fuel,
            gearbox,
            image_url
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        `,
        [
            car.brand,
            car.model,
            car.description,
            car.price_per_day,
            car.seats,
            car.fuel,
            car.gearbox,
            car.image_url
        ]
    );

    return result;
};
