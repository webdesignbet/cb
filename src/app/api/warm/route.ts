import connectDB from "@/lib/mongodb";
import { NextResponse } from "next/server";

export async function GET() {
  const start = Date.now();

  try {
    const conn = await connectDB();
    const duration = Date.now() - start;

    console.info(`✅ Warm-up bem-sucedido - conectado ao MongoDB em ${duration}ms`);
    console.info(`📡 Estado da conexão: ${conn.connection.readyState === 1 ? "Aberta" : "Fechada"}`);

    return NextResponse.json({
      ok: true,
      message: "Servidor aquecido 🔥",
      connectionState: conn.connection.readyState,
      timeMs: duration,
    });
  } catch (error: unknown) {
    const duration = Date.now() - start;
    console.error("❌ Erro ao aquecer o servidor:", (error as Error).message);

    return NextResponse.json(
      {
        ok: false,
        error: (error as Error).message || "Falha ao conectar com o banco de dados",
        timeMs: duration,
      },
      { status: 500 }
    );
  }
}