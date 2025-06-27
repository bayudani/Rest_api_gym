import asyncHandler from 'express-async-handler';
import axios from 'axios';

/**
 * @desc    Menangani permintaan chat dari user dan meneruskannya ke Gemini API
 * @route   POST /api/ai/chat
 * @access  Private (memerlukan login)
 */
export const handleChat = asyncHandler(async (req, res) => {
    // 1. Ambil pesan dari body request yang dikirim Flutter
    const { message } = req.body;

    // Validasi input: pastikan pesan tidak kosong
    if (!message) {
        res.status(400);
        throw new Error('Pesan tidak boleh kosong!');
    }

    // 2. Ambil API Key dari environment variables 
    const geminiApiKey = process.env.GEMINI_API_KEY;
    if (!geminiApiKey) {
        res.status(500);
        throw new Error('API Key untuk Gemini belum diatur di server.');
    }

    // 3. Siapkan dan kirim request ke Google Gemini API
    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${geminiApiKey}`;

    const requestBody = {
        contents: [
            {
                parts: [
                    {
                        text: message,
                    },
                ],
            },
        ],
    };

    try {
        const geminiResponse = await axios.post(apiUrl, requestBody, {
            headers: {
                'Content-Type': 'application/json',
            },
        });

        // 4. Ekstrak jawaban AI dari response
        // Pastikan struktur response sesuai dokumentasi Gemini
        const aiReply = geminiResponse.data.candidates[0].content.parts[0].text;

        // 5. Kirim jawaban AI kembali ke aplikasi Flutter
        res.status(200).json({
            reply: aiReply,
        });

    } catch (error) {
        console.error('Error saat menghubungi Gemini API:', error.response ? error.response.data : error.message);
        res.status(500);
        throw new Error('Gagal berkomunikasi dengan AI. Coba lagi nanti.');
    }
});
