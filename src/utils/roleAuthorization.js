import { ROLES } from '../constants/roles'
import { demoAccounts } from '../data/auth/demoAccounts'
import { roleEmailRules } from '../data/auth/roleEmailRules'

const normalizeEmail = email => String(email || '').trim().toLowerCase()

export function readAuthSession() {
  try { return JSON.parse(localStorage.getItem('campuspoolSession') || 'null') } catch { return null }
}

export function isEmailAllowedForRole(email, role) {
  const domain = normalizeEmail(email).split('@')[1]
  return Boolean(roleEmailRules[role]?.allowedDomains.includes(domain))
}

export function getAccountByEmail(email) {
  return demoAccounts.find(account => account.email === normalizeEmail(email)) || null
}

export function isAuthorizedOrganizer(email) {
  return getAccountByEmail(email)?.role === ROLES.ORGANIZER
}

export function isAuthorizedCollegeAdmin(email) {
  return getAccountByEmail(email)?.role === ROLES.COLLEGE_ADMIN
}

export function isAuthorizedSuperAdmin(email) {
  return getAccountByEmail(email)?.role === ROLES.SUPER_ADMIN
}

export function canAccessRole(user, requiredRole) {
  return Boolean(user && user.status === 'active' && user.verified === true && user.role === requiredRole)
}

export function getAuthorizedRole(email) {
  return getAccountByEmail(email)?.role || null
}

export function authenticate(email, password, selectedRole) {
  const account = getAccountByEmail(email)
  if (!account || account.password !== password || account.role !== selectedRole) return null
  if (!isEmailAllowedForRole(account.email, selectedRole) || !canAccessRole(account, selectedRole)) return null
  const { password: _password, ...session } = account
  return session
}

export function createSession(email, role) {
  const account = getAccountByEmail(email)
  if (!account || account.role !== role || !isEmailAllowedForRole(account.email, role)) return null
  const { password: _password, ...session } = account
  return canAccessRole(session, role) ? session : null
}
