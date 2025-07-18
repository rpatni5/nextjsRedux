import mongoose, { Connection } from "mongoose";

const MONGODB_URI = process.env.MONGODB_URL!;

if (!MONGODB_URI) {
    console.error("mongodburl",MONGODB_URI)
    throw new Error("Please define the MONGODB_URI environment variable inside .env");
}

interface MongooseCache {
    conn: Connection | null;
    promise: Promise<Connection> | null;
}

declare global {
    var mongoose: MongooseCache;
}

const globalForMongoose = globalThis as typeof globalThis & {
    mongoose?: MongooseCache;
};

const cached = globalForMongoose.mongoose ?? {
    conn: null,
    promise: null,
};

globalForMongoose.mongoose = cached;

export async function connectToDatabase() {
    if (cached.conn) {
        return cached.conn;
    }

    if (!cached.promise) {
        const opts = {
            bufferCommands: false,
            maxPoolSize: 10,
        };

        cached.promise = mongoose.connect(MONGODB_URI, opts).then((mongoose) => mongoose.connection);
    }

    try {
        cached.conn = await cached.promise;
    } catch (error) {
        cached.promise = null;
        throw error;
    }

    return cached.conn;
}
