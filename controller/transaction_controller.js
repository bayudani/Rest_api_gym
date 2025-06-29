import {
  createTransaction,
  getTransactionsByUser,
  findTransactionById,
  updateTransactionStatus,
} from "../models/transactions_models.js"; // asumsinya yang di atas tadi di file ini
import { createMemberProfile } from "../models/member_models.js";
import { getMembershipById } from "../models/membership_models.js";
import { sendTransactionPendingEmail, sendTransactionConfirmedEmail, sendTransactionRejectedEmail, } from "../helpers/mailer.js"; // <-- Impor dari file helper
import { findUserById } from "../models/user_models.js"; // <-- FIX: Pastikan baris ini ada dan tidak di-comment

// Create new transaction
export const createTransactionController = async (req, res) => {
  try {
    const userId = req.user.id; // Ambil userId dari middleware otentikasi (misal: JWT)

    // --- VALIDASI PENTING YANG DIPERBAIKI ---
    // Sebelum lanjut, pastikan user dengan ID dari token ini benar-benar ada di DB
    const user = await findUserById(userId);
    if (!user) {
      // Jika user tidak ditemukan, jangan lanjut. Kasih error yang jelas.
      return res.status(404).json({ message: "User tidak ditemukan. Mungkin token tidak valid atau user telah dihapus." });
    }
    // --- SELESAI PERBAIKAN VALIDASI ---

    const { membership_package_id, amount, full_name, addres, phone } = req.body;
    const numericAmount = parseInt(amount, 10);
    const proofFile = req.file;

    if (!proofFile) {
      return res.status(400).json({ message: "Bukti transfer (gambar) wajib diupload." });
    }

    if (!membership_package_id || !amount || !full_name || !addres || !phone) {
      return res.status(400).json({ message: "Semua field teks wajib diisi." });
    }

    const proofImagePath = `bukti-transfer/${proofFile.filename}`;

    // Buat/update profil member (diset tidak aktif dulu)
    await createMemberProfile({
      user_id: userId,
      full_name,
      addres, // Sebaiknya diganti jadi 'address' di seluruh project biar konsisten
      phone,
      is_active: false,
    });

    // Buat record transaksi di database
    const transaction = await createTransaction({
      userId,
      membership_package_id,
      amount: numericAmount,
      proof_image: proofImagePath,
      status: "pending",
    });

    // --- BAGIAN KIRIM EMAIL NOTIFIKASI (SUDAH DIOPTIMASI) ---
    try {

      const membership = await getMembershipById(membership_package_id);

      if (membership) {
        // Panggil fungsi pengirim email dari helper
        await sendTransactionPendingEmail({
          userEmail: user.email,
          userName: user.name, // Menggunakan nama dari user yang sudah divalidasi
          transactionId: transaction.id,
          packageName: membership.name,
          amount: transaction.amount,
        });
      } else {
        console.warn("Membership tidak ditemukan, email notifikasi tidak terkirim.");
      }
    } catch (emailError) {
      // Jika kirim email gagal, transaksi utama JANGAN digagalkan.
      // Cukup catat errornya di log server.
      console.error("KRUSIAL: Gagal mengirim email notifikasi transaksi:", emailError);
    }
    // --- SELESAI BAGIAN EMAIL ---

    res.status(201).json({
      message: "Transaksi berhasil dibuat! Cek email kamu untuk info selanjutnya.",
      data: transaction,
    });
  } catch (error) {
    // Log error asli dari Prisma atau service lain untuk debugging
    console.error("Error di createTransactionController:", error);

    // Memberikan response yang lebih bersahabat ke client
    const errorMessage = error.code === 'P2003'
      ? "Terjadi masalah relasi data. Pastikan semua data terkait valid."
      : error.message || "Terjadi kesalahan pada server";

    res.status(500).json({ message: errorMessage });
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
/**
 * Controller untuk mengupdate status transaksi (oleh Admin).
 * Sekaligus mengirim notifikasi email ke user.
 */
export const updateTransactionStatusController = async (req, res) => {
  try {
    const transactionId = req.params.id;
    const { status, reason } = req.body; 

    if (!status || !['Confirmed', 'Rejected'].includes(status)) {
      return res.status(400).json({ message: "Status wajib diisi dan harus 'Confirmed' atau 'Rejected'." });
    }

    // 1. Update status transaksi
    const updatedTransaction = await updateTransactionStatus(transactionId, status);
    if (!updatedTransaction) {
      return res.status(404).json({ message: "Transaksi tidak ditemukan untuk diupdate." });
    }

    // !! BAGIAN PENTING !!
    // Pastikan user diambil dari DB SEBELUM blok if/else.
    // Ini adalah sumber variabel `user` untuk email.
    const user = await findUserById(updatedTransaction.userId);
    if (!user) {
        console.error(`User dengan ID ${updatedTransaction.userId} tidak ditemukan saat update status transaksi.`);
        // Kirim response di sini agar tidak lanjut ke bawah jika user tidak ada
        return res.status(404).json({ message: "User terkait transaksi ini tidak ditemukan." });
    }

    // 3. Logic berdasarkan status
    if (status === "Confirmed") {
      const membership = await getMembershipById(updatedTransaction.membership_package_id);
      if (!membership) {
        return res.status(404).json({ message: "Paket membership terkait tidak ditemukan." });
      }

      const startDate = new Date();
      const endDate = new Date(startDate);
      endDate.setMonth(endDate.getMonth() + membership.duration_months);

      const activatedProfile = await createMemberProfile({
        user_id: updatedTransaction.userId,
        start_date: startDate,
        end_date: endDate,
        is_active: true,
      });

      // Kirim email konfirmasi ke user menggunakan variabel `user` dari atas
      try {
        await sendTransactionConfirmedEmail({
          userEmail: user.email,
          userName: user.name,
          endDate: activatedProfile.end_date,
        });
      } catch (emailError) {
        // Log error ini jika pengiriman email gagal
        console.error("KRUSIAL: Gagal mengirim email konfirmasi transaksi:", emailError);
      }

      return res.status(200).json({
        message: "Transaksi berhasil dikonfirmasi dan membership telah diaktifkan.",
        data: { transaction: updatedTransaction, profile: activatedProfile },
      });

    } else { // Ini berarti statusnya 'Rejected'
        // Kirim email penolakan ke user menggunakan variabel `user` dari atas
        try {
            await sendTransactionRejectedEmail({
                userEmail: user.email,
                userName: user.name,
                transactionId: transactionId,
                reason: reason
            });
        } catch(emailError) {
            console.error("Gagal kirim email penolakan transaksi:", emailError);
        }

        return res.status(200).json({
            message: `Status transaksi berhasil diupdate menjadi '${status}'.`,
            data: updatedTransaction,
        });
    }
  } catch (error) {
    console.error("Error di updateTransactionStatusController:", error);
    res.status(500).json({ message: "Gagal mengupdate status transaksi." });
  }
};
