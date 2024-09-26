import mongoose from "mongoose";

let isConnected: boolean = false;

export const connectToDB = async (): Promise<void> => {
    mongoose.set('strictQuery', true);

    if (!process.env.MONGODB_URL) return console.log('MONGODB_URL not found.');
    if (isConnected) return console.log('Already connected to MongoDB');

    try {
        await mongoose.connect(process.env.MONGODB_URL, { dbName: 'threads' });
        isConnected = true;
        console.log('Connected to MongoDB');
    } catch (error: unknown) {
        throw new Error(`Failed to connect to DB: ${error}`);
    }
};
