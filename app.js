import express from "express";
import dotenv from 'dotenv';
import cors from 'cors';
import morgan from "morgan"; // <<== Tambahkan ini
import {setupSwagger} from './swagger.js';
import { createProxyMiddleware } from "http-proxy-middleware";
import authRoutes from "./routes/auth.js";
import posts from "./routes/article.js";
import like from "./routes/likes.js";
import comment from "./routes/comment.js";
import membership from "./routes/membership.js";
import transactions from "./routes/transactions.js";
import member from "./routes/member.js";
import program from "./routes/programs.js";
import rewards from "./routes/reward.js";
import itemRewards from "./routes/itemRewards.js";
import ai from "./routes/ai.js";
import formChacker from "./routes/ai_form_checker_routes.js";



const app = express();
dotenv.config();

app.use(cors());
// log with morgan
app.use(morgan(':method :url :status :res[content-length] - :response-time ms'));
// app.use(express.static('public')); 

// === Custom logger biar tampil kayak: [tgl jam] - IP - METHOD URL ===
app.use((req, res, next) => {
  const now = new Date();
  const formatted = `[${now.toLocaleDateString('id-ID')} ${now.toLocaleTimeString('id-ID')}]`;
  const ip = req.ip || req.connection.remoteAddress;
  console.log(`${formatted} - ${ip} - ${req.method} ${req.originalUrl}`);
  next();
});

// Proxy untuk Laravel
// Semua request ke /laravel/... akan diteruskan ke http://localhost:8000
app.use('/laravel', createProxyMiddleware({
  target: process.env.LARAVEL_IMAGE, // Alamat server Laravel 
  changeOrigin: true,
  pathRewrite: {
    '^/laravel': '', // Hapus '/laravel' dari path sebelum diteruskan
  },
}));

// app.use(cors({
//   origin: 'http://localhost:5173', // asal domain yang diizinkan
//   credentials: true, // kalau pakai cookie
// }));

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
app.use("/api/memberships", membership);
app.use("/api/transactions", transactions);
app.use("/api/member", member);
app.use("/api/programs", program);
app.use("/api/member/rewards", rewards);
app.use("/api/item-rewards", itemRewards);
app.use("/api/ai", ai);
app.use("/api/ai", formChacker);
// app.use("/api/categories", categories);


// Tes endpoint root
app.get("/", (req, res) => {
  res.send("Welcome to the API FitID Gym App");
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server jalan di http://localhost:${PORT}`);
    console.log('Swagger UI -> http://localhost:3001/api-docs');
});

export default app;