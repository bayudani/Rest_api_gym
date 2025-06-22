import prisma  from "../prisma/db.js";

/**
 * mengambil semua item rewards
 * urut item rewards dari point terkecil
 * return
 */
export const getAllItemRewards = async () => {
    return await prisma.item_rewards.findMany({
        orderBy: {
            points: 'asc'
        }
    });
}

/**
 * mengambil item reward berdasarkan id
 * @param {number} id - id item reward
 * @returns {Promise<Object>} - data item reward
 */ 
export const getItemRewardById = async (id) => {
    return await prisma.item_rewards.findUnique({
        where: {
            id: BigInt(id)
        }
    });
}