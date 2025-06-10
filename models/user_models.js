import prisma from "../prisma/db.js";

// find by email
export const findUserByEmail = async (email) => {
    try {
        return await prisma.users.findUnique({
            where: { email },
        });
    } catch (error) {
        console.error("Error finding user by email:", error);
        throw error;
    }
};

// create user
export const createUser = async (data) => {
    try {
        return await prisma.users.create({
            data,
        });
    } catch (error) {
        console.error("Error creating user:", error);
        throw error;
    }
};

// find by id profile
export const findUserById = async (id) => {
    try {
        return await prisma.users.findUnique({
            where: { id },
            select: {
                id: true,
                name: true,
                email: true,
                created_at: true,
                updated_at: true,
            },
        });
    } catch (error) {
        console.error("Error finding user by ID:", error);
        throw error;
    }
};