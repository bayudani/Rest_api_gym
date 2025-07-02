import asyncHandler from 'express-async-handler';
import axios from 'axios';

/**
 * Handler: checkExerciseForm
 * ------------------------------------------
 * @desc    Menganalisis gambar form latihan user menggunakan AI Gemini Vision.
 *          Endpoint ini menerima gambar dan nama latihan, lalu mengirim gambar ke API Google Gemini Vision
 *          untuk mendapatkan analisis postur dengan feedback dalam format JSON.
 * @route   POST /api/ai/check-form
 * @access  Private (memerlukan login)
 * 
 * Request Body (form-data):
 *   - exerciseName: String (nama latihan, contoh: squat, push-up, dll)
 *   - image: File gambar (user saat latihan, wajib)
 * 
 * Response Success (Status 200):
 *   {
 *     is_correct: boolean,      // Apakah postur sudah benar (90%+)
 *     score: number,            // Skor 0-100
 *     feedback_points: [        // 3 feedback utama
 *       { type: "good"|"bad", point: "string" },
 *       ...
 *     ],
 *     summary: string           // Kesimpulan & motivasi singkat
 *   }
 * 
 * Response Error:
 *   - 400: exerciseName/image tidak diisi
 *   - 500: API Key tidak tersedia / gagal analisa
 */
export const checkExerciseForm = asyncHandler(async (req, res) => {
    // 1. Ambil data dari request body dan file upload (melalui middleware, misal: multer)
    const { exerciseName } = req.body;
    const imageFile = req.file;

    // Validasi: Nama latihan wajib diisi
    if (!exerciseName) {
        res.status(400);
        throw new Error('Nama latihan harus diisi.');
    }

    // Validasi: Gambar wajib diupload (backup, walau biasanya sudah ditangani middleware)
    if (!imageFile) {
        res.status(400);
        throw new Error('Gambar latihan wajib diupload.');
    }

    // 2. Konversi buffer gambar ke string base64 (format yang dibutuhkan Gemini)
    const imageBase64 = imageFile.buffer.toString('base64');

    // 3. Ambil API Key Gemini dari environment variable
    const geminiApiKey = process.env.GEMINI_API_KEY;
    if (!geminiApiKey) {
        res.status(500);
        throw new Error('API Key Gemini belum diatur di server.');
    }

    // 4. Siapkan URL endpoint Gemini Vision (gunakan model terbaru untuk analisa gambar)
    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${geminiApiKey}`;

    // 5. Siapkan body permintaan ke Gemini: isi prompt instruksi dan lampirkan gambar (base64)
    const requestBody = {
        contents: [
            {
                parts: [
                    // Instruksi analisa untuk AI
                    {
                        text: `Kamu adalah "Coach FitID", seorang pelatih fitness bersertifikat internasional dengan spesialisasi analisis postur. Analisis gambar berikut dengan saksama. User sedang melakukan gerakan "${exerciseName}".
                        
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
                    // Lampiran data gambar yang akan dianalisis AI
                    {
                        inline_data: {
                            mime_type: imageFile.mimetype,
                            data: imageBase64
                        }
                    }
                ]
            }
        ],
        // Konfigurasi agar AI hanya mengembalikan output bertipe JSON
        "generationConfig": {
            "response_mime_type": "application/json",
        }
    };

    try {
        // 6. Kirim request ke Gemini Vision API
        const geminiResponse = await axios.post(apiUrl, requestBody);

        // 7. Ambil hasil analisa (AI mengembalikan JSON sebagai string → parse ke objek)
        const aiReply = geminiResponse.data.candidates[0].content.parts[0].text;
        res.status(200).json(JSON.parse(aiReply));

    } catch (error) {
        // Logging error ke server
        console.error('Error saat menghubungi Gemini API:', error.response ? error.response.data.error : error.message);
        res.status(500);
        throw new Error('Gagal menganalisis gambar. Coba lagi nanti.');
    }
});