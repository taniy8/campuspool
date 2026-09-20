# CampusPool

CampusPool is a college-focused student ride-pooling platform that helps verified campus communities find compatible shared rides, coordinate trips, and reduce transportation costs.

## Project Overview

CampusPool connects students traveling from similar locations so they can find one another before commuting. Users can post a trip with a starting location, destination, and departure time. The platform demonstrates matching students using route and timing similarity, allowing them to share rides and split transportation costs.

College email verification improves trust and safety within the campus community. This repository is currently a frontend-focused React application using realistic mock data and browser-based demo state; it does not include a production backend or database.

## Features

### Student

- Dashboard with commute and ride summaries
- Find Ride browsing with search and status filters
- Post Trip creation flow
- Smart Matches with route, timing, proximity, destination, and overall scores
- My Trips with upcoming, active, completed, and cancelled views
- Active Ride details
- Ride History with savings summaries
- Messages and rider conversations
- Notifications and read-state interactions
- Safety Center and support actions
- Profile and rider details
- Settings and appearance preferences
- Ratings and reviews shown across ride and profile data
- Report and block interaction surfaces in the student experience

### Ride Organizer

- Organizer Dashboard
- Create Ride
- Manage Rides
- Ride Requests
- Participants
- Schedule
- Messages
- Notifications
- Safety
- Profile
- Settings

### College Admin

- Admin Dashboard
- Students
- Verification
- Trips
- Rides
- Reports
- Complaints
- Safety
- Analytics
- Notifications
- Settings

### Super Admin

- Super Admin Dashboard
- Colleges
- Users
- Rides
- Ride Analytics
- Matching Analytics
- Reports
- Safety
- Complaints
- System Activity
- Settings

## Technology Stack

The project uses the following installed technologies:

- React 19
- Vite 8
- React Router 7
- JavaScript with JSX
- CSS
- React Context API for shared theme state
- `localStorage` and `sessionStorage` for frontend demo sessions, theme preference, and mock API state
- Oxlint for linting

The project does not currently install or use Tailwind CSS, Framer Motion, Recharts, or Lucide React. Charts are implemented with local React/SVG and CSS helpers. There is no production backend dependency in this repository.

## Role-Based Authentication

CampusPool uses four canonical internal role IDs:

- `student` — Student
- `organizer` — Ride Organizer
- `collegeAdmin` — College Admin
- `superAdmin` — Super Admin

Display labels are separate from authorization values:

| Internal role ID | Display name |
|---|---|
| `student` | Student |
| `organizer` | Ride Organizer |
| `collegeAdmin` | College Admin |
| `superAdmin` | Super Admin |

Selecting a role does not grant access to that dashboard. Login validates the account email, password, verification status, active status, and canonical role. Protected routes check the authenticated user's role before rendering workspace pages.

## Demo Login Credentials

These are **DEMO/FRONTEND credentials** for local project demonstration only.

| Role | Email | Password | Dashboard |
|---|---|---|---|
| Student | `student@abes.ac.in` | `Student@123` | `/student/dashboard` |
| Ride Organizer | `organizer@abes.ac.in` | `Organizer@123` | `/organizer/dashboard` |
| College Admin | `admin@abes.ac.in` | `Admin@123` | `/admin/dashboard` |
| Super Admin | `admin@campuspool.com` | `SuperAdmin@123` | `/super-admin/dashboard` |

> **IMPORTANT:** These credentials are for project demonstration only and must not be used as production credentials.

## Email Authorization Rules

- **Student:** An approved college email is required.
- **Ride Organizer:** An approved college email and organizer authorization are required.
- **College Admin:** The account must be an authorized college administrator.
- **Super Admin:** The account must be an authorized CampusPool system administrator.

Simply selecting a role does not grant permissions. The account record and its authorization status must match the selected role.

## Routes

### Public

- `/`
- `/about`
- `/how-it-works`
- `/safety`
- `/smart-matching`
- `/login`
- `/register`
- `/verify-email`
- `/forgot-password`
- `/reset-password`
- `/roles`

### Student

- `/student/*`

### Organizer

- `/organizer/*`

### College Admin

- `/admin/*`

### Super Admin

- `/super-admin/*`

Protected route components validate the authenticated user's canonical role before rendering these workspace groups. The `/admin` and `/super-admin` URL segments are route paths; their corresponding internal roles remain `collegeAdmin` and `superAdmin`.

## Smart Matching

CampusPool demonstrates matching using realistic mock data and factors such as:

- Route similarity
- Time compatibility
- Pickup proximity
- Destination match
- Route overlap
- Distance
- Overall match score

The frontend presents these factors to help students compare potential ride matches. Matching is demonstrated locally and is not connected to a production matching service.

## Admin Analytics

Admin analytics use separate datasets instead of showing the same graph or data on every page. Current examples include:

- Daily active students
- Completed rides
- Average match score
- Money saved
- Completion versus cancellation
- Match score trends
- Ride completion trends
- Ride activity by day
- Transport mode distribution
- Top pickup areas

## Data Architecture

The frontend organizes mock data by domain, including:

- Students
- Colleges
- Trips
- Rides
- Matches
- Ride requests
- Messages
- Notifications
- Ratings
- Reports
- Complaints
- Safety reports
- Analytics
- System activities

College Admin pages use separate domain-specific datasets, including:

- `src/data/admin/adminStudents.js`
- `src/data/admin/verificationQueue.js`
- `src/data/admin/adminRides.js`
- `src/data/admin/adminReports.js`
- `src/data/admin/adminComplaints.js`
- `src/data/admin/safetyReports.js`
- `src/data/admin/adminAnalytics.js`
- `src/data/admin/adminNotifications.js`
- `src/data/admin/adminActivity.js`

Authentication data and authorization rules are maintained separately under `src/data/auth/`, while shared role constants live in `src/constants/roles.js`.

## Theme System

- Dark mode is the default theme.
- A light/bright theme is available through the workspace theme control.
- The selected theme is persisted in `localStorage`.
- Theme tokens apply across dashboards, tables, cards, forms, charts, modals, notifications, messages, and settings.
- Surfaces use solid theme-aware backgrounds rather than unreadable transparent blocks.
- Text, axes, legends, controls, and chart labels maintain strong contrast in both themes.

## Interactive Features

The frontend includes working demo interactions for:

- Login and logout
- Role switching
- Theme switching
- Search and filters
- Sorting and pagination in administrative views
- Ride requests
- Accept and reject actions
- Ride cancellation
- Sending messages
- Notifications and read states
- Profile and settings views
- Report and block surfaces
- Admin verification actions
- Complaint and report actions
- Confirmation modals
- Toast notifications

All state is local to the frontend demo and may be reset by clearing browser storage.

## Confirmation Popups

Important actions use confirmation or feedback surfaces where appropriate. Examples include:

- Logout
- Request Ride
- Accept Request
- Reject Request
- Cancel Ride
- Report User
- Block User
- Verify Student
- Suspend Account

These surfaces use the existing CampusPool theme tokens so they remain readable in dark and light modes.

## Project Structure

The current project structure is:

```text
campuspool/
├── README.md
├── index.html
├── package.json
├── vite.config.js
├── public/
└── src/
    ├── App.css
    ├── App.jsx
    ├── SuperAdmin.css
    ├── SuperAdmin.jsx
    ├── index.css
    ├── main.jsx
    ├── assets/
    ├── components/
    │   ├── ProtectedRoute.jsx
    │   └── RoleProtectedRoute.jsx
    ├── constants/
    │   └── roles.js
    ├── data/
    │   ├── admin/
    │   │   ├── adminActivity.js
    │   │   ├── adminAnalytics.js
    │   │   ├── adminComplaints.js
    │   │   ├── adminNotifications.js
    │   │   ├── adminReports.js
    │   │   ├── adminRides.js
    │   │   ├── adminStudents.js
    │   │   ├── safetyReports.js
    │   │   └── verificationQueue.js
    │   ├── auth/
    │   │   ├── authorizedOrganizers.js
    │   │   ├── collegeAdmins.js
    │   │   ├── demoAccounts.js
    │   │   ├── roleEmailRules.js
    │   │   └── superAdmins.js
    │   ├── colleges.js
    │   ├── matches.js
    │   ├── mockData.js
    │   ├── notifications.js
    │   ├── organizerMockData.js
    │   ├── rides.js
    │   ├── students.js
    │   ├── superAdminColleges.js
    │   ├── superAdminOperations.js
    │   ├── superAdminRides.js
    │   ├── superAdminUsers.js
    │   ├── trips.js
    │   └── userData.js
    ├── services/
    │   ├── mockApi.js
    │   └── organizerMockApi.js
    └── utils/
        └── roleAuthorization.js
```

## Installation

Install the project dependencies from the repository root:

```bash
npm install
```

## Development

Start the Vite development server:

```bash
npm run dev
```

Then open the local URL shown by Vite, usually `http://localhost:5173`.

## Build and Validation

Create a production build:

```bash
npm run build
```

Run the project linter:

```bash
npm run lint
```

Preview the production build locally:

```bash
npm run preview
```
