import express from 'express';
import mongoose from "mongoose";
import config from "../src/config/config.js";
import postRoutes from "./routes/post.routes.js";



const app = express();

app.use(express.json());
app.use('/forum', postRoutes)

const connectToMongo = async  ()=> {
    try {
        await mongoose.connect(config.mongodb.uri, config.mongodb.db.dbName);
        console.log('Connected to MongoDB: ' + config.mongodb.uri);
    } catch (e) {
        console.log('Failed connecting to MongoDB: ', e);
    }
}

const startServer = async () => {
    await connectToMongo();
    app.listen(config.port, () => console.log(`Server started on port ${config.port}`));
}

startServer();

