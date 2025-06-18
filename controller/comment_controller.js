import {
    getApprovedComments,
    checkCommentExists,
    createComment,
    deleteComment,
    findCommentById,
    findPostBySlug,
    getCommentsByArticleSlug,
} from '../models/comment_models.js';

export const listComments = async (req, res) => {
    try {
        const { slug } = req.params; // pastikan kamu kirim slug dari frontend
        const comments = await getCommentsByArticleSlug(slug);

        const formatted = comments.map(comment => ({
            id: comment.id,
            content: comment.comment.replace(/<[^>]*>?/gm, ''), // bersihin tag HTML
            post_title: comment.post?.title ?? '[judul tidak ditemukan]',
            user_name: comment.user?.name ?? '[anonim]',
            created_at: comment.created_at.toISOString(),
        }));

        res.json(formatted);
    } catch (error) {
        res.status(500).json({
            message: 'Gagal mengambil komentar berdasarkan artikel.',
            error: error.message
        });
    }
};


export const postComment = async (req, res) => {
    const { post_id, comment } = req.body;
    const userId = req.user?.id;

    if (!userId) return res.status(401).json({ message: 'User belum login' });

    try {
        if (!post_id || !comment) {
            return res.status(400).json({ message: 'Isi komentar dan post_id diperlukan' });
        }

        const existing = await checkCommentExists(post_id, userId);
        if (existing) return res.status(409).json({ message: 'Kamu sudah pernah komentar di postingan ini.' });

        const newComment = await createComment({
            name: req.user.name,
            user_id: BigInt(userId),
            post_id: BigInt(post_id),
            comment,
            approved: false,
            created_at: new Date(),
            updated_at: new Date(),
        });

        res.status(201).json({ message: 'Komentar berhasil dikirim! Menunggu persetujuan admin.', comment: newComment });
    } catch (error) {
        res.status(500).json({ message: 'Gagal mengirim komentar.', error: error.message });
    }
};

export const deleteCommentById = async (req, res) => {
    const { id } = req.params;
    const userId = req.user?.id;

    if (!userId) return res.status(401).json({ message: 'User belum login' });

    try {
        const comment = await findCommentById(id);

        if (!comment) return res.status(404).json({ message: 'Komentar tidak ditemukan.' });
        if (comment.user_id !== BigInt(userId)) return res.status(403).json({ message: 'Kamu tidak punya akses untuk menghapus komentar ini.' });

        await deleteComment(id);
        res.json({ message: 'Komentar berhasil dihapus.' });
    } catch (error) {
        res.status(500).json({ message: 'Gagal menghapus komentar.', error: error.message });
    }
};

export const listCommentsByArticleSlug = async (req, res) => {
    const { slug } = req.params;

    try {
        const comments = await getCommentsByArticleSlug(slug);

        const formatted = comments.map(comment => ({
            id: comment.id,
            content: comment.comment.replace(/<[^>]*>?/gm, ''),
            post_title: comment.post?.title ?? '[judul tidak ditemukan]',
            user_name: comment.user?.name ?? '[anonim]',
            created_at: comment.created_at.toISOString(),
        }));

        res.json(formatted);
    } catch (error) {
        res.status(500).json({
            message: 'Gagal mengambil komentar berdasarkan artikel.',
            error: error.message,
        });
    }
};

export const postCommentBySlug = async (req, res) => {
    const { slug } = req.params;
    const { comment } = req.body;
    const userId = req.user?.id;

    if (!userId) return res.status(401).json({ message: 'User belum login' });
    if (!comment) return res.status(400).json({ message: 'Komentar tidak boleh kosong' });

    try {
        const post = await findPostBySlug(slug);
        if (!post) return res.status(404).json({ message: 'Post tidak ditemukan.' });

        const existing = await checkCommentExists(post.id, userId);
        if (existing) return res.status(409).json({ message: 'Kamu sudah komentar di postingan ini.' });

        const newComment = await createComment({
            name: req.user.name,
            user_id: BigInt(userId),
            post_id: BigInt(post.id),
            comment,
            approved: false,
            created_at: new Date(),
            updated_at: new Date(),
        });

        res.status(201).json({ message: 'Komentar berhasil dikirim! Menunggu persetujuan.', comment: newComment });
    } catch (error) {
        res.status(500).json({ message: 'Gagal mengirim komentar.', error: error.message });
    }
};

export const deleteCommentBySlug = async (req, res) => {
    const { slug } = req.params;
    const userId = req.user?.id;

    if (!userId) return res.status(401).json({ message: 'User belum login' });

    try {
        const post = await findPostBySlug(slug);
        if (!post) return res.status(404).json({ message: 'Post tidak ditemukan.' });

        const comment = await checkCommentExists(post.id, userId);
        if (!comment) return res.status(404).json({ message: 'Komentar kamu di artikel ini tidak ditemukan.' });

        await deleteComment(comment.id);
        res.json({ message: 'Komentar berhasil dihapus berdasarkan slug artikel.' });
    } catch (error) {
        res.status(500).json({ message: 'Gagal menghapus komentar.', error: error.message });
    }
};
