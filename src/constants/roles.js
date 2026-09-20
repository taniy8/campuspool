export const ROLES = {
  STUDENT: 'student',
  ORGANIZER: 'organizer',
  COLLEGE_ADMIN: 'collegeAdmin',
  SUPER_ADMIN: 'superAdmin'
}

export const ROLE_LABELS = {
  student: 'Student',
  organizer: 'Ride Organizer',
  collegeAdmin: 'College Admin',
  superAdmin: 'Super Admin'
}

export const ROLE_PATHS = {
  student: 'student',
  organizer: 'organizer',
  collegeAdmin: 'admin',
  superAdmin: 'super-admin'
}

export const ROLE_BY_PATH = Object.fromEntries(Object.entries(ROLE_PATHS).map(([role, path]) => [path, role]))
