import mongoose from "mongoose";

const MONGODB_URI_MONGODB_URI = process.env.MONGODB_URI_MONGODB_URI!;

if (!MONGODB_URI_MONGODB_URI) {
  throw new Error("Defina a variavel MONGODB_URI_MONGODB_URI no arquivo .env.local");
}

declare global {
  var mongoose: {
    conn: typeof import("mongoose") | null;
    promise: Promise<typeof import("mongoose")> | null;
  } | undefined;
}

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

export default async function connectDB() {
  if (cached!.conn) {
    return cached!.conn;
  }

  if (!cached!.promise) {
    cached!.promise = mongoose.connect(MONGODB_URI_MONGODB_URI, {
      bufferCommands: false,
    });
  }

  try {
    cached!.conn = await cached!.promise;
  } catch (error) {
    cached!.promise = null;
    throw error;
  }
  return cached!.conn;
}
