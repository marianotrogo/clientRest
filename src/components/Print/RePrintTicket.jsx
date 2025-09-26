import { useState, useEffect } from 'react';
import { api } from '../../api';

export default function RePrintTickets() {
    const [tickets, setTickets] = useState([]);
    const [date, setDate] = useState('');

    const fetchTickets = async () => {
        try {
            const res = await api.get('/orders/tickets', { params: { from: date, to: date } });
            setTickets(res.data);
        } catch (e) {
            console.error(e);
        }
    };

    useEffect(() => {
        fetchTickets();
    }, []);

    return (
        <div style={{ fontFamily: 'sans-serif', fontSize: '13px', maxWidth: '700px', margin: '0 auto' }}>
            <h2 style={{ marginBottom: '0.75rem' }}>Reimprimir Tickets</h2>

            <div style={{ marginBottom: '0.75rem', display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                <input
                    type="date"
                    value={date}
                    onChange={e => setDate(e.target.value)}
                    style={{ padding: '0.25rem 0.5rem', fontSize: '13px' }}
                />
                <button
                    onClick={fetchTickets}
                    style={{
                        padding: '0.25rem 0.75rem',
                        fontSize: '13px',
                        cursor: 'pointer',
                        background: '#007bff',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px'
                    }}
                >
                    Filtrar
                </button>
            </div>

            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12px' }}>
                <thead>
                    <tr style={{ background: '#f2f2f2' }}>
                        <th style={{ borderBottom: '1px solid #ccc', padding: '6px' }}>Ticket</th>
                        <th style={{ borderBottom: '1px solid #ccc', padding: '6px' }}>Fecha</th>
                        <th style={{ borderBottom: '1px solid #ccc', padding: '6px' }}>Cliente</th>
                        <th style={{ borderBottom: '1px solid #ccc', padding: '6px', textAlign: 'right' }}>Total</th>
                        <th style={{ borderBottom: '1px solid #ccc', padding: '6px' }}>Pago</th>
                        <th style={{ borderBottom: '1px solid #ccc', padding: '6px' }}>Acción</th>
                    </tr>
                </thead>
                <tbody>
                    {(Array.isArray(tickets) ? tickets : []).map((t, i) => (
                        <tr key={t._id} style={{ background: i % 2 === 0 ? '#fff' : '#fafafa' }}>
                            <td style={{ padding: '4px' }}>{t.number}</td>
                            <td style={{ padding: '4px' }}>{new Date(t.createdAt).toLocaleString()}</td>
                            <td style={{ padding: '4px' }}>{t.customerName || '-'}</td>
                            <td style={{ padding: '4px', textAlign: 'right' }}>
                                {t.total.toFixed(2)}
                            </td>
                            <td style={{ padding: '4px' }}>{t.paymentMethod}</td>
                            <td style={{ padding: '4px', textAlign: 'center' }}>
                                <button
                                    onClick={() => window.open(`/api/orders/${t._id}/ticket`, '_blank')}
                                    style={{
                                        padding: '0.2rem 0.5rem',
                                        fontSize: '12px',
                                        cursor: 'pointer',
                                        background: '#28a745',
                                        color: 'white',
                                        border: 'none',
                                        borderRadius: '4px'
                                    }}
                                >
                                    Reimprimir
                                </button>
                            </td>
                        </tr>
                    ))}
                    {(!Array.isArray(tickets) || tickets.length === 0) && (
                        <tr>
                            <td colSpan="6" style={{ padding: '6px', textAlign: 'center', fontStyle: 'italic' }}>
                                No hay tickets
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
}
