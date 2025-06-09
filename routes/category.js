import express from "express";
import prisma from "../prisma/db.js";  // jangan lupa tambahin .js di import
const router = express.Router();

// GET all categories + published posts
router.get("/", async (req, res) => {
    try {
        const categories = await prisma.fblog_categories.findMany({
            include: {
                posts: {
                    where: { status: "published" },
                    select: {
                        id: true,
                        title: true,
                        slug: true,
                    },
                },
            },
        });

        res.json(categories);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// GET posts by category name
router.get("/:name", async (req, res) => {
    try {
        const category = await prisma.fblog_categories.findFirst({
            where: { name: req.params.name },
            include: {
                posts: {
                    where: { status: "published" },
                    select: {
                        id: true,
                        title: true,
                        slug: true,
                    },
                },
            },
        });

        if (!category)
            return res.status(404).json({ error: "Kategori tidak ditemukan" });

        res.json({
            category: category.name,
            posts: category.posts,
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

export default router;
