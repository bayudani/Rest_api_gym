import dotenv from 'dotenv';
dotenv.config();

import express from "express";
import authRoutes from "./routes/auth.js";
import posts from "./routes/post.js";
import categories from "./routes/category.js";

const app = express();

app.use(express.json());

// Gunakan route auth
app.use("/api/auth", authRoutes);
app.use("/api/posts", posts);
app.use("/api/categories", categories);

// Tes endpoint root
app.get("/", (req, res) => {
  res.send("Welcome to the API bro 🚀");
});

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Server jalan di http://localhost:${PORT}`);
});
