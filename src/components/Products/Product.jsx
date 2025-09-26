"use client"

import { useEffect, useState } from "react"
import { api } from '../../api'
import { Card } from "../ui/card"
import { Button } from "../ui/button"
import { Separator } from "../ui/separator"
import ProductForm from "./ProductForm"
import ProductList from "./ProductList"
import CategoryManager from "../Categories/CategoryManager"

export default function ProductManager() {
  const [products, setProducts] = useState([])
  const [categories, setCategories] = useState([])
  const [currentView, setCurrentView] = useState("list")
  const [editingProduct, setEditingProduct] = useState(null)
  const [message, setMessage] = useState('')
  const [priceModalProduct, setPriceModalProduct] = useState(null)
  const [newPrice, setNewPrice] = useState("")
  const [stockModalProduct, setStockModalProduct] = useState(null)
  const [newStock, setNewStock] = useState("")

  // --- API ---
  const fetchProducts = async () => {
    try {
      const { data } = await api.get("/products")
      setProducts(Array.isArray(data) ? data : [])
    } catch (err) {
      console.error(err)
      alert("Error al cargar productos")
    }
  }

  const fetchCategories = async () => {
    try {
      const { data } = await api.get("/categories")
      setCategories(Array.isArray(data) ? data : [])
    } catch (err) {
      console.error(err)
      alert("Error al cargar categorías")
    }
  }

  useEffect(() => {
    fetchProducts()
    fetchCategories()
  }, [])

  const handleCreate = async (formData, clearForm) => {
    try {
      await api.post("/products", formData)
      await fetchProducts()
      setMessage('✅ Producto guardado con éxito')
      if (clearForm) clearForm()
    } catch (err) {
      console.error(err)
      alert("Error al crear producto")
    }
  }

  const handleUpdate = async (id, formData) => {
    try {
      await api.put(`/products/${id}`, formData)
      await fetchProducts()
      setCurrentView("list")
      setEditingProduct(null)
    } catch (err) {
      console.error(err)
      alert("Error al actualizar producto")
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm("¿Seguro que quieres eliminar este producto?")) return
    try {
      await api.delete(`/products/${id}`)
      await fetchProducts()
      setCurrentView("list")
      setEditingProduct(null)
    } catch (err) {
      console.error(err)
      alert("Error al eliminar producto")
    }
  }

  // --- Precio ---
  const openPriceModal = (product) => {
    setPriceModalProduct(product)
    setNewPrice(product.price)
  }
  const handlePriceUpdate = async () => {
    if (!priceModalProduct) return
    try {
      await api.put(`/products/${priceModalProduct._id}`, { price: newPrice })
      await fetchProducts()
      setPriceModalProduct(null)
      setNewPrice("")
    } catch (err) {
      console.error(err)
      alert("Error al actualizar precio")
    }
  }

  // --- Stock ---
  const openStockModal = (product) => {
    setStockModalProduct(product)
    setNewStock("")
  }
  const handleStockUpdate = async () => {
    if (!stockModalProduct) return
    const addedStock = Number(newStock)
    if (isNaN(addedStock)) return alert("Ingrese un número válido")

    try {
      await api.put(`/products/${stockModalProduct._id}`, {
        stock: stockModalProduct.stock + addedStock
      })
      await fetchProducts()
      setStockModalProduct(null)
      setNewStock("")
    } catch (err) {
      console.error(err)
      alert("Error al actualizar stock")
    }
  }

  // --- Mensaje temporal ---
  useEffect(() => {
    if (!message) return
    const timer = setTimeout(() => setMessage(''), 3000)
    return () => clearTimeout(timer)
  }, [message])

  return (
    <Card className="p-6 max-w-5xl mx-auto mt-8 bg-white shadow-lg rounded-lg">
      {/* NAV */}
      <div className="flex gap-3 mb-6 justify-center">
        <Button className="px-4 py-2" onClick={() => { setCurrentView("create"); setEditingProduct(null) }}>Nuevo</Button>
        <Button className="px-4 py-2" onClick={() => setCurrentView("list")}>Lista</Button>
        <Button className="px-4 py-2" onClick={() => setCurrentView("categories")}>Categorías</Button>
      </div>

      

      {/* FORMULARIO */}
      {(currentView === "create" || currentView === "edit" || currentView === "price") && (
        <ProductForm
          mode={currentView}
          product={editingProduct}
          categories={categories}
          onCreate={(formData, clearForm) => handleCreate(formData, clearForm)}
          onUpdate={handleUpdate}
          onDelete={handleDelete}
          onCancel={() => { setCurrentView("list"); setEditingProduct(null) }}
        />
      )}

      {message && <p className="text-green-600 font-medium mb-4 text-center">{message}</p>}

      {/* LISTADO */}
      {currentView === "list" && (
        <div className="overflow-x-auto">
          <ProductList
            products={products}
            onEdit={(p) => { setEditingProduct(p); setCurrentView("edit") }}
            onEditPrice={openPriceModal}
            onEditStock={openStockModal}
            onDelete={(p) => handleDelete(p._id)}
          />
        </div>
      )}

      {/* CATEGORÍAS */}
      {currentView === "categories" && (
        <CategoryManager categories={categories} onChange={fetchCategories} />
      )}

      {/* MODAL PRECIO */}
      {priceModalProduct && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-xl shadow-2xl w-96 max-w-full">
            <h2 className="text-xl font-semibold mb-4">Actualizar Precio: {priceModalProduct.code}</h2>
            <input
              type="number"
              value={newPrice}
              onChange={(e) => setNewPrice(e.target.value)}
              className="border p-3 w-full mb-4 rounded-md"
            />
            <div className="flex gap-3 justify-end">
              <Button onClick={handlePriceUpdate}>Guardar</Button>
              <Button variant="outline" onClick={() => setPriceModalProduct(null)}>Cancelar</Button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL STOCK */}
      {stockModalProduct && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-xl shadow-2xl w-96 max-w-full">
            <h2 className="text-xl font-semibold mb-4">Cargar Stock: {stockModalProduct.code}</h2>
            <input
              type="number"
              value={newStock}
              onChange={(e) => setNewStock(e.target.value)}
              placeholder={`Stock actual: ${stockModalProduct.stock}, ingrese cantidad a sumar`}
              className="border p-3 w-full mb-4 rounded-md"
            />
            <div className="flex gap-3 justify-end">
              <Button onClick={handleStockUpdate}>Guardar</Button>
              <Button variant="outline" onClick={() => setStockModalProduct(null)}>Cancelar</Button>
            </div>
          </div>
        </div>
      )}
    </Card>
  )
}
