import prisma from "../prisma/db.js";
// get all programs
export const getAllPrograms = async () => {
    try {
        return await prisma.programs.findMany({
            orderBy: { created_at: "desc" },
        });
    } catch (error) {
        console.error("Error fetching programs:", error);
        throw error;
    }
};
// get program by ID
export const getProgramById = async (id) => {
    try {
        return await prisma.programs.findUnique({
            where: { id: BigInt(id) },
        });
    } catch (error) {
        console.error("Error fetching program by ID:", error);
        throw error;
    }
};