import { useState } from 'react';
import { api } from '../../api';

export default function ResetPassword() {
  const [token, setToken] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [message, setMessage] = useState('');

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post('/auth/reset-password', { token, newPassword });
      setMessage(res.data.message);
    } catch (err) {
      setMessage(err.response?.data?.message || 'Error');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <form onSubmit={onSubmit} className="bg-white p-6 rounded-2xl shadow w-full max-w-sm space-y-3">
        <h1 className="text-xl font-semibold">Nueva contraseña</h1>
        <input
          className="border rounded p-2 w-full"
          placeholder="Token"
          value={token}
          onChange={e => setToken(e.target.value)}
        />
        <input
          className="border rounded p-2 w-full"
          placeholder="Nueva contraseña"
          type="password"
          value={newPassword}
          onChange={e => setNewPassword(e.target.value)}
        />
        <button className="w-full bg-black text-white rounded p-2">
          Cambiar contraseña
        </button>
        {message && <p className="text-sm mt-2">{message}</p>}
      </form>
    </div>
  );
}
