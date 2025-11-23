import PostService from "../services/post.service.js";
import postService from "../services/post.service.js";

class PostController {
    async createPost(req, res, next) {
       try{
           const post = await PostService.createPost(req.params.author, req.body);
           return res.status(201).json(post);
       }catch (e) {
           next(e);
       }
    }

    async getPostById(req, res,  next){
        try{
            const post = await postService.getPostsById(req.params.id);
            return res.status(200).json(post);
        }catch (e) {
            next(e);
        }
    }

}

export default new PostController();