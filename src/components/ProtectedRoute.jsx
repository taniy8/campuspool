import { Link } from 'react-router-dom'
import { readAuthSession } from '../utils/roleAuthorization'

export function AccessDenied() {
  return <div className="auth-page"><div className="auth-card access-denied"><span className="eyebrow">ACCESS CONTROL / ROLE CHECK</span><h1>Access denied</h1><p>You are not authorized to access this area.</p><Link className="button dark" to="/roles">Return to Dashboard ↗</Link></div></div>
}

export default function ProtectedRoute({ children }) {
  const session = readAuthSession()
  return ['active', 'approved'].includes(session?.status) && session.verified === true ? children : <AccessDenied />
}
