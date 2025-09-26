import { useState, useEffect } from "react";
import { api } from '../../api';
import { Card } from "../ui/card";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Separator } from "../ui/separator";

export default function CategoryManager() {
  const [categories, setCategories] = useState([]);
  const [name, setName] = useState("");
  const [editingId, setEditingId] = useState(null);

  // Trae categorías
  const fetchCategories = async () => {
    try {
      const { data } = await api.get("/categories");
      setCategories(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
      alert("Error al cargar categorías");
    }
  };

  // Crear o actualizar
  const saveCategory = async () => {
    if (!name) return alert("Ingrese un nombre de categoría");

    try {
      if (editingId) {
        await api.put(`/categories/${editingId}`, { name });
      } else {
        await api.post("/categories", { name });
      }
      setName("");
      setEditingId(null);
      fetchCategories();
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Error al guardar categoría");
    }
  };

  const editCategory = (cat) => {
    setName(cat.name);
    setEditingId(cat._id);
  };

  const deleteCategory = async (id) => {
    if (!window.confirm("¿Seguro que quieres eliminar esta categoría?")) return;
    try {
      await api.delete(`/categories/${id}`);
      fetchCategories();
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Error al eliminar categoría");
    }
  };

  useEffect(() => { fetchCategories(); }, []);

  return (
    <Card className="p-4 max-w-md mx-auto mt-6">
      <h2 className="text-xl font-bold mb-4">Categorías</h2>

      <div className="flex gap-2 mb-4">
        <Input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Nombre de categoría"
        />
        <Button onClick={saveCategory}>
          {editingId ? "Actualizar" : "Crear"}
        </Button>
        {editingId && (
          <Button variant="outline" onClick={() => { setEditingId(null); setName(""); }}>
            Cancelar
          </Button>
        )}
      </div>

      <Separator className="mb-4" />

      <div className="space-y-2">
        {categories.length === 0 && <p className="text-gray-500 text-center">No hay categorías</p>}
        {categories.map(cat => (
          <div key={cat._id} className="flex justify-between items-center border p-2 rounded">
            <span>{cat.name}</span>
            <div className="flex gap-2">
              <Button size="sm" onClick={() => editCategory(cat)}>Editar</Button>
              <Button size="sm" variant="destructive" onClick={() => deleteCategory(cat._id)}>Eliminar</Button>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}
