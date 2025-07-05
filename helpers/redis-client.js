// config/redis-client.js

import { createClient } from 'redis';
import dotenv from 'dotenv';
dotenv.config(); // Load environment variables from .env file
// Buat koneksi ke Redis server hanya dengan URL dari .env
const redisClient = createClient({
    url: process.env.REDIS_URL
});

redisClient.on('error', (err) => console.log('Redis Client Error ', err));

//  bungkus connect dalam fungsi biar bisa di-await di tempat lain
const connectRedis = async () => {
    try {
        await redisClient.connect();
        console.log("Berhasil konek ke Cloud Redis! 🚀");
    } catch (err) {
        console.error("Gagal konek ke Redis:", err);
    }
};

connectRedis(); // Langsung panggil fungsi koneksi

export default redisClient;