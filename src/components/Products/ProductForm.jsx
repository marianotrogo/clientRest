import { useState, useEffect } from "react";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import Select from "../ui/select";
import { api } from "../../api";

export default function ProductForm({ mode, product, onCreate, onUpdate, onDelete, onCancel }) {
  const [categories, setCategories] = useState([]);

  const [form, setForm] = useState({
    code: "",
    name: "",
    price: "",
    category: "",
    stock: 0,
  });

  const fetchCategories = async () => {
    try {
      const { data } = await api.get("/categories");
      setCategories(data);
      if (data.length > 0 && !form.category) {
        setForm((prev) => ({ ...prev, category: data[0]._id }));
      }
    } catch (err) {
      console.error("Error al cargar categorias", err);
      alert("No se pudieron cargar las categorias");
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    if (product) {
      setForm({
        code: product.code || "",
        name: product.name || "",
        price: product.price || "",
        category: product.category || (categories.length > 0 ? categories[0]._id : ""),
        stock: product.stock || 0,
      });
    }
  }, [product, categories]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = () => {
    if (!form.code || !form.name || !form.price) return alert("Complete los campos obligatorios");
    if (mode === "create") {
      onCreate(form, ()=>{
        setForm({
          code: '',
          name: '',
          price: '',
          category: categories.length > 0 ? categories[0]._id: '',
          stock:0,
        })
      })
    }
    if (mode === "edit") onUpdate(product._id, form);
    if (mode === "price") onUpdate(product._id, { price: form.price });
  };

  return (
    <div className="space-y-1 w-1/2 mx-auto">
      <div>
        <label>Código</label>
        <Input name="code" value={form.code} onChange={handleChange} disabled={mode !== "create"} />
      </div>

      {mode !== "price" && (
        <>
          <div>
            <label>Nombre</label>
            <Input name="name" value={form.name} onChange={handleChange} />
          </div>

          <div>
            <label>Categoría</label>
            <Select
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value })}
              options={categories.map((cat) => ({ value: cat._id, label: cat.name }))}
              placeholder="Selecciona una categoría"
            />
          </div>

          <div>
            <label>Stock</label>
            <Input type="number" name="stock" value={form.stock} onChange={handleChange} />
          </div>
        </>
      )}

      <div>
        <label>Precio</label>
        <Input type="number" name="price" value={form.price} onChange={handleChange} />
      </div>

      <div className="flex gap-2 mt-2">
        <Button onClick={handleSubmit}>{mode === "create" ? "Guardar" : "Actualizar"}</Button>
        {(mode === "edit" || mode === "price") && (
          <Button variant="destructive" onClick={() => onDelete(product._id)}>
            Eliminar
          </Button>
        )}
        <Button variant="outline" onClick={onCancel}>
          Cancelar
        </Button>
      </div>
    </div>
  );
}
