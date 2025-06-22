import {
    createTransaction,
    getTransactionsByUser,
    findTransactionById,
    updateTransactionStatus,
} from "../models/transactions_models.js"; // asumsinya yang di atas tadi di file ini
import { createMemberProfile } from "../models/member_models.js";
import { getMembershipById } from "../models/membership_models.js";

// Create new transaction
export const createTransactionController = async (req, res) => {
    try {
        const userId = req.user.id;

        // Data dari body sekarang tidak ada proof_image
        const {
            membership_package_id,
            amount,
            full_name,
            addres, // typo di kode asli, harusnya address
            phone,
        } = req.body;

        const numericAmount = parseInt(amount, 10); // Ubah string "15000" menjadi angka 15000

        // File yang diupload ada di req.file
        const proofFile = req.file;

        if (!proofFile) {
            return res.status(400).json({ message: "Bukti transfer (gambar) wajib diupload." });
        }

        // Validasi field lainnya
        if (!membership_package_id || !amount || !full_name || !addres || !phone) {
            return res.status(400).json({ message: "Semua field teks wajib diisi." });
        }

        // --- INI PERUBAHANNYA ---
        // Simpan path relatif yang bisa dikenali Laravel
        // Contoh hasilnya: "proofs/proof_image-1678886400000-12345.jpg"
        const proofImagePath = `bukti-transfer/${proofFile.filename}`;

        // ... (kode createMemberProfile tetap sama) ...
        await createMemberProfile({
            user_id: userId,
            full_name,
            addres,
            phone,
            is_active: false, // Default tetap false, karena belum dikonfirmasi
        });

        // Simpan transaksi dengan path gambar yang baru
        const transaction = await createTransaction({
            userId,
            membership_package_id,
            amount:numericAmount,
            proof_image: proofImagePath, // <-- Simpan path relatif ke DB
            status: "pending",
        });

        res.status(201).json({
            message: "Transaksi berhasil dibuat dan sedang menunggu konfirmasi.",
            data: transaction,
        });

    } catch (error) {
        console.error("Error di createTransactionController:", error);
        res.status(500).json({ message: error.message || "Terjadi kesalahan pada server" });
    }
};

// // Get transactions by user
// export const getTransactionsByUserController = async (req, res) => {
//     try {
//         const userId = req.params.userId;
//         const transactions = await getTransactionsByUser(userId);
//         res.status(200).json(transactions);
//     } catch (error) {
//         console.error('Error getting transactions:', error);
//         res.status(500).json({ message: 'Failed to get transactions' });
//     }
// };

// Get transaction by ID
export const findTransactionByIdController = async (req, res) => {
    try {
        const id = req.params.id;
        const transaction = await findTransactionById(id);
        if (!transaction) {
            return res.status(404).json({ message: "Transaction not found" });
        }
        res.status(200).json(transaction);
    } catch (error) {
        console.error("Error finding transaction:", error);
        res.status(500).json({ message: "Failed to find transaction" });
    }
};

// Update transaction status
export const updateTransactionStatusController = async (req, res) => {
    try {
        const transactionId = req.params.id;
        const { status } = req.body; // status dari admin: 'Confirmed' atau 'Rejected'

        if (!status) {
            return res.status(400).json({ message: "Status wajib diisi." });
        }

        // 1. Update status transaksi di database
        const updatedTransaction = await updateTransactionStatus(
            transactionId,
            status
        );
        if (!updatedTransaction) {
            return res
                .status(404)
                .json({ message: "Transaksi tidak ditemukan untuk diupdate." });
        }

        // 2. Jika statusnya 'Confirmed', baru kita aktifkan member
        if (status === "Confirmed") {
            // Ambil detail membership untuk tahu durasinya
            const membership = await getMembershipById(
                updatedTransaction.membership_package_id
            );
            if (!membership) {
                return res
                    .status(404)
                    .json({ message: "Paket membership terkait tidak ditemukan." });
            }

            // 3. Hitung tanggal mulai dan berakhir membership
            const startDate = new Date();
            const endDate = new Date(startDate); // Copy tanggal start
            endDate.setDate(startDate.getDate() + membership.duration_months);

            // 4. Update profil member menjadi AKTIF!
            // Kita "reuse" fungsi createMemberProfile karena dia sudah handle logic update.
            const activatedProfile = await createMemberProfile({
                user_id: updatedTransaction.userId,
                start_date: startDate,
                end_date: endDate,
                is_active: true,
            });

            return res.status(200).json({
                message:
                    "Transaksi berhasil dikonfirmasi dan membership telah diaktifkan.",
                data: {
                    transaction: updatedTransaction,
                    profile: activatedProfile,
                },
            });
        }

        // Kalau statusnya bukan 'Confirmed' (misal 'Rejected'), cukup kembalikan pesan biasa
        res.status(200).json({
            message: `Status transaksi berhasil diupdate menjadi '${status}'.`,
            data: updatedTransaction,
        });
    } catch (error) {
        console.error("Error di updateTransactionStatusController:", error);
        res.status(500).json({ message: "Gagal mengupdate status transaksi." });
    }
};
