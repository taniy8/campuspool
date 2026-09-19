export const organizerProfile = {
  id: 'ORG-001',
  name: 'CampusPool Ride Organizer',
  workspace: 'ABES Institute Demo Workspace',
  role: 'Ride Organizer',
  totalRides: 42,
  participants: 126,
  rating: 4.8,
  completed: 31,
  cancelled: 3,
}

export const organizerRides = [
  { rideId: 'RD-2048', rideCode: 'CP-2048', route: 'Raj Nagar → ABES Institute', pickup: 'Raj Nagar Gate 2', destination: 'ABES Institute', date: '12 Jun 2025', departure: '7:45 AM', arrival: '8:25 AM', seats: 10, availableSeats: 2, price: 25, vehicle: 'Sedan', status: 'In Progress', notes: 'Meet beside the campus shuttle stop.' },
  { rideId: 'RD-2049', rideCode: 'CP-2049', route: 'Indirapuram → KIET Campus', pickup: 'Shipra Mall', destination: 'KIET Campus', date: '13 Jun 2025', departure: '8:15 AM', arrival: '8:55 AM', seats: 8, availableSeats: 3, price: 30, vehicle: 'Hatchback', status: 'Scheduled', notes: 'Please arrive five minutes early.' },
  { rideId: 'RD-2050', rideCode: 'CP-2050', route: 'Vaishali → ABES Institute', pickup: 'Vaishali Metro Gate 1', destination: 'ABES Institute', date: '14 Jun 2025', departure: '7:30 AM', arrival: '8:10 AM', seats: 10, availableSeats: 0, price: 28, vehicle: 'SUV', status: 'Full', notes: 'Final passenger list confirmed.' },
  { rideId: 'RD-2051', rideCode: 'CP-2051', route: 'Kavi Nagar → IMS College', pickup: 'City Park', destination: 'IMS College', date: '16 Jun 2025', departure: '9:00 AM', arrival: '9:35 AM', seats: 6, availableSeats: 4, price: 22, vehicle: 'Sedan', status: 'Confirmed', notes: 'Flexible pickup within 1 km.' },
  { rideId: 'RD-2052', rideCode: 'CP-2052', route: 'ABES Institute → Raj Nagar', pickup: 'ABES Main Gate', destination: 'Raj Nagar', date: '17 Jun 2025', departure: '4:30 PM', arrival: '5:05 PM', seats: 8, availableSeats: 5, price: 25, vehicle: 'Hatchback', status: 'Scheduled', notes: 'Return commute after classes.' },
]

export const rideRequests = [
  { requestId: 'REQ-701', rideId: 'RD-2048', rideCode: 'CP-2048', student: 'Riya Kapoor', route: 'Raj Nagar → ABES Institute', date: '12 Jun · 7:45 AM', seats: 1, rating: 4.8, status: 'Pending', message: 'Can I join from Gate 2?', requestedAt: '5 minutes ago' },
  { requestId: 'REQ-702', rideId: 'RD-2048', rideCode: 'CP-2048', student: 'Meera Kapoor', route: 'Raj Nagar → ABES Institute', date: '12 Jun · 7:45 AM', seats: 1, rating: 4.7, status: 'Pending', message: 'I can be at the pickup point early.', requestedAt: '18 minutes ago' },
  { requestId: 'REQ-703', rideId: 'RD-2049', rideCode: 'CP-2049', student: 'Aarav Sharma', route: 'Indirapuram → KIET Campus', date: '13 Jun · 8:15 AM', seats: 1, rating: 4.9, status: 'Accepted', message: 'Joining from Shipra Mall.', requestedAt: '42 minutes ago' },
  { requestId: 'REQ-704', rideId: 'RD-2050', rideCode: 'CP-2050', student: 'Priya Singh', route: 'Vaishali → ABES Institute', date: '14 Jun · 7:30 AM', seats: 1, rating: 4.6, status: 'Rejected', message: 'Please let me know if another seat opens.', requestedAt: 'Yesterday' },
  { requestId: 'REQ-705', rideId: 'RD-2049', rideCode: 'CP-2049', student: 'Rohan Mehta', route: 'Indirapuram → KIET Campus', date: '13 Jun · 8:15 AM', seats: 1, rating: 4.8, status: 'Pending', message: 'Happy to share the fare.', requestedAt: 'Yesterday' },
]

export const participants = [
  { participantId: 'PAR-801', rideId: 'RD-2048', student: 'Riya Kapoor', route: 'Raj Nagar → ABES Institute', date: '12 Jun', seat: 1, payment: 25, status: 'Confirmed', rating: 4.8 },
  { participantId: 'PAR-802', rideId: 'RD-2048', student: 'Aarav Sharma', route: 'Raj Nagar → ABES Institute', date: '12 Jun', seat: 2, payment: 25, status: 'Confirmed', rating: 4.9 },
  { participantId: 'PAR-803', rideId: 'RD-2049', student: 'Priya Singh', route: 'Indirapuram → KIET Campus', date: '13 Jun', seat: 1, payment: 30, status: 'Confirmed', rating: 4.6 },
  { participantId: 'PAR-804', rideId: 'RD-2049', student: 'Kunal Verma', route: 'Indirapuram → KIET Campus', date: '13 Jun', seat: 2, payment: 30, status: 'Confirmed', rating: 4.8 },
  { participantId: 'PAR-805', rideId: 'RD-2050', student: 'Ananya Gupta', route: 'Vaishali → ABES Institute', date: '14 Jun', seat: 1, payment: 28, status: 'Confirmed', rating: 4.7 },
]

export const scheduleData = [
  { day: 'Monday', date: '16 Jun', time: '9:00 AM', route: 'Kavi Nagar → IMS College', seats: '2/6 seats', status: 'Confirmed' },
  { day: 'Tuesday', date: '17 Jun', time: '7:45 AM', route: 'Raj Nagar → ABES Institute', seats: '8/10 seats', status: 'Scheduled' },
  { day: 'Wednesday', date: '18 Jun', time: '8:15 AM', route: 'Indirapuram → KIET Campus', seats: '5/8 seats', status: 'Scheduled' },
  { day: 'Thursday', date: '19 Jun', time: '2:30 PM', route: 'ABES Institute → Raj Nagar', seats: '6/8 seats', status: 'Scheduled' },
  { day: 'Friday', date: '20 Jun', time: '7:30 AM', route: 'Vaishali → ABES Institute', seats: '10/10 seats', status: 'Full' },
]

export const organizerMessages = [
  { conversationId: 'CON-01', student: 'Riya Kapoor', preview: 'Hi, is the pickup point near Gate 1?', time: '10:24 AM', unread: true, messages: ['Hi, is the pickup point near Gate 1?', 'Yes, I will share the exact pin before departure.'] },
  { conversationId: 'CON-02', student: 'Aarav Sharma', preview: "I'll be joining the 7:45 ride.", time: '9:42 AM', unread: false, messages: ["I'll be joining the 7:45 ride."] },
  { conversationId: 'CON-03', student: 'Priya Singh', preview: 'Can I reserve one more seat?', time: 'Yesterday', unread: true, messages: ['Can I reserve one more seat?', 'I will check the remaining capacity and get back to you.'] },
  { conversationId: 'CON-04', student: 'Kunal Verma', preview: 'I have sent the payment for CP-2049.', time: 'Yesterday', unread: false, messages: ['I have sent the payment for CP-2049.'] },
]

export const organizerNotifications = [
  { id: 'ORG-NOT-01', type: 'Ride request received', title: 'New request from Riya Kapoor', message: 'Riya Kapoor requested to join CP-2048.', timestamp: '5 minutes ago', read: false },
  { id: 'ORG-NOT-02', type: 'Ride confirmed', title: 'Aarav Sharma joined CP-2048', message: 'Your passenger list has been updated.', timestamp: '20 minutes ago', read: false },
  { id: 'ORG-NOT-03', type: 'Ride reminder', title: 'Your Raj Nagar ride starts tomorrow', message: 'Departure is scheduled for 7:45 AM.', timestamp: '2 hours ago', read: true },
  { id: 'ORG-NOT-04', type: 'Payment received', title: 'Payment received from Priya Singh', message: '₹30 was recorded for CP-2049.', timestamp: 'Yesterday', read: true },
]

export const organizerDashboardStats = { activeRides: 8, totalRides: 42, participants: 126, pendingRequests: 14, completedRides: 31, cancelledRides: 3 }
