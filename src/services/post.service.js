class PostService {
    async createPost(author, data) {
        throw new Error('Not implemented');
    }

    async getPostsById(id) {
        throw new Error('Not implemented');
    }

    async addLike(postId) {
        throw new Error('Not implemented');
    }

    async getPostsByAuthor(author) {
        throw new Error('Not implemented');
    }

    async addComment(postId, commenter, comment) {
        throw new Error('Not implemented');
    }

    async deletePost(postId) {
        throw new Error('Not implemented');
    }

    async getPostsByTag(tagsString) {
        throw new Error('Not implemented');
    }

    async getPostsByPeriod(dateFrom, dateTo) {
        throw new Error('Not implemented');
    }

    async updatePost(postId, data) {
        // TODO
        //     "title": "Jakarta EE",
        //     "tags":["Jakarta EE", "J2EE"],
        //     "content": "Java is the best for backend"

        throw new Error('Not implemented');
    }
}

export default new PostService();
