import prisma from "../prisma/db.js";
// get all articles
export const getAllArticles = async () => {
    try {
        return await prisma.fblog_posts.findMany({
            orderBy: { created_at: "desc" },
        });
    } catch (error) {
        console.error("Error fetching articles:", error);
        throw error;
    }
};
// get article by slug
export const getArticleBySlug = async (slug) => {
    try {
        return await prisma.fblog_posts.findUnique({
            where: { slug },
        });
    } catch (error) {
        console.error("Error fetching article by slug:", error);
        throw error;
    }
};


// add like to article


// Cari post published berdasarkan ID
// Ambil post published berdasarkan slug
export const findPublishedPostBySlug = async (slug) => {
  return await prisma.fblog_posts.findFirst({
    where: {
      slug,
      status: 'published',
    },
  });
};

export const checkLikeExists = async (postId, userId) => {
  const like = await prisma.post_likes.findUnique({
    where: {
      post_id_user_id: {
        post_id: BigInt(postId),
        user_id: BigInt(userId),
      },
    },
  });
  return !!like;
};

export const addLike = async (postId, userId) => {
  return await prisma.post_likes.create({
    data: {
      post_id: BigInt(postId),
      user_id: BigInt(userId),
      created_at: new Date(),
      updated_at: new Date(),
    },
  });
};

export const removeLike = async (postId, userId) => {
  return await prisma.post_likes.delete({
    where: {
      post_id_user_id: {
        post_id: BigInt(postId),
        user_id: BigInt(userId),
      },
    },
  });
};


export const countLikes = async (postId) => {
  return await prisma.post_likes.count({
    where: { post_id: BigInt(postId) },
  });
};