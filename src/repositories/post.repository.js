import Post from '../models/post.model.js';

class PostRepository {
    async createPost(postData) {
        const post = new Post(postData);
        return post.save();
    }

    async findPostById(postId) {
        return Post.findById(postId)
    }

    async deletePost(postId) {
        return Post.findByIdAndDelete(postId);
    }

    async updateLikes(postId) {
        return Post.updateOne({_id: postId}, {$inc: {likes: 1}});
    }

    async findPostsByAuthor(author) {
        return Post.find({author: new RegExp(`^${author}$, 'i`)});
    }

    async addComment(postId, commenter, comment) {
        const post = await this.findPostById(postId);
        post.comments.push({user:commenter,message: comment});
        post.save();
        return post;
    }

    async getPostsByTags(arrTags){
        const posts = [];
        for (const tag of arrTags) {
            posts.push(await Post.find({ tags: { $regex: tag, $options: 'i' } }))
        }
        return posts;
    }

    async findPostsByPeriod(dateFrom, dateTo) {
        dateTo = dateTo + 'T23:59:59.999Z';
        dateFrom = dateFrom + 'T00:00:00.000Z';
        return Post.find({
            dataCreated: {$gte: new Date(dateFrom), $lte: new Date(dateTo)}
        });
    }

    async updatePost(postId, data) {
        return Post.findByIdAndUpdate({_id: postId}, {$set: data}, {returnDocument: 'after'});
    }
}

export default new PostRepository();