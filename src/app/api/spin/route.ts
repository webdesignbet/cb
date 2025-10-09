import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Prize from "@/models/Prize";

export async function POST(req: Request) {
  await connectDB();

  try {
    const body = await req.json();
    const { finalDegree } = body;

    const allPrizes = await Prize.find();

    if (!allPrizes || allPrizes.length === 0) {
      return NextResponse.json({
        prize: "Todos os prêmios acabaram!",
      });
    }

    const prize = allPrizes.find(
      (p) => finalDegree >= p.angleMin && finalDegree <= p.angleMax
    );

    if (!prize) {
      return NextResponse.json({ prize: "Tente outra vez" });
    }

    if (prize.name === "Tente outra vez") {
      return NextResponse.json({ prize: "Tente outra vez" });
    }

    if (prize.quantity === 0) {
      return NextResponse.json({ prize: "Tente outra vez" });
    }

    if (prize.quantity > 0) {
      prize.quantity -= 1;
      await prize.save();
    }

    return NextResponse.json({ prize: prize.name });
  } catch (error) {
    console.error("Erro ao girar roleta:", error);
    return NextResponse.json(
      { prize: "Erro ao sortear prêmio." },
      { status: 500 }
    );
  }
}
