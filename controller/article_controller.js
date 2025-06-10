// article controller
import express from 'express';
import { getAllArticles, getArticleBySlug } from '../models/article_models.js';
import { stripHtml } from 'string-strip-html';


// get all articles
export const getArticles = async (req, res) => {
    try {
        const articles = await getAllArticles();
        const cleanArticles = articles.map(article => ({
            id: article.id,
            title: article.title,
            slug: article.slug,
            sub_title: article.sub_title,
            excerpt: stripHtml(article.body).result.slice(0, 200),
            body: article.body,
            status: article.status,
            published_at: article.published_at,
            cover_photo_path: article.cover_photo_path,
            photo_alt_text: article.photo_alt_text,
            user_id: article.user_id
        }));
        res.json(cleanArticles);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
// get article by slug
export const getArticleBySlugs = async (req, res) => {
    const { slug } = req.params;
    try {
        const article = await getArticleBySlug(slug);
        if (!article) {
            return res.status(404).json({ error: 'Article not found' });
        }
        res.json({
            id: article.id,
            title: article.title,
            slug: article.slug,
            sub_title: article.sub_title,
            body: article.body,
            status: article.status,
            published_at: article.published_at,
            cover_photo_path: article.cover_photo_path,
            photo_alt_text: article.photo_alt_text,
            user_id: article.user_id
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};