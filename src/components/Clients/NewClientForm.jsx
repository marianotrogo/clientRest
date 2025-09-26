import { useState } from "react"
import { Button } from "../../components/ui/button"
import { Input } from "../../components/ui/input"
import { api } from "../../api"

export default function NewClientForm({ onClientCreated }) {
  const [name, setName] = useState("")
  const [dni, setDni] = useState("")
  const [email, setEmail] = useState("")
  const [phone, setPhone] = useState("")
  const [credit, setCredit] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const data = {
        name,
        dni,
        email,
        phone,
        credit,   // solo true/false
      }

      const res = await api.post("/clients", data)
      alert("Cliente creado correctamente")
      onClientCreated && onClientCreated(res.data)

      // Limpiar formulario
      setName("")
      setDni("")
      setEmail("")
      setPhone("")
      setCredit(false)
    } catch (err) {
      console.error(err)
      alert("Error al crear cliente")
    }
  }

  return (
    <form 
      onSubmit={handleSubmit} 
      className="space-y-4 max-w-md mx-auto p-4 border rounded shadow"
    >
      <div>
        <label className="block font-medium mb-1">Nombre</label>
        <Input
          placeholder="Nombre completo"
          value={name}
          onChange={e => setName(e.target.value)}
          required
          className="text-sm"
        />
      </div>

      <div>
        <label className="block font-medium mb-1">DNI</label>
        <Input
          placeholder="DNI"
          value={dni}
          onChange={e => setDni(e.target.value)}
          className="text-sm"
        />
      </div>

      <div>
        <label className="block font-medium mb-1">Email</label>
        <Input
          placeholder="Correo electrónico"
          value={email}
          onChange={e => setEmail(e.target.value)}
          type="email"
          className="text-sm"
        />
      </div>

      <div>
        <label className="block font-medium mb-1">Teléfono</label>
        <Input
          placeholder="Teléfono"
          value={phone}
          onChange={e => setPhone(e.target.value)}
          className="text-sm"
        />
      </div>

      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          id="credit"
          checked={credit}
          onChange={e => setCredit(e.target.checked)}
          className="w-4 h-4"
        />
        <label htmlFor="credit" className="font-medium">
          Habilitar cuenta corriente
        </label>
      </div>

      <Button type="submit">Crear Cliente</Button>
    </form>
  )
}
