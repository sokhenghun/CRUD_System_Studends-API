import { Link } from 'react-router-dom'
import RetroErrorWindow from './RetroErrorWindow.jsx'

export default function NotFoundPage() {
  return (
    <div className="not-found-page">
      <a href="https://www.rupp.edu.kh" className="not-found-page-logo-link" target="_blank" rel="noopener noreferrer">
        <img className="not-found-page-logo" src="/school-logo.svg" alt="Royal University of Phnom Penh" decoding="async" />
      </a>

      <RetroErrorWindow
        titleBar="STUDENT_MGMT.EXE — NOT FOUND"
        line1="ERROR 404:"
        line2="PAGE NOT FOUND"
        sub="This URL is not in the directory. Check the address or go back to the app."
        line2Variant="gradient"
        cta={
          <Link to="/" className="nf-window-cta">
            Back to Student Management
          </Link>
        }
      />

      <p className="not-found-page-foot">Royal University of Phnom Penh · Student Management</p>
    </div>
  )
}
