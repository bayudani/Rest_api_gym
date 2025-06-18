import prisma from "../prisma/db.js";

export const getRewardHistoryByUserId = async (userId) => {
    // Cari member profile dulu berdasarkan userId
    const memberProfile = await prisma.member_profiles.findUnique({
        where: {
            user_id: BigInt(userId) // Pastikan dikonversi ke BigInt
        },
        // Pake `include` buat langsung join dan ambil data rewards terkait
        // Ini bisa dilakukan karena kita udah nambahin relasi di schema.prisma
        include: {
            rewards: {
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
    return memberProfile.rewards;
};