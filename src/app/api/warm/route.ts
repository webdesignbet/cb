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
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    const duration = Date.now() - start;
    console.error("❌ Erro ao aquecer o servidor:", error.message || error);

    return NextResponse.json(
      {
        ok: false,
        error: error.message || "Falha ao conectar com o banco de dados",
        timeMs: duration,
      },
      { status: 500 }
    );
  }
}