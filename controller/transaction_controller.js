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
        const userId = req.user.id;

        const {
            membership_package_id,
            amount,
            proof_image,
            full_name,
            addres,
            phone,
        } = req.body;

        // 🔁 Ambil data membership via model
    const membership = await getMembershipById(membership_package_id);

        if (!membership) {
            return res.status(404).json({ error: "Paket membership tidak ditemukan" });
        }

        const startDate = new Date();
        const endDate = new Date();
        endDate.setDate(startDate.getDate() + (membership.duration_months * 30)); // asumsi 30 hari/bulan

        // Simpan transaksi
        const transaction = await createTransaction({
            userId,
            membership_package_id,
            amount,
            proof_image,
        });

        // Simpan / update profil member
        const memberProfile = await createMemberProfile({
            user_id: userId,
            full_name,
            addres,
            phone,
            start_date: startDate,
            end_date: endDate,
            is_active: false,
        });

        res.status(201).json({
            message: "Transaksi dan data member berhasil disimpan",
            transaction,
            memberProfile,
        });

    } catch (error) {
        console.error("Error creating transaction and member:", error);
        res.status(500).json({ error: error.message || "Gagal membuat transaksi dan member" });
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
        const id = req.params.id;
        const { status } = req.body;
        const updated = await updateTransactionStatus(id, status);
        res.status(200).json({ message: 'Transaction status updated', updated });
    } catch (error) {
        console.error('Error updating status:', error);
        res.status(500).json({ message: 'Failed to update status' });
    }
};
