import mongoose from 'mongoose';

export const initializeDatabase = async () => {
    try {
       const mongoURI = process.env.MONGODB_URI;
       if (!mongoURI) {
        throw new Error('MONGODB_URI is not defined');
       }
       const conn = await mongoose.connect(mongoURI);
       console.log(`MongoDB connected: ${conn.connection.host}`);
       
    } catch (error) {
        console.error(`Error : ${error}`);
        process.exit(1);
    }
}