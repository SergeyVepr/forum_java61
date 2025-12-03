import express from 'express';
import mongoose from "mongoose";
import config from "../src/config/config.js";
import postRoutes from "./routes/post.routes.js";
import errorHandler from "./middlewares/error.middleware.js";
import userAccountRouter from "./routes/userAccount.routes.js";



const app = express();

app.use(express.json());
app.use('/forum', postRoutes);
app.use('/account', userAccountRouter)
app.use(errorHandler);

const connectToMongo = async  ()=> {
    try {
        await mongoose.connect(config.mongodb.uri, config.mongodb.db);
        console.log('Connected to MongoDB: ' + config.mongodb.db.dbName);
    } catch (e) {
        console.log('Failed connecting to MongoDB: ', e);
    }
}



const startServer = async () => {
    await connectToMongo();
    app.listen(config.port, () => console.log(`Server started on port ${config.port}`));
}

startServer();

