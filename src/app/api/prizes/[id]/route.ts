import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Prize from "@/models/Prize";

export async function PUT(req: Request, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params;
  await connectDB();
  const { name, quantity } = await req.json();

  const updated = await Prize.findByIdAndUpdate(
    id,
    { name, quantity },
    { new: true }
  );

  if (!updated) {
    return NextResponse.json({ success: false, message: "Prêmio não encontrado" });
  }

  return NextResponse.json({ success: true, prize: updated });
}

export async function DELETE(_req: Request, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params;
  await connectDB();
  const deleted = await Prize.findByIdAndDelete(id);

  if (!deleted) {
    return NextResponse.json({ success: false, message: "Prêmio não encontrado" });
  }

  return NextResponse.json({ success: true });
}
