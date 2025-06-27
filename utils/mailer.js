// utils/mailer.js
import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

export const sendVerificationEmail = async (email, code) => {
    await transporter.sendMail({
        from: `"Gym App" <${process.env.EMAIL_USER}>`,
        to: email,
        subject: "Kode Verifikasi Akun Kamu 💪",
        html: `<p>Kode verifikasi kamu adalah <b>${code}</b>. Masukkan kode ini di aplikasi untuk verifikasi akun.</p>`,
    });
};
