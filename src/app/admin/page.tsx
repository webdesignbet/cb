"use client";
import { useEffect, useState } from "react";

type Prize = {
  _id: string;
  name: string;
  quantity: number;
  angleMin: number;
  angleMax: number;
};

export default function AdminPage() {
  const [prizes, setPrizes] = useState<Prize[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState<"success" | "error" | "">("");
  const [authorized, setAuthorized] = useState(false);

  const [newPrize, setNewPrize] = useState({
    name: "",
    quantity: 1,
    angleMin: 0,
    angleMax: 0,
  });

  const [editingPrize, setEditingPrize] = useState<string | null>(null);
  const [editPrize, setEditPrize] = useState<Partial<Prize>>({});

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
    if (
      !confirm(
        "Tem certeza que deseja limpar todos os prêmios? Essa ação é irreversível."
      )
    )
      return;
    const key = getKeyFromUrl();
    const res = await fetch(`/api/reset?key=${key}`, { method: "POST" });
    const data = await res.json();

    if (data.success) {
      setMessageType("success");
      setMessage(data.message);
      fetchPrizes();
    } else {
      setMessageType("error");
      setMessage("Erro ao redefinir prêmios.");
    }
  };

  /** ✅ validações */
  const validateAngles = (min: number, max: number) => {
    return min >= 0 && max <= 360 && min < max;
  };

  const overlapsWithExisting = (
    min: number,
    max: number,
    excludeId?: string
  ) => {
    return prizes.some(
      (p) =>
        p._id !== excludeId &&
        ((min >= p.angleMin && min < p.angleMax) ||
          (max > p.angleMin && max <= p.angleMax) ||
          (min <= p.angleMin && max >= p.angleMax))
    );
  };

  const addPrize = async () => {
    if (!newPrize.name.trim()) {
      alert("Informe o nome do prêmio!");
      return;
    }

    if (!validateAngles(newPrize.angleMin, newPrize.angleMax)) {
      alert(
        "Os ângulos devem estar entre 0 e 360, e o mínimo deve ser menor que o máximo."
      );
      return;
    }

    if (overlapsWithExisting(newPrize.angleMin, newPrize.angleMax)) {
      alert("Faixa de ângulo sobreposta com outro prêmio.");
      return;
    }

    const res = await fetch("/api/add-prize", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newPrize),
    });

    const data = await res.json();
    if (data.success) {
      setMessageType("success");
      setMessage(data.message);
      setNewPrize({ name: "", quantity: 1, angleMin: 0, angleMax: 0 });
      fetchPrizes();
    } else {
      setMessageType("error");
      setMessage(data.message || "Erro ao adicionar prêmio.");
    }
  };

  const updatePrize = async (id: string) => {
    const { angleMin, angleMax } = editPrize;

    if (
      angleMin !== undefined &&
      angleMax !== undefined &&
      !validateAngles(angleMin, angleMax)
    ) {
      alert(
        "Os ângulos devem estar entre 0 e 360, e o mínimo deve ser menor que o máximo."
      );
      return;
    }

    if (
      angleMin !== undefined &&
      angleMax !== undefined &&
      overlapsWithExisting(angleMin, angleMax, id)
    ) {
      alert("Faixa de ângulo sobreposta com outro prêmio.");
      return;
    }

    const res = await fetch(`/api/prizes/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(editPrize),
    });

    const data = await res.json();
    if (data.success) {
      setMessageType("success");
      setMessage("Prêmio atualizado!");
      setEditingPrize(null);
      fetchPrizes();
    } else {
      setMessageType("error");
      setMessage(data.message || "Erro ao atualizar prêmio.");
    }
  };

  const deletePrize = async (id: string) => {
    if (!confirm("Deseja realmente excluir este prêmio?")) return;
    const res = await fetch(`/api/prizes/${id}`, { method: "DELETE" });
    const data = await res.json();

    if (data.success) {
      setMessageType("success");
      setMessage("Prêmio removido!");
      fetchPrizes();
    } else {
      setMessageType("error");
      setMessage(data.message || "Erro ao remover prêmio.");
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
    <div className="flex flex-col items-center justify-center min-h-screen text-gray-900 p-6 w-full bg-gray-100">
      <h1 className="text-3xl font-bold my-6 text-black">
        Painel de Administração
      </h1>

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
        <table className="border-collapse border border-gray-400 bg-white shadow-lg min-w-[850px]">
          <thead>
            <tr className="bg-gray-200">
              <th className="border border-gray-400 px-4 py-2">Prêmio</th>
              <th className="border border-gray-400 px-4 py-2">Qtd</th>
              <th className="border border-gray-400 px-4 py-2">Âng. Mín</th>
              <th className="border border-gray-400 px-4 py-2">Âng. Máx</th>
              <th className="border border-gray-400 px-4 py-2">Ações</th>
            </tr>
          </thead>
          <tbody>
            {prizes.map((p) => {
              const invalidAngles =
                editingPrize === p._id &&
                editPrize.angleMin !== undefined &&
                editPrize.angleMax !== undefined &&
                !validateAngles(editPrize.angleMin, editPrize.angleMax);

              const overlappingAngles =
                editingPrize === p._id &&
                editPrize.angleMin !== undefined &&
                editPrize.angleMax !== undefined &&
                overlapsWithExisting(
                  editPrize.angleMin,
                  editPrize.angleMax,
                  p._id
                );

              return (
                <tr key={p._id}>
                  <td className="border border-gray-400 px-4 py-2">
                    {editingPrize === p._id ? (
                      <input
                        type="text"
                        value={editPrize.name || ""}
                        onChange={(e) =>
                          setEditPrize((prev) => ({
                            ...prev,
                            name: e.target.value,
                          }))
                        }
                        className="border px-2 py-1 w-full"
                      />
                    ) : (
                      <span className="font-semibold">{p.name}</span>
                    )}
                  </td>
                  <td className="border border-gray-400 px-4 py-2 text-center">
                    {editingPrize === p._id ? (
                      <input
                        type="number"
                        value={editPrize.quantity ?? p.quantity}
                        onChange={(e) =>
                          setEditPrize((prev) => ({
                            ...prev,
                            quantity: Number(e.target.value),
                          }))
                        }
                        className="border px-2 py-1 w-20 text-center"
                      />
                    ) : (
                      p.quantity
                    )}
                  </td>
                  <td className="border border-gray-400 px-4 py-2 text-center">
                    {editingPrize === p._id ? (
                      <input
                        type="number"
                        value={editPrize.angleMin ?? p.angleMin}
                        onChange={(e) =>
                          setEditPrize((prev) => ({
                            ...prev,
                            angleMin: Number(e.target.value),
                          }))
                        }
                        className={`border px-2 py-1 w-20 text-center ${
                          invalidAngles || overlappingAngles
                            ? "border-red-500 bg-red-100"
                            : ""
                        }`}
                      />
                    ) : (
                      p.angleMin
                    )}
                  </td>
                  <td className="border border-gray-400 px-4 py-2 text-center">
                    {editingPrize === p._id ? (
                      <input
                        type="number"
                        value={editPrize.angleMax ?? p.angleMax}
                        onChange={(e) =>
                          setEditPrize((prev) => ({
                            ...prev,
                            angleMax: Number(e.target.value),
                          }))
                        }
                        className={`border px-2 py-1 w-20 text-center ${
                          invalidAngles || overlappingAngles
                            ? "border-red-500 bg-red-100"
                            : ""
                        }`}
                      />
                    ) : (
                      p.angleMax
                    )}
                  </td>
                  <td className="border border-gray-400 px-4 py-2 text-center">
                    {editingPrize === p._id ? (
                      <div className="flex gap-2 justify-center">
                        <button
                          onClick={() => updatePrize(p._id)}
                          disabled={invalidAngles || overlappingAngles}
                          className={`px-3 py-1 rounded text-white transition ${
                            invalidAngles || overlappingAngles
                              ? "bg-gray-400 cursor-not-allowed"
                              : "bg-green-600 hover:bg-green-800"
                          }`}
                        >
                          Salvar
                        </button>
                        <button
                          onClick={() => setEditingPrize(null)}
                          className="bg-gray-400 text-white px-3 py-1 rounded hover:bg-gray-600 transition"
                        >
                          Cancelar
                        </button>
                      </div>
                    ) : (
                      <div className="flex gap-2 justify-center">
                        <button
                          onClick={() => {
                            setEditingPrize(p._id);
                            setEditPrize(p);
                          }}
                          className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-700 transition"
                        >
                          Editar
                        </button>
                        <button
                          onClick={() => deletePrize(p._id)}
                          className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-800 transition"
                        >
                          Excluir
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}

      {/* BOTÕES */}
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
          Limpar Tudo
        </button>
      </div>

      {/* NOVO PRÊMIO */}
      <div className="mt-10 w-full max-w-md bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-bold mb-4">Adicionar Novo Prêmio</h2>
        <input
          type="text"
          placeholder="Nome do prêmio"
          value={newPrize.name}
          onChange={(e) => setNewPrize({ ...newPrize, name: e.target.value })}
          className="border border-gray-400 rounded px-3 py-2 w-full mb-4"
        />
        <input
          type="number"
          placeholder="Quantidade"
          value={newPrize.quantity}
          onChange={(e) =>
            setNewPrize({ ...newPrize, quantity: Number(e.target.value) })
          }
          className="border border-gray-400 rounded px-3 py-2 w-full mb-4"
        />
        <div className="flex gap-4">
          <input
            type="number"
            placeholder="Ângulo Mínimo"
            value={newPrize.angleMin}
            onChange={(e) =>
              setNewPrize({ ...newPrize, angleMin: Number(e.target.value) })
            }
            className={`border border-gray-400 rounded px-3 py-2 w-full ${
              !validateAngles(newPrize.angleMin, newPrize.angleMax) ||
              overlapsWithExisting(newPrize.angleMin, newPrize.angleMax)
                ? "border-red-500 bg-red-100"
                : ""
            }`}
          />
          <input
            type="number"
            placeholder="Ângulo Máximo"
            value={newPrize.angleMax}
            onChange={(e) =>
              setNewPrize({ ...newPrize, angleMax: Number(e.target.value) })
            }
            className={`border border-gray-400 rounded px-3 py-2 w-full ${
              !validateAngles(newPrize.angleMin, newPrize.angleMax) ||
              overlapsWithExisting(newPrize.angleMin, newPrize.angleMax)
                ? "border-red-500 bg-red-100"
                : ""
            }`}
          />
        </div>
        {!validateAngles(newPrize.angleMin, newPrize.angleMax) ? (
          <p className="text-red-600 text-sm mt-2">
            ⚠️ Os ângulos devem estar entre 0 e 360 e o mínimo menor que o
            máximo.
          </p>
        ) : overlapsWithExisting(newPrize.angleMin, newPrize.angleMax) ? (
          <p className="text-red-600 text-sm mt-2">
            ⚠️ Faixa de ângulo sobreposta com outro prêmio existente.
          </p>
        ) : null}
        <button
          onClick={addPrize}
          disabled={
            !validateAngles(newPrize.angleMin, newPrize.angleMax) ||
            overlapsWithExisting(newPrize.angleMin, newPrize.angleMax)
          }
          className={`w-full text-white px-6 py-2 mt-4 rounded-lg transition ${
            !validateAngles(newPrize.angleMin, newPrize.angleMax) ||
            overlapsWithExisting(newPrize.angleMin, newPrize.angleMax)
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-green-600 hover:bg-green-800"
          }`}
        >
          Adicionar
        </button>
      </div>
    </div>
  );
}
