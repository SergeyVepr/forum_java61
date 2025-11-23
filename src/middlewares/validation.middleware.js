import Joi from "joi";


const schemas = {
    createPost: Joi.object({
        title: Joi.string().required(),
        content: Joi.string().required(),
        tags: Joi.array().items(Joi.string())
    })
}

const validate = schemaName => (req, res, next) => {
    const schema = schemas[schemaName];
    if (!schema) next(new Error(`Schema ${schemaName} not found`));
    const {error} = schema.validate(req.body);
    if (error) res.status(400).send({
        message: error.details[0].message,
        code: 400,
        status: 'bad request',
        path: req.path
    });
    return next();
};

export default validate;