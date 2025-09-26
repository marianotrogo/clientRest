import { Button } from "../ui/button"

export default function ProductList({ products, onEdit, onEditPrice, onEditStock, onDelete }) {
  if (!products || products.length === 0) {
    return <p className="text-center text-gray-500">No hay productos aún</p>
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full table-auto border">
        <thead className="bg-gray-100">
          <tr>
            <th className="border px-2 py-1">Código</th>
            <th className="border px-2 py-1">Nombre</th>
            <th className="border px-2 py-1">Categoría</th>
            <th className="border px-2 py-1">Stock</th>
            <th className="border px-2 py-1">Precio</th>
            <th className="border px-2 py-1">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {products.map((p) => (
            <tr key={p._id} className="hover:bg-gray-50">
              <td className="border px-2 py-1">{p.code}</td>
              <td className="border px-2 py-1">{p.name}</td>
              <td className="border px-2 py-1">{p.category?.name}</td>
              <td className="border px-2 py-1">{p.stock}</td>
              <td className="border px-2 py-1">{p.price}</td>
              <td className="border px-2 py-1 flex gap-1">
                <Button size="sm" onClick={() => onEdit(p)}>Editar</Button>
                <Button size="sm" onClick={() => onEditPrice(p)}>Actualizar Precio</Button>
                <Button size="sm" onClick={() => onEditStock(p)}>Actualizar Stock</Button>
                <Button size="sm" variant="destructive" onClick={() => onDelete(p._id)}>Eliminar</Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
