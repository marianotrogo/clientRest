import { useState, useEffect } from "react"
import { Button } from "../../components/ui/button"
import { Input } from "../../components/ui/input"
import { api } from "../../api"

export default function ClientList({ onSelectClient }) {
  const [clients, setClients] = useState([])
  const [editClient, setEditClient] = useState(null)

  const fetchClients = async () => {
    try {
      const res = await api.get("/clients")
      setClients(res.data)
    } catch (err) {
      console.error(err)
    }
  }

  useEffect(() => {
    fetchClients()
  }, [])

  const handleDelete = async (id) => {
    if (!confirm("¿Estás seguro de eliminar este cliente?")) return
    try {
      await api.delete(`/clients/${id}`)
      setClients(prev => prev.filter(c => c._id !== id))
    } catch (err) {
      console.error(err)
      alert("Error al eliminar cliente")
    }
  }

  const handleEditSave = async () => {
    try {
      const payload = {
        ...editClient,
        balance: editClient.credit ? Number(editClient.balance) || 0 : 0,
      };

      const res = await api.put(`/clients/${editClient._id}`, payload);

      setClients(prev => prev.map(c => c._id === res.data._id ? res.data : c));
      setEditClient(null);
    } catch (err) {
      console.error(err);
      alert("Error al actualizar cliente");
    }
  };


  return (
    <div className="p-4">
      <table className="w-full text-sm border-collapse">
        <thead>
          <tr className="border-b bg-gray-100">
            <th className="px-2 py-1">Nombre</th>
            <th className="px-2 py-1">DNI</th>
            <th className="px-2 py-1">Email</th>
            <th className="px-2 py-1">Teléfono</th>
            <th className="px-2 py-1">Crédito</th>
            <th className="px-2 py-1">Saldo</th>
            <th className="px-2 py-1">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {clients.map(c => (
            <tr key={c._id} className="border-b">
              <td className="px-2 py-1">{c.name}</td>
              <td className="px-2 py-1">{c.dni}</td>
              <td className="px-2 py-1">{c.email}</td>
              <td className="px-2 py-1">{c.phone}</td>
              <td className="px-2 py-1">{c.credit ? "Sí" : "No"}</td>
              <td className="px-2 py-1">{c.balance}</td>
              <td className="px-2 py-1 flex gap-2">
                <Button size="sm" onClick={() => setEditClient(c)}>Editar</Button>
                <Button size="sm" variant="destructive" onClick={() => handleDelete(c._id)}>Eliminar</Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Modal de edición */}
      {editClient && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded shadow-lg w-96 flex flex-col gap-4">
            <h2 className="text-lg font-bold">Editar Cliente</h2>

            <Input
              value={editClient.name}
              onChange={e => setEditClient({ ...editClient, name: e.target.value })}
              placeholder="Nombre"
              className="text-sm"
            />
            <Input
              value={editClient.dni}
              onChange={e => setEditClient({ ...editClient, dni: e.target.value })}
              placeholder="DNI"
              className="text-sm"
            />
            <Input
              value={editClient.email}
              onChange={e => setEditClient({ ...editClient, email: e.target.value })}
              placeholder="Email"
              className="text-sm"
            />
            <Input
              value={editClient.phone}
              onChange={e => setEditClient({ ...editClient, phone: e.target.value })}
              placeholder="Teléfono"
              className="text-sm"
            />

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={editClient.credit}
                onChange={e => setEditClient({ ...editClient, credit: e.target.checked })}
              />
              <label>Cuenta corriente</label>
            </div>

            {editClient.credit && (
              <Input
                value={editClient.balance}
                onChange={e => setEditClient({ ...editClient, balance: e.target.value })}
                type="number"
                placeholder="Saldo"
                className="text-sm"
              />
            )}

            <div className="flex justify-end gap-2 mt-2">
              <Button onClick={handleEditSave}>Guardar</Button>
              <Button variant="outline" onClick={() => setEditClient(null)}>Cancelar</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
