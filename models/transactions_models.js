import prisma from "../prisma/db.js";

// Create new transaction (payment)
export const createTransaction = async (data) => {
    const transaction = await prisma.transactions.create({ data });
    return transaction;
};

// Get transaction by user (optional, kalau nanti butuh)
export const getTransactionsByUser = async (userId) => {
    return await prisma.transactions.findMany({
        where: { userId: parseInt(userId) },
        include: {
            membershipPackage: true,
        },
        orderBy: {
            createdAt: "desc",
        },
    });
};

// Optional: get by ID (buat admin nanti approve misalnya)
export const findTransactionById = async (id) => {
    return await prisma.transactions.findUnique({
        where: { id: parseInt(id) },
        include: {
            user: true,
            membershipPackage: true,
        },
    });
};

// Optional: update status (buat admin konfirmasi)
export const updateTransactionStatus = async (id, status) => {
    return await prisma.transactions.update({
        where: { id: parseInt(id) },
        data: { status },
    });
};
