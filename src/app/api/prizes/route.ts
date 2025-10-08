import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Prize from "@/models/Prize";

export async function GET() {
  await connectDB();
  const prizes = await Prize.find();
  return NextResponse.json(prizes);
}