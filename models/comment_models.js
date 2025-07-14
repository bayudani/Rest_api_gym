// comment_models.js
import prisma from "../prisma/db.js";

export const getApprovedComments = async () => {
    return await prisma.fblog_comments.findMany({
        where: { approved: true },
        include: {
            post: true,
            user: true,
        },
        orderBy: { created_at: 'desc' },
    });
};

export const getCommentsByArticleSlug = async (slug) => {
    const post = await prisma.fblog_posts.findFirst({
        where: {
            slug: slug,
            status: 'published'
        }
    });

    if (!post) return []; 

    return await prisma.fblog_comments.findMany({
        where: {
            approved: true,
            post_id: post.id
        },
        include: {
            user: true,
            // post: true
        },
        // orderBy: {
        //     created_at: 'desc'
        // }
    });
};


export const checkCommentExists = async (postId, userId) => {
    return await prisma.fblog_comments.findFirst({
        where: {
            post_id: BigInt(postId),
            user_id: BigInt(userId),
        },
    });
};

export const createComment = async (data) => {
    return await prisma.fblog_comments.create({ data });
};

export const deleteComment = async (id) => {
    return await prisma.fblog_comments.delete({
        where: { id: BigInt(id) },
    });
};

export const findCommentById = async (id) => {
    return await prisma.fblog_comments.findUnique({
        where: { id: BigInt(id) },
    });
};

export const findPostBySlug = async (slug) => {
    return await prisma.fblog_posts.findUnique({
        where: { slug },
    });
};

// count comment
export const countComment = async (postId)=>{
    return await prisma.fblog_comments.count({
    where: { post_id: BigInt(postId) }
    })
}