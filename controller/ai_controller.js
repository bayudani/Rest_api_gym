import asyncHandler from 'express-async-handler';
import axios from 'axios';
import prisma from '../prisma/db.js'; 
import redisClient from '../helpers/redis-client.js';

/**
 * @desc    Menangani permintaan chat dari user dan meneruskannya ke Gemini API
 * @route   POST /api/ai/chat
 * @access  Private (memerlukan login)
 * @cache    ada cache Redis untuk chat
 */
export const handleChat = asyncHandler(async (req, res) => {
    // Ambil pesan dari body request
    const { message } = req.body;
    const userId = req.user.id; // Ambil ID user dari token yang sudah di-decode oleh middleware
    const redisKey = `chat_history:${userId}`; // Kunci cache Redis untuk chat user ini
    if (!message) {
        res.status(400);
        throw new Error('Pesan tidak boleh kosong!');
    }

    // <-- 2. AMBIL DATA DARI DATABASE  -->
    const membershipPackages = await prisma.memberships.findMany({
    });

    // Format data membership jadi teks yang gampang dibaca 
    let membershipContext = "Berikut adalah daftar paket membership yang tersedia di aplikasi FitID:\n";
    if (membershipPackages.length > 0) {
        membershipPackages.forEach(pkg => {
            // Menggunakan field baru: name, price, dan duration_months
            const price = Number(pkg.price); // Konversi Decimal ke Number 
            membershipContext += `- Paket "${pkg.name}": Harga Rp ${price.toLocaleString('id-ID')} untuk durasi ${pkg.duration_months} bulan.\n`;
        });
    } else {
        membershipContext = "Saat ini belum ada paket membership yang tersedia.";
    }
    // <-- Akhir dari pengambilan data -->


    // Ambil API Key dari environment variables
    const geminiApiKey = process.env.GEMINI_API_KEY;
    if (!geminiApiKey) {
        res.status(500);
        throw new Error('API Key untuk Gemini belum diatur di server.');
    }
    
    // 3 ambil chat history dari Redis
    const history = await redisClient.lRange(redisKey,0, 9); // Ambil 10 pesan terakhir dari chat history
    const chatHitoryForGemini  = history.map(item => JSON.parse(item)); // Parse setiap item dari Redis ke JSON
    console.log("Chat history for Gemini:", chatHitoryForGemini);
    // 4. Siapkan dan kirim request ke Google Gemini API

    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${geminiApiKey}`;

    const requestBody = {
        // <-- 3. SYSTEM INSTRUCTION DENGAN NAMA & ATURAN BARU -->
        "system_instruction": {
            "parts": [
                {
                    "text": `Kamu adalah "FitID AI", asisten kebugaran virtual untuk aplikasi gym bernama "FitID". Kamu sangat ramah, profesional, dan berpengetahuan luas.
                    
                    TUGAS UTAMA:
                    1. Jawab semua pertanyaan yang spesifik berhubungan dengan dunia gym, fitness, program latihan, nutrisi untuk olahraga, suplemen, dan gaya hidup sehat.
                    2. JAWAB PERTANYAAN TENTANG APLIKASI FITID berdasarkan informasi yang diberikan di bawah ini.
                    
                    ATURAN PENTING:
                    - Jika user bertanya tentang topik di luar itu (misalnya tentang film, politik, sejarah, atau topik umum lainnya), kamu HARUS menolak dengan santai dan ramah namun tetap profesional. JANGAN menjawab pertanyaannya.
                    Contoh penolakan: "Mohon maaf, sebagai FitID AI, saya hanya diprogram untuk membantu seputar kebugaran dan informasi aplikasi FitID. Ada pertanyaan lain seputar fitness yang bisa saya bantu?"
                    - Selalu sebutkan bahwa kamu adalah AI untuk aplikasi "FitID" jika ada user yang bertanya kamu siapa.
                    
                    --- INFORMASI APLIKASI (Data dari Database) ---
                    ${membershipContext}
                    --- AKHIR DARI INFORMASI ---
                    `
                }
            ]
        },
        
        contents: [
            ...chatHitoryForGemini,
            {
                role:"user",
                parts: [ { text: message } ],
            },
        ],
    };

    try {
        const geminiResponse = await axios.post(apiUrl, requestBody, {
            headers: { 'Content-Type': 'application/json' },
        });

        const aiReply = geminiResponse.data.candidates[0].content.parts[0].text;
        // 5. Simpan chat history ke Redis
        const userMessageToSave = { role: 'user', parts: [{ text: message }] };
        const aiMessageToSave = { role: 'model', parts: [{ text: aiReply }] };

        await redisClient.rPush(redisKey, JSON.stringify(userMessageToSave));
        await redisClient.rPush(redisKey, JSON.stringify(aiMessageToSave));

        console.log('Chat history saved to Redis:', { userMessageToSave, aiMessageToSave });

         // Set masa berlaku untuk riwayat chat ini,  1 hari
        await redisClient.expire(redisKey, 60 * 60 * 24);

        res.status(200).json({ reply: aiReply });

    } catch (error) {
        console.error('Error saat menghubungi Gemini API:', error.response ? error.response.data : error.message);
        res.status(500);
        throw new Error('Gagal berkomunikasi dengan AI. Coba lagi nanti.');
    }
});
/**
 * @desc    Mengambil riwayat chat user
 * @route   GET /api/ai/chat/history
 * @access  Private (memerlukan login)
 */
export const getChatHistory = asyncHandler(async (req, res) => {
    // Asumsi: 'req.user' didapat dari middleware otentikasi
    const userId = req.user.id;
    const redisKey = `chat_history:${userId}`;

    if (!userId) {
        res.status(401);
        throw new Error('User tidak terautentikasi!');
    }

    // Ambil semua data dari list di Redis
    const history = await redisClient.lRange(redisKey, 0, -1);
    console.log(`Mengambil riwayat chat untuk user ID ${userId} dari Redis:`, history);
    // Ubah kembali dari format string JSON ke object JSON
    const parsedHistory = history.map(item => {
        const parsedItem = JSON.parse(item);
        //  ubah formatnya biar lebih simpel buat di-render di Flutter
        return {
            sender: parsedItem.role === 'user' ? 'user' : 'ai',
            text: parsedItem.parts[0].text
        };
    });

    res.status(200).json(parsedHistory);
});
