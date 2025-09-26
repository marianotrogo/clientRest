import { useSelector } from 'react-redux'
import { Navigate } from 'react-router-dom'

export default function ProtectedRoute({ roles, children }) {
    const { token, user, loading } = useSelector(s => s.auth)

    // Mientras se esté cargando el estado de auth, no renderiza nada
    if (loading) return null  // o un spinner si querés

    // Si no hay token, redirige a login
    if (!token) return <Navigate to='/login' replace />

    // Si hay roles definidos y el usuario no tiene permisos
    if (roles && user && !roles.includes(user.role)) return <div className='p-6'>No Autorizado</div>

    return children
}
