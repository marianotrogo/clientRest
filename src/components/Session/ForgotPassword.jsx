import { useState } from 'react';
import {api} from '../../api';


export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [resetToken, setResetToken] = useState('');

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post('/auth/forgot-password', { email });
      setMessage(res.data.message);
      setResetToken(res.data.resetToken); // 👈 en local mostramos el token
    } catch (err) {
      setMessage(err.response?.data?.message || 'Error');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <form onSubmit={onSubmit} className="bg-white p-6 rounded-2xl shadow w-full max-w-sm space-y-3">
        <h1 className="text-xl font-semibold">Recuperar contraseña</h1>
        <input
          className="border rounded p-2 w-full"
          placeholder="Tu email"
          value={email}
          onChange={e => setEmail(e.target.value)}
        />
        <button className="w-full bg-black text-white rounded p-2">
          Enviar enlace
        </button>
        {message && <p className="text-sm">{message}</p>}
        {resetToken && (
          <div className="mt-2 text-xs break-all">
            <p><strong>Token:</strong> {resetToken}</p>
          </div>
        )}
      </form>
    </div>
  );
}
