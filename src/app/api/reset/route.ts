import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Prize from "@/models/Prize";

export async function POST(request: Request) {
  await connectDB();

  const { searchParams } = new URL(request.url);
  const key = searchParams.get("key");

  if (key !== process.env.ADMIN_KEY) {
    return NextResponse.json(
      { success: false, message: "Acesso negado — chave inválida." },
      { status: 403 }
    );
  }

  try {
    const prizes = await Prize.find();

    if (!prizes || prizes.length === 0) {
      return NextResponse.json({
        success: false,
        message: "Nenhum prêmio encontrado para resetar.",
      });
    }

    const updates = prizes.map(async (p) => {
      if (p.name === "Tente outra vez") {
        p.quantity = -1;
      } else {
        p.quantity = 3;
      }
      await p.save();
    });

    await Promise.all(updates);

    return NextResponse.json({
      success: true,
      message: "Prêmios resetados com sucesso!",
    });
  } catch (error) {
    console.error("Erro ao resetar prêmios:", error);
    return NextResponse.json(
      { success: false, message: "Erro interno ao resetar prêmios." },
      { status: 500 }
    );
  }
}
