import prisma from '../prisma/db.js';

// get all memberships
export const getAllMemberships = async () => {
    try {
        return await prisma.memberships.findMany({
            orderBy: { created_at: 'desc' },
        });
    } catch (error) {
        console.error("Error fetching memberships:", error);
        throw error;
    }
};
// get membership by ID
export const getMembershipById = async (id) => {
    try {
        return await prisma.memberships.findUnique({
            where: { id: BigInt(id) },
        });
    } catch (error) {
        console.error("Error fetching membership by ID:", error);
        throw error;
    }
};