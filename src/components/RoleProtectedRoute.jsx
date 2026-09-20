import ProtectedRoute, { AccessDenied } from './ProtectedRoute'
import { canAccessRole, readAuthSession } from '../utils/roleAuthorization'

export default function RoleProtectedRoute({ requiredRole, children }) {
  const session = readAuthSession()
  const selectedRole = localStorage.getItem('selectedRole')
  return <ProtectedRoute>{selectedRole === requiredRole && canAccessRole(session, requiredRole) ? children : <AccessDenied />}</ProtectedRoute>
}
