import mongoose from "mongoose";

let isConnected = false;

export async function connectDB() {
  if (isConnected) return;

  const uri = process.env.MONGODB_URI as string;
  if (!uri) throw new Error("MONGODB_URI não configurada!");

  await mongoose.connect(uri);
  isConnected = true;
  console.log("MongoDB conectado");
}