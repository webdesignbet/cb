import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Prize from "@/models/Prize";

export async function PUT(req: Request, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params;
  await connectDB();

  try {
    const body = await req.json();
    const { name, quantity, angleMin, angleMax } = body;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const updateData: any = {};

    if (name !== undefined) {
      if (typeof name !== "string" || name.trim().length < 2)
        return NextResponse.json(
          { success: false, message: "O nome deve ter pelo menos 2 caracteres." },
          { status: 400 }
        );
      updateData.name = name.trim();
    }

    if (quantity !== undefined) {
      if (!Number.isInteger(quantity) || quantity < -1)
        return NextResponse.json(
          { success: false, message: "A quantidade precisa ser um número inteiro maior ou igual a -1." },
          { status: 400 }
        );
      updateData.quantity = quantity;
    }

    if (angleMin !== undefined || angleMax !== undefined) {
      const min = angleMin ?? 0;
      const max = angleMax ?? 0;
      if (min < 0 || max > 360 || min >= max) {
        return NextResponse.json(
          { success: false, message: "Os ângulos devem estar entre 0 e 360, e o mínimo deve ser menor que o máximo." },
          { status: 400 }
        );
      }
      updateData.angleMin = min;
      updateData.angleMax = max;
    }

    const updated = await Prize.findByIdAndUpdate(id, updateData, { new: true });

    if (!updated) {
      return NextResponse.json(
        { success: false, message: "Prêmio não encontrado." },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Prêmio atualizado com sucesso!",
      prize: updated,
    });
  } catch (error) {
    console.error("Erro ao atualizar prêmio:", error);
    return NextResponse.json(
      { success: false, message: "Erro interno ao atualizar prêmio." },
      { status: 500 }
    );
  }
}

export async function DELETE(req: Request, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params;
  await connectDB();

  try {
    const deleted = await Prize.findByIdAndDelete(id);

    if (!deleted) {
      return NextResponse.json(
        { success: false, message: "Prêmio não encontrado para exclusão." },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Prêmio removido com sucesso!",
    });
  } catch (error) {
    console.error("Erro ao remover prêmio:", error);
    return NextResponse.json(
      { success: false, message: "Erro interno ao remover prêmio." },
      { status: 500 }
    );
  }
}
