import asyncHandler from 'express-async-handler';
import axios from 'axios';

/**
 * @desc    Menganalisis gambar form latihan user menggunakan Gemini Vision
 * @route   POST /api/ai/check-form
 * @access  Private (memerlukan login)
 */
export const checkExerciseForm = asyncHandler(async (req, res) => {
    // 1. Ambil data dari request
    const { exerciseName } = req.body;
    const imageFile = req.file;

    // Validasi input
    if (!exerciseName) {
        res.status(400);
        throw new Error('Nama latihan harus diisi.');
    }
    if (!imageFile) {
        // Sebenarnya ini sudah ditangani middleware, tapi sebagai pengaman tambahan
        res.status(400);
        throw new Error('Gambar latihan wajib diupload.');
    }

    // 2. Konversi gambar (buffer) ke format base64
    const imageBase64 = imageFile.buffer.toString('base64');

    // 3. Ambil API Key dan siapkan request ke Gemini
    const geminiApiKey = process.env.GEMINI_API_KEY;
    if (!geminiApiKey) {
        res.status(500);
        throw new Error('API Key Gemini belum diatur di server.');
    }
    
    // Kita pakai model gemini-1.5-pro karena lebih kuat untuk analisis gambar
    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${geminiApiKey}`;

    const requestBody = {
        contents: [
            {
                parts: [
                    // Prompt teks sebagai instruksi pertama
                    {
                        text: `Kamu adalah "Coach Pro", seorang pelatih fitness bersertifikat internasional dengan spesialisasi analisis postur. Analisis gambar berikut dengan saksama. User sedang melakukan gerakan "${exerciseName}".
                        
                        Berikan feedback dengan struktur JSON berikut:
                        {
                          "is_correct": boolean, // true jika postur sudah 90% benar, false jika ada kesalahan fatal
                          "score": number, // Beri skor dari 0-100 berdasarkan kebenaran postur
                          "feedback_points": [
                            { "type": "good" | "bad", "point": "string" },
                            { "type": "good" | "bad", "point": "string" },
                            { "type": "good" | "bad", "point": "string" }
                          ],
                          "summary": "string" // Kesimpulan akhir dalam satu kalimat yang memotivasi
                        }
                        
                        Fokus analisis pada: posisi punggung, lutut, pinggul, dan kepala. Berikan 3 poin feedback yang paling krusial. Jika ada yang bagus, puji. Jika ada yang salah, berikan koreksi yang jelas.`
                    },
                    // Data gambar sebagai instruksi kedua
                    {
                        inline_data: {
                            mime_type: imageFile.mimetype,
                            data: imageBase64
                        }
                    }
                ]
            }
        ],
        // Menambahkan generationConfig agar outputnya PASTI JSON
        "generationConfig": {
            "response_mime_type": "application/json",
        }
    };

    try {
        const geminiResponse = await axios.post(apiUrl, requestBody);
        
        // Response dari Gemini sudah dalam format JSON, kita tinggal teruskan
        const aiReply = geminiResponse.data.candidates[0].content.parts[0].text;
        
        res.status(200).json(JSON.parse(aiReply));

    } catch (error) {
        console.error('Error saat menghubungi Gemini API:', error.response ? error.response.data.error : error.message);
        res.status(500);
        throw new Error('Gagal menganalisis gambar. Coba lagi nanti.');
    }
});
