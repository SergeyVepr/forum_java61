import postService from "../services/post.service.js";

class PostController {

    async createPost(req, res, next) {
        try {
            const post = await postService.createPost(req.params.author, req.body);
            return res.status(201).json(post);
        } catch (e) {
            return next(e);
        }
    }

    async getPostById(req, res, next) {
        try {
            const post = await postService.getPostsById(req.params.id);
            return res.status(200).json(post);
        } catch (e) {
            return next(e);
        }
    }

    async deletePost(req, res, next) {
        try {
            const post = await postService.deletePost(req.params.id);
            return res.json(post);
        } catch (e) {
            return next(e);
        }
    }

    async addLike(req, res, next) {
        try {
            const post = await postService.addLike(req.params.id);
            return res.status(204).json(post);
        } catch (e) {
            return next(e);
        }
    }

    async getPostsByAuthor(req, res, next) {
        try {
            const posts = await postService.getPostsByAuthor(req.params.author);
            return res.status(200).json(posts);
        } catch (e) {
            return next(e);
        }
    }

    async addComment(req, res, next) {
        try{
            const {id, user} = req.params;
            const post = await postService.addComment(id, user, req.body.message);
            return res.json(post);
        }catch (e) {
            return next(e);
        }
    }

    async getPostsByTags(req, res, next) {
        try {
            const value = req.query.values.split(',');
            const posts = await postService.getPostsByTag(value);
            return res.status(200).json(posts);
        }catch (e){
            return next(e);
        }
    }

    async getPostsByPeriod(req, res, next) {
        try {
            const {dateFrom, dateTo} = req.query;
            const posts = await postService.getPostsByPeriod(dateFrom, dateTo);
            return res.status(200).json(posts);
        }catch (e){
            return next(e);
        }
    }

    async updatePost(req, res, next) {
        try {
            const post = await postService.updatePost(req.params.id, req.body);
            return res.json(post);
        }catch (e){
            return next(e);
        }
    }

}

export default new PostController();