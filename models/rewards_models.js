import prisma from "../prisma/db.js";

/**
 * Logika untuk member MEMBUAT PERMINTAAN reward.
 * Fungsi ini sekarang dinamai 'createPendingReward' untuk kejelasan.
 * @param {string | number} userId - ID dari user yang mengklaim.
 * @param {string | number} itemRewardId - ID dari item reward yang mau diklaim.
 * @returns {Promise<Object>} Data record reward baru yang berhasil dibuat.
 * @throws {Error} Akan melempar error jika validasi gagal.
 */

// models/rewards_models.js

export const claimReward = async (userId, itemRewardId) => {

    // 1. Dapatkan profile_id dari userId
    const memberProfile = await prisma.member_profiles.findUnique({
        where: { user_id: BigInt(userId) },
    });

    // 2. Dapatkan detail item reward
    const itemReward = await prisma.item_rewards.findUnique({
        where: { id: BigInt(itemRewardId) },
    });

    // 3. Validasi
    if (!memberProfile) {
        throw new Error("Profil member tidak ditemukan.");
    }
    if (!itemReward) {
        throw new Error("Item reward tidak ditemukan.");
    }
    // Cek poin tetap penting, jangan sampai user klaim barang yang poinnya jauh di atas kemampuannya
    if (memberProfile.point < itemReward.points) {
        throw new Error("Poin Anda tidak cukup untuk menukarkan reward ini.");
    }

    const now = new Date();
    const wibTime = new Date(now.getTime() + (7 * 60 * 60 * 1000));

    const newClaim = await prisma.rewardss.create({
        data: {
            member_profile_id: memberProfile.id,
            item_reward_id: itemReward.id,
            reward_status: "pending",
            // Cukup panggil variabelnya langsung
            created_at: wibTime
        },
    });

    console.log(`PENDING: Reward ${itemReward.name} untuk ${memberProfile.fullName} tercatat.`);
    return newClaim;
};

/**
 * Mencari satu data klaim reward berdasarkan ID uniknya.
 * @param {string | number} claimId - ID dari tabel 'rewardss'.
 * @returns {Promise<Object|null>} Data klaim atau null jika tidak ditemukan.
 */
export const findClaimById = async (claimId) => {
    return await prisma.rewardss.findUnique({
        where: {
            id: BigInt(claimId),
        },
        // Kita butuh userId untuk validasi kepemilikan
        include: {
            member_profile: {
                select: {
                    user_id: true
                }
            }
        }
    });
};

/**
 * Mengubah status dari sebuah klaim reward.
 * @param {string | number} claimId - ID dari tabel 'rewardss'.
 * @param {'pending' | 'confirmed' | 'claimed'} newStatus - Status baru untuk reward.
 * @returns {Promise<Object>} Data klaim yang sudah di-update.
 */
export const updateClaimStatus = async (claimId, newStatus) => {
    return await prisma.rewardss.update({
        where: {
            id: BigInt(claimId),
        },
        data: {
            reward_status: newStatus,
            updated_at: new Date(),
        },
    });
};

/**
 * Mengambil detail satu item reward berdasarkan ID.
 * Berguna untuk notifikasi email.
 * @param {string | number} itemRewardId - ID dari item reward.
 * @returns {Promise<Object|null>}
 */
export const getItemRewardById = async (itemRewardId) => {
    return await prisma.item_rewards.findUnique({
        where: { id: BigInt(itemRewardId) },
    });
};

export const getRewardHistoryByUserId = async (userId) => {
    // Cari member profile dulu berdasarkan userId
    const memberProfile = await prisma.member_profiles.findUnique({
        where: {
            user_id: BigInt(userId), // Pastikan dikonversi ke BigInt
        },
        // Pake `include` buat langsung join dan ambil data rewards terkait
        // Ini bisa dilakukan karena kita udah nambahin relasi di schema.prisma
        include: {
            rewardss: {
                // ambil yang status claimed
                // where: {
                //     reward_status: "claimed",
                // },
                include: {
                    item_reward: true, // Asumsi relasi di schema.prisma sudah didefinisikan
                },
                orderBy: {
                    created_at: "desc",
                },
            },
        },
    });

    // Kalo profil member nggak ada, atau dia belum punya reward,
    // balikin array kosong aja.
    if (!memberProfile) {
        return [];
    }

    // Balikin cuma data rewards-nya aja
    return memberProfile.rewardss;
};
