import prisma from "../prisma/db.js";



/**
 * logika untuk member claim reward
* @param {number | string} userId - ID dari user yang mengklaim.
 * @param {number | string} itemRewardId - ID dari item reward yang mau diklaim.
 * @returns {Promise<Object>} Data record reward baru yang berhasil dibuat.
 * @throws {Error} Akan melempar error dengan pesan spesifik jika validasi gagal.
 */

export const claimReward = async (userId, itemRewardId) => {
    return await prisma.$transaction(async (tx) => {
        // --- FIX: Gunakan nama model snake_case sesuai yang dikenali Prisma Client ---
        // Sebelum: tx.memberProfile
        // Sesudah: tx.member_profiles
        const memberProfile = await tx.member_profiles.findUnique({
            where: { user_id: BigInt(userId) }, // <-- INI DIA FIX-NYA!
        });

        // Sebelum: tx.itemReward
        // Sesudah: tx.item_rewards
        const itemReward = await tx.item_rewards.findUnique({
            where: { id: BigInt(itemRewardId) },
        });

        // 2. Validasi awal
        if (!memberProfile) {
            throw new Error("Profil member tidak ditemukan.");
        }
        if (!itemReward) {
            throw new Error("Item reward tidak ditemukan.");
        }

        // 3. Validasi UTAMA: Cek kecukupan poin member
        if (memberProfile.point < itemReward.points) {
            throw new Error("Poin Anda tidak cukup untuk menukarkan reward ini.");
        }

        // 4. Proses pengurangan poin
        const updatedProfile = await tx.member_profiles.update({
            where: { id: memberProfile.id },
            data: {
                point: {
                    decrement: itemReward.points, // Kurangi poinnya
                },
            },
        });

        // 5. Catat transaksi klaim di tabel 'rewardss'
        // Sebelum: tx.reward
        // Sesudah: tx.rewardss
        const newClaim = await tx.rewardss.create({
            data: {
                member_profile_id: memberProfile.id,
                item_reward_id: itemReward.id,
                reward_status: 'claimed', // Langsung set statusnya jadi 'claimed'
            },
        });

        console.log(`SUCCESS: Poin ${memberProfile.fullName} dikurangi ${itemReward.points}. Sisa: ${updatedProfile.point}`);
        return newClaim; // Kembalikan data klaim yang baru dibuat
    });
};
export const getRewardHistoryByUserId = async (userId) => {
    // Cari member profile dulu berdasarkan userId
    const memberProfile = await prisma.member_profiles.findUnique({
        where: {
            user_id: BigInt(userId) // Pastikan dikonversi ke BigInt
        },
        // Pake `include` buat langsung join dan ambil data rewards terkait
        // Ini bisa dilakukan karena kita udah nambahin relasi di schema.prisma
        include: {
            rewardss: {
                // ambil yang status claimed
                where: {
                    reward_status: 'claimed'
                },
                orderBy: {
                    created_at: 'desc'
                }
            }
        }
    });

    // Kalo profil member nggak ada, atau dia belum punya reward,
    // balikin array kosong aja.
    if (!memberProfile) {
        return [];
    }

    // Balikin cuma data rewards-nya aja
    return memberProfile.rewardss;
};

