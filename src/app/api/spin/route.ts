import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Prize from "@/models/Prize";

export async function POST() {
  await connectDB();

  const prizes = await Prize.find();

  const available = prizes.filter(p => p.quantity > 0 || p.quantity === -1);
  const nonRetry = available.filter(p => p.name !== "Tente outra vez");

  if (nonRetry.length === 0) {
    return NextResponse.json({ prize: "Todos os prêmios acabaram!" });
  }

  const randomPrize = available[Math.floor(Math.random() * available.length)];

  if (randomPrize.name !== "Tente outra vez") {
    if (randomPrize.quantity > 0) {
      randomPrize.quantity -= 1;
      await randomPrize.save();
    }
    return NextResponse.json({ prize: randomPrize.name });
  }

  return NextResponse.json({ prize: "Tente outra vez" });
}