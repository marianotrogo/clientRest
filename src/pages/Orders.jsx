import { useState, useMemo, useEffect } from "react"
import { Button } from "../components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card.jsx"
import { Input } from "../components/ui/input"
import Textarea from "../components/ui/textarea"
import { Badge } from "../components/ui/badge"
import { Separator } from "../components/ui/separator.jsx"
import { Search, Plus, Minus, Trash2, User, Percent, DollarSign } from "lucide-react"
import { api } from "../api"
import Ticket from "../components/Print/Ticket.jsx"
import ReactDOM from 'react-dom/client'

export default function Orders() {
  const [products, setProducts] = useState([])
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [cart, setCart] = useState([])
  const [customerSearch, setCustomerSearch] = useState("")
  const [customerAddress, setCustomerAddress] = useState("")
  const [discount, setDiscount] = useState(null)
  const [discountInput, setDiscountInput] = useState("")
  const [ticketData, setTicketData] = useState(null)
  const [customerSuggestions, setCustomerSuggestions] = useState([])
  const [selectedCustomerId, setSelectedCustomerId] = useState(null)
  const [categories, setCategories] = useState([])

  useEffect(() => {
    api.get("/categories")
      .then(res => setCategories(Array.isArray(res.data) ? res.data : []))
      .catch(() => setCategories([]))
  }, [])

  // Traer productos desde API
  useEffect(() => {
    api.get("/products")
      .then(res => setProducts(Array.isArray(res.data) ? res.data : []))
      .catch(() => setProducts([]))
  }, [])

  useEffect(() => {
    if (!customerSearch) return setCustomerSuggestions([])
    const delayDebounce = setTimeout(async () => {
      try {
        const res = await api.get(`/clients/search?query=${customerSearch}`)
        setCustomerSuggestions(res.data)
      } catch (err) {
        console.error(err)
        setCustomerSuggestions([])
      }
    }, 300) // pequeño debounce

    return () => clearTimeout(delayDebounce)
  }, [customerSearch])

  // Al seleccionar cliente
  const handleSelectCustomer = (client) => {
    setCustomerSearch(client.name)
    setCustomerAddress(client.address || "")
    setSelectedCustomerId(client._id)
    setCustomerSuggestions([])
  }

  // Filtrar productos
  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const matchesSearch =
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (p.description && p.description.toLowerCase().includes(searchTerm.toLowerCase()))
      // 👇 reemplazá tu matchesCategory por este
      const matchesCategory =
        selectedCategory === "all" ||
        (p.category && (p.category._id === selectedCategory || p.category === selectedCategory))

      return matchesSearch && matchesCategory
    })
  }, [searchTerm, selectedCategory, products])

  // Carrito
  const addToCart = (product) => {
    setCart(prev => {
      const exist = prev.find(item => item._id === product._id)
      if (exist) {
        return prev.map(item =>
          item._id === product._id ? { ...item, quantity: item.quantity + 1 } : item
        )
      }
      return [...prev, { _id: product._id, name: product.name, price: product.price, quantity: 1 }]
    })
  }

  const updateQuantity = (id, qty) => {
    if (qty <= 0) return removeFromCart(id)
    setCart(prev => prev.map(item => item._id === id ? { ...item, quantity: qty } : item))
  }

  const removeFromCart = (id) => setCart(prev => prev.filter(item => item._id !== id))

  // Totales
  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const discountAmount = discount
    ? discount.type === "percentage"
      ? subtotal * (discount.value / 100)
      : discount.value
    : 0
  const total = subtotal - discountAmount

  // Descuentos
  const applyDiscount = (type) => {
    const value = parseFloat(discountInput)
    if (isNaN(value) || value <= 0) return
    setDiscount({
      type,
      value,
      description: type === "percentage" ? `${value}% descuento` : `$${value} descuento`,
    })
    setDiscountInput("")
  }
  const clearDiscount = () => setDiscount(null)

  // Preparar orden
  // Preparar orden e imprimir directo
  const handlePrepareOrder = async () => {
    if (cart.length === 0) return alert("El Carrito está vacío");

    try {
      const items = cart.map(item => ({
        productId: item._id,
        qty: item.quantity
      }));

      const discountAmount = discount
        ? discount.type === "percentage"
          ? subtotal * (discount.value / 100)
          : discount.value
        : 0;

      const body = {
        items,
        table: null,
        customerId: selectedCustomerId || null,
        customerName: customerSearch || "Consumidor Final",
        address: customerAddress || "",
        discount: discountAmount,
        surcharge: 0
      };

      const { data } = await api.post("/orders", body);

      const ticketInfo = {
        items: cart.map(item => ({
          name: item.name,
          price: item.price,
          qty: item.quantity,
          total: item.price * item.quantity
        })),
        customerName: customerSearch || "Consumidor Final",
        address: customerAddress || "",
        subtotal,
        discount: discountAmount,
        surcharge: 0,
        total,
        orderNumber: data.number,
        paymentMethod: data.paymentMethod || "EFECTIVO"
      };

      // 👉 Guardamos los datos para que Ticket los imprima automáticamente
      setTicketData(ticketInfo);

      // Refrescar productos
      const res = await api.get("/products");
      setProducts(Array.isArray(res.data) ? res.data : []);

      // Limpiar carrito y campos
      setCart([]);
      setDiscount(null);
      setCustomerSearch("");
      setCustomerAddress("");

    } catch (err) {
      console.error(err);
      alert("Error al preparar el pedido");
    }
  };


  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-7xl mx-auto">
        <header className="mb-6">
          <h1 className="text-3xl font-sans font-black text-foreground">Sistema POS Restaurante</h1>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-[calc(100vh-120px)]">
          {/* Menú de productos */}
          <div className="lg:col-span-4 space-y-4">
            <Card className="h-full">
              <CardHeader className="pb-4">
                <CardTitle className="font-sans font-black">Menú de Productos</CardTitle>

                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                  <Input
                    placeholder="Buscar productos..."
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                    className="pl-10 text-base"
                  />
                </div>

                <div className="flex flex-wrap gap-2">
                  <Button
                    variant={selectedCategory === "all" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedCategory("all")}
                  >
                    Todos
                  </Button>
                  {categories.map(cat => (
                    <Button
                      key={cat._id}
                      variant={selectedCategory === cat._id ? "default" : "outline"}
                      size="sm"
                      onClick={() => setSelectedCategory(cat._id)}
                    >
                      {cat.name}
                    </Button>
                  ))}
                </div>
              </CardHeader>

              <CardContent className="overflow-y-auto max-h-[calc(100vh-300px)]">
                <div className="space-y-3">
                  {filteredProducts.map((product, index) => {
                    const outOfStock = product.stock <= 0
                    return (
                      <div
                        key={`${product.id}-${index}`}
                        className={`flex items-center justify-between p-3 border rounded-lg transition-colors ${!outOfStock ? 'hover:bg-muted/50' : 'opacity-50 cursor-not-allowed'
                          }`}
                      >
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-foreground truncate">{product.name}</h3>
                          <p className="text-sm text-muted-foreground line-clamp-2">{product.description}</p>
                          <div className="flex items-center gap-2 mt-1">
                            <Badge variant="secondary" className="text-xs">
                              {categories.find(c => c._id === product.category)?.name}
                            </Badge>
                            <span className="font-bold text-primary">${product.price.toFixed(2)}</span>
                            {outOfStock && (
                              <Badge variant="destructive" className="text-xs">
                                Sin stock
                              </Badge>
                            )}
                          </div>
                        </div>
                        <Button
                          onClick={() => addToCart(product)}
                          size="sm"
                          className="ml-3 font-semibold"
                          disabled={outOfStock}
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                    )
                  })}
                  {filteredProducts.length === 0 && (
                    <p className="text-center text-muted-foreground py-4">No hay productos</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Controles */}
          <div className="lg:col-span-4 space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="font-sans font-black">Controles</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-foreground mb-2 block">Cliente (Opcional)</label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                    <Input
                      placeholder="Buscar cliente..."
                      value={customerSearch}
                      onChange={e => setCustomerSearch(e.target.value)}
                      className="pl-10"
                    />

                    {customerSuggestions.length > 0 && (
                      <ul className="absolute z-50 bg-white border w-full mt-1 max-h-40 overflow-y-auto shadow-md rounded">
                        {customerSuggestions.map(c => (
                          <li
                            key={c._id}
                            className="p-2 hover:bg-gray-100 cursor-pointer"
                            onClick={() => handleSelectCustomer(c)}
                          >
                            {c.name} {c.dni && `- ${c.dni}`}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </div>


                <div>
                  <label className="text-sm font-medium text-foreground mb-2 block">Dirección del Cliente (Opcional)</label>
                  <Textarea
                    placeholder="Escriba la dirección del cliente..."
                    value={customerAddress}
                    onChange={e => setCustomerAddress(e.target.value)}
                    className="w-full"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium text-foreground mb-2 block">Descuentos y Recargos</label>
                  <div className="space-y-2">
                    <div className="flex gap-2">
                      <Input
                        placeholder="Valor"
                        value={discountInput}
                        onChange={e => setDiscountInput(e.target.value)}
                        type="number"
                        step="0.01"
                      />
                      <Button onClick={() => applyDiscount("percentage")} variant="outline" size="sm" className="px-3">
                        <Percent className="h-4 w-4" />
                      </Button>
                      <Button onClick={() => applyDiscount("fixed")} variant="outline" size="sm" className="px-3">
                        <DollarSign className="h-4 w-4" />
                      </Button>
                    </div>
                    {discount && (
                      <div className="flex items-center justify-between p-2 bg-muted rounded">
                        <span className="text-sm">{discount.description}</span>
                        <Button onClick={clearDiscount} size="sm" variant="outline" className="h-6 w-6 flex items-center justify-center text-red-600 hover:bg-gray200 transition-colores rounded-full">
                          X
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Resumen */}
          <div className="lg:col-span-4">
            <Card className="h-full flex flex-col">
              <CardHeader className="pb-4">
                <CardTitle className="font-sans font-black">Resumen del Ticket</CardTitle>
              </CardHeader>

              <CardContent className="flex-1 flex flex-col">
                <div className="flex-1 overflow-y-auto max-h-[calc(100vh-400px)] mb-4">
                  {cart.length === 0 ? (
                    <div className="text-center text-muted-foreground py-8">
                      <p>No hay productos seleccionados</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {cart.map((item, index) => (
                        <div key={`${item._id}-${index}`} className="flex items-center justify-between p-3 border rounded-lg">
                          <div className="flex-1 min-w-0">
                            <h4 className="font-medium text-foreground truncate">{item.name}</h4>
                            <p className="text-sm text-muted-foreground">${item.price.toFixed(2)} c/u</p>
                          </div>
                          <div className="flex items-center gap-2 ml-3">
                            <Button onClick={() => updateQuantity(item._id, item.quantity - 1)} variant="outline" size="sm" className="h-8 w-8 p-0">
                              <Minus className="h-3 w-3" />
                            </Button>
                            <span className="w-8 text-center font-medium">{item.quantity}</span>
                            <Button onClick={() => updateQuantity(item._id, item.quantity + 1)} variant="outline" size="sm" className="h-8 w-8 p-0">
                              <Plus className="h-3 w-3" />
                            </Button>
                            <Button onClick={() => removeFromCart(item._id)} variant="destructive" size="sm" className="h-8 w-8 p-0 ml-2">
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="space-y-3 pt-4 border-t">
                  <div className="flex justify-between text-base">
                    <span>Subtotal:</span>
                    <span className="font-medium">${subtotal.toFixed(2)}</span>
                  </div>

                  {discount && (
                    <div className="flex justify-between text-base text-green-600">
                      <span>{discount.description}:</span>
                      <span>-${discountAmount.toFixed(2)}</span>
                    </div>
                  )}

                  <Separator />

                  <div className="flex justify-between text-xl font-bold">
                    <span>Total:</span>
                    <span className="text-primary">${total.toFixed(2)}</span>
                  </div>

                  <Button
                    onClick={handlePrepareOrder}
                    disabled={cart.length === 0}
                    className="w-full h-12 text-lg font-serif font-black mt-4"
                    size="lg"
                  >
                    Preparar
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {ticketData && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-start pt-20 z-50">
          <Ticket
            orderData={ticketData}          // 👉 Usamos el estado correcto
            onClose={() => setTicketData(null)} // 👉 Cerramos limpiando ticketData
            autoPrint={true}
          />
        </div>
      )}
    </div>
  )
}
