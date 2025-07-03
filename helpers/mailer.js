import nodemailer from "nodemailer";

/**
 * Konfigurasi transporter email menggunakan Nodemailer.
 * Dibuat sebagai objek terpisah agar bisa digunakan kembali.
 */
const transporter = nodemailer.createTransport({
    service: "gmail",
    
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

/**
 * Mengirim email verifikasi pendaftaran berisi kode OTP.
 * @param {string} email - Email tujuan.
 * @param {string} code - Kode OTP 6 digit.
 */
const sendVerificationEmail = async (email, code) => {
    await transporter.sendMail({
        from: `"FitID 🏋️" <${process.env.EMAIL_USER}>`,
        to: email,
        subject: "Kode Verifikasi Akun anda 💡",
        html: `
    <div style="font-family: Arial, sans-serif; line-height: 1.6; padding: 20px; background-color: #f9f9f9;">
        <div style="max-width: 500px; margin: auto; background: white; padding: 20px; border: 1px solid #ddd; border-radius: 10px;">
            <h2 style="color: #333; text-align: center;">👋 Halo bro,</h2>
            <p style="font-size: 16px; text-align: center;">Satu langkah lagi! Berikut adalah kode verifikasi untuk aktivasi akun FitID anda:</p>
            <p style="text-align: center; font-size: 32px; font-weight: bold; color: #4CAF50; letter-spacing: 5px; margin: 20px 0; padding: 10px; background-color: #f0fff0; border-radius: 5px;">${code}</p>
            <p style="font-size: 14px; color: #777; text-align: center;">Kode ini hanya berlaku selama 10 menit. Jangan kasih ke siapapun ya, demi keamanan akunmu!</p>
            <hr style="margin: 20px 0; border: none; border-top: 1px solid #eee;">
            <p style="font-size: 12px; color: #aaa; text-align: center;">FitID Gym App • ${new Date().getFullYear()}</p>
        </div>
    </div>
    `,
    });
};

/**
 * Mengirim email notifikasi bahwa transaksi sedang diproses.
 * @param {object} details - Detail transaksi.
 * @param {string} details.userEmail - Email pengguna.
 * @param {string} details.userName - Nama pengguna.
 * @param {number|string} details.transactionId - ID transaksi.
 * @param {string} details.packageName - Nama paket membership.
 * @param {number} details.amount - Jumlah pembayaran.
 */
const sendTransactionPendingEmail = async ({
    userEmail,
    userName,
    transactionId,
    packageName,
    amount,
}) => {
    // Format angka jadi Rupiah biar cakep
    const formattedAmount = new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
        minimumFractionDigits: 0,
    }).format(amount);

    await transporter.sendMail({
        from: `"FitID 🏋️" <${process.env.EMAIL_USER}>`,
        to: userEmail,
        subject: "Transaksi anda Sedang Diproses! ⏳",
        html: `
    <div style="font-family: Arial, sans-serif; line-height: 1.6; padding: 20px; background-color: #f9f9f9;">
        <div style="max-width: 600px; margin: auto; background: white; padding: 20px; border: 1px solid #ddd; border-radius: 10px;">
            <h2 style="color: #333;">Transaksi anda sedang diproses, ${userName}! 🔥</h2>
            <p style="font-size: 16px;">
                Terimakasih telah melakukan pembayaran. Kami sudah menerima bukti pembayaran anda dan sedang memproses transaksi ini.
            </p>
            <p style="font-size: 16px;">
                Mohon ditunggu, nanti bakal ada email konfirmasi lagi kalau membership anda udah aktif.
            </p>
            
            <div style="border-left: 4px solid #ffc107; padding-left: 15px; margin: 25px 0; background-color: #fff9e6; padding-top: 10px; padding-bottom: 10px; border-radius: 0 5px 5px 0;">
                <h3 style="margin: 0 0 10px 0; color: #333;">Detail Transaksi:</h3>
                <p style="margin: 5px 0; font-size: 14px;"><strong>ID Transaksi:</strong> #${transactionId}</p>
                <p style="margin: 5px 0; font-size: 14px;"><strong>Paket Membership:</strong> ${packageName}</p>
                <p style="margin: 5px 0; font-size: 14px;"><strong>Jumlah Bayar:</strong> ${formattedAmount}</p>
            </div>

            <p style="font-size: 14px; color: #777;">
                Kalau ada pertanyaan, jangan ragu buat hubungi support kami ya.
            </p>
            <hr style="margin: 20px 0; border: none; border-top: 1px solid #eee;">
            <p style="font-size: 12px; color: #aaa; text-align: center;">FitID Gym App • ${new Date().getFullYear()}</p>
        </div>
    </div>
    `,
    });
};

/**
 * [BARU] Mengirim email konfirmasi bahwa transaksi berhasil dan membership aktif.
 * @param {object} details - Detail konfirmasi.
 */
const sendTransactionConfirmedEmail = async ({ userEmail, userName, endDate }) => {
    const formattedEndDate = new Date(endDate).toLocaleDateString('id-ID', {
        weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
    });

    await transporter.sendMail({
        from: `"FitID 🏋️" <${process.env.EMAIL_USER}>`,
        to: userEmail,
        subject: " Membership anda Sudah Aktif! 🎉",
        html: `
        <div style="font-family: Arial, sans-serif; line-height: 1.6; padding: 20px; background-color: #f9f9f9;">
            <div style="max-width: 600px; margin: auto; background: white; padding: 20px; border: 1px solid #ddd; border-radius: 10px;">
                <h2 style="color: #4CAF50; text-align: center;">Selamat, ${userName}! Membership anda aktif!</h2>
                <p style="font-size: 16px;">
                Pembayaran anda sudah kami konfirmasi. anda sekarang resmi jadi member FitID dan bisa nikmatin semua fasilitas premium kami.
                </p>
                <div style="text-align: center; margin: 25px 0; padding: 15px; background-color: #e8f5e9; border-left: 5px solid #4CAF50; border-radius: 5px;">
                <p style="margin: 0; font-size: 14px;">Membership anda aktif sampai:</p>
                <p style="margin: 5px 0 0 0; font-size: 18px; font-weight: bold; color: #2e7d32;">${formattedEndDate}</p>
                </div>
                <p style="font-size: 16px; text-align: center;">
                Silahkan cek kartu membership anda di aplikasi FitID!.
                </p>
                <hr style="margin: 20px 0; border: none; border-top: 1px solid #eee;">
                <p style="font-size: 12px; color: #aaa; text-align: center;">FitID Gym App • ${new Date().getFullYear()}</p>
            </div>
        </div>
        `,
    });
};

/**
 * [BARU] Mengirim email notifikasi bahwa transaksi ditolak.
 * @param {object} details - Detail penolakan.
 */
const sendTransactionRejectedEmail = async ({ userEmail, userName, transactionId, reason }) => {
    await transporter.sendMail({
        from: `"FitID 🏋️" <${process.env.EMAIL_USER}>`,
        to: userEmail,
        subject: "Transaksi Anda Ditolak 🙁",
        html: `
        <div style="font-family: Arial, sans-serif; line-height: 1.6; padding: 20px; background-color: #f9f9f9;">
            <div style="max-width: 600px; margin: auto; background: white; padding: 20px; border: 1px solid #ddd; border-radius: 10px;">
                <h2 style="color: #d32f2f; text-align: center;">Yah, transaksi anda ditolak, ${userName}.</h2>
                <p style="font-size: 16px;">
                Setelah tim kami melakukan pengecekan, tim kami menolak transaksi adna dengan ID <strong>#${transactionId}</strong>.
                </p>
                <div style="margin: 25px 0; padding: 15px; background-color: #ffebee; border-left: 5px solid #d32f2f; border-radius: 5px;">
                <p style="margin: 0; font-size: 14px;"><strong>Alasan Penolakan:</strong></p>
                <p style="margin: 5px 0 0 0; font-size: 16px;">${reason || 'Bukti pembayaran tidak valid atau tidak sesuai.'}</p>
                </div>
                <p style="font-size: 16px;">
                Jangan khawatir, anda bisa coba lakukan transaksi lagi dengan bukti pembayaran yang benar. Kalau ada pertanyaan, jangan ragu hubungi tim support kami ya.
                </p>
                <hr style="margin: 20px 0; border: none; border-top: 1px solid #eee;">
                <p style="font-size: 12px; color: #aaa; text-align: center;">FitID Gym App • ${new Date().getFullYear()}</p>
            </div>
        </div>
        `,
    });
};

// notifikasi email klaim reward
const sendRewardClaimedEmail = async ({ userEmail, userName, rewardName }) => {
    await transporter.sendMail({
        from: `"FitID 🏋️" <${process.env.EMAIL_USER}>`,
        to: userEmail,
        subject: "Klaim Reward Berhasil! 🎉",
        html: `
        <div style="font-family: Arial, sans-serif; line-height: 1.6; padding: 20px; background-color: #f9f9f9;">
            <div style="max-width: 600px; margin: auto; background: white; padding: 20px; border: 1px solid #ddd; border-radius: 10px;">
                <h2 style="color: #4CAF50; text-align: center;">Selamat, ${userName}! Klaim reward anda berhasil!</h2>
                <p style="font-size: 16px;">
                Kami senang menginformasikan bahwa klaim reward anda untuk <strong>${rewardName}</strong> telah berhasil diproses.
                </p>
                <p style="font-size: 16px; text-align: center;">
                Terima kasih telah menjadi bagian dari komunitas FitID! Silahkan ambil reward di FitID dan tunjukkan bukti email ini!
                </p>
                <hr style="margin: 20px 0; border: none; border-top: 1px solid #eee;">
                <p style="font-size: 12px; color: #aaa; text-align: center;">FitID Gym App • ${new Date().getFullYear()}</p>
            </div>
        </div>
        `,
    });
};

export { sendVerificationEmail, sendTransactionPendingEmail, sendTransactionConfirmedEmail, sendTransactionRejectedEmail, sendRewardClaimedEmail };
