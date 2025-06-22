import {getAllItemRewards, getItemRewardById} from "../models/itemRewards_models.js";

/**
 * controlller ngambil semua item 
 */
export const getAllItemRewardss = async (req, res) => {
    try {
        const items = await getAllItemRewards();
        res.status(200).json({
            message: "Berhasil mengambil semua item rewards",
            data: items
        });
    } catch (error) {
        console.error("Error getAllItemRewards:", error);
        res.status(500).json({ error: "Gagal mengambil item rewards" });
    }
};
/**
 * controller ngambil item rewards berdasarkan id
 * @param {number} id - id item reward
 */
export const getItemRewardByIdd = async (req, res) => {
    const { id } = req.params;
    try {
        const item = await getItemRewardById(id);
        if (!item) {
            return res.status(404).json({ error: "Item reward tidak ditemukan" });
        }
        res.status(200).json({
            message: "Berhasil mengambil item reward",
            data: item
        });
    } catch (error) {
        console.error("Error getItemRewardById:", error);
        res.status(500).json({ error: "Gagal mengambil item reward" });
    }
};