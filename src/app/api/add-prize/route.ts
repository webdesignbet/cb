import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Prize from "@/models/Prize";

export async function POST(request: Request) {
  await connectDB();

  const body = await request.json();
  const { name, quantity } = body;

  if (!name || typeof name !== "string" || name.trim().length < 2) {
    return NextResponse.json(
      { success: false, message: "O nome do prêmio é inválido." },
      { status: 400 }
    );
  }

  if (isNaN(quantity) || !Number.isInteger(quantity)) {
    return NextResponse.json(
      { success: false, message: "A quantidade precisa ser um número inteiro." },
      { status: 400 }
    );
  }

  if (quantity < -1) {
    return NextResponse.json(
      { success: false, message: "A quantidade não pode ser menor que -1." },
      { status: 400 }
    );
  }

  const existing = await Prize.findOne({ name: name.trim() });
  if (existing) {
    return NextResponse.json(
      { success: false, message: "Já existe um prêmio com este nome." },
      { status: 409 }
    );
  }

  const prize = new Prize({
    name: name.trim(),
    quantity,
  });

  await prize.save();

  return NextResponse.json({
    success: true,
    message: "Prêmio adicionado com sucesso!",
    prize,
  });
}
