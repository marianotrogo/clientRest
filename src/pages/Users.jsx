import { useEffect, useState } from 'react';
import { api } from '../api';

export default function Users() {
  const [users, setUsers] = useState([]);
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'CAJERO' });
  const [editingUserId, setEditingUserId] = useState(null);

  const fetchUsers = async () => {
    try {
      const res = await api.get('/admin/users');
      setUsers(Array.isArray(res.data) ? res.data : []);
    } catch {
      setUsers([]);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // Crear usuario
  const create = async () => {
    try {
      await api.post('/auth/register', form);
      setForm({ name: '', email: '', password: '', role: 'CAJERO' });
      fetchUsers();
    } catch (e) {
      console.log(e);
    }
  };

  // Preparar formulario para editar
  const editUser = (user) => {
    setForm({ name: user.name, email: user.email, password: '', role: user.role, active: user.active });
    setEditingUserId(user._id);
  };

  // Actualizar usuario
  const update = async () => {
    try {
      await api.put(`/admin/users/${editingUserId}`, form);
      setForm({ name: '', email: '', password: '', role: 'CAJERO' });
      setEditingUserId(null);
      fetchUsers();
    } catch (e) {
      console.log(e);
    }
  };

  // Desactivar usuario (borrado lógico)
  const deactivate = async (id) => {
    try {
      await api.put(`/admin/users/${id}`, { active: false });
      fetchUsers();
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <div className='p-6 space-y-3'>
      <h1 className='text-2xl font-bold'>Usuarios</h1>

      <div className='grid md:grid-cols-4 gap-2'>
        <input
          className='border rounded p-2'
          placeholder='Nombre'
          value={form.name}
          onChange={e => setForm({ ...form, name: e.target.value })}
        />
        <input
          className='border rounded p-2'
          placeholder='Email'
          value={form.email}
          onChange={e => setForm({ ...form, email: e.target.value })}
        />
        <input
          className='border rounded p-2'
          placeholder='Password'
          type='password'
          value={form.password}
          onChange={e => setForm({ ...form, password: e.target.value })}
        />
        <select
          value={form.role}
          onChange={e => setForm({ ...form, role: e.target.value })}
          className='border rounded p-2'
        >
          <option value='ADMIN'>ADMIN</option>
          <option value='CAJERO'>CAJERO</option>
        </select>
      </div>

      {editingUserId ? (
        <button onClick={update} className='bg-yellow-600 text-white rounded p-2'>
          Actualizar Usuario
        </button>
      ) : (
        <button onClick={create} className='bg-black text-white rounded p-2'>
          Crear Usuario
        </button>
      )}

      <ul className='mt-4 space-y-1'>
        {users.length === 0 ? (
          <li className='border rounded p-2'>No hay usuarios para mostrar</li>
        ) : (
          users.map(u => (
            <li key={u._id} className='border rounded p-2 flex justify-between items-center'>
              <span>
                {u.name} - {u.email} - {u.role} {u.active ? '' : '(Inactivo)'}
              </span>
              <div className='flex gap-2'>
                <button
                  onClick={() => editUser(u)}
                  className='bg-blue-600 text-white rounded px-2 py-1 text-sm'
                >
                  Editar
                </button>
                {u.active && (
                  <button
                    onClick={() => deactivate(u._id)}
                    className='bg-red-600 text-white rounded px-2 py-1 text-sm'
                  >
                    Desactivar
                  </button>
                )}
              </div>
            </li>
          ))
        )}
      </ul>
    </div>
  );
}
