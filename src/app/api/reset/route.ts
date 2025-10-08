import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Prize from "@/models/Prize";

export async function POST(request: Request) {
  const { searchParams } = new URL(request.url);
  const key = searchParams.get("key");

  if (key !== process.env.ADMIN_KEY) {
    return NextResponse.json(
      { success: false, message: "Acesso negado" },
      { status: 403 }
    );
  }

  await connectDB();
  await Prize.deleteMany();

  return NextResponse.json({ success: true, message: "Todos os prêmios foram removidos!" });
}
