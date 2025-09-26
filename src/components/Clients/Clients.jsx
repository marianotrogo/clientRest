import { useState } from "react"
import NewClientForm from "./NewClientForm"
import ClientsList from "./ClientList"
import ClientsBalance from "./ClientBalance"

export default function Clients() {
  const [activeTab, setActiveTab] = useState("new")

  return (
    <div className="p-4">
      {/* Tabs */}
      <div className="flex gap-4 border-b mb-4">
        <button
          onClick={() => setActiveTab("new")}
          className={`pb-2 ${activeTab === "new" ? "border-b-2 border-blue-500 font-semibold" : ""}`}
        >
          Nuevo Cliente
        </button>
        <button
          onClick={() => setActiveTab("list")}
          className={`pb-2 ${activeTab === "list" ? "border-b-2 border-blue-500 font-semibold" : ""}`}
        >
          Lista de Clientes
        </button>
        <button
          onClick={() => setActiveTab("balance")}
          className={`pb-2 ${activeTab === "balance" ? "border-b-2 border-blue-500 font-semibold" : ""}`}
        >
          Saldos
        </button>
      </div>

      {/* Contenido dinámico */}
      <div>
        {activeTab === "new" && <NewClientForm />}
        {activeTab === "list" && <ClientsList />}
        {activeTab === "balance" && <ClientsBalance />}
      </div>
    </div>
  )
}
