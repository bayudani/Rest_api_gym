import express from "express";
import {
  getArticles,
  getArticleBySlugs,
} from "../controller/article_controller.js";
import { stripHtml } from "string-strip-html";
// const stripHtml = require("string-strip-html");

const router = express.Router();
// GET all published posts
router.get("/", getArticles);
// GET post by slug
router.get("/:slug", getArticleBySlugs);

/**
 * @swagger
 * tags:
 *   name: Article
 *   description: Endpoint untuk mengelola artikel
 */

/**
 * @swagger
 * /posts:
 *   get:
 *     summary: Ambil semua artikel yang terpublish
 *     tags: [Article]
 *     responses:
 *       200:
 *         description: Berhasil ambil semua artikel
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                   title:
 *                     type: string
 *                   slug:
 *                     type: string
 *                   content:
 *                     type: string
 *                   created_at:
 *                     type: string
 *                     format: date-time
 *                   updated_at:
 *                     type: string
 *                     format: date-time
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /posts/{slug}:
 *   get:
 *     summary: Ambil satu artikel berdasarkan slug
 *     tags: [Article]
 *     parameters:
 *       - in: path
 *         name: slug
 *         required: true
 *         schema:
 *           type: string
 *         description: Slug unik dari artikel
 *     responses:
 *       200:
 *         description: Artikel ditemukan
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                 title:
 *                   type: string
 *                 slug:
 *                   type: string
 *                 content:
 *                   type: string
 *                 created_at:
 *                   type: string
 *                   format: date-time
 *                 updated_at:
 *                   type: string
 *                   format: date-time
 *       404:
 *         description: Artikel tidak ditemukan
 */

export default router;
