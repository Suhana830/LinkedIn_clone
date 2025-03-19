import mongoose from 'mongoose'

export const connectDB = async () => {

    try {
        const conn = await mongoose.connect(process.env.MONGO_URL)
        console.log(`MongoDB connected: ${conn.Connection.host}`)
    }
    catch (error) {
        console.log(`Error connecting to Mongodb: ${error.message}`)
        process.exit(1)
    }
}