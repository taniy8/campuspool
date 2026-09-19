import { mockAvailableRides, mockHistory, mockMatches, mockMessages, mockNotifications, mockTrips, mockUser } from '../data/mockData'

const clone = (value) => JSON.parse(JSON.stringify(value))
const read = (key, fallback) => { try { const stored = localStorage.getItem(key); return stored ? JSON.parse(stored) : clone(fallback) } catch { return clone(fallback) } }
const write = (key, value) => { localStorage.setItem(key, JSON.stringify(value)); return clone(value) }

export const getUser = () => read('campuspool_user', mockUser)
export const updateProfile = (profile) => write('campuspool_user', { ...getUser(), ...profile })
export const getTrips = () => read('campuspool_trips', mockTrips)
export const createTrip = (trip) => { const trips = [{ ...trip, id: `trip-${Date.now()}` }, ...getTrips()]; return write('campuspool_trips', trips) }
export const getAvailableRides = () => clone(mockAvailableRides)
export const getMatches = () => clone(mockMatches)
export const getHistory = () => clone(mockHistory)
export const getActiveRide = () => read('campuspool_active_ride', { id: 'ride-102', driver: 'Aarav Sharma', from: 'Raj Nagar', to: 'ABES Institute', pickup: '7:55 AM', passengers: '2/3', status: 'Driver arriving', eta: '5 minutes', cost: 25 })
export const getMessages = () => read('campuspool_messages', mockMessages)
export const saveMessages = (messages) => write('campuspool_messages', messages)
export const getNotifications = () => read('campuspool_notifications', mockNotifications)
export const saveNotifications = (notifications) => write('campuspool_notifications', notifications)
export const getSettings = () => read('campuspool_settings', { notifications: true, emailNotifications: true, rideReminders: true, locationSharing: true, privacy: true })
export const saveSettings = (settings) => write('campuspool_settings', settings)
