// article controller
import express from 'express';
import { getAllArticles, getArticleBySlug } from '../models/article_models.js';
import { stripHtml } from 'string-strip-html';
import redisClient from '../helpers/redis-client.js';

const DEFAULT_EXPIRE_TIME = 60 * 60 * 24; // 1 day in seconds

// get all articles
export const getArticles = async (req, res) => {
    try {
        // Cek cache Redis dulu
        /**const cachedArticles = await redisClient.get('articles');
        if (cachedArticles) {
            console.log('Mengambil artikel dari cache Redis');
            // Jika ada, parse JSON dan kirim sebagai response
            return res.json(JSON.parse(cachedArticles));
        }
            **/
        // klo gada cache, ambil dari database
        console.log('Mengambil artikel dari database');
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
        // Simpan hasil ke cache Redis dengan expire time
        // await redisClient.set('articles', JSON.stringify(cleanArticles), {
        //     EX: DEFAULT_EXPIRE_TIME // Set expire time to 1 day
        // });
        res.json(cleanArticles);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
// get article by slug
export const getArticleBySlugs = async (req, res) => {
    const { slug } = req.params;
    // const cacheSlug = `article:${slug}`;
    try {
        // Cek cache Redis dulu
        // const cachedArticle = await redisClient.get(cacheSlug); 
        // if (cachedArticle) {
        //     console.log('Mengambil artikel dari cache Redis');
        //     // Jika ada, parse JSON dan kirim sebagai response
        //     return res.json(JSON.parse(cachedArticle));
        // }
        // klo gada cache, ambil dari database
        console.log('Mengambil artikel dari database');
        const article = await getArticleBySlug(slug);
        if (!article) {
            return res.status(404).json({ error: 'Article not found' });
        }
        // // Simpan hasil ke cache Redis dengan expire time
        // await redisClient.set(cacheSlug, JSON.stringify(article), {
        //     EX: DEFAULT_EXPIRE_TIME // Set expire time to 1 day
        // });

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