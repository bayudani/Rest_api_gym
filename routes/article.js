import express from "express";
import { getArticles, getArticleBySlugs } from "../controller/article_controller.js";
import { stripHtml } from "string-strip-html";
// const stripHtml = require("string-strip-html");

const router = express.Router();
// GET all published posts
router.get('/',getArticles);
// GET post by slug
router.get('/:slug',getArticleBySlugs);

export default router;
