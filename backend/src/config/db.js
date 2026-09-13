import mongoose from "mongoose";

const connectDB = async () => {
    try {
        console.log("Connecting to MongoDB...");
        console.log("URI exists:", !!process.env.MONGO_URI);

        const conn = await mongoose.connect(process.env.MONGO_URI);

        console.log("MongoDB Connected:", conn.connection.host);
        return conn;
    } catch (error) {
        console.error("DATABASE CONNECTION ERROR:", error.message);
        console.error(error);
        throw error; // important
    }
};

export default connectDB;