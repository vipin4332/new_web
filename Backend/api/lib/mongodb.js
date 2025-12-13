// MongoDB connection utility for Vercel Serverless Functions
const { MongoClient } = require('mongodb');

let cachedClient = null;
let cachedDb = null;

const MONGODB_URI = process.env.MONGODB_URI;
const MONGODB_DB = process.env.MONGODB_DB || 'tenx_registrations';

if (!MONGODB_URI) {
    console.error('❌ MONGODB_URI is not defined in environment variables');
    console.error('📝 Please add MONGODB_URI to Vercel environment variables');
    console.error('📝 Format: mongodb+srv://username:password@cluster.mongodb.net/?retryWrites=true&w=majority');
    throw new Error('MONGODB_URI environment variable is required. Please set it in Vercel dashboard.');
}

async function connectToDatabase() {
    if (cachedClient && cachedDb) {
        console.log('✅ Using cached MongoDB connection');
        return { client: cachedClient, db: cachedDb };
    }

    try {
        console.log('🔌 Connecting to MongoDB...');
        const client = new MongoClient(MONGODB_URI, {
            maxPoolSize: 10,
            serverSelectionTimeoutMS: 5000,
            socketTimeoutMS: 45000,
        });

        await client.connect();
        const db = client.db(MONGODB_DB);

        cachedClient = client;
        cachedDb = db;

        console.log('✅ MongoDB connected successfully');
        return { client, db };
    } catch (error) {
        console.error('❌ MongoDB connection error:', error);
        throw error;
    }
}

module.exports = { connectToDatabase };

