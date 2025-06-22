import { getRewardHistoryByUserId, claimReward } from "../models/rewards_models.js";

/**
 * Controller untuk member mengklaim sebuah reward.
 */
export const claimMemberReward = async (req, res) => {
    const { id: itemRewardId } = req.params; // Ambil ID item dari URL
    const { id: userId } = req.user; // Ambil ID user dari token (authMiddleware)

    try {
        const newClaim = await claimReward(userId, itemRewardId);
        res.status(201).json({ // 201 Created
            message: "Hore! Reward berhasil diklaim.",
            data: newClaim,
        });
    } catch (error) {
        console.error("Error di claimMemberReward:", error.message);

        // Kirim response error yang lebih deskriptif ke frontend
        if (error.message.includes("Poin Anda tidak cukup")) {
            return res.status(400).json({ error: error.message }); // 400 Bad Request
        }
        if (error.message.includes("ditemukan")) {
            return res.status(404).json({ error: error.message }); // 404 Not Found
        }

        res.status(500).json({ error: "Servernya lagi error, gagal klaim reward." });
    }
};

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