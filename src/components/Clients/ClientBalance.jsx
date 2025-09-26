import { useState, useEffect } from "react";
import { api } from "../../api";

export default function ClientBalances() {
  const [clients, setClients] = useState([]);
  const [selectedClient, setSelectedClient] = useState(null);
  const [amount, setAmount] = useState("");

  const fetchClients = async () => {
    try {
      const res = await api.get("/clients");
      const creditClients = res.data.filter(c => c.credit);
      setClients(creditClients);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchClients();
  }, []);

  const totalDebt = clients.reduce((sum, c) => sum + Number(c.balance || 0), 0);

  const handlePay = async () => {
    if (!selectedClient || !amount) return;

    const payAmount = Number(amount);
    if (payAmount <= 0 || payAmount > selectedClient.balance) {
      alert("Monto inválido");
      return;
    }

    try {
      // 🔹 Llamada al nuevo endpoint de pago
      await api.patch(`/clients/${selectedClient._id}/pay`, { amount: payAmount });

      alert(`Se descontaron $${payAmount} del saldo de ${selectedClient.name}`);
      setSelectedClient(null);
      setAmount("");
      fetchClients();
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Error al procesar el pago");
    }
  };

  return (
    <div className="p-2 flex justify-center">
      <div className="w-full max-w-md">
        <h2 className="text-base font-bold mb-2">Saldo de Clientes (Cuenta Corriente)</h2>
        <table className="w-full text-s border-collapse">
          <thead>
            <tr className="border-b bg-gray-100">
              <th className="px-1 py-0.5 text-left">Nombre</th>
              <th className="px-1 py-0.5 text-left">DNI</th>
              <th className="px-1 py-0.5 text-right">Saldo</th>
              <th className="px-1 py-0.5">Acción</th>
            </tr>
          </thead>
          <tbody>
            {clients.map(c => (
              <tr key={c._id} className="border-b">
                <td className="px-1 py-0.5">{c.name}</td>
                <td className="px-1 py-0.5">{c.dni}</td>
                <td className="px-1 py-0.5 text-right">{c.balance}</td>
                <td className="px-1 py-0.5">
                  {c.balance > 0 && (
                    <button
                      className="bg-blue-500 text-white px-2 py-0.5 rounded text-xs"
                      onClick={() => setSelectedClient(c)}
                    >
                      Pagar
                    </button>
                  )}
                </td>
              </tr>
            ))}
            <tr className="font-semibold border-t">
              <td className="px-1 py-0.5" colSpan={2}>Total Deudas</td>
              <td className="px-1 py-0.5 text-right">{totalDebt}</td>
              <td></td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Modal de pago más grande */}
      {selectedClient && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded shadow-md w-96">
            <h3 className="text-sm font-bold mb-2">Pagar Cuenta Corriente</h3>
            <p className="mb-1 text-xs">Cliente: {selectedClient.name}</p>
            <p className="mb-2 text-xs">Saldo disponible: ${selectedClient.balance}</p>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="border px-2 py-1 w-full mb-2 text-sm"
              placeholder="Monto a descontar"
              max={selectedClient.balance}
            />
            <div className="flex justify-end gap-2">
              <button
                className="px-2 py-1 bg-gray-300 rounded text-xs"
                onClick={() => { setSelectedClient(null); setAmount("") }}
              >
                Cancelar
              </button>
              <button
                className="px-2 py-1 bg-green-500 text-white rounded text-xs"
                onClick={handlePay}
              >
                Pagar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
