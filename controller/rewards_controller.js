import { getRewardHistoryByUserId, claimReward,findClaimById,
    updateClaimStatus, } from "../models/rewards_models.js";
import { sendRewardClaimedEmail } from "../helpers/mailer.js";
import { getItemRewardById } from "../models/itemRewards_models.js";
import { findUserById } from "../models/user_models.js";
/**
 * Controller untuk member mengklaim sebuah reward.
 */
export const claimMemberReward = async (req, res) => {
    const { id: itemRewardId } = req.params; // Ambil ID item dari URL
    const { id: userId } = req.user; // Ambil ID user dari token (authMiddleware)
    const user = await findUserById(userId);
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
 * @desc    Finalisasi reward oleh member setelah diterima
 * @route   PUT /api/rewards/:claimId/finalize
 * @access  Private (Member)
 */
export const finalizeMemberReward = async (req, res) => {
    const { claimId } = req.params;
    // const { id: itemRewardId } = req.params; // Ambil ID item dari URL
    
    const { id: userId } = req.user;
    const user = await findUserById(userId);

    try {
        // 1. Cari data klaim reward-nya
        const claimRecord = await findClaimById(claimId);

        // 2. Validasi
        if (!claimRecord) {
            return res.status(404).json({ error: "Data klaim reward tidak ditemukan." });
        }
        // Pastikan yang akses adalah pemilik reward
        if (claimRecord.member_profile.user_id !== BigInt(userId)) {
            return res.status(403).json({ error: "Akses ditolak. Ini bukan reward kamu." });
        }
        // Pastikan statusnya 'confirmed'
        if (claimRecord.reward_status !== 'confirmed') {
            return res.status(400).json({ error: `Reward ini belum dikonfirmasi admin atau sudah selesai.` });
        }

        // 3. Jika lolos validasi, update statusnya ke 'claimed'
        const updatedClaim = await updateClaimStatus(claimId, 'claimed',userId);

        // notif
        try {
            const itemRewardId = claimRecord.item_reward_id; 
            const reward = await getItemRewardById(itemRewardId);

            if(reward){
                // panggil fungsi kirim email dari helpers
                await sendRewardClaimedEmail({
                    userEmail : user.email,
                    userName:user.name,
                    rewardName:reward.name,
                })
            }else{
                console.warn ("Reward tidak ditemukan, email notifikasi tidak terkirim")
            }
        } catch (emailError) {
            console.error("Gagal mengirim email", emailError);
        }

        res.status(200).json({
            message: "Mantap! Reward sudah kamu konfirmasi diterima. Enjoy!",
            data: updatedClaim,
        });

    } catch (error) {
        console.error("Error di finalizeMemberReward:", error.message);
        res.status(500).json({ error: "Servernya lagi error, gagal finalisasi reward." });
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