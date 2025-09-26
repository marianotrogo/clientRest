import React, { useRef } from "react";

const Ticket = ({ orderData, onClose }) => {
  const printRef = useRef();

  const handlePrint = () => {
    const printContent = printRef.current.innerHTML;
    const printWindow = window.open("", "", "width=300,height=400");
    printWindow.document.write(`
      <html>
        <head>
          <title>Ticket</title>
          <style>
            @media print {
              body {
                margin: 0;
                font-family: monospace;
                font-size: 8px;
                width: 58mm;          /* ✅ ancho ticket térmico */
              }
              .ticket {
                width: 100%;
                text-align: center;
              }
              .line {
                border-top: 1px dashed #000;
                margin: 4px 0;
              }
              .ticket table {
                width: 100%;
                border-collapse: collapse;
                margin-top: 4px;
                font-size: 8px;
              }
              .ticket td {
                padding: 1px 0;
              }
              .totals {
                margin-top: 6px;
                text-align: right;
              }
              .totals h3 {
                margin: 2px 0;
                font-size: 12px;
              }
            }
          </style>
        </head>
        <body onload="window.print(); window.close();"> 
          <div class="ticket">${printContent}</div>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  if (!orderData) return null;

  return (
    <div className="p-4 border rounded bg-white shadow-md">
      <div ref={printRef}>
        <h2 style={{ margin: "0", fontWeight: "bold", fontSize: "12px" }}>PIPI CUCU</h2>
        <p style={{ margin: "0", fontSize: "9px" }}>Rivadavia 156 -Lules </p>
        <p style={{ margin: "0 0 6px", fontSize: "8px" }}>3872148812</p>
        <div className="line"></div>

        <p style={{ textAlign: "left", margin: "2px 0", fontSize: "10px" }}>
          Cliente: {orderData.customerName || "Consumidor Final"} <br />
          Dirección: {orderData.address || "-"}
        </p>
        <div className="line"></div>

        <table>
          <tbody>
            {orderData.items.map((item, i) => (
              <tr key={i}>
                <td style={{ textAlign: "left", fontSize: "10px" }}>{item.name}</td>
                <td style={{ textAlign: "center", fontSize: "10px" }}>
                  {item.qty} x ${item.price}
                </td>
                <td style={{ textAlign: "right", fontSize: "10px" }}>
                  ${(item.qty * item.price).toFixed(2)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="line"></div>

        <div className="totals">
          <h3 style={{ textAlign: "right" }}>
            Total: ${orderData.total?.toFixed(2)}
          </h3>
          <p style={{ fontSize: "8px" }}>Pago: {orderData.paymentMethod}</p>
        </div>

        <div className="line"></div>

        <p style={{ textAlign: "center", marginTop: "6px", fontSize: "8px" }}>
          ¡Gracias por su compra!
        </p>
      </div>

      <div className="flex justify-end gap-2 mt-4">
        <button
          onClick={handlePrint}
          className="px-3 py-1 bg-blue-500 text-white rounded"
        >
          Imprimir
        </button>
        <button
          onClick={onClose}
          className="px-3 py-1 bg-gray-500 text-white rounded"
        >
          Cerrar
        </button>
      </div>
    </div>
  );
};

export default Ticket;
