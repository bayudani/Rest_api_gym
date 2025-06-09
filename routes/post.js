import express from "express";
import prisma from "../prisma/db.js"; // jangan lupa tambahin .js di import
const router = express.Router();
import { stripHtml } from "string-strip-html";
// const stripHtml = require("string-strip-html");

// GET all published posts
router.get("/", async (req, res) => {
    try {
        const posts = await prisma.fblog_posts.findMany({
            where: { status: "published" },
        });

        const cleanPosts = posts.map((post) => ({
            id: post.id,
            title: post.title,
            slug: post.slug,
            sub_title: post.sub_title,
            excerpt: stripHtml(post.body).result.slice(0, 200),
            body: post.body,
            status: post.status,
            published_at: post.published_at,
            cover_photo_path: post.cover_photo_path,
            photo_alt_text: post.photo_alt_text,
            user_id: post.user_id,
        }));

        res.json(cleanPosts);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// GET single post by slug
router.get("/:slug", async (req, res) => {
    try {
        const post = await prisma.fblog_posts.findUnique({
            where: { slug: req.params.slug },
        });

        if (!post) return res.status(404).json({ error: "Post tidak ditemukan" });

        res.json({
            id: post.id,
            title: post.title,
            slug: post.slug,
            sub_title: post.sub_title,
            body: post.body,
            status: post.status,
            published_at: post.published_at,
            cover_photo_path: post.cover_photo_path,
            photo_alt_text: post.photo_alt_text,
            //   user_id: post.user_id,
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

export default router;
