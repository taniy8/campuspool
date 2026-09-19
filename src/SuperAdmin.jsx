import { useState } from 'react'
import { Link } from 'react-router-dom'
import { superAdminColleges } from './data/superAdminColleges'
import { superAdminUsers } from './data/superAdminUsers'
import { superAdminRides } from './data/superAdminRides'
import { superAdminActivities, superAdminComplaints, superAdminMatches, superAdminReports, superAdminSafety } from './data/superAdminOperations'
import './SuperAdmin.css'

const pageSize = 10
const statusOptions = values => [...new Set(values)]

// ========== SHARED COMPONENTS ==========
function Header({ eyebrow, title, description, action }) {
  return <div className="sa-heading">
    <div>
      <span className="eyebrow">{eyebrow}</span>
      <h2>{title}</h2>
      <p>{description}</p>
    </div>
    {action}
  </div>
}

function Kpis({ items }) {
  return <div className="sa-kpis">
    {items.map(item => <div className="sa-kpi" key={item.label}>
      <small>{item.label}</small>
      <strong>{item.value}</strong>
      <em>{item.note || 'Live platform data'}</em>
    </div>)}
  </div>
}

function MiniChart({ title, values, labels, tone = 'coral' }) {
  const max = Math.max(...values, 1)
  return <section className="sa-panel sa-chart">
    <div className="sa-panel-head">
      <h3>{title}</h3>
      <small>Last 6 months</small>
    </div>
    <div className={`sa-bars ${tone}`}>
      {values.map((value, index) => <div key={`${labels[index]}-${index}`}>
        <i style={{ height: `${Math.max(8, value / max * 100)}%` }} title={`${value}`} />
        <small>{labels[index]}</small>
      </div>)}
    </div>
  </section>
}

function Pager({ page, total, setPage }) {
  const pages = Math.max(1, Math.ceil(total / pageSize))
  return <div className="sa-pager">
    <span>Showing page {page} of {pages}</span>
    <div>
      <button disabled={page === 1} onClick={() => setPage(page - 1)}>←</button>
      {Array.from({ length: Math.min(pages, 5) }, (_, i) => <button className={page === i + 1 ? 'selected' : ''} onClick={() => setPage(i + 1)} key={i}>{i + 1}</button>)}
      <button disabled={page === pages} onClick={() => setPage(page + 1)}>→</button>
    </div>
  </div>
}

function Filters({ query, setQuery, selects = [] }) {
  return <div className="sa-filters">
    <input value={query} onChange={event => setQuery(event.target.value)} placeholder="Search records..." />
    {selects.map(select => <select key={select.label} value={select.value} onChange={event => select.setValue(event.target.value)}>
      <option value="">{select.label}</option>
      {select.options.map(option => <option value={option} key={option}>{option}</option>)}
    </select>)}
  </div>
}

function Toast({ message }) {
  return message ? <div className="sa-toast">✓ {message}</div> : null
}

// Legacy Table component - kept for compatibility with other pages
function Table({ headers, rows, renderRow, variant = 'default', toolbar = true }) {
  const detectedVariant = variant === 'default' ? headers[0].toLowerCase().replaceAll(' ', '-') : variant
  return <section className={`sa-table-card sa-table-card-${detectedVariant}`}>
    {toolbar && <div className="sa-table-toolbar">
      <span>{headers.length} columns</span>
      <small>← Scroll horizontally to view more →</small>
    </div>}
    <div className="sa-table-scroll">
      <div className="sa-table" role="table">
        <div className="sa-table-row head" role="row">
          {headers.map(header => <span role="columnheader" key={header}>{header}</span>)}
        </div>
        {rows.map((row, index) => <div className="sa-table-row" role="row" key={row.id || index}>
          {renderRow ? renderRow(row) : row.map((cell, cellIndex) => <span key={cellIndex} title={String(cell)}>{String(cell)}</span>)}
        </div>)}
      </div>
    </div>
  </section>
}

function Status({ value }) {
  return <b className={`sa-status ${String(value).toLowerCase().replaceAll(' ', '-')}`}>{value}</b>
}

function ActionButtons({ onView, onToggle, active = true }) {
  return <span className="sa-actions">
    <button onClick={onView}>View</button>
    {onToggle && <button className={active ? 'danger-text' : 'success-text'} onClick={() => (!active || window.confirm('Suspend this record?')) && onToggle()}>
      {active ? 'Suspend' : 'Activate'}
    </button>}
  </span>
}

// NEW REUSABLE SUPER ADMIN TABLE COMPONENT - Uses flexible column widths
function SuperAdminTable({ columns, rows, onRowClick, mobileCardRenderer, pageSize: size = 10 }) {
  const [page, setPage] = useState(1)
  const visible = rows.slice((page - 1) * size, page * size)
  const totalPages = Math.ceil(rows.length / size)
  
  return <div className="sa-admin-table-wrapper">
    <div className="sa-admin-desktop">
      <div className="sa-admin-table">
        <div className="sa-admin-row head">
          {columns.map(col => (
            <div className={`sa-admin-col sa-admin-col-${col.key}`} key={col.key}>
              {col.label}
            </div>
          ))}
        </div>
        {visible.map((row, idx) => (
          <div className="sa-admin-row" key={row.id || idx} onClick={() => onRowClick?.(row)}>
            {columns.map(col => (
              <div className={`sa-admin-col sa-admin-col-${col.key}`} key={col.key}>
                {col.render ? col.render(row) : row[col.key] || '—'}
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
    <div className="sa-admin-mobile">
      {visible.map((row, idx) => (
        <div className="sa-admin-card" key={row.id || idx} onClick={() => onRowClick?.(row)}>
          {mobileCardRenderer?.(row)}
        </div>
      ))}
    </div>
    {totalPages > 1 && <Pager page={page} total={rows.length} setPage={setPage} />}
  </div>
}

export default function SuperAdminPage({ path }) {
  const [notice, setNotice] = useState('')
  const notify = message => { setNotice(message); window.setTimeout(() => setNotice(''), 2200) }
  const [subpath, id] = path.split('/')
  
  if (subpath === 'colleges' && id) return <CollegeDetail id={id} />
  if (subpath === 'users' && id) return <UserDetail id={id} />
  
  const pages = {
    dashboard: <SuperDashboard />,
    colleges: <CollegeManagement notify={notify} />,
    users: <UserManagement notify={notify} />,
    rides: <RideManagementPro />,
    'ride-analytics': <RideAnalytics />,
    'matching-analytics': <MatchingAnalytics />,
    reports: <ReportCenter notify={notify} />,
    safety: <SafetyOperations notify={notify} />,
    complaints: <ComplaintCenter notify={notify} />,
    'system-activity': <AuditLog />,
    settings: <SuperSettings notify={notify} />
  }
  
  return <>
    <div className="super-admin-surface">
      {pages[subpath] || pages.dashboard}
    </div>
    <Toast message={notice} />
  </>
}

export function Safety() { return <SuperAdminPage path="safety" /> }
export function Settings() { return <SuperAdminPage path="settings" /> }

// ========== DASHBOARD AND ANALYTICS ==========
function SuperDashboard() {
  return <div className="sa-view">
    <Header eyebrow="PLATFORM CONTROL CENTER" title="Platform overview" description="A live view of CampusPool's network, trust, and growth." />
    <Kpis items={[
      ['Total colleges', '24'],
      ['Total students', '18,642'],
      ['Verified students', '17,850'],
      ['Active rides', '1,284'],
      ['Completed rides', '45,280'],
      ['Successful matches', '12,482'],
      ['Money saved', '₹8.4M'],
      ['Safety cases', '64']
    ].map(([label, value]) => ({ label, value }))} />
    <div className="sa-chart-grid">
      <MiniChart title="Platform growth" values={[42, 58, 67, 82, 96, 120]} labels={['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun']} />
      <MiniChart title="Monthly rides" values={[420, 510, 608, 720, 840, 1020]} labels={['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun']} tone="mint" />
      <MiniChart title="Successful matches" values={[280, 360, 430, 520, 690, 810]} labels={['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun']} />
      <MiniChart title="Student registrations" values={[310, 440, 520, 680, 790, 940]} labels={['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun']} tone="gold" />
    </div>
    <div className="sa-dashboard-grid">
      <section className="sa-panel">
        <div className="sa-panel-head">
          <h3>Top performing colleges</h3>
          <Link to="/super-admin/colleges">Manage colleges ↗</Link>
        </div>
        {superAdminColleges.slice(0, 5).map(college => <div className="sa-ranking" key={college.id}>
          <strong>{college.name}</strong>
          <span>{college.matchSuccessRate}% match success</span>
          <b>{college.completedRides.toLocaleString()}</b>
        </div>)}
      </section>
      <section className="sa-panel">
        <div className="sa-panel-head">
          <h3>Most popular routes</h3>
          <small>Across all colleges</small>
        </div>
        {['Raj Nagar → Campus Gate', 'Indirapuram → Main Block', 'Vaishali → North Entrance', 'Noida Sector 62 → Academic Plaza'].map((route, index) => <div className="sa-ranking" key={route}>
          <strong>{route}</strong>
          <span>{320 - index * 37} shared rides</span>
          <b>#{index + 1}</b>
        </div>)}
      </section>
    </div>
  </div>
}

function RideAnalytics() {
  return <div className="sa-view">
    <Header eyebrow="RIDE INTELLIGENCE" title="Ride performance analytics" description="Occupancy, completion, cost, and route performance across the ride network." />
    <Kpis items={[
      ['Total rides', '45,280'],
      ['Completed rides', '39,642'],
      ['Cancelled rides', '2,840'],
      ['Avg participants', '3.4'],
      ['Avg cost/person', '₹34'],
      ['Avg occupancy', '78%'],
      ['Completion rate', '87.5%']
    ].map(([label, value]) => ({ label, value }))} />
    <div className="sa-chart-grid">
      <MiniChart title="Rides by month" values={[640, 720, 810, 940, 1040, 1220]} labels={['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun']} />
      <MiniChart title="Completed vs cancelled" values={[82, 78, 86, 90, 88, 94]} labels={['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun']} tone="mint" />
      <MiniChart title="Average occupancy" values={[61, 68, 72, 76, 79, 84]} labels={['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun']} tone="gold" />
      <MiniChart title="Average ride cost" values={[28, 30, 29, 33, 34, 36]} labels={['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun']} />
    </div>
    <div className="sa-dashboard-grid">
      <section className="sa-panel">
        <div className="sa-panel-head"><h3>Popular routes</h3></div>
        {['Raj Nagar → Campus Gate', 'Indirapuram → Main Block', 'Vaishali → North Entrance', 'Noida Sector 62 → Academic Plaza'].map((route, i) => <div className="sa-ranking" key={route}>
          <strong>{route}</strong>
          <span>{720 - i * 90} rides</span>
          <b>{89 - i * 3}% occupied</b>
        </div>)}
      </section>
      <section className="sa-panel">
        <div className="sa-panel-head"><h3>Peak departure hours</h3></div>
        {['7:00 AM', '7:30 AM', '8:00 AM', '8:30 AM'].map((time, i) => <div className="sa-ranking" key={time}>
          <strong>{time}</strong>
          <span>{420 - i * 42} rides</span>
          <b>{['High', 'High', 'Medium', 'Low'][i]}</b>
        </div>)}
      </section>
    </div>
  </div>
}

function MatchingAnalytics() {
  const stages = ['Potential', 'Recommended', 'Requested', 'Accepted', 'Completed']
  return <div className="sa-view">
    <Header eyebrow="MATCHING INTELLIGENCE" title="Smart matching analytics" description="Understand how route, time, proximity, and destination signals create successful matches." />
    <Kpis items={[
      ['Match attempts', '18,420'],
      ['Matches generated', '12,482'],
      ['Acceptance rate', '68%'],
      ['Completion rate', '54%'],
      ['Average match score', '84%'],
      ['Route similarity', '79%'],
      ['Time compatibility', '88%'],
      ['Pickup distance', '1.4 km']
    ].map(([label, value]) => ({ label, value }))} />
    <section className="sa-panel sa-funnel">
      <div className="sa-panel-head">
        <h3>Matching funnel</h3>
        <small>Current quarter</small>
      </div>
      {stages.map((stage, index) => <div className="sa-funnel-step" key={stage}>
        <span>{stage}</span>
        <i style={{ width: `${100 - index * 16}%` }} />
        <b>{[18420, 15280, 11240, 8420, 6920][index].toLocaleString()}</b>
      </div>)}
    </section>
    <div className="sa-chart-grid">
      <MiniChart title="Match score distribution" values={[18, 32, 51, 74, 88, 60]} labels={['50', '60', '70', '80', '90', '95+']} />
      <MiniChart title="Route similarity" values={[12, 26, 46, 68, 82, 55]} labels={['40', '50', '60', '70', '80', '90']} tone="mint" />
      <MiniChart title="Time compatibility" values={[14, 28, 48, 72, 91, 64]} labels={['50', '60', '70', '80', '90', '95+']} tone="gold" />
      <MiniChart title="Successful vs unsuccessful" values={[38, 62, 44, 70, 52, 78]} labels={['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun']} />
    </div>
  </div>
}

// ========== COLLEGES MANAGEMENT ==========
function CollegeManagement({ notify }) {
  const [items, setItems] = useState(superAdminColleges)
  const [query, setQuery] = useState('')
  const [city, setCity] = useState('')
  const [status, setStatus] = useState('')
  const [page, setPage] = useState(1)
  const [selectedCollege, setSelectedCollege] = useState(null)
  
  const filtered = items.filter(item =>
    `${item.name} ${item.city}`.toLowerCase().includes(query.toLowerCase()) &&
    (!city || item.city === city) &&
    (!status || item.status === status)
  )
  const visible = filtered.slice((page - 1) * pageSize, page * pageSize)
  
  const add = () => {
    const college = { ...superAdminColleges[0], id: `COL-NEW-${Date.now()}`, name: 'New Campus College', city: 'Noida', status: 'Pending' }
    setItems([college, ...items])
    notify('College added to review queue')
  }
  
  const toggle = id => {
    setItems(items.map(item => item.id === id ? { ...item, status: item.status === 'Active' ? 'Suspended' : 'Active' } : item))
    notify('College status updated')
  }
  
  return <div className="sa-view">
    <Header eyebrow="COLLEGE NETWORK" title="College management" description="Govern identities, performance, and status across every campus." action={<button className="button dark" onClick={add}>＋ Add college</button>} />
    <Filters query={query} setQuery={value => { setQuery(value); setPage(1) }} selects={[
      { label: 'All cities', value: city, setValue: setCity, options: statusOptions(items.map(item => item.city)) },
      { label: 'All statuses', value: status, setValue: setStatus, options: statusOptions(items.map(item => item.status)) }
    ]} />
    <section className="sa-panel">
      <SuperAdminTable
        columns={[
          { key: 'name', label: 'COLLEGE', width: '20%', render: c => <><strong>{c.name}</strong><small>{c.id}</small></> },
          { key: 'city', label: 'CITY', width: '12%' },
          { key: 'totalStudents', label: 'STUDENTS', width: '13%', render: c => c.totalStudents.toLocaleString() },
          { key: 'verifiedStudents', label: 'VERIFIED', width: '13%', render: c => c.verifiedStudents.toLocaleString() },
          { key: 'activeRides', label: 'ACTIVE RIDES', width: '12%' },
          { key: 'matchSuccessRate', label: 'MATCH RATE', width: '12%', render: c => `${c.matchSuccessRate}%` },
          { key: 'status', label: 'STATUS', width: '10%', render: c => <Status value={c.status} /> },
          { key: 'actions', label: 'ACTIONS', width: '8%', render: c => <button onClick={e => { e.stopPropagation(); setSelectedCollege(c) }} className="sa-view-btn">View</button> }
        ]}
        rows={visible}
        onRowClick={c => setSelectedCollege(c)}
        mobileCardRenderer={c => <>
          <div className="sa-card-top">
            <h3>{c.name}</h3>
            <Status value={c.status} />
          </div>
          <small>{c.city} · {c.totalStudents.toLocaleString()} students</small>
          <p>{c.activeRides} active rides · {c.matchSuccessRate}% match</p>
          <button className="button dark" onClick={() => setSelectedCollege(c)}>View Details</button>
        </>}
      />
    </section>
    {selectedCollege && <CollegeDetailsModal college={selectedCollege} close={() => setSelectedCollege(null)} />}
  </div>
}

function CollegeDetailsModal({ college, close }) {
  return <div className="sa-modal-backdrop" onClick={e => e.target === e.currentTarget && close()}>
    <section className="sa-detail-modal">
      <div className="sa-modal-head">
        <div>
          <span className="eyebrow">COLLEGE PROFILE</span>
          <h2>{college.name}</h2>
        </div>
        <button className="sa-modal-close" onClick={close}>×</button>
      </div>
      <div className="sa-detail-sections">
        <section>
          <h3>Overview</h3>
          <div className="sa-detail-fields">
            {[
              ['ID', college.id],
              ['City', college.city],
              ['Status', <Status value={college.status} />],
              ['Joined', college.joinedDate],
              ['Total Students', college.totalStudents.toLocaleString()],
              ['Verified Students', college.verifiedStudents.toLocaleString()],
              ['Active Students', college.activeStudents.toLocaleString()],
            ].map(([label, value]) => <div key={label}><small>{label}</small><strong>{value}</strong></div>)}
          </div>
        </section>
        <section>
          <h3>Performance</h3>
          <div className="sa-detail-fields">
            {[
              ['Active Rides', college.activeRides],
              ['Completed Rides', college.completedRides.toLocaleString()],
              ['Match Success Rate', `${college.matchSuccessRate}%`],
              ['Peak Time', college.peakTime]
            ].map(([label, value]) => <div key={label}><small>{label}</small><strong>{value}</strong></div>)}
          </div>
        </section>
        <section>
          <h3>Administrator</h3>
          <div className="sa-detail-fields">
            {[
              ['Name', college.admin.name],
              ['Email', college.admin.email],
              ['Phone', college.admin.phone]
            ].map(([label, value]) => <div key={label}><small>{label}</small><strong>{value}</strong></div>)}
          </div>
        </section>
        <section>
          <h3>Popular Routes</h3>
          <ul>
            {college.routes.map(route => <li key={route}>{route}</li>)}
          </ul>
        </section>
      </div>
    </section>
  </div>
}

function CollegeDetail({ id }) {
  const college = superAdminColleges.find(item => item.id === id) || superAdminColleges[0]
  const rides = superAdminRides.filter(item => item.collegeId === college.id)
  
  return <div className="sa-view">
    <Link className="sa-back" to="/super-admin/colleges">← All colleges</Link>
    <Header eyebrow={`COLLEGE PROFILE / ${college.id}`} title={college.name} description={`${college.city} · joined ${college.joinedDate}`} />
    <div className="sa-profile-banner">
      <div className="sa-avatar">{college.shortName.slice(0, 2).toUpperCase()}</div>
      <div>
        <h3>{college.admin.name}</h3>
        <p>{college.admin.email} · College administrator</p>
      </div>
      <Status value={college.status} />
    </div>
    <Kpis items={[
      ['Total students', college.totalStudents.toLocaleString()],
      ['Verified', college.verifiedStudents.toLocaleString()],
      ['Active students', college.activeStudents.toLocaleString()],
      ['Active rides', college.activeRides],
      ['Completed rides', college.completedRides],
      ['Match success', `${college.matchSuccessRate}%`]
    ].map(([label, value]) => ({ label, value }))} />
    <div className="sa-detail-grid">
      <section className="sa-panel">
        <div className="sa-panel-head"><h3>Student and verification trend</h3></div>
        <MiniChart title="Monthly verification" values={[61, 72, 68, 84, 91, college.matchSuccessRate]} labels={['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun']} tone="mint" />
      </section>
      <section className="sa-panel">
        <div className="sa-panel-head"><h3>Ride performance</h3></div>
        <MiniChart title="Rides by month" values={[34, 48, 43, 57, 66, rides.length + 20]} labels={['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun']} />
      </section>
      <section className="sa-panel">
        <div className="sa-panel-head"><h3>Popular routes</h3></div>
        {college.routes.map((route, index) => <div className="sa-ranking" key={route}>
          <strong>{route}</strong>
          <span>{92 - index * 18} rides</span>
          <b>{index + 1}</b>
        </div>)}
        <p className="sa-insight">Peak travel time: <strong>{college.peakTime}</strong></p>
      </section>
    </div>
  </div>
}

// ========== USERS MANAGEMENT ==========
function UserManagement({ notify }) {
  const [items, setItems] = useState(superAdminUsers)
  const [query, setQuery] = useState('')
  const [college, setCollege] = useState('')
  const [role, setRole] = useState('')
  const [verification, setVerification] = useState('')
  const [page, setPage] = useState(1)
  const [selectedUser, setSelectedUser] = useState(null)
  
  const filtered = items.filter(item =>
    `${item.name} ${item.email} ${item.college}`.toLowerCase().includes(query.toLowerCase()) &&
    (!college || item.college === college) &&
    (!role || item.role === role) &&
    (!verification || item.verificationStatus === verification)
  )
  const visible = filtered.slice((page - 1) * pageSize, page * pageSize)
  
  return <div className="sa-view">
    <Header eyebrow="IDENTITY OPERATIONS" title="User management" description="Review platform identities, verification, and account access." />
    <Filters query={query} setQuery={value => { setQuery(value); setPage(1) }} selects={[
      { label: 'All colleges', value: college, setValue: setCollege, options: statusOptions(items.map(item => item.college)) },
      { label: 'All roles', value: role, setValue: setRole, options: statusOptions(items.map(item => item.role)) },
      { label: 'Verification', value: verification, setValue: setVerification, options: statusOptions(items.map(item => item.verificationStatus)) }
    ]} />
    <section className="sa-panel">
      <SuperAdminTable
        columns={[
          { key: 'name', label: 'USER', width: '15%', render: u => <><strong>{u.name}</strong><small>{u.id}</small></> },
          { key: 'college', label: 'COLLEGE', width: '18%' },
          { key: 'role', label: 'ROLE', width: '12%' },
          { key: 'verificationStatus', label: 'VERIFICATION', width: '13%', render: u => <Status value={u.verificationStatus} /> },
          { key: 'rating', label: 'RATING', width: '10%', render: u => `★ ${u.rating}` },
          { key: 'completedRides', label: 'RIDES', width: '8%' },
          { key: 'accountStatus', label: 'STATUS', width: '10%', render: u => <Status value={u.accountStatus} /> },
          { key: 'joinedDate', label: 'JOINED', width: '10%' },
          { key: 'actions', label: 'ACTIONS', width: '8%', render: u => <button onClick={e => { e.stopPropagation(); setSelectedUser(u) }} className="sa-view-btn">View</button> }
        ]}
        rows={visible}
        onRowClick={u => setSelectedUser(u)}
        mobileCardRenderer={u => <>
          <div className="sa-card-top">
            <h3>{u.name}</h3>
            <Status value={u.accountStatus} />
          </div>
          <small>{u.college} · {u.role}</small>
          <p>★ {u.rating} · {u.completedRides} rides</p>
          <button className="button dark" onClick={() => setSelectedUser(u)}>View Details</button>
        </>}
      />
    </section>
    {selectedUser && <UserDetailsModal user={selectedUser} close={() => setSelectedUser(null)} />}
  </div>
}

function UserDetailsModal({ user, close }) {
  return <div className="sa-modal-backdrop" onClick={e => e.target === e.currentTarget && close()}>
    <section className="sa-detail-modal">
      <div className="sa-modal-head">
        <div>
          <span className="eyebrow">USER PROFILE</span>
          <h2>{user.name}</h2>
        </div>
        <button className="sa-modal-close" onClick={close}>×</button>
      </div>
      <div className="sa-detail-sections">
        <section>
          <h3>Identity</h3>
          <div className="sa-detail-fields">
            {[
              ['ID', user.id],
              ['Email', user.email],
              ['College', user.college],
              ['Role', user.role],
              ['Course', user.course],
              ['Year', `Year ${user.year}`],
              ['Joined', user.joinedDate]
            ].map(([label, value]) => <div key={label}><small>{label}</small><strong>{value}</strong></div>)}
          </div>
        </section>
        <section>
          <h3>Verification & Status</h3>
          <div className="sa-detail-fields">
            {[
              ['Verification', <Status value={user.verificationStatus} />],
              ['Account Status', <Status value={user.accountStatus} />],
              ['Rating', `★ ${user.rating}`],
              ['Completed Rides', user.completedRides],
              ['Cancelled Rides', user.cancelledRides],
              ['Money Saved', `₹${user.moneySaved.toLocaleString()}`],
              ['Safety Reports', user.safetyReports]
            ].map(([label, value]) => <div key={label}><small>{label}</small><strong>{value}</strong></div>)}
          </div>
        </section>
      </div>
    </section>
  </div>
}

function UserDetail({ id }) {
  const user = superAdminUsers.find(item => item.id === id) || superAdminUsers[0]
  
  return <div className="sa-view">
    <Link className="sa-back" to="/super-admin/users">← All users</Link>
    <Header eyebrow={`USER PROFILE / ${user.id}`} title={user.name} description={`${user.role} · ${user.college}`} />
    <div className="sa-profile-banner">
      <div className="sa-avatar">{user.name.slice(0, 2)}</div>
      <div>
        <h3>{user.email}</h3>
        <p>{user.course} · Year {user.year} · joined {user.joinedDate}</p>
      </div>
      <Status value={user.accountStatus} />
    </div>
    <Kpis items={[
      ['Verification', user.verificationStatus],
      ['Rating', `★ ${user.rating}`],
      ['Completed rides', user.completedRides],
      ['Cancelled rides', user.cancelledRides],
      ['Money saved', `₹${user.moneySaved.toLocaleString()}`],
      ['Safety reports', user.safetyReports]
    ].map(([label, value]) => ({ label, value }))} />
  </div>
}

// ========== RIDES MANAGEMENT ==========
function RideManagementPro() {
  const [query, setQuery] = useState('')
  const [status, setStatus] = useState('')
  const [college, setCollege] = useState('')
  const [route, setRoute] = useState('')
  const [page, setPage] = useState(1)
  const [selectedRide, setSelectedRide] = useState(null)
  
  const filtered = superAdminRides.filter(item =>
    `${item.id} ${item.organizer} ${item.route} ${item.college}`.toLowerCase().includes(query.toLowerCase()) &&
    (!status || item.status === status) &&
    (!college || item.college === college) &&
    (!route || item.route === route)
  )
  const visible = filtered.slice((page - 1) * pageSize, page * pageSize)
  
  return <div className="sa-view">
    <Header eyebrow="RIDE OPERATIONS" title="Platform rides" description="View all rides with essential information. Click any row to inspect the complete record." />
    <Filters query={query} setQuery={value => { setQuery(value); setPage(1) }} selects={[
      { label: 'All colleges', value: college, setValue: value => { setCollege(value); setPage(1) }, options: statusOptions(superAdminRides.map(item => item.college)) },
      { label: 'All statuses', value: status, setValue: value => { setStatus(value); setPage(1) }, options: statusOptions(superAdminRides.map(item => item.status)) },
      { label: 'All routes', value: route, setValue: value => { setRoute(value); setPage(1) }, options: statusOptions(superAdminRides.map(item => item.route)) }
    ]} />
    <section className="sa-panel">
      <SuperAdminTable
        columns={[
          { key: 'id', label: 'RIDE', width: '12%', render: r => <><strong>{r.id}</strong><small>{r.matchScore}%</small></> },
          { key: 'organizer', label: 'ORGANIZER', width: '14%' },
          { key: 'college', label: 'COLLEGE', width: '16%' },
          { key: 'route', label: 'ROUTE', width: '18%' },
          { key: 'date', label: 'DATE & TIME', width: '15%', render: r => <><span>{r.date}</span><span>{r.departureTime}</span></> },
          { key: 'seats', label: 'SEATS', width: '10%', render: r => `${r.seats - r.availableSeats}/${r.seats}` },
          { key: 'status', label: 'STATUS', width: '10%', render: r => <Status value={r.status} /> },
          { key: 'actions', label: 'ACTIONS', width: '5%', render: r => <button onClick={e => { e.stopPropagation(); setSelectedRide(r) }} className="sa-view-btn">View</button> }
        ]}
        rows={visible}
        onRowClick={r => setSelectedRide(r)}
        mobileCardRenderer={r => <>
          <div className="sa-card-top">
            <h3>{r.id}</h3>
            <Status value={r.status} />
          </div>
          <small>{r.organizer} · {r.college}</small>
          <p>{r.route} · {r.date}</p>
          <p>{r.seats - r.availableSeats}/{r.seats} seats · ₹{r.costPerPerson}/person</p>
          <button className="button dark" onClick={() => setSelectedRide(r)}>View Details</button>
        </>}
      />
    </section>
    {selectedRide && <RideDetails ride={selectedRide} close={() => setSelectedRide(null)} />}
  </div>
}

function RideDetails({ ride, close }) {
  const origin = ride.route.split(' → ')[0]
  const destination = ride.route.split(' → ')[1] || ride.route
  const pickupPoints = ride.pickupPoints || [origin, 'Main junction', 'Campus gate']
  const participants = superAdminUsers.filter(user => user.collegeId === ride.collegeId).slice(0, Math.max(1, ride.participants))
  
  return <div className="sa-modal-backdrop" onClick={e => e.target === e.currentTarget && close()}>
    <section className="sa-ride-details">
      <div className="sa-modal-head">
        <div>
          <span className="eyebrow">RIDE RECORD</span>
          <h2>Ride #{ride.id}</h2>
        </div>
        <button className="sa-modal-close" onClick={close}>×</button>
      </div>
      <div className="sa-ride-identity">
        <div><small>Organizer</small><strong>{ride.organizer}</strong></div>
        <div><small>College</small><strong>{ride.college}</strong></div>
        <Status value={ride.status} />
      </div>
      <div className="sa-route-detail">
        <span>ROUTE</span>
        <strong>{origin}</strong>
        <i>↓</i>
        <strong>{destination}</strong>
      </div>
      <div className="sa-detail-sections">
        <section>
          <h3>Trip information</h3>
          <div className="sa-detail-fields">
            {[['Date', ride.date], ['Departure', ride.departureTime], ['Vehicle', ride.vehicleType], ['Total seats', ride.seats], ['Participants', ride.participants], ['Available seats', ride.availableSeats], ['Estimated fare', `₹${ride.costPerPerson * ride.seats}`], ['Cost per person', `₹${ride.costPerPerson}`], ['Created', ride.createdDate]].map(([label, value]) => <div key={label}><small>{label}</small><strong>{value}</strong></div>)}
          </div>
        </section>
        <section>
          <h3>Pickup points</h3>
          <ul>{pickupPoints.map(point => <li key={point}>{point}</li>)}</ul>
          <h3>Participants</h3>
          <ul>{participants.length ? participants.map(user => <li key={user.id}>{user.name}</li>) : <li>No participants yet</li>}</ul>
        </section>
        <section>
          <h3>Match information</h3>
          <div className="sa-detail-fields">
            {[['Match score', `${ride.matchScore}%`], ['Route similarity', '94%'], ['Time compatibility', '89%'], ['Pickup distance', '1.2 km']].map(([label, value]) => <div key={label}><small>{label}</small><strong>{value}</strong></div>)}
          </div>
        </section>
      </div>
    </section>
  </div>
}

// ========== REPORTS MANAGEMENT ==========
function ReportCenter({ notify }) {
  const [items, setItems] = useState(superAdminReports)
  const [type, setType] = useState('')
  const [college, setCollege] = useState('')
  const [selectedReport, setSelectedReport] = useState(null)
  
  const filtered = items.filter(item =>
    (!type || item.type === type) &&
    (!college || item.college === college)
  )
  
  const generate = () => {
    const report = { ...items[0], id: `RPT-${Date.now()}`, type: type || 'Monthly Ride Report', college: college || 'All colleges', generatedDate: new Date().toISOString().slice(0, 10), status: 'Ready' }
    setItems([report, ...items])
    notify('Report generated successfully')
  }
  
  return <div className="sa-view">
    <Header eyebrow="REPORT CENTER" title="Generated reports" description="Create, inspect, and download platform intelligence on demand." action={<button className="button dark" onClick={generate}>＋ Generate report</button>} />
    <div className="sa-filters">
      <select value={type} onChange={event => setType(event.target.value)}>
        <option value="">All report types</option>
        {statusOptions(items.map(item => item.type)).map(value => <option key={value}>{value}</option>)}
      </select>
      <select value={college} onChange={event => setCollege(event.target.value)}>
        <option value="">All colleges</option>
        {statusOptions(items.map(item => item.college)).map(value => <option key={value}>{value}</option>)}
      </select>
    </div>
    <section className="sa-report-grid">
      {filtered.map(report => <article className="sa-report-card" key={report.id}>
        <span className="eyebrow">{report.id}</span>
        <h3>{report.type}</h3>
        <p>{report.dateRange}</p>
        <small>{report.college} · generated by {report.generatedBy}</small>
        <div>
          <Status value={report.status} />
          <button onClick={() => notify(`${report.id} opened`)}>View</button>
          <button onClick={() => notify(`Mock download started for ${report.id}`)}>Download</button>
        </div>
      </article>)}
    </section>
  </div>
}

// ========== SAFETY OPERATIONS ==========
function SafetyOperations({ notify }) {
  const [items, setItems] = useState(superAdminSafety)
  const [status, setStatus] = useState('')
  const [selectedCase, setSelectedCase] = useState(null)
  
  const resolve = id => {
    setItems(items.map(item => item.id === id ? { ...item, status: 'Resolved', resolution: 'Resolved by Safety Desk' } : item))
    notify('Safety case resolved')
  }
  
  const filtered = items.filter(item => !status || item.status === status)
  
  return <div className="sa-view">
    <Header eyebrow="TRUST & SAFETY" title="Safety operations" description="Prioritize reports, coordinate response, and close safety cases." />
    <Kpis items={[
      ['Total safety cases', items.length],
      ['Open cases', items.filter(i => i.status === 'Open').length],
      ['Resolved cases', items.filter(i => i.status === 'Resolved').length],
      ['High priority', items.filter(i => ['High', 'Critical'].includes(i.severity)).length],
      ['Emergency reports', items.filter(i => i.category === 'Emergency').length],
      ['Avg response time', '18 min']
    ].map(([label, value]) => ({ label, value }))} />
    <div className="sa-filters">
      <select value={status} onChange={event => setStatus(event.target.value)}>
        <option value="">All case statuses</option>
        {statusOptions(items.map(item => item.status)).map(value => <option key={value}>{value}</option>)}
      </select>
    </div>
    <section className="sa-panel">
      <SuperAdminTable
        columns={[
          { key: 'id', label: 'CASE', width: '12%' },
          { key: 'reportedBy', label: 'REPORTED BY', width: '15%' },
          { key: 'college', label: 'COLLEGE', width: '18%' },
          { key: 'category', label: 'CATEGORY', width: '15%' },
          { key: 'severity', label: 'SEVERITY', width: '12%', render: item => <Status value={item.severity} /> },
          { key: 'date', label: 'DATE', width: '12%' },
          { key: 'status', label: 'STATUS', width: '12%', render: item => <Status value={item.status} /> },
          { key: 'actions', label: 'ACTIONS', width: '8%', render: item => item.status !== 'Resolved' ? <button onClick={e => { e.stopPropagation(); resolve(item.id) }} className="sa-inline-button">Resolve</button> : <span className="sa-inline-button disabled">Resolved</span> }
        ]}
        rows={filtered}
        onRowClick={c => setSelectedCase(c)}
        mobileCardRenderer={c => <>
          <div className="sa-card-top">
            <h3>{c.id}</h3>
            <Status value={c.status} />
          </div>
          <small>{c.reportedBy} · {c.college}</small>
          <p>{c.category} · <Status value={c.severity} /></p>
          <button className="button dark" onClick={() => setSelectedCase(c)}>View Details</button>
        </>}
      />
    </section>
    {selectedCase && <SafetyDetailsModal case={selectedCase} close={() => setSelectedCase(null)} onResolve={() => { resolve(selectedCase.id); setSelectedCase(null) }} />}
  </div>
}

function SafetyDetailsModal({ case: c, close, onResolve }) {
  return <div className="sa-modal-backdrop" onClick={e => e.target === e.currentTarget && close()}>
    <section className="sa-detail-modal">
      <div className="sa-modal-head">
        <div>
          <span className="eyebrow">SAFETY CASE</span>
          <h2>{c.id}</h2>
        </div>
        <button className="sa-modal-close" onClick={close}>×</button>
      </div>
      <div className="sa-detail-sections">
        <section>
          <h3>Case Information</h3>
          <div className="sa-detail-fields">
            {[
              ['ID', c.id],
              ['Reported By', c.reportedBy],
              ['Reported User', c.reportedUser],
              ['College', c.college],
              ['Date', c.date],
              ['Category', c.category],
              ['Severity', <Status value={c.severity} />],
              ['Status', <Status value={c.status} />],
              ['Assigned Admin', c.assignedAdmin],
              ['Resolution', c.resolution]
            ].map(([label, value]) => <div key={label}><small>{label}</small><strong>{value}</strong></div>)}
          </div>
        </section>
      </div>
      {c.status !== 'Resolved' && <div className="sa-modal-actions">
        <button className="button dark" onClick={onResolve}>Resolve Case</button>
        <button className="button ghost" onClick={close}>Close</button>
      </div>}
    </section>
  </div>
}

// ========== COMPLAINTS MANAGEMENT ==========
function ComplaintCenter({ notify }) {
  const [items, setItems] = useState(superAdminComplaints)
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState('')
  const [priority, setPriority] = useState('')
  const [status, setStatus] = useState('')
  const [selectedComplaint, setSelectedComplaint] = useState(null)
  
  const update = (id, next) => {
    setItems(items.map(item => item.id === id ? { ...item, status: next, lastUpdated: 'Just now' } : item))
    notify(`Complaint marked ${next.toLowerCase()}`)
  }
  
  const filtered = items.filter(item =>
    `${item.id} ${item.student} ${item.description}`.toLowerCase().includes(query.toLowerCase()) &&
    (!category || item.category === category) &&
    (!priority || item.priority === priority) &&
    (!status || item.status === status)
  )
  
  return <div className="sa-view">
    <Header eyebrow="CUSTOMER SUPPORT" title="Platform complaints" description="Resolve product, fare, matching, and account issues separately from safety cases." />
    <Filters query={query} setQuery={setQuery} selects={[
      { label: 'All categories', value: category, setValue: setCategory, options: statusOptions(items.map(i => i.category)) },
      { label: 'All priorities', value: priority, setValue: setPriority, options: statusOptions(items.map(i => i.priority)) },
      { label: 'All statuses', value: status, setValue: setStatus, options: statusOptions(items.map(i => i.status)) }
    ]} />
    <section className="sa-panel">
      <SuperAdminTable
        columns={[
          { key: 'id', label: 'COMPLAINT', width: '14%', render: c => <><strong>{c.id}</strong><small>Platform complaint</small></> },
          { key: 'student', label: 'STUDENT', width: '13%' },
          { key: 'college', label: 'COLLEGE', width: '20%' },
          { key: 'category', label: 'CATEGORY', width: '15%' },
          { key: 'priority', label: 'PRIORITY', width: '9%', render: c => <Status value={c.priority} /> },
          { key: 'createdDate', label: 'CREATED', width: '11%' },
          { key: 'status', label: 'STATUS', width: '10%', render: c => <Status value={c.status} /> },
          { key: 'actions', label: 'ACTIONS', width: '8%', render: c => <button onClick={e => { e.stopPropagation(); setSelectedComplaint(c) }} className="sa-view-btn">View</button> }
        ]}
        rows={filtered}
        onRowClick={c => setSelectedComplaint(c)}
        mobileCardRenderer={c => <>
          <div className="sa-card-top">
            <h3>{c.id}</h3>
            <Status value={c.status} />
          </div>
          <small>{c.student} · {c.college}</small>
          <p>{c.category} · Priority: <Status value={c.priority} /></p>
          <button className="button dark" onClick={() => setSelectedComplaint(c)}>View Details</button>
        </>}
      />
    </section>
    {selectedComplaint && <ComplaintDetailsModal complaint={selectedComplaint} close={() => setSelectedComplaint(null)} onUpdate={update} />}
  </div>
}

function ComplaintDetailsModal({ complaint, close, onUpdate }) {
  return <div className="sa-modal-backdrop" onClick={e => e.target === e.currentTarget && close()}>
    <section className="sa-detail-modal">
      <div className="sa-modal-head">
        <div>
          <span className="eyebrow">COMPLAINT DETAILS</span>
          <h2>{complaint.id}</h2>
        </div>
        <button className="sa-modal-close" onClick={close}>×</button>
      </div>
      <div className="sa-detail-sections">
        <section>
          <h3>Complaint Information</h3>
          <div className="sa-detail-fields">
            {[
              ['Complaint ID', complaint.id],
              ['Student', complaint.student],
              ['College', complaint.college],
              ['Category', complaint.category],
              ['Priority', <Status value={complaint.priority} />],
              ['Status', <Status value={complaint.status} />],
              ['Created', complaint.createdDate],
              ['Last Updated', complaint.lastUpdated],
              ['Assigned To', complaint.assignedTo]
            ].map(([label, value]) => <div key={label}><small>{label}</small><strong>{value}</strong></div>)}
          </div>
        </section>
        <section>
          <h3>Description</h3>
          <p className="sa-complaint-description">{complaint.description}</p>
        </section>
      </div>
      <div className="sa-modal-actions">
        {complaint.status !== 'Resolved' && <button className="button dark" onClick={() => { onUpdate(complaint.id, 'Resolved'); close() }}>Mark Resolved</button>}
        {complaint.status === 'Resolved' && <button className="button dark" onClick={() => { onUpdate(complaint.id, 'Reopened'); close() }}>Reopen</button>}
        <button className="button ghost" onClick={close}>Close</button>
      </div>
    </section>
  </div>
}

// ========== AUDIT LOG ==========
function AuditLog() {
  const [query, setQuery] = useState('')
  const [role, setRole] = useState('')
  const [module, setModule] = useState('')
  const [action, setAction] = useState('')
  const [status, setStatus] = useState('')
  const [page, setPage] = useState(1)
  const [selectedActivity, setSelectedActivity] = useState(null)
  
  const filtered = superAdminActivities.filter(item =>
    `${item.id} ${item.user} ${item.action} ${item.description}`.toLowerCase().includes(query.toLowerCase()) &&
    (!role || item.role === role) &&
    (!module || item.module === module) &&
    (!action || item.action === action) &&
    (!status || item.status === status)
  )
  
  const totalEvents = superAdminActivities.length
  const successCount = superAdminActivities.filter(i => i.status === 'Success').length
  const failedCount = superAdminActivities.filter(i => i.status === 'Failed').length
  const todayCount = filtered.length
  
  return <div className="sa-view">
    <Header eyebrow="AUDIT & COMPLIANCE" title="System activity" description="Immutable-looking operational audit trail of platform events and administrative actions." />
    <section className="sa-panel">
      <Filters query={query} setQuery={value => { setQuery(value); setPage(1) }} selects={[
        { label: 'All roles', value: role, setValue: value => { setRole(value); setPage(1) }, options: statusOptions(superAdminActivities.map(i => i.role)) },
        { label: 'All modules', value: module, setValue: value => { setModule(value); setPage(1) }, options: statusOptions(superAdminActivities.map(i => i.module)) },
        { label: 'All actions', value: action, setValue: value => { setAction(value); setPage(1) }, options: statusOptions(superAdminActivities.map(i => i.action)) },
        { label: 'All statuses', value: status, setValue: value => { setStatus(value); setPage(1) }, options: statusOptions(superAdminActivities.map(i => i.status)) }
      ]} />
    </section>
    <div className="sa-audit-kpis">
      <div className="sa-audit-kpi">
        <small>Total Events</small>
        <strong>{totalEvents.toLocaleString()}</strong>
      </div>
      <div className="sa-audit-kpi">
        <small>Successful</small>
        <strong>{successCount.toLocaleString()}</strong>
      </div>
      <div className="sa-audit-kpi">
        <small>Failed</small>
        <strong>{failedCount}</strong>
      </div>
      <div className="sa-audit-kpi">
        <small>Matching Results</small>
        <strong>{filtered.length}</strong>
      </div>
    </div>
    <section className="sa-panel">
      <div className="sa-panel-head">
        <h3>Activity timeline</h3>
        <small>Latest platform events</small>
      </div>
      <div className="sa-audit-timeline">
        {filtered.slice((page - 1) * pageSize, page * pageSize).map(item => <article className="sa-timeline-event" key={item.id} onClick={() => setSelectedActivity(item)}>
          <div className="sa-event-dot" />
          <div className="sa-event-content">
            <div className="sa-event-header">
              <strong>{item.action}</strong>
              <Status value={item.status} />
            </div>
            <div className="sa-event-details">
              <span>{item.user}</span>
              <span>·</span>
              <span>{item.role}</span>
              <span>·</span>
              <span>{item.module}</span>
            </div>
            <p className="sa-event-description">{item.description}</p>
            <div className="sa-event-meta">
              <span className="sa-event-time">{item.timestamp}</span>
              <span className="sa-event-id">{item.id}</span>
            </div>
          </div>
        </article>)}
      </div>
      {filtered.length === 0 && <div className="sa-empty-state">
        <p>No activities match your filters.</p>
      </div>}
    </section>
    <Pager page={page} total={filtered.length} setPage={setPage} />
    {selectedActivity && <ActivityDetailsModal activity={selectedActivity} close={() => setSelectedActivity(null)} />}
  </div>
}

function ActivityDetailsModal({ activity, close }) {
  return <div className="sa-modal-backdrop" onClick={e => e.target === e.currentTarget && close()}>
    <section className="sa-detail-modal">
      <div className="sa-modal-head">
        <div>
          <span className="eyebrow">ACTIVITY RECORD</span>
          <h2>{activity.id}</h2>
        </div>
        <button className="sa-modal-close" onClick={close}>×</button>
      </div>
      <div className="sa-detail-sections">
        <section>
          <h3>Event Information</h3>
          <div className="sa-detail-fields">
            {[
              ['Activity ID', activity.id],
              ['Action', activity.action],
              ['Status', <Status value={activity.status} />],
              ['Timestamp', activity.timestamp],
              ['User', activity.user],
              ['Role', activity.role],
              ['Module', activity.module],
              ['Description', activity.description],
              ['Device / IP', activity.device]
            ].map(([label, value]) => <div key={label}><small>{label}</small><strong>{value}</strong></div>)}
          </div>
        </section>
      </div>
    </section>
  </div>
}

// ========== SETTINGS ==========
function SuperSettings({ notify }) {
  const [settings, setSettings] = useState(() => JSON.parse(localStorage.getItem('campuspool-super-settings') || '{"matchingMode":"Balanced","minimumScore":"70","safetyAlerts":true,"emailDigest":true,"twoFactor":true,"compactTables":false,"adminName":"Platform Operations"}'))
  
  const update = (key, value) => setSettings({ ...settings, [key]: value })
  
  const save = event => {
    event.preventDefault()
    localStorage.setItem('campuspool-super-settings', JSON.stringify(settings))
    notify('Super Admin settings saved')
  }
  
  const toggle = key => <button type="button" className={settings[key] ? 'toggle on' : 'toggle'} onClick={() => update(key, !settings[key])}>
    {settings[key] ? 'On' : 'Off'}
  </button>
  
  return <div className="sa-view">
    <Header eyebrow="PLATFORM CONFIGURATION" title="Super Admin settings" description="Control matching, safety, notifications, security, and your admin workspace." />
    <form className="sa-settings" onSubmit={save}>
      <section className="sa-panel">
        <h3>Platform settings</h3>
        <label>Platform name<input value="CampusPool" readOnly /></label>
        <label>Default region<select value="NCR" readOnly><option>NCR</option></select></label>
        <label>Admin display name<input value={settings.adminName} onChange={event => update('adminName', event.target.value)} /></label>
      </section>
      <section className="sa-panel">
        <h3>Matching settings</h3>
        <label>Matching mode<select value={settings.matchingMode} onChange={event => update('matchingMode', event.target.value)}><option>Balanced</option><option>Route first</option><option>Time first</option></select></label>
        <label>Minimum match score<input type="number" value={settings.minimumScore} onChange={event => update('minimumScore', event.target.value)} /></label>
      </section>
      <section className="sa-panel">
        <h3>Safety settings</h3>
        <div className="sa-setting-row">
          <span><strong>Emergency alerts</strong><small>Notify the safety desk immediately.</small></span>
          {toggle('safetyAlerts')}
        </div>
      </section>
      <section className="sa-panel">
        <h3>Notifications</h3>
        <div className="sa-setting-row">
          <span><strong>Email digest</strong><small>Daily platform summary.</small></span>
          {toggle('emailDigest')}
        </div>
        <div className="sa-setting-row">
          <span><strong>Two-factor authentication</strong><small>Extra security for admin login.</small></span>
          {toggle('twoFactor')}
        </div>
      </section>
      <button type="submit" className="button dark">Save settings ↗</button>
    </form>
  </div>
}
