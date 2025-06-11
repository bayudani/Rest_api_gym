import {
  findPublishedPostBySlug,
  checkLikeExists,
  addLike,
  removeLike,
  countLikes,
} from '../models/article_models.js';

export const likePost = async (req, res) => {
  const { slug } = req.params;
  const userId = req.user?.id;

  if (!userId) return res.status(401).json({ message: 'User belum login' });

  try {
    const post = await findPublishedPostBySlug(slug);
    if (!post) return res.status(404).json({ message: 'Post tidak ditemukan.' });

    const liked = await checkLikeExists(post.id, userId);
    if (liked) return res.status(409).json({ message: 'Kamu sudah like post ini.' });

    await addLike(post.id, userId);
    res.json({ message: 'Post berhasil di-like!' });
  } catch (error) {
    res.status(500).json({ message: 'Terjadi kesalahan saat like post.', error: error.message });
  }
};

export const unlikePost = async (req, res) => {
  const { slug } = req.params;
  const userId = req.user?.id;

  if (!userId) return res.status(401).json({ message: 'User belum login' });

  try {
    const post = await findPublishedPostBySlug(slug);
    if (!post) return res.status(404).json({ message: 'Post tidak ditemukan.' });

    const liked = await checkLikeExists(post.id, userId);
    if (!liked) return res.status(409).json({ message: 'Kamu belum like post ini.' });

    await removeLike(post.id, userId);
    res.json({ message: 'Like berhasil dibatalkan.' });
  } catch (error) {
    res.status(500).json({ message: 'Terjadi kesalahan saat unlike post.', error: error.message });
  }
};

export const getLikeCount = async (req, res) => {
  const { slug } = req.params;

  try {
    const post = await findPublishedPostBySlug(slug);
    if (!post) return res.status(404).json({ message: 'Post tidak ditemukan.' });

    const totalLikes = await countLikes(post.id);
    res.json({ likes: totalLikes });
  } catch (error) {
    res.status(500).json({ message: 'Terjadi kesalahan saat mengambil jumlah like.', error: error.message });
  }
};
