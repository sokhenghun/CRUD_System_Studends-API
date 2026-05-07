import { useEffect, useMemo, useRef, useState } from 'react'
import axios from 'axios'
import RetroErrorWindow from './RetroErrorWindow.jsx'
import './App.css'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? 'http://127.0.0.1:8000/api',
})

/** Debug: log API + form flow (remove or gate with import.meta.env.DEV when done debugging). */
const log = (...args) => console.log('[CRUD]', ...args)

function validateForm(values) {
  const nextErrors = {}

  if (!values.name.trim()) {
    nextErrors.name = 'Name is required.'
  } else if (values.name.trim().length < 3) {
    nextErrors.name = 'Name must be at least 3 characters.'
  }

  if (!values.email.trim()) {
    nextErrors.email = 'Email is required.'
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) {
    nextErrors.email = 'Please enter a valid email address.'
  }

  if (!values.phone.trim()) {
    nextErrors.phone = 'Phone is required.'
  } else if (!/^\+?[0-9]{8,15}$/.test(values.phone.trim())) {
    nextErrors.phone = 'Phone must be 8 to 15 digits.'
  }

  if (!values.course.trim()) {
    nextErrors.course = 'Course is required.'
  }

  if (!['1', '2', '3', '4'].includes(values.year_level)) {
    nextErrors.year_level = 'Please select a valid year level.'
  }

  return nextErrors
}

const emptyForm = {
  name: '',
  email: '',
  phone: '',
  course: '',
  year_level: '1',
}

const STUDENTS_PAGE_SIZE = 10

function AppHeader() {
  return (
    <header className="app-header">
      <a href="#add-student" className="skip-link">
        Skip to add student
      </a>
      <a href="#students-list" className="skip-link">
        Skip to student list
      </a>
      <div className="app-header-row">
        <div className="app-header-brand">
          <div className="rupp-brand-banner">
            <a
              className="app-header-logo-link"
              href="https://www.rupp.edu.kh"
              target="_blank"
              rel="noopener noreferrer"
              title="Royal University of Phnom Penh — official site"
            >
              <img
                className="school-logo"
                src="/school-logo.svg"
                alt="Royal University of Phnom Penh"
                decoding="async"
              />
            </a>
            <div className="rupp-brand-copy">
              <p className="rupp-name-km" lang="km">
                សាកលវិទ្យាល័យភូមិន្ទភ្នំពេញ
              </p>
              <p className="rupp-name-en">Royal University of Phnom Penh</p>
              <a
                className="rupp-site-link"
                href="https://www.rupp.edu.kh"
                target="_blank"
                rel="noopener noreferrer"
              >
                rupp.edu.kh
              </a>
            </div>
          </div>
          <div className="app-header-titles">
            <h1 className="app-header-title">Student Management</h1>
            <p className="app-header-tagline">Create, read, update & delete · Laravel API + React</p>
          </div>
        </div>
        <nav className="app-header-nav" aria-label="Quick navigation">
          <a href="#add-student" className="app-nav-pill">
            Add student
          </a>
          <a href="#students-list" className="app-nav-pill">
            Directory
          </a>
        </nav>
        <div className="app-header-stack" aria-label="Technology stack">
          <span className="app-stack-label">Stack</span>
          <div className="app-stack-icons">
            <a
              className="app-stack-link"
              href="https://react.dev"
              target="_blank"
              rel="noopener noreferrer"
              title="React"
            >
              <svg className="app-stack-svg" viewBox="-11.5 -10.23174 23 20.46348" aria-hidden="true">
                <circle cx="0" cy="0" r="2.05" fill="#61dafb" />
                <g stroke="#61dafb" strokeWidth="1" fill="none">
                  <ellipse rx="11" ry="4.2" />
                  <ellipse rx="11" ry="4.2" transform="rotate(60)" />
                  <ellipse rx="11" ry="4.2" transform="rotate(120)" />
                </g>
              </svg>
              <span className="visually-hidden">React</span>
            </a>
            <a
              className="app-stack-link"
              href="https://laravel.com"
              target="_blank"
              rel="noopener noreferrer"
              title="Laravel"
            >
              <svg className="app-stack-svg" viewBox="0 0 50 52" aria-hidden="true">
                <path
                  fill="#FF2D20"
                  fillRule="evenodd"
                  d="M49.626 11.564a.809.809 0 01.028.209v10.972a.8.8 0 01-.402.694l-9.209 5.302V39.25c0 .286-.152.55-.4.694L25.813 49.837a.79.79 0 01-.788 0L11.648 39.944a.8.8 0 01-.402-.694V6.502c0-.286.152-.55.4-.694l9.209-5.302a.79.79 0 01.788 0l9.216 5.302c.248.144.4.408.4.694v10.816l8.004-4.618v-6.2c0-.286.152-.55.4-.694l9.209-5.302a.79.79 0 01.788 0l9.216 5.302c.248.144.4.408.4.694v.002zm-1.225-.006l-8.004 4.618v6.2a.79.79 0 01-.402.694l-9.209 5.302a.79.79 0 01-.788 0l-9.216-5.302a.8.8 0 01-.402-.694V12.38l8.618 4.992a.79.79 0 00.788 0l9.216-5.302a.793.793 0 00.397-.692v-.002L49.626 11.564zm-9.416 21.14l-8.004-4.618V17.27l8.004 4.618v10.816zm-9.618-16.476l-8.618-4.992-8.616 4.992 8.616 4.992 8.618-4.992zm-.788 19.89l-9.216 5.302a.79.79 0 01-.788 0l-9.216-5.302V7.38l8.618 4.992a.79.79 0 00.788 0l9.216-5.302v24.928z"
                />
              </svg>
              <span className="visually-hidden">Laravel</span>
            </a>
            <a
              className="app-stack-link"
              href="https://vite.dev"
              target="_blank"
              rel="noopener noreferrer"
              title="Vite"
            >
              <svg className="app-stack-svg app-stack-svg-vite" viewBox="0 0 256 257" aria-hidden="true">
                <defs>
                  <linearGradient id="appStackViteA" x1="-0.828%" x2="57.636%" y1="7.652%" y2="78.411%">
                    <stop offset="0%" stopColor="#41D1FF" />
                    <stop offset="100%" stopColor="#BD34FE" />
                  </linearGradient>
                  <linearGradient id="appStackViteB" x1="43.376%" x2="50.316%" y1="2.242%" y2="89.03%">
                    <stop offset="0%" stopColor="#FFBD4F" />
                    <stop offset="100%" stopColor="#FF980E" />
                  </linearGradient>
                </defs>
                <path
                  fill="url(#appStackViteA)"
                  d="M255.153 37.938L134.897 252.976c-2.483 4.44-8.862 4.466-11.382.048L.875 37.958c-2.746-4.814 1.371-10.646 6.827-9.67l120.385 21.517a6.537 6.537 0 002.322-.004l117.867-21.483c5.438-.991 9.574 4.796 6.877 9.62z"
                />
                <path
                  fill="url(#appStackViteB)"
                  d="M185.432.063L96.44 17.501a3.268 3.268 0 00-2.634 3.014l-5.474 92.456a3.268 3.268 0 003.997 3.378l24.777-5.718c2.318-.535 4.413 1.507 3.936 3.838l-7.361 36.047c-.495 2.426 1.782 4.5 4.151 3.78l15.304-4.649c2.372-.72 4.652 1.36 4.15 3.788l-11.698 56.621c-.732 3.542 3.979 5.473 5.943 2.437l1.313-2.028 72.516-144.72c1.215-2.423-.88-5.186-3.54-4.672l-25.505 4.922c-2.396.462-4.435-1.77-3.759-4.114l16.646-57.705c.677-2.35-1.37-4.583-3.769-4.113z"
                />
              </svg>
              <span className="visually-hidden">Vite</span>
            </a>
          </div>
        </div>
      </div>
    </header>
  )
}

function App() {
  const [students, setStudents] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [studentsPage, setStudentsPage] = useState(1)
  const [form, setForm] = useState(emptyForm)
  const [touched, setTouched] = useState({})
  const [editingId, setEditingId] = useState(null)
  const [deleteState, setDeleteState] = useState({
    open: false,
    student: null,
    phoneInput: '',
    error: '',
    deleting: false,
    success: false,
  })
  const [loading, setLoading] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [alert, setAlert] = useState({ type: '', message: '' })
  const deletePhoneSuccessTimerRef = useRef(null)

  const clearDeletePhoneSuccessTimer = () => {
    if (deletePhoneSuccessTimerRef.current != null) {
      window.clearTimeout(deletePhoneSuccessTimerRef.current)
      deletePhoneSuccessTimerRef.current = null
    }
  }

  useEffect(() => {
    return () => {
      if (deletePhoneSuccessTimerRef.current != null) {
        window.clearTimeout(deletePhoneSuccessTimerRef.current)
        deletePhoneSuccessTimerRef.current = null
      }
    }
  }, [])

  const displayErrors = useMemo(() => {
    const fieldErrors = validateForm(form)
    const next = {}
    for (const key of Object.keys(touched)) {
      if (touched[key]) next[key] = fieldErrors[key]
    }
    return next
  }, [form, touched])

  const showAlert = (type, message) => {
    setAlert({ type, message })
    window.clearTimeout(showAlert.timer)
    showAlert.timer = window.setTimeout(() => {
      setAlert({ type: '', message: '' })
    }, 2600)
  }

  const fetchStudents = async () => {
    log('GET /students — request')
    try {
      setLoading(true)
      const { data } = await api.get('/students')
      log('GET /students — response data', data)
      setStudents(data)
    } catch (err) {
      log('GET /students — error', {
        message: err.message,
        status: err.response?.status,
        data: err.response?.data,
      })
      const status = err.response?.status
      const base = api.defaults.baseURL ?? ''
      let msg = 'Failed to load students.'
      if (status) {
        msg += ` The API responded with HTTP ${status}.`
        if (status >= 500) {
          msg += ' Check Laravel logs; on a new database run: php artisan migrate --force'
        }
      } else {
        msg += ` No response from ${base}. Start Laravel (php artisan serve in backend-laravel) or set VITE_API_URL in frontend-react/.env.`
      }
      showAlert('error', msg)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    log('config', {
      VITE_API_URL: import.meta.env.VITE_API_URL,
      baseURL: api.defaults.baseURL,
    })
    queueMicrotask(() => {
      void fetchStudents()
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps -- load list once on mount; mutations call fetchStudents explicitly
  }, [])

  const onChange = (event) => {
    const { name, value } = event.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  const onBlur = (event) => {
    const { name } = event.target
    setTouched((prev) => ({ ...prev, [name]: true }))
  }

  const resetForm = () => {
    setForm(emptyForm)
    setTouched({})
    setEditingId(null)
  }

  const onSubmit = async (event) => {
    event.preventDefault()
    const validationErrors = validateForm(form)
    if (Object.keys(validationErrors).length > 0) {
      setTouched({
        name: true,
        email: true,
        phone: true,
        course: true,
        year_level: true,
      })
      showAlert('error', 'Please correct the highlighted fields.')
      return
    }

    setSubmitting(true)
    const payload = {
      ...form,
      year_level: Number(form.year_level),
    }
    log('submit payload', { editingId, payload })
    try {
      if (editingId) {
        const res = await api.put(`/students/${editingId}`, payload)
        log('PUT /students/:id — response', res.status, res.data)
        showAlert('success', 'Student updated successfully.')
      } else {
        const res = await api.post('/students', payload)
        log('POST /students — response', res.status, res.data)
        showAlert('success', 'Student created successfully.')
        setSearchTerm('')
        setStudentsPage(1)
      }
      resetForm()
      await fetchStudents()
    } catch (err) {
      log('save error', {
        status: err.response?.status,
        data: err.response?.data,
      })
      const backendErrors = err.response?.data?.errors
      const firstBackendError = backendErrors ? Object.values(backendErrors).flat()[0] : null
      const message = firstBackendError ?? err.response?.data?.message ?? 'Save failed. Check input values.'
      showAlert('error', message)
    } finally {
      setSubmitting(false)
    }
  }

  const onEdit = (student) => {
    log('edit row', student)
    setEditingId(student.id)
    setForm({
      name: student.name,
      email: student.email,
      phone: student.phone ?? '',
      course: student.course,
      year_level: String(student.year_level),
    })
    setTouched({})
    window.setTimeout(() => {
      document.getElementById('add-student')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }, 0)
  }

  const openDeletePopup = (student) => {
    clearDeletePhoneSuccessTimer()
    setDeleteState({
      open: true,
      student,
      phoneInput: '',
      error: '',
      deleting: false,
      success: false,
    })
  }

  const closeDeletePopup = () => {
    if (deleteState.deleting) return
    clearDeletePhoneSuccessTimer()
    setDeleteState({
      open: false,
      student: null,
      phoneInput: '',
      error: '',
      deleting: false,
      success: false,
    })
  }

  const onDeleteConfirm = async () => {
    const selectedStudent = deleteState.student
    if (!selectedStudent) return

    const typed = deleteState.phoneInput.trim()
    if (!typed) {
      const msg = 'Please enter the phone number to confirm deletion.'
      setDeleteState((prev) => ({ ...prev, error: msg }))
      showAlert('error', msg)
      return
    }

    if (typed !== String(selectedStudent.phone ?? '').trim()) {
      setDeleteState((prev) => ({
        ...prev,
        error: 'Phone number does not match. Deletion blocked.',
      }))
      return
    }

    setDeleteState((prev) => ({ ...prev, deleting: true, error: '' }))
    log('DELETE /students/:id — request', { id: selectedStudent.id, student: selectedStudent })
    try {
      const res = await api.delete(`/students/${selectedStudent.id}`)
      log('DELETE /students/:id — response', res.status, res.data)
      await fetchStudents()
      if (editingId === selectedStudent.id) resetForm()

      const isPhone =
        typeof window !== 'undefined' && window.matchMedia('(max-width: 575.98px)').matches

      if (isPhone) {
        clearDeletePhoneSuccessTimer()
        setDeleteState((prev) => ({
          ...prev,
          deleting: false,
          success: true,
        }))
        deletePhoneSuccessTimerRef.current = window.setTimeout(() => {
          deletePhoneSuccessTimerRef.current = null
          setDeleteState({
            open: false,
            student: null,
            phoneInput: '',
            error: '',
            deleting: false,
            success: false,
          })
        }, 2200)
      } else {
        showAlert('success', 'Student deleted successfully.')
        closeDeletePopup()
      }
    } catch (err) {
      log('DELETE error', {
        status: err.response?.status,
        data: err.response?.data,
      })
      setDeleteState((prev) => ({
        ...prev,
        deleting: false,
        error: 'Delete failed. Please try again.',
      }))
    }
  }

  useEffect(() => {
    log('students in state (count)', students.length, students)
  }, [students])

  const filteredStudents = students.filter((student) => {
    const query = searchTerm.trim().toLowerCase()
    if (!query) return true

    return [student.name, student.email, student.phone, student.course, `year ${student.year_level}`]
      .filter(Boolean)
      .some((value) => String(value).toLowerCase().includes(query))
  })

  const studentsTotalPages = Math.max(1, Math.ceil(filteredStudents.length / STUDENTS_PAGE_SIZE))
  const studentsPageClamped = Math.min(studentsPage, studentsTotalPages)
  const studentsPageOffset = (studentsPageClamped - 1) * STUDENTS_PAGE_SIZE
  const paginatedStudents = filteredStudents.slice(studentsPageOffset, studentsPageOffset + STUDENTS_PAGE_SIZE)

  const showStudentsPagination = !loading && filteredStudents.length > STUDENTS_PAGE_SIZE

  return (
    <>
      <AppHeader />
      <main className="container">
      {alert.message && <div className={`alert ${alert.type}`}>{alert.message}</div>}

      <form id="add-student" className="form-card" onSubmit={onSubmit}>
        <h2>{editingId ? 'Update Student' : 'Add New Student'}</h2>
        <div className="grid">
          <div className={`field ${displayErrors.name ? 'field-has-error' : ''}`}>
            <input name="name" placeholder="Full Name" value={form.name} onChange={onChange} onBlur={onBlur} required />
            {displayErrors.name && <small className="field-error">{displayErrors.name}</small>}
          </div>
          <div className={`field ${displayErrors.email ? 'field-has-error' : ''}`}>
            <input name="email" type="email" placeholder="Email" value={form.email} onChange={onChange} onBlur={onBlur} required />
            {displayErrors.email && <small className="field-error">{displayErrors.email}</small>}
          </div>
          <div className={`field ${displayErrors.phone ? 'field-has-error' : ''}`}>
            <input name="phone" placeholder="Phone" value={form.phone} onChange={onChange} onBlur={onBlur} required />
            {displayErrors.phone && <small className="field-error">{displayErrors.phone}</small>}
          </div>
          <div className={`field ${displayErrors.course ? 'field-has-error' : ''}`}>
            <input name="course" placeholder="Course" value={form.course} onChange={onChange} onBlur={onBlur} required />
            {displayErrors.course && <small className="field-error">{displayErrors.course}</small>}
          </div>
          <div className={`field ${displayErrors.year_level ? 'field-has-error' : ''}`}>
            <select name="year_level" value={form.year_level} onChange={onChange} onBlur={onBlur}>
              <option value="1">Year 1</option>
              <option value="2">Year 2</option>
              <option value="3">Year 3</option>
              <option value="4">Year 4</option>
            </select>
            {displayErrors.year_level && <small className="field-error">{displayErrors.year_level}</small>}
          </div>
        </div>
        <div className="actions">
          <button type="submit" disabled={submitting}>
            {submitting ? (
              <span className="btn-loader-wrap">
                <span className="btn-loader" />
                Saving...
              </span>
            ) : editingId ? (
              'Update'
            ) : (
              <span className="btn-with-icon">
                <svg
                  className="btn-icon"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  aria-hidden="true"
                >
                  <path
                    d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <circle cx="9" cy="7" r="4" stroke="currentColor" strokeWidth="2" />
                  <path
                    d="M19 8v6 M22 11h-6"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                </svg>
                Add new student
              </span>
            )}
          </button>
          {editingId && (
            <button type="button" className="secondary" onClick={resetForm}>
              Cancel Edit
            </button>
          )}
        </div>
      </form>

      <section id="students-list" className="table-card">
        <div className="table-card-head">
          <h2>Students List</h2>
        </div>
        <div className="table-card-controls">
          <div className="student-stat-row">
            <div
              className="student-stat-card"
              aria-label={`Total students: ${students.length}${
                searchTerm.trim() ? `, showing ${filteredStudents.length} in search` : ''
              }`}
            >
              <div className="student-stat-ring">
                <span className="student-stat-value">{students.length}</span>
                <span className="student-stat-caption">Total</span>
              </div>
              {searchTerm.trim() ? (
                <span className="student-stat-hint">
                  {filteredStudents.length} match{filteredStudents.length === 1 ? '' : 'es'}
                </span>
              ) : null}
            </div>
          </div>
          <div className="table-toolbar">
            <div className="search-shell">
            <span className="search-icon" aria-hidden="true">
              <svg viewBox="0 0 24 24" fill="none">
                <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="2" />
                <path d="M20 20L16.65 16.65" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </span>
            <input
              type="search"
              className="search-input"
              placeholder="Search anything..."
              value={searchTerm}
              onChange={(event) => {
                setSearchTerm(event.target.value)
                setStudentsPage(1)
              }}
            />
            <button
              type="button"
              className="search-filter-btn"
              aria-label="Clear search"
              title="Clear search"
              onClick={() => {
                setSearchTerm('')
                setStudentsPage(1)
              }}
            >
              <svg viewBox="0 0 24 24" fill="none">
                <path d="M4 6H14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                <path d="M4 12H20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                <path d="M4 18H11" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                <circle cx="17" cy="6" r="2" fill="currentColor" />
                <circle cx="14" cy="12" r="2" fill="currentColor" />
                <circle cx="14" cy="18" r="2" fill="currentColor" />
              </svg>
            </button>
          </div>
          </div>
        </div>
        {loading ? (
          <div className="loading-box">
            <span className="spinner" />
            Loading students...
          </div>
        ) : (
          <>
            <div className="table-wrap">
              <table>
                <thead>
                  <tr>
                    <th scope="col" className="col-num">
                      #
                    </th>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Phone</th>
                    <th>Course</th>
                    <th>Year</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredStudents.length === 0 ? (
                    <tr>
                      <td colSpan="7" className="empty-state">
                        {searchTerm.trim() ? (
                          <RetroErrorWindow
                            className="nf-window--inline"
                            titleBar="STUDENT_MGMT.EXE — SEARCH"
                            line1="ERROR 0 RESULTS:"
                            line2="NO USER FOUND"
                            sub="This search returned no students. Try another keyword or clear the filter to show the full directory."
                            warnOutline
                            line2Variant="gradient"
                            cta={
                              <button
                                type="button"
                                className="nf-window-cta"
                                onClick={() => {
                                  setSearchTerm('')
                                  setStudentsPage(1)
                                }}
                              >
                                Back to Student Management
                              </button>
                            }
                          />
                        ) : (
                          'No students found.'
                        )}
                      </td>
                    </tr>
                  ) : (
                    paginatedStudents.map((student, index) => (
                      <tr key={student.id}>
                        <td className="row-num" data-label="#">
                          {studentsPageOffset + index + 1}
                        </td>
                        <td className="student-name" data-label="Name">
                          {student.name}
                        </td>
                        <td data-label="Email">{student.email}</td>
                        <td data-label="Phone">{student.phone || '-'}</td>
                        <td data-label="Course">
                          <span className="course-pill">{student.course}</span>
                        </td>
                        <td data-label="Year">
                          <span className="year-pill">Year {student.year_level}</span>
                        </td>
                        <td className="actions" data-label="Actions">
                          <button type="button" className="secondary edit-btn" onClick={() => onEdit(student)}>
                            Edit
                          </button>
                          <button type="button" className="danger" onClick={() => openDeletePopup(student)}>
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
            {showStudentsPagination ? (
              <nav className="table-pagination" aria-label="Student list pages">
                <button
                  type="button"
                  className="table-pagination-nav"
                  disabled={studentsPageClamped <= 1}
                  onClick={() => setStudentsPage(Math.max(1, studentsPageClamped - 1))}
                >
                  Previous
                </button>
                <div className="table-pagination-circles">
                  {Array.from({ length: studentsTotalPages }, (_, i) => i + 1).map((n) => (
                    <button
                      key={n}
                      type="button"
                      className={`table-page-circle${n === studentsPageClamped ? ' is-active' : ''}`}
                      aria-label={`Page ${n}`}
                      aria-current={n === studentsPageClamped ? 'page' : undefined}
                      onClick={() => setStudentsPage(n)}
                    >
                      {n}
                    </button>
                  ))}
                </div>
                <button
                  type="button"
                  className="table-pagination-nav"
                  disabled={studentsPageClamped >= studentsTotalPages}
                  onClick={() => setStudentsPage(Math.min(studentsTotalPages, studentsPageClamped + 1))}
                >
                  Next
                </button>
              </nav>
            ) : null}
          </>
        )}
      </section>

      {deleteState.open && (
        <>
          <div className="modal fade show d-block" role="dialog" aria-modal="true" aria-labelledby="delete-title">
            <div className="modal-dialog modal-dialog-centered modal-fullscreen-sm-down">
              <div
                className={`modal-content${deleteState.success ? ' delete-modal--success-phone' : ''}`}
              >
                <div className="modal-header border-0 pb-0 flex-column align-items-stretch gap-0">
                  <div className="d-flex w-100 align-items-center">
                    <h5 className="modal-title fw-bold flex-grow-1 mb-0" id="delete-title">
                      {deleteState.success ? 'Student removed' : 'Confirm Delete Student'}
                    </h5>
                    <button
                      type="button"
                      className="btn-close"
                      onClick={closeDeletePopup}
                      disabled={deleteState.deleting}
                    />
                  </div>
                  {deleteState.success ? (
                    <div className="delete-modal-phone-success-alert" role="status">
                      Student deleted successfully.
                    </div>
                  ) : null}
                </div>
                <div className="modal-body pt-2">
                  <p className="mb-3 text-secondary">
                    Type this phone number to delete: <strong className="text-dark">{deleteState.student?.phone || '-'}</strong>
                  </p>
                  <input
                    className={`form-control ${deleteState.error ? 'is-invalid' : ''}`}
                    name="deletePhone"
                    placeholder="Enter phone to confirm"
                    value={deleteState.phoneInput}
                    onChange={(event) =>
                      setDeleteState((prev) => ({
                        ...prev,
                        phoneInput: event.target.value,
                        error: '',
                      }))
                    }
                    disabled={deleteState.deleting}
                  />
                  {deleteState.error && <div className="invalid-feedback d-block">{deleteState.error}</div>}
                </div>
                <div className="modal-footer border-0 pt-0">
                  <button type="button" className="btn btn-danger" onClick={onDeleteConfirm} disabled={deleteState.deleting}>
                    {deleteState.deleting ? 'Deleting...' : 'Confirm Delete'}
                  </button>
                  <button type="button" className="btn btn-secondary" onClick={closeDeletePopup} disabled={deleteState.deleting}>
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div className="modal-backdrop fade show" />
        </>
      )}
      </main>
    </>
  )
}

export default App
