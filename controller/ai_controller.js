import asyncHandler from 'express-async-handler';
import axios from 'axios';
import prisma from '../prisma/db.js'; // <-- 1. IMPORT PRISMA CLIENT

/**
 * @desc    Menangani permintaan chat dari user dan meneruskannya ke Gemini API
 * @route   POST /api/ai/chat
 * @access  Private (memerlukan login)
 */
export const handleChat = asyncHandler(async (req, res) => {
    // Ambil pesan dari body request
    const { message } = req.body;
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
    
    // 3. Siapkan dan kirim request ke Google Gemini API

    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${geminiApiKey}`;

    const requestBody = {
        // <-- 3. UPGRADE SYSTEM INSTRUCTION DENGAN NAMA & ATURAN BARU -->
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
            {
                parts: [ { text: message } ],
            },
        ],
    };

    try {
        const geminiResponse = await axios.post(apiUrl, requestBody, {
            headers: { 'Content-Type': 'application/json' },
        });

        const aiReply = geminiResponse.data.candidates[0].content.parts[0].text;
        res.status(200).json({ reply: aiReply });

    } catch (error) {
        console.error('Error saat menghubungi Gemini API:', error.response ? error.response.data : error.message);
        res.status(500);
        throw new Error('Gagal berkomunikasi dengan AI. Coba lagi nanti.');
    }
});
