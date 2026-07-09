const User = require("../models/user");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

exports.register = async (req, res) => {
    try {
        const { fullname, email, password } = req.body;

        if (!fullname || !email || !password) {
            return res.status(400).json({
                message: "Tous les champs sont obligatoires"
            });
        }

        const existing = await User.findByEmail(email);

        if (existing) {
            return res.status(400).json({
                message: "Email déjà utilisé"
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        await User.create(fullname, email, hashedPassword);

        res.status(201).json({
            message: "Compte créé"
        });

    } catch (error) {
        console.error("REGISTER ERROR:", error);
        res.status(500).json({
            message: "Erreur serveur lors de l'inscription"
        });
    }
};

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                message: "Email et mot de passe obligatoires"
            });
        }

        const user = await User.findByEmail(email);

        if (!user) {
            return res.status(404).json({
                message: "Utilisateur introuvable"
            });
        }

        const valid = await bcrypt.compare(password, user.password);

        if (!valid) {
            return res.status(401).json({
                message: "Mot de passe incorrect"
            });
        }

        if (!process.env.JWT_SECRET) {
            return res.status(500).json({
                message: "JWT_SECRET manquant côté serveur"
            });
        }

        const token = jwt.sign(
            {
                id: user.id,
                role: user.role
            },
            process.env.JWT_SECRET,
            {
                expiresIn: "30d"
            }
        );

        res.json({
            token,
            user: {
                id: user.id,
                fullname: user.fullname,
                email: user.email,
                role: user.role
            }
        });

    } catch (error) {
        console.error("LOGIN ERROR:", error);
        res.status(500).json({
            message: "Erreur serveur lors de la connexion"
        });
    }
};

exports.getAllUsers = async (req, res) => {
    try {
        const users = await User.getAll();
        res.json(users);
    } catch (err) {
        console.error("GET USERS ERROR:", err);
        res.status(500).json({
            message: "Erreur récupération utilisateurs"
        });
    }
};

exports.deleteUser = async (req, res) => {
    try {
        const userIdToDelete = Number(req.params.id);
        const currentAdminId = Number(req.user.id);

        if (userIdToDelete === currentAdminId) {
            return res.status(400).json({
                message: "Vous ne pouvez pas supprimer votre propre compte admin"
            });
        }

        await User.delete(userIdToDelete);

        res.json({
            message: "Utilisateur supprimé"
        });

    } catch (err) {
        console.error("DELETE USER ERROR:", err);
        res.status(500).json({
            message: "Erreur suppression utilisateur"
        });
    }
};

exports.adminCreateUser = async (req, res) => {
    try {
        const { fullname, email, password, role } = req.body;

        if (!fullname || !email || !password || !role) {
            return res.status(400).json({
                message: "Tous les champs sont obligatoires"
            });
        }

        if (!["user", "admin"].includes(role)) {
            return res.status(400).json({
                message: "Rôle invalide"
            });
        }

        const existing = await User.findByEmail(email);

        if (existing) {
            return res.status(400).json({
                message: "Email déjà utilisé"
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        await User.create(fullname, email, hashedPassword, role);

        res.status(201).json({
            message: "Compte créé"
        });

    } catch (err) {
        console.error("ADMIN CREATE USER ERROR:", err);
        res.status(500).json({
            message: "Erreur création utilisateur"
        });
    }
};
