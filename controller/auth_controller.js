import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { findUserByEmail, createUser, findUserById } from "../models/user_models.js";

const JWT_SECRET = process.env.JWT_SECRET;

// register user
export const registerUser = async (req, res) => {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
        return res.status(400).json({ error: "Lengkapi semua field ya bro!" });
    }
    try {
        const existingUser = await findUserByEmail(email);
        if (existingUser) {
            return res.status(409).json({ error: "Email sudah terdaftar!" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await createUser({ name, email, password: hashedPassword });

        const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, {
            expiresIn: "7d",
        });

        res.status(201).json({
            message: "Registrasi berhasil",
            user: {
                id: user.id.toString(),
                name: user.name,
                email: user.email,
                created_at: user.created_at,
                updated_at: user.updated_at,
            },
            token,
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

    // login user
    export const login = async (req, res) => {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ error: "Email dan password harus diisi!" });
        }
        try {
            const user = await findUserByEmail(email);
            if (!user) {
                return res.status(401).json({ error: "Email belum terdaftar bro!" });
            }

            const isValid = await bcrypt.compare(password, user.password);
            if (!isValid) {
                return res.status(401).json({ error: "Password salah bro!" });
            }

            const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, {
                expiresIn: "7d",
            });

            res.status(200).json({
                message: "Login berhasil",
                user: {
                    id: user.id.toString(),
                    name: user.name,
                    email: user.email,
                    created_at: user.created_at,
                    updated_at: user.updated_at,
                },
                token,
            });
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    }
// get user profile
export const profile = async (req, res) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({ error: "Token tidak valid!" });
    }
    const token = authHeader.split(" ")[1];
    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        const user = await findUserById(decoded.id);
        if (!user) {
            return res.status(404).json({ error: "User tidak ditemukan!" });
        }
        res.status(200).json({
            id: user.id.toString(),
            name: user.name,
            email: user.email,
            created_at: user.created_at,
            updated_at: user.updated_at,
        });
    } catch (err) {
        res.status(401).json({ error: "Token tidak valid!" });
    }
}
