import prisma from "../prisma/db.js";

export const createMemberProfile = async (data) => {
    const existingProfile = await prisma.member_profiles.findFirst({
        where: { user_id: data.user_id },
    });

    const now = new Date();

    if (existingProfile) {
        return await prisma.member_profiles.update({
            where: { user_id: data.user_id },
            data: {
                start_date: data.start_date || now,
                end_date: data.end_date || null,
                is_active: data.is_active ?? true,
                updated_at: now,
            },
        });
    } else {
        if (!data.full_name || !data.addres || !data.phone) {
            throw new Error("Data profil member tidak lengkap");
        }

        return await prisma.member_profiles.create({
            data: {
                user_id: data.user_id,
                full_name: data.full_name,
                addres: data.addres,
                phone: data.phone,
                start_date: data.start_date || now,
                end_date: data.end_date || null,
                is_active: data.is_active ?? true,
                created_at: now,
                updated_at: now,
            },
        });
    }
};

export const getMemberProfileByUserId = async (userId) => {
    return await prisma.member_profiles.findUnique({
        where: { user_id: BigInt(userId) }, // pakai userId dari parameter
        select: {
            id: true,
            full_name: true,
            addres: true,
            phone: true,
        },
    });
};

// get point member
export const getMemberPointByUserId = async (userId) => {
    return await prisma.member_profiles.findUnique({
        where: { user_id: BigInt(userId) },
        select: {
            id: true,
            point: true,
        },
    });
};