const express = require("express");
const { PrismaClient } = require("@prisma/client"); // import sekali aja
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const prisma = new PrismaClient();

const app = express();
// const app = express()
app.use(express.json());

app.use(express.json());

const JWT_SECRET = process.env.JWT_SECRET;
// Register
app.post("/register", async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password)
    return res.status(400).json({ error: "Lengkapi semua field ya bro!" });

  try {
    // Cek email udah dipakai belum
    const existingUser = await prisma.users.findUnique({
      where: { email },
    });

    if (existingUser) {
      return res.status(409).json({ error: "Email sudah terdaftar!" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Simpan user baru
    const user = await prisma.users.create({
      data: {
        name,
        email,
        password: hashedPassword,
      },
    });

    // Generate Token (misalnya pakai JWT dulu)
    const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, {
      expiresIn: "7d",
    });

    res.status(201).json({
      message: "Registrasi berhasil",
      user: {
        name: user.name,
        email: user.email,
        created_at: user.created_at ?? new Date(), // fallback kalau null
        updated_at: user.updated_at ?? new Date(),
        id: user.id.toString(),
      },
      token: token,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Login
app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password)
    return res.status(400).json({ error: "Email dan password harus diisi!" });

  try {
    // Cari user berdasar email
    const user = await prisma.users.findUnique({ where: { email } });

    if (!user)
      return res.status(401).json({ error: "Email belum terdaftar bro!" });

    // Cek password
    const isValid = await bcrypt.compare(password, user.password);

    if (!isValid) return res.status(401).json({ error: "Password salah bro!" });

    // Generate JWT token
    const token = jwt.sign({ userId: user.id, email: user.email }, JWT_SECRET, {
      expiresIn: "1d",
    });

    res.json({ message: "Login berhasil!", token });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Server jalan di http://localhost:${PORT}`);
});
