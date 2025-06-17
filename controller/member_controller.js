import {getMemberProfileByUserId,getMemberPointByUserId} from "../models/member_models.js";

// get member profile by user ID
export const getMemberProfile = async (req, res) => {
    const userId = req.user.id; // token udah sukses decoded
    try {
        const profile = await getMemberProfileByUserId(userId);
        if (!profile) {
            return res.status(404).json({ error: 'Member profile not found' });
        }

        // pastikan ini pakai `profile` bukan `data`
        res.json(profile);
    } catch (error) {
        console.error("Error getMemberProfile:", error); // log error-nya
        res.status(500).json({ error: error.message });
    }
};

// get point member
export const getMemberPoint = async (req, res) => {
    const userId = req.user.id; // token udah sukses decoded
    try {
        const point = await getMemberPointByUserId(userId);
        if (!point) {
            return res.status(404).json({ error: 'Member point not found' });
        }
        res.json(point);
    } catch (error) {
        console.error("Error getMemberPoint:", error); // log error-nya
        res.status(500).json({ error: error.message });
    }
};