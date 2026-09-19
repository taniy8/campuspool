export const mockUser = {
  id: 'student-riya',
  name: 'Riya Kapoor',
  initials: 'RK',
  college: 'ABES Institute',
  email: 'riya@example.com',
  phone: '+91 98XXXXXX12',
  department: 'Computer Science',
  year: '3rd Year',
  rating: 4.8,
  tripsCompleted: 36,
  moneySaved: 2840,
}

export const mockTrips = [
  { id: 'trip-102', from: 'Raj Nagar', to: 'ABES Institute', date: '12 June 2025', pickupTime: '7:55 AM', arrivalTime: '8:32 AM', distance: '3.2 km', status: 'Confirmed', passengers: 2 },
  { id: 'trip-101', from: 'Vaishali', to: 'ABES Institute', date: '10 June 2025', pickupTime: '8:00 AM', arrivalTime: '8:38 AM', distance: '5.8 km', status: 'Completed', passengers: 3 },
  { id: 'trip-100', from: 'Raj Nagar', to: 'ABES Institute', date: '8 June 2025', pickupTime: '7:45 AM', arrivalTime: '8:30 AM', distance: '3.4 km', status: 'Cancelled', passengers: 0 },
]

export const mockAvailableRides = [
  { id: 'ride-aarav', name: 'Aarav Sharma', initials: 'AS', from: 'Raj Nagar', to: 'ABES Institute', time: '7:45 AM', date: '12 June 2025', score: 94, distance: '3.4 km', seats: 2, cost: 25, rating: 4.8, college: 'ABES Institute', tone: 'coral' },
  { id: 'ride-ananya', name: 'Ananya Singh', initials: 'AS', from: 'Crossing Republik', to: 'ABES Institute', time: '8:00 AM', date: '12 June 2025', score: 89, distance: '5.1 km', seats: 1, cost: 30, rating: 4.7, college: 'ABES Institute', tone: 'mint' },
  { id: 'ride-kunal', name: 'Kunal Verma', initials: 'KV', from: 'Indirapuram', to: 'ABES Institute', time: '7:30 AM', date: '12 June 2025', score: 86, distance: '6.8 km', seats: 3, cost: 35, rating: 4.9, college: 'KIET Group', tone: 'blue' },
]

export const mockMatches = [
  { id: 'match-rohan', name: 'Rohan Mehta', initials: 'RM', from: 'Raj Nagar', to: 'ABES Institute', time: '7:50 AM', score: 94, rating: 4.8, mutualConnections: 3, college: 'ABES Institute', tone: 'coral' },
  { id: 'match-priya', name: 'Priya Sharma', initials: 'PS', from: 'Indirapuram', to: 'ABES Institute', time: '8:00 AM', score: 89, rating: 4.7, mutualConnections: 2, college: 'ABES Institute', tone: 'mint' },
]

export const mockSavings = [
  { month: 'January', value: 1200 }, { month: 'February', value: 1450 }, { month: 'March', value: 1380 },
  { month: 'April', value: 1700 }, { month: 'May', value: 1950 }, { month: 'June', value: 2100 },
  { month: 'July', value: 2300 }, { month: 'August', value: 2500 }, { month: 'September', value: 2600 },
  { month: 'October', value: 2750 }, { month: 'November', value: 2840 },
]

export const mockActiveRide = { id: 'ride-102', driver: 'Aarav Sharma', from: 'Raj Nagar', to: 'ABES Institute', pickup: '7:55 AM', passengers: '2/3', status: 'Driver arriving', eta: '5 minutes', cost: 25 }

export const mockHistory = [
  { id: 'history-1', date: '10 June', from: 'Raj Nagar', to: 'ABES Institute', driver: 'Aarav Sharma', amount: 25, status: 'Completed' },
  { id: 'history-2', date: '8 June', from: 'Indirapuram', to: 'ABES Institute', driver: 'Kunal Verma', amount: 30, status: 'Completed' },
  { id: 'history-3', date: '5 June', from: 'Vaishali', to: 'ABES Institute', driver: 'Priya Sharma', amount: 20, status: 'Completed' },
]

export const mockMessages = [
  { id: 'msg-aarav', name: 'Aarav Sharma', initials: 'AS', lastMessage: "Hey, I'll reach Raj Nagar around 7:50.", time: '9:42 AM', unread: 2, tone: 'coral', messages: ["Hey, I'll reach Raj Nagar around 7:50."] },
  { id: 'msg-priya', name: 'Priya Sharma', initials: 'PS', lastMessage: 'Are you still joining the ride tomorrow?', time: 'Yesterday', unread: 1, tone: 'mint', messages: ['Are you still joining the ride tomorrow?'] },
  { id: 'msg-kunal', name: 'Kunal Verma', initials: 'KV', lastMessage: "I've shared the pickup location.", time: 'Mon', unread: 0, tone: 'blue', messages: ["I've shared the pickup location."] },
]

export const mockNotifications = [
  { id: 'notification-1', type: 'Ride confirmed', text: 'Your ride with Aarav Sharma is confirmed.', time: '10 min ago', read: false },
  { id: 'notification-2', type: 'New match', text: 'Riya, you have a new ride match.', time: '1 hour ago', read: false },
  { id: 'notification-3', type: 'Ride reminder', text: 'Your trip tomorrow starts at 7:55 AM.', time: 'Yesterday', read: true },
  { id: 'notification-4', type: 'Payment recorded', text: '₹25 ride payment recorded.', time: 'Yesterday', read: true },
]

export const mockSettings = { notifications: true, emailNotifications: true, rideReminders: true, locationSharing: true, privacy: true }

export const mockAdminData = {
  stats: [{ label: 'Total students', value: '1,248' }, { label: 'Active students', value: '986' }, { label: 'Total rides', value: '3,842' }, { label: 'Active rides', value: '126' }, { label: 'Pending approvals', value: '18' }, { label: 'Reports', value: '7' }],
  recentUsers: [['Riya Kapoor', 'Student', 'ABES Institute', 'Active'], ['Aarav Sharma', 'Student', 'ABES Institute', 'Active'], ['Priya Singh', 'Student', 'KIET', 'Active']],
  recentTrips: [['Raj Nagar', 'ABES Institute', '7:55 AM', 'Confirmed'], ['Indirapuram', 'ABES Institute', '8:00 AM', 'In progress'], ['Vaishali', 'ABES Institute', '8:15 AM', 'Completed']],
}

export const mockSuperAdminData = {
  stats: [{ label: 'Total colleges', value: '24' }, { label: 'Total users', value: '18,642' }, { label: 'Total students', value: '17,850' }, { label: 'Total admins', value: '792' }, { label: 'Total rides', value: '45,280' }, { label: 'Active rides', value: '1,284' }, { label: 'Platform revenue', value: '₹8,42,600' }, { label: 'Pending issues', value: '23' }],
  colleges: [['ABES Institute', '2,840', '42', '326', 'Active'], ['KIET Group', '2,430', '38', '291', 'Active'], ['AKTU Campus', '3,120', '51', '412', 'Active']],
  users: [['Riya Kapoor', 'riya@example.com', 'Student', 'ABES Institute', 'Active'], ['Aarav Sharma', 'aarav@example.com', 'Admin', 'ABES Institute', 'Active'], ['Priya Singh', 'priya@example.com', 'Student', 'KIET Group', 'Active']],
  activity: ['New college registered', 'Admin account approved', '1,200 new rides completed this month', 'System report generated'],
}
