import express from 'express';
import mongoose from "mongoose";
import authRouter from "./authRouters.js";

const PORT = process.env.PORT || 5000;
const DB_API = "mongodb+srv://admin:admin@cluster0.7sy5rhs.mongodb.net/?retryWrites=true&w=majority";

const app = express();
app.use(express.json());
app.use("/auth", authRouter);

const start = async () => {
    try {
        await mongoose.connect(DB_API);
        app.listen(PORT, () => console.log(`Server has been started on PORT ${PORT}`));
    } catch (e) {
        console.log(e);
    }
};

start();




