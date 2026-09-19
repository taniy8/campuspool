import { organizerDashboardStats, organizerMessages, organizerNotifications, organizerProfile, organizerRides, participants, rideRequests, scheduleData } from '../data/organizerMockData'

const keys = { rides: 'organizer_rides', requests: 'organizer_ride_requests', participants: 'organizer_participants', messages: 'organizer_messages', notifications: 'organizer_notifications' }
const read = (key, fallback) => { try { return JSON.parse(localStorage.getItem(key)) || fallback } catch { return fallback } }
const write = (key, value) => { localStorage.setItem(key, JSON.stringify(value)); return value }

export const getOrganizerDashboard = () => ({ stats: organizerDashboardStats, profile: organizerProfile, rides: getOrganizerRides(), requests: getRideRequests(), participants: getParticipants() })
export const getOrganizerRides = () => read(keys.rides, organizerRides)
export const getRideRequests = () => read(keys.requests, rideRequests)
export const getParticipants = () => read(keys.participants, participants)
export const getSchedule = () => scheduleData
export const getMessages = () => read(keys.messages, organizerMessages)
export const getNotifications = () => read(keys.notifications, organizerNotifications)
export const createRide = ride => write(keys.rides, [...getOrganizerRides(), { ...ride, rideId: `RD-${Date.now()}`, rideCode: `CP-${String(Date.now()).slice(-4)}`, status: 'Scheduled', availableSeats: ride.seats }])
export const updateRide = (rideId, updates) => write(keys.rides, getOrganizerRides().map(ride => ride.rideId === rideId ? { ...ride, ...updates } : ride))
export const cancelRide = rideId => updateRide(rideId, { status: 'Cancelled' })
export const acceptRideRequest = requestId => { const request = getRideRequests().find(item => item.requestId === requestId); if (!request) return null; write(keys.requests, getRideRequests().map(item => item.requestId === requestId ? { ...item, status: 'Accepted' } : item)); const nextParticipants = [...getParticipants(), { participantId: `PAR-${Date.now()}`, rideId: request.rideId, student: request.student, route: request.route, date: request.date.split(' · ')[0], seat: request.seats, payment: 25, status: 'Confirmed', rating: request.rating }]; write(keys.participants, nextParticipants); return request }
export const rejectRideRequest = requestId => write(keys.requests, getRideRequests().map(item => item.requestId === requestId ? { ...item, status: 'Rejected' } : item))
export const markOrganizerNotificationsRead = () => write(keys.notifications, getNotifications().map(item => ({ ...item, read: true })))
