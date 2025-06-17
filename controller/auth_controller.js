import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import {
    findUserByEmail,
    createUser,
    findUserById,
} from "../models/user_models.js";
import prisma from "../prisma/db.js";

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
};

// login user
export const login = async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json({ error: "Email dan password harus diisi!" });
    }
    try {
        const user = await findUserByEmail(email);
        if (!user) {
            return res.status(401).json({ error: "Email belum terdaftar!" });
        }

        const isValid = await bcrypt.compare(password, user.password);
        if (!isValid) {
            return res.status(401).json({ error: "Password salah!" });
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
};
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
            // id: user.id.toString(),
            name: user.name,
            email: user.email,
            // created_at: user.created_at,
            // updated_at: user.updated_at,
        });
    } catch (err) {
        res.status(401).json({ error: "Token tidak valid!" });
    }
};

// update user
// controllers/user_controller.js (lanjutin dari file lo)
export const updateUserInfo = async (req, res) => {
    console.log("USER PAYLOAD:", req.user); // <-- Tambahin di sini bro!

    const { name, email } = req.body;

    if (!name || !email) {
        return res.status(400).json({ error: "Nama dan email wajib diisi!" });
    }

    try {
        const updatedUser = await prisma.users.update({
            where: { id: Number(req.user.id) },
            data: { name, email },
            select: {
                id: true,
                name: true,
                email: true,
                created_at: true,
                updated_at: true,
            },
        });

        res.status(200).json({
            message: "Profil berhasil diupdate!",
            user: updatedUser,
        });
    } catch (error) {
        console.error("Error updating user info:", error);
        res.status(500).json({ error: "Gagal update data user!" });
    }
};

// update pas
export const updateUserPassword = async (req, res) => {
        console.log("USER PAYLOAD:", req.user); // <-- Tambahin di sini bro!

    const { currentPassword, newPassword, confirmPassword } = req.body;

    if (newPassword != confirmPassword) {
        return res.status(400).json({
            error: "Password tidak cocok! Silakan coba lagi.",
        });
    }
    if (!currentPassword || !newPassword) {
        return res
            .status(400)
            .json({ error: "Password lama dan baru wajib diisi!" });
    }

    try {
        const user = await prisma.users.findUnique({
            where: { id: req.user.id },
        });

        const isMatch = await bcrypt.compare(currentPassword, user.password);
        if (!isMatch) {
            return res.status(401).json({ error: "Password lama salah!" });
        }

        const hashedNewPassword = await bcrypt.hash(newPassword, 10);

        await prisma.users.update({
            where: { id: req.user.id },
            data: { password: hashedNewPassword },
        });

        res.status(200).json({ message: "Password berhasil diupdate!" });
    } catch (error) {
        console.error("Error updating password:", error);
        res.status(500).json({ error: "Gagal update password!" });
    }
};
