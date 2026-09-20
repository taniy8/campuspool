import { ROLES } from '../../constants/roles'

export const roleEmailRules = {
  [ROLES.STUDENT]: {
    label: 'Student',
    allowedDomains: ['abes.ac.in'],
    requiresCollegeVerification: true,
    requiresAdminApproval: false
  },
  [ROLES.ORGANIZER]: {
    label: 'Ride Organizer',
    allowedDomains: ['abes.ac.in'],
    requiresCollegeVerification: true,
    requiresAdminApproval: true
  },
  [ROLES.COLLEGE_ADMIN]: {
    label: 'College Admin',
    allowedDomains: ['abes.ac.in'],
    requiresCollegeVerification: true,
    requiresAdminApproval: true
  },
  [ROLES.SUPER_ADMIN]: {
    label: 'Super Admin',
    allowedDomains: ['campuspool.com'],
    requiresCollegeVerification: false,
    requiresAdminApproval: true
  }
}
