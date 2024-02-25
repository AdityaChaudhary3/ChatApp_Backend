import mongoose from 'mongoose';
import { DB_NAME } from '../constant.js';

const connectDB = async() => {
    try {
        const connect = await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`);
        console.log(`\n MongoDB connected!! DB HOST: ${connect.connection.host}`);
    } catch (error) {
        console.log("Error while connecting mongodb",error)
        process.exit(1)
    }
}

export default connectDB