import {model, Schema} from "mongoose";


const userAccountSchema = new Schema({
    _id: {
        type: String,
        required: true,
        alias: 'login'
    },
    password: {
        type: String,
        required: true,
    },
    firstName: {
        type: String,
        required: true,
    },
    lastName: {
        type: String,
        required: true,
    },
    roles: {
        type: [String],
        default: ['USER']
    }
},{
    versionKey: false,
    toJSON: {
        transform: (doc, ret) => {
            delete ret.password;
            const {_id, ...rest} = ret;
            return {login: _id, ...rest}
        }
    }
})


export default model('UserAccount', userAccountSchema, 'users');