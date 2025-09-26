import { useEffect, useState } from "react";
import { api } from "../api";
import { Card, CardHeader, CardTitle, CardContent } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";

export default function Reports() {
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [code, setCode] = useState('')
  const [data, setData] = useState({
    totalSales: 0,
    totalOrders: 0,
    payments: {},
    categories: [],
    byDay: [],
    cuentaCorrienteTotal: 0, // total pedidos en cuenta corriente
    cuentaCorrienteCount: 0 // cantidad de órdenes
  });

  const token = localStorage.getItem('token')

  const fetchReports = async (params = {}) => {
    try {
      const res = await api.get("/orders/reports/dashboard", {
        params: { from, to, code, ...params },
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setData({
        totalSales: res.data.totalSales || 0,
        totalOrders: res.data.totalOrders || 0,
        payments: res.data.payments || {},
        categories: res.data.categories || [],
        byDay: res.data.byDay || [],
        cuentaCorrienteTotal: res.data.cuentaCorrienteTotal || 0,
        cuentaCorrienteCount: res.data.cuentaCorrienteCount || 0,
      });
    } catch (e) {
      console.error(e);
      setData({
        totalSales: 0,
        totalOrders: 0,
        payments: {},
        categories: [],
        byDay: [],
        cuentaCorrienteTotal: 0,
        cuentaCorrienteCount: 0,
      });
    }
  };

  useEffect(() => {
    fetchReports();
  }, []);

  const todayStr = () => {
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, "0");
    const dd = String(today.getDate()).padStart(2, "0");
    return `${yyyy}-${mm}-${dd}`;
  };

  const formatPaymentName = (method) => {
    if (method === "PAGO_CUENTA_CORRIENTE") return "Pago de clientes";
    return method.charAt(0) + method.slice(1).toLowerCase();
  };

  return (
    <div className="p-6 space-y-6">
      {/* Filtros */}
      <div className="flex gap-4 items-end">
        <div>
          <label className="text-sm">Desde</label>
          <Input type="date" value={from} onChange={(e) => setFrom(e.target.value)} />
        </div>
        <div>
          <label className="text-sm">Hasta</label>
          <Input type="date" value={to} onChange={(e) => setTo(e.target.value)} />
        </div>
        <div>
          <label className="text-sm">Código</label>
          <Input
            type="password"
            placeholder="Código de seguridad"
            value={code}
            onChange={(e) => setCode(e.target.value)}
          />
        </div>
        <Button onClick={() => {
          if ((from || to) && !code) {
            alert("Debe ingresar el código de seguridad para filtrar por rango de fechas");
            return;
          }

          fetchReports()
          setCode('')
        }

        }>Filtrar</Button>
        <Button
          variant="secondary"
          onClick={() => {
            setFrom("");
            setTo("");
            fetchReports();
          }}
        >
          Limpiar filtro
        </Button>
        <Button
          variant="secondary"
          onClick={() => fetchReports({ date: todayStr() })}
        >
          Corte del día
        </Button>
      </div>

      {/* Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Total vendido */}
        <Card>
          <CardHeader>
            <CardTitle>Total Vendido</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">${data.totalSales}</p>
            <p className="text-sm text-gray-500">{data.totalOrders} órdenes</p>
          </CardContent>
        </Card>

        {/* Subtotales por forma de pago */}
        <Card>
          <CardHeader>
            <CardTitle>Por Forma de Pago</CardTitle>
          </CardHeader>
          <CardContent className="space-y-1">
            {Object.entries(data.payments).length === 0 ? (
              <p className="text-sm text-gray-500">Sin datos</p>
            ) : (
              Object.entries(data.payments).map(([method, total]) => (
                <p key={method}>
                  {formatPaymentName(method)}: ${total}
                </p>
              ))
            )}
          </CardContent>
        </Card>

        {/* Pedidos en cuenta corriente */}
        <Card>
          <CardHeader>
            <CardTitle>Pedidos en Cuenta Corriente</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">${data.cuentaCorrienteTotal}</p>
            <p className="text-sm text-gray-500">{data.cuentaCorrienteCount} órdenes</p>
          </CardContent>
        </Card>

        {/* Categorías más vendidas */}
        <Card>
          <CardHeader>
            <CardTitle>Categorías más vendidas</CardTitle>
          </CardHeader>
          <CardContent>
            {data.categories.length === 0 ? (
              <p className="text-sm text-gray-500">Sin datos</p>
            ) : (
              <ul className="text-sm space-y-1">
                {data.categories.map((c, i) => (
                  <li key={i}>
                    {i + 1}. {c.category} – ${c.total}
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Evolución diaria */}
      <div className="mt-6">
        <Card>
          <CardHeader>
            <CardTitle>Evolución diaria</CardTitle>
          </CardHeader>
          <CardContent>
            {data.byDay.length === 0 ? (
              <p className="text-sm text-gray-500">Sin datos</p>
            ) : (
              <ul className="text-sm space-y-1">
                {data.byDay.map((d, i) => (
                  <li key={i}>
                    {d.date}: ${d.total} ({d.count} órdenes)
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
