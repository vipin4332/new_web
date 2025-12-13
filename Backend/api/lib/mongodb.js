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
        console.log('🔌 MongoDB URI configured:', !!MONGODB_URI);
        console.log('🔌 MongoDB DB:', MONGODB_DB);
        
        const client = new MongoClient(MONGODB_URI, {
            maxPoolSize: 10,
            serverSelectionTimeoutMS: 10000, // Increased timeout
            socketTimeoutMS: 45000,
            connectTimeoutMS: 10000,
            tls: true,
            tlsAllowInvalidCertificates: false,
            tlsAllowInvalidHostnames: false,
            retryWrites: true,
            retryReads: true
        });

        console.log('🔌 Attempting MongoDB connection...');
        await client.connect();
        console.log('🔌 MongoDB client connected, accessing database...');
        
        const db = client.db(MONGODB_DB);
        
        // Test the connection with a ping
        await db.admin().ping();
        console.log('✅ MongoDB ping successful');

        cachedClient = client;
        cachedDb = db;

        console.log('✅ MongoDB connected successfully');
        return { client, db };
    } catch (error) {
        console.error('❌ MongoDB connection error:', error);
        console.error('❌ Error name:', error.name);
        console.error('❌ Error message:', error.message);
        console.error('❌ Error code:', error.code);
        
        // Clear cache on error
        cachedClient = null;
        cachedDb = null;
        
        throw error;
    }
}

module.exports = { connectToDatabase };

