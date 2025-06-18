import { getRewardHistoryByUserId } from "../models/rewards_models.js";

/**
 * Controller untuk mengambil histori reward member yang sedang login.
 */
export const getMemberRewardHistory = async (req, res) => {
    // Ambil user id dari token yang udah di-decode sama middleware
    const userId = req.user.id;

    try {
        // Panggil fungsi model buat ngambil data
        const history = await getRewardHistoryByUserId(userId);

        // Kalo datanya nggak ada atau kosong, kita bisa kirim 200 dengan array kosong
        // atau 404. Tapi 200 lebih umum untuk list yang emang kosong.
        if (!history || history.length === 0) {
            return res.status(200).json({
                message: "Kamu belum punya histori reward.",
                data: []
            });
        }

        // Kalo ada, kirim datanya sebagai JSON
        res.status(200).json({
            message: "Histori reward berhasil diambil.",
            data: history
        });

    } catch (error) {
        // Kalo ada error di server, kasih tau di console dan kirim response 500
        console.error("Error getMemberRewardHistory:", error);
        res.status(500).json({ error: "Server lagi ngambek, coba lagi nanti." });
    }
};