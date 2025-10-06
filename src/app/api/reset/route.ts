import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
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

  await Prize.insertMany([
    { name: "Taça Acrilico", quantity: 3 },
    { name: "Chaveiro abridor de garrafa", quantity: 5 },
    { name: "Copo ecolabel", quantity: 2 },
    { name: "Tente outra vez", quantity: -1 },
    { name: "Mochila saco", quantity: 4 },
    { name: "Garrafa térmica", quantity: 1 },
  ]);

  return NextResponse.json({ success: true, message: "Prêmios resetados!" });
}
