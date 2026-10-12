import {
  Bell,
  ChevronDown,
  Menu,
  CalendarDays,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import "./Topbar.css";

function Topbar({ onMenuClick, payPeriod, onPayPeriodChange }) {
  const { user } = useAuth();

  const username = user?.username || "HR Admin";
  const role = user?.role || "HR";
  const initial = username.charAt(0).toUpperCase();

  return (
    <header className="topbar">

      {/* Mobile menu */}
      <button
        className="mobile-menu-button"
        onClick={onMenuClick}
        aria-label="Open menu"
      >
        <Menu size={21} />
      </button>

      {/* Page heading area */}
      <div className="topbar-heading">
        <span className="topbar-label">HR MANAGEMENT</span>
        <h1>Payroll & Leave Management</h1>
      </div>

      {/* Right section */}
      <div className="topbar-actions">

        {/* Pay period */}
        <div className="topbar-period">
          <CalendarDays size={17} />

          <div className="period-content">
            <span>Pay Period</span>

            <input
              type="month"
              value={payPeriod}
              onChange={(event) =>
                onPayPeriodChange?.(event.target.value)
              }
            />
          </div>
        </div>

        {/* Notification */}
        <button
          className="notification-button"
          aria-label="Notifications"
        >
          <Bell size={19} />
          <span className="notification-dot"></span>
        </button>

        <div className="topbar-divider"></div>

        {/* User */}
        <button className="topbar-user">
          <div className="topbar-avatar">
            {initial}
          </div>

          <div className="topbar-user-info">
            <strong>{username}</strong>
            <span>{role} Administrator</span>
          </div>

          <ChevronDown size={16} />
        </button>
      </div>
    </header>
  );
}

export default Topbar;