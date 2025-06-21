import {
    getMemberProfileByUserId,
    getMemberPointByUserId,
    getMemberAttends
} from "../models/member_models.js";

// get member profile by user ID
export const getMemberProfile = async (req, res) => {
    const userId = req.user.id;
    try {
        // 1. Ambil profil lengkap dari model yang sudah kita perbaiki
        const profile = await getMemberProfileByUserId(userId);

        // 2. Cek apakah profil ada
        if (!profile) {
            // Pakai 404 Not Found karena datanya memang tidak ada
            return res.status(404).json({ error: "Profil member tidak ditemukan." });
        }

        // --- LOGIKA VALIDASI STATUS MEMBER ---
        const now = new Date();
        let membership_status = 'active'; // Default status

        // 3. Cek apakah masa berlaku sudah habis (expired)
        if (profile.end_date && new Date(profile.end_date) < now) {
            membership_status = 'expired';
            // Pakai 403 Forbidden karena user ada tapi tidak punya hak akses
            return res.status(403).json({
                error: "Masa berlaku membership Anda telah habis.",
                membership_status: membership_status,
            });
        }
        
        // 4. Cek flag is_active (mungkin dinonaktifkan manual oleh admin)
        if (!profile.is_active) {
            membership_status = 'inactive';
            return res.status(403).json({
                error: "Akun member Anda tidak aktif. Silakan hubungi admin.",
                membership_status: membership_status,
            });
        }
        
        //  tambahkan info status ke response biar frontend gampang
        res.json({ ...profile, membership_status });

    } catch (error) {
        console.error("Error di getMemberProfile:", error);
        res.status(500).json({ error: error.message });
    }
};


// get point member
export const getMemberPoint = async (req, res) => {
    const userId = req.user.id; 
    try {
        const point = await getMemberPointByUserId(userId);
        if (!point) {
            return res.status(404).json({ error: "Belum terdaftar sebagai member" });
        }
        res.json(point);
    } catch (error) {
        console.error("Error getMemberPoint:", error); 
        res.status(500).json({ error: error.message });
    }
};


// get member attends
export const getMyAttends = async (req, res) => {
    const userId = req.user.id;
    try {
        const attends = await getMemberAttends(userId);
        if (!attends) {
            return res.status(404).json({ error: "Member profile tidak ditemukan" });
        }

        res.json({ attends });
    } catch (error) {
        console.error("Error getMyAttends:", error);
        res.status(500).json({ error: error.message });
    }
};

