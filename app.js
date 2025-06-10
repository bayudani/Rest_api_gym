import dotenv from 'dotenv';
dotenv.config();

import express from "express";
import authRoutes from "./routes/auth.js";
import morgan from "morgan"; // <<== Tambahkan ini
import posts from "./routes/article.js";
// import categories from "./routes/category.js";
import like from "./routes/likes.js";
import comment from "./routes/comment.js";
import {setupSwagger} from './swagger.js';


const app = express();

// log with morgan
app.use(morgan(':method :url :status :res[content-length] - :response-time ms'));

// === Custom logger biar tampil kayak: [tgl jam] - IP - METHOD URL ===
app.use((req, res, next) => {
  const now = new Date();
  const formatted = `[${now.toLocaleDateString('id-ID')} ${now.toLocaleTimeString('id-ID')}]`;
  const ip = req.ip || req.connection.remoteAddress;
  console.log(`${formatted} - ${ip} - ${req.method} ${req.originalUrl}`);
  next();
});

// bigint fix global
BigInt.prototype.toJSON = function () {
  return this.toString();
};

app.use(express.json());

// swagger
setupSwagger(app);

// Route
app.use("/api/auth", authRoutes);
app.use("/api/posts", posts);
app.use("/api/likes", like);
app.use("/api/comment", comment);
// app.use("/api/categories", categories);

// Tes endpoint root
app.get("/", (req, res) => {
  res.send("Welcome to the API gm");
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server jalan di http://localhost:${PORT}`);
    console.log('Swagger UI -> http://localhost:3001/api-docs');

});
