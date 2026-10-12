import {
  LayoutDashboard,
  Users,
  CalendarDays,
  WalletCards,
  Banknote,
  FileText,
  Mail,
  LogOut,
  ChevronLeft,
  BadgeDollarSign,
  UserRound,
} from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "./Sidebar.css";

const hrMenuItems = [
  {
    label: "Dashboard",
    icon: LayoutDashboard,
    path: "/dashboard",
  },
  {
    label: "Employees",
    icon: Users,
    path: "/employees",
  },
  {
    label: "Leave Management",
    icon: CalendarDays,
    path: "/leave-management",
  },
  {
    label: "Salary",
    icon: WalletCards,
    path: "/salary",
  },
  {
    label: "Employee Salary",
    icon: BadgeDollarSign,
    path: "/employee-salary",
  },
  {
    label: "Payroll",
    icon: Banknote,
    path: "/payroll",
  },
  {
    label: "Payslips",
    icon: FileText,
    path: "/payslips",
  },
  {
    label: "Email Logs",
    icon: Mail,
    path: "/email-logs",
  },
];

const employeeMenuItems = [
  {
    label: "Dashboard",
    icon: LayoutDashboard,
    path: "/employee-dashboard",
  },
  {
    label: "My Profile",
    icon: UserRound,
    path: "/employee-profile",
  },
  {
    label: "My Leave",
    icon: CalendarDays,
    path: "/my-leave",
  },
  {
    label: "My Payslips",
    icon: FileText,
    path: "/my-payslips",
  },
];

function Sidebar({ collapsed = false, onToggle, role }) {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();

  const currentRole =
    role ||
    user?.role?.toUpperCase() ||
    localStorage.getItem("role")?.toUpperCase() ||
    "";

  const menuItems =
    currentRole === "EMPLOYEE"
      ? employeeMenuItems
      : hrMenuItems;

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <aside
      className={`sidebar ${
        collapsed ? "sidebar-collapsed" : ""
      }`}
    >
      {/* Brand */}
      <div className="sidebar-brand">
        <div className="brand-logo">H</div>

        {!collapsed && (
          <div className="brand-text">
            <h2>HRM Payroll</h2>
            <span>Management System</span>
          </div>
        )}
      </div>

      {/* Navigation */}
      <nav className="sidebar-navigation">
        <p className="navigation-title">
          {!collapsed &&
            (currentRole === "EMPLOYEE"
              ? "EMPLOYEE MENU"
              : "MAIN MENU")}
        </p>

        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive =
            location.pathname === item.path;

          return (
            <button
              key={item.path}
              className={`sidebar-item ${
                isActive ? "active" : ""
              }`}
              onClick={() => navigate(item.path)}
              title={collapsed ? item.label : ""}
            >
              <Icon size={20} strokeWidth={1.9} />

              {!collapsed && (
                <span>{item.label}</span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Bottom section */}
      <div className="sidebar-bottom">

        {/* User */}
        <div className="sidebar-user">
          <div className="user-avatar">
            {user?.username?.charAt(0).toUpperCase() || "H"}
          </div>

          {!collapsed && (
            <div className="user-details">
              <strong>
                {user?.username || "HR Admin"}
              </strong>

              <span>
                {user?.role || currentRole || "HR"}
              </span>
            </div>
          )}
        </div>

        {/* Logout */}
        <button
          className="sidebar-logout"
          onClick={handleLogout}
          title={collapsed ? "Logout" : ""}
        >
          <LogOut size={19} />

          {!collapsed && (
            <span>Logout</span>
          )}
        </button>

        {/* Collapse */}
        <button
          className="sidebar-collapse"
          onClick={onToggle}
          title={
            collapsed
              ? "Expand sidebar"
              : "Collapse sidebar"
          }
        >
          <ChevronLeft
            size={18}
            className={
              collapsed ? "rotate-icon" : ""
            }
          />

          {!collapsed && (
            <span>Collapse sidebar</span>
          )}
        </button>
      </div>
    </aside>
  );
}

export default Sidebar;