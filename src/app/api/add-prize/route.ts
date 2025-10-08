import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Prize from "@/models/Prize";

export async function POST(request: Request) {
  await connectDB();
  const body = await request.json();
  const { name, quantity } = body;

  if (!name || quantity === undefined) {
    return NextResponse.json(
      { success: false, message: "Nome e quantidade são obrigatórios." },
      { status: 400 }
    );
  }

  let prize = await Prize.findOne({ name });
  if (prize) {
    if (prize.quantity !== -1) {
      prize.quantity += Number(quantity);
      await prize.save();
    }
  } else {
    prize = new Prize({ name, quantity: Number(quantity) });
    await prize.save();
  }

  return NextResponse.json({ success: true, message: "Prêmio adicionado!" });
}
