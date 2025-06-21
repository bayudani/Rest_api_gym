import {
    createTransaction,
    getTransactionsByUser,
    findTransactionById,
    updateTransactionStatus,
} from '../models/transactions_models.js'; // asumsinya yang di atas tadi di file ini
import { createMemberProfile } from "../models/member_models.js";
import { getMembershipById } from "../models/membership_models.js";

// Create new transaction
export const createTransactionController = async (req, res) => {
    try {
        const userId = req.user.id; // Diambil dari middleware otentikasi (misal JWT)
        const {
            membership_package_id,
            amount,
            proof_image,
            full_name,
            addres,
            phone,
        } = req.body;

        // Disarankan untuk menambahkan validasi (pakai Joi atau express-validator) di sini
        if (!membership_package_id || !amount || !proof_image || !full_name || !addres || !phone) {
            return res.status(400).json({ message: "Semua field wajib diisi." });
        }

        // 1. Buat atau update profil member (tapi tanpa tanggal aktif)
        // Ini untuk memastikan data nama, alamat, telp user selalu up-to-date.
        await createMemberProfile({
            user_id: userId,
            full_name,
            addres,
            phone,
            is_active: false, // Default tetap false, karena belum dikonfirmasi
        });
        
        // 2. Simpan data transaksi dengan status 'pending'
        const transaction = await createTransaction({
            userId,
            membership_package_id,
            amount,
            proof_image,
            status: 'pending', // Wajib pending di awal
        });

        res.status(201).json({
            message: "Transaksi berhasil dibuat dan sedang menunggu konfirmasi dari admin.",
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
            return res.status(404).json({ message: 'Transaction not found' });
        }
        res.status(200).json(transaction);
    } catch (error) {
        console.error('Error finding transaction:', error);
        res.status(500).json({ message: 'Failed to find transaction' });
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
        const updatedTransaction = await updateTransactionStatus(transactionId, status);
        if (!updatedTransaction) {
            return res.status(404).json({ message: 'Transaksi tidak ditemukan untuk diupdate.' });
        }

        // 2. Jika statusnya 'Confirmed', baru kita aktifkan member
        if (status === 'Confirmed') {
            // Ambil detail membership untuk tahu durasinya
            const membership = await getMembershipById(updatedTransaction.membership_package_id);
            if (!membership) {
                 return res.status(404).json({ message: 'Paket membership terkait tidak ditemukan.' });
            }

            // 3. Hitung tanggal mulai dan berakhir membership
            const startDate = new Date();
            const endDate = new Date(startDate); // Copy tanggal start
            endDate.setMonth(startDate.getMonth() + membership.duration_months);

            // 4. Update profil member menjadi AKTIF!
            // Kita "reuse" fungsi createMemberProfile karena dia sudah handle logic update.
            const activatedProfile = await createMemberProfile({
                user_id: updatedTransaction.userId,
                start_date: startDate,
                end_date: endDate,
                is_active: true,
            });

            return res.status(200).json({ 
                message: 'Transaksi berhasil dikonfirmasi dan membership telah diaktifkan.',
                data: {
                    transaction: updatedTransaction,
                    profile: activatedProfile
                }
            });
        }
        
        // Kalau statusnya bukan 'Confirmed' (misal 'Rejected'), cukup kembalikan pesan biasa
        res.status(200).json({ 
            message: `Status transaksi berhasil diupdate menjadi '${status}'.`,
            data: updatedTransaction 
        });

    } catch (error) {
        console.error('Error di updateTransactionStatusController:', error);
        res.status(500).json({ message: 'Gagal mengupdate status transaksi.' });
    }
};

