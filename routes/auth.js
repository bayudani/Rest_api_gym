import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import prisma from "../prisma/db.js";  // jangan lupa tambahin .js di import

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET;

// Global fix untuk error BigInt serialization (optional tapi mantap)
BigInt.prototype.toJSON = function () {
  return this.toString();
};

// ================== REGISTER ==================
router.post("/register", async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ error: "Lengkapi semua field ya bro!" });
  }

  try {
    const existingUser = await prisma.users.findUnique({ where: { email } });

    if (existingUser) {
      return res.status(409).json({ error: "Email sudah terdaftar!" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.users.create({
      data: { name, email, password: hashedPassword },
    });

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
});

// ================== LOGIN ==================
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: "Email dan password harus diisi!" });
  }

  try {
    const user = await prisma.users.findUnique({ where: { email } });

    if (!user) {
      return res.status(401).json({ error: "Email belum terdaftar bro!" });
    }

    const isValid = await bcrypt.compare(password, user.password);

    if (!isValid) {
      return res.status(401).json({ error: "Password salah bro!" });
    }

    const token = jwt.sign({ userId: user.id, email: user.email }, JWT_SECRET, {
      expiresIn: "1d",
    });

    res.json({
      message: "Login berhasil!",
      token,
      user: {
        id: user.id.toString(),
        name: user.name,
        email: user.email,
      },
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
