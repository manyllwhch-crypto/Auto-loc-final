const db = require("../config/db");

exports.findByEmail = async (email) => {
    const [rows] = await db.query(
        "SELECT * FROM users WHERE email = ?",
        [email]
    );

    return rows[0];
};

exports.create = async (
    fullname,
    email,
    password,
    role = "user"
) => {
    const [result] = await db.query(
        `
        INSERT INTO users
        (fullname, email, password, role)
        VALUES (?, ?, ?, ?)
        `,
        [
            fullname,
            email,
            password,
            role
        ]
    );

    return result;
};

exports.getAll = async () => {
    const [rows] = await db.query(
        "SELECT id, fullname, email, role FROM users ORDER BY id DESC"
    );

    return rows;
};

exports.delete = async (id) => {
    await db.query(
        "DELETE FROM users WHERE id = ?",
        [id]
    );
};
