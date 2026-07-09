const db = require("../config/db");

exports.create = async (reservation) => {
    const [result] = await db.query(
        `
        INSERT INTO reservations
        (
            user_id,
            car_id,
            start_date,
            end_date,
            pickup_location,
            total_price
        )
        VALUES (?, ?, ?, ?, ?, ?)
        `,
        [
            reservation.user_id,
            reservation.car_id,
            reservation.start_date,
            reservation.end_date,
            reservation.pickup_location,
            reservation.total_price
        ]
    );

    return result;
};

exports.getByUser = async (userId) => {
    const [rows] = await db.query(
        `
        SELECT 
            reservations.*,
            cars.brand,
            cars.model
        FROM reservations
        INNER JOIN cars ON reservations.car_id = cars.id
        WHERE reservations.user_id = ?
        ORDER BY reservations.id DESC
        `,
        [userId]
    );

    return rows;
};

exports.getAll = async () => {
    const [rows] = await db.query(
        `
        SELECT
            reservations.*,
            users.fullname,
            users.email,
            cars.brand,
            cars.model
        FROM reservations
        JOIN users ON reservations.user_id = users.id
        JOIN cars ON reservations.car_id = cars.id
        ORDER BY reservations.id DESC
        `
    );

    return rows;
};

exports.delete = async (id) => {
    await db.query(
        "DELETE FROM reservations WHERE id = ?",
        [id]
    );
};

exports.update = async (id, reservation) => {
    await db.query(
        `
        UPDATE reservations
        SET
            start_date = ?,
            end_date = ?,
            pickup_location = ?,
            status = ?
        WHERE id = ?
        `,
        [
            reservation.start_date,
            reservation.end_date,
            reservation.pickup_location,
            reservation.status,
            id
        ]
    );
};
