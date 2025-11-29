import postRepository from '../repositories/post.repository.js';

class PostService {
    async createPost(author, data) {
        return await postRepository.createPost({...data, author});
    }

    async getPostsById(id) {
        const post = await postRepository.findPostById(id);
        if (!post) throw new Error(`Post not found, id:${id}`);
        return post;
    }

    async addLike(postId) {
        const post = await postRepository.findPostById(postId);
        if (!post) throw new Error(`Post not found, id:${postId}`);
        await postRepository.updateLikes(postId);
        return true;
    }

    async getPostsByAuthor(author) {
        const posts = await postRepository.findPostsByAuthor(author);
        if (posts.length === 0) throw new Error(`Posts not found, author:${author}`);
        return posts;
    }

    async addComment(postId, commenter, comment) {
        const post = await postRepository.findPostById(postId);
        if (!post) throw new Error(`Post not found, id:${postId}`);
        await postRepository.addComment(postId, commenter, comment);
        return post;
    }

    async deletePost(postId) {
        const post = await postRepository.deletePost(postId);
        if (!post) throw new Error(`Post not found, id:${postId}`);
        return post;
    }

    async getPostsByTag(tagsString) {
        const posts = (await postRepository.getPostsByTags(tagsString)).flat();
        if(posts.length === 0) throw new Error(`Posts not found, tags:${tagsString}`);
        return posts
    }

    async getPostsByPeriod(dateFrom, dateTo) {

        const posts = await postRepository.findPostsByPeriod(dateFrom, dateTo);
        if(!posts || posts.length === 0) throw new Error(`Posts not found, period:${dateFrom} - ${dateTo}`);
        return posts
    }

    async updatePost(postId, data) {
        const post = await postRepository.updatePost(postId, data);
        if (!post) throw new Error(`Post not found, id:${postId}`);
        return post;
    }
}

export default new PostService();
