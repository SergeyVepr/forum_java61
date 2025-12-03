import {model, Schema, Types} from 'mongoose';
import commentsScheme from './comment.model.js';

const postSchema = new Schema({
    _id: {type: String, default: () => new Types.ObjectId().toHexString()},
    title: {type: String, required: true},
    content: {type: String, required: true},
    author: {type: String, required: true},
    dataCreated: {type: Date, default: Date.now},
    tags: {type: [String], default: []},
    likes: {type: Number, default: 0},
    comments: {type: [commentsScheme], default: []}
}, {
    versionKey: false,
    toJSON: {
        transform: (doc, ret) => {
            // ret.id = ret._id;
            // delete ret._id;
            ret.dataCreated = ret.dataCreated.toISOString().slice(0, 19);
            const {_id, ...rest} = ret;
            return {id: _id, ...rest};

        }
    }
});

export default model('Post', postSchema, 'posts');