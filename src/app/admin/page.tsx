"use client";
import { useEffect, useState } from "react";

type Prize = {
  _id: string;
  name: string;
  quantity: number;
};

export default function AdminPage() {
  const [prizes, setPrizes] = useState<Prize[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState<"success" | "error" | "">("");
  const [newPrizeName, setNewPrizeName] = useState("");
  const [newPrizeQty, setNewPrizeQty] = useState<number>(1);
  const [authorized, setAuthorized] = useState(false);

  const getKeyFromUrl = () => {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get("key");
  };

  const fetchPrizes = async () => {
    setLoading(true);
    const res = await fetch("/api/prizes");
    const data = await res.json();
    setPrizes(data);
    setLoading(false);
  };

  const resetPrizes = async () => {
    if (!confirm("Tem certeza que deseja resetar os prêmios?")) return;

    const key = getKeyFromUrl();

    const res = await fetch(`/api/reset?key=${key}`, { method: "POST" });
    const data = await res.json();

    if (data.success) {
      setMessageType("success");
      setMessage(data.message);
      fetchPrizes();
    } else {
      setMessageType("error");
      setMessage("Erro ao resetar prêmios.");
    }
  };

  const addPrize = async () => {
    if (!newPrizeName.trim()) {
      alert("Informe o nome do prêmio!");
      return;
    }

    const res = await fetch("/api/add-prize", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: newPrizeName, quantity: newPrizeQty }),
    });

    const data = await res.json();
    if (data.success) {
      setMessageType("success");
      setMessage(data.message);
      setNewPrizeName("");
      setNewPrizeQty(1);
      fetchPrizes();
    } else {
      setMessageType("error");
      setMessage("Erro ao adicionar prêmio.");
    }
  };

  useEffect(() => {
    const key = getKeyFromUrl();
    if (key === process.env.NEXT_PUBLIC_ADMIN_KEY) {
      setAuthorized(true);
      fetchPrizes();
    } else {
      setAuthorized(false);
    }
  }, []);

  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => {
        setMessage("");
        setMessageType("");
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  if (!authorized) {
    return (
      <div className="flex items-center justify-center min-h-screen w-full bg-gray-100">
        <p className="text-4xl font-bold text-red-600">
          Acesso negado — chave inválida
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center self-center max-h-[95vh] text-gray-900 p-6 w-xl bg-gray-100">
      <h1 className="text-3xl font-bold my-6 text-black">Painel de Administração</h1>

      {message && (
        <div
          className={`mb-4 font-semibold ${
            messageType === "success" ? "text-green-600" : "text-red-600"
          }`}
        >
          {message}
        </div>
      )}

      {loading ? (
        <p>Carregando...</p>
      ) : (
        <table className="border-collapse border border-gray-400 bg-white shadow-lg">
          <thead>
            <tr className="bg-gray-200">
              <th className="border border-gray-400 px-4 py-2">Prêmio</th>
              <th className="border border-gray-400 px-4 py-2">Quantidade</th>
            </tr>
          </thead>
          <tbody>
            {prizes.map((p) => (
              <tr key={p._id}>
                <td className="border border-gray-400 px-4 py-2 font-semibold">
                  {p.name}
                </td>
                <td className="border border-gray-400 px-4 py-2 text-center">
                  {p.quantity === -1 ? "Infinito" : p.quantity}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <div className="flex gap-4 mt-6">
        <button
          onClick={fetchPrizes}
          className="bg-blue-700 text-white px-6 py-2 rounded-lg hover:bg-blue-900 transition"
        >
          Atualizar
        </button>
        <button
          onClick={resetPrizes}
          className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-800 transition"
        >
          Resetar Prêmios
        </button>
      </div>

      <div className="mt-10 w-full max-w-md bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-bold mb-4">Adicionar Novo Prêmio</h2>
        <input
          type="text"
          placeholder="Nome do prêmio"
          value={newPrizeName}
          onChange={(e) => setNewPrizeName(e.target.value)}
          className="border border-gray-400 rounded px-3 py-2 w-full mb-4"
        />
        <input
          type="number"
          placeholder="Quantidade"
          value={newPrizeQty}
          onChange={(e) => setNewPrizeQty(Number(e.target.value))}
          className="border border-gray-400 rounded px-3 py-2 w-full mb-4"
        />
        <button
          onClick={addPrize}
          className="w-full bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-800 transition"
        >
          Adicionar
        </button>
      </div>
    </div>
  );
}
