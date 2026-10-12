import { useEffect, useState } from "react";
import axios from "axios";
import {
  Users,
  Clock3,
  MailCheck,
  MailX,
  CalendarDays,
  RefreshCw,
  TrendingUp,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";

import "./Dashboard.css";

const Dashboard = () => {
  const [payPeriod, setPayPeriod] = useState("2026-12");
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadDashboard = async () => {
    try {
      setLoading(true);
      setError("");

      const token = localStorage.getItem("token");

      const response = await axios.get(
        `http://localhost:8090/api/dashboard?payPeriod=${payPeriod}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setDashboard(response.data);
    } catch (err) {
      console.error("Dashboard loading error:", err);

      if (err.response?.status === 401) {
        setError("Your session has expired. Please login again.");
      } else if (err.response?.status === 403) {
        setError("You do not have permission to view the dashboard.");
      } else {
        setError("Unable to load dashboard data.");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboard();
  }, [payPeriod]);

  /* =========================================================
     LEAVE SUMMARY
     ========================================================= */

  const leaveSummary = dashboard?.leaveBalanceSummary || {
    totalCasualLeaveBalance: 0,
    totalSickLeaveBalance: 0,
    totalEarnedLeaveBalance: 0,
  };

  /* =========================================================
     DASHBOARD STATISTICS
     ========================================================= */

  const stats = [
    {
      title: "Employees Processed",
      value: dashboard?.totalEmployeesProcessed ?? 0,
      icon: Users,
      className: "blue",
      description: "Payroll processed",
    },
    {
      title: "Pending Payroll",
      value: dashboard?.pendingPayroll ?? 0,
      icon: Clock3,
      className: "orange",
      description: "Awaiting processing",
    },
    {
      title: "Payslips Sent",
      value: dashboard?.payslipsSentSuccessfully ?? 0,
      icon: MailCheck,
      className: "green",
      description: "Successfully delivered",
    },
    {
      title: "Failed Emails",
      value: dashboard?.failedEmailDeliveries ?? 0,
      icon: MailX,
      className: "red",
      description: "Delivery failures",
    },
  ];

  /* =========================================================
     PAYROLL PROGRESS
     ========================================================= */

  const processedEmployees =
    dashboard?.totalEmployeesProcessed ?? 0;

  const pendingPayroll =
    dashboard?.pendingPayroll ?? 0;

  const totalPayrollEmployees =
    processedEmployees + pendingPayroll;

  const payrollProgress =
    totalPayrollEmployees > 0
      ? Math.round(
          (processedEmployees / totalPayrollEmployees) * 100
        )
      : 0;

  /* =========================================================
     RENDER
     ========================================================= */

  return (
    <div className="dashboard-page">

      {/* =====================================================
          PAGE HEADER
          ===================================================== */}

      <div className="dashboard-header">

        <div className="dashboard-title-section">

          <span className="page-eyebrow">
            HR MANAGEMENT
          </span>

          <h1>Dashboard</h1>

          <p>
            Overview of payroll processing, payslips and
            employee leave balances.
          </p>

        </div>

        <div className="dashboard-actions">

          {/* Pay Period */}

          <div className="period-selector">

            <CalendarDays size={18} />

            <div className="period-content">

              <span>Pay Period</span>

              <select
                value={payPeriod}
                onChange={(e) =>
                  setPayPeriod(e.target.value)
                }
              >
                <option value="2026-10">
                  October, 2026
                </option>

                <option value="2026-11">
                  November, 2026
                </option>

                <option value="2026-12">
                  December, 2026
                </option>
              </select>

            </div>

          </div>

          {/* Refresh */}

          <button
            className="refresh-button"
            onClick={loadDashboard}
            disabled={loading}
          >

            <RefreshCw
              size={17}
              className={loading ? "spin" : ""}
            />

            {loading ? "Loading..." : "Refresh"}

          </button>

        </div>

      </div>

      {/* =====================================================
          ERROR MESSAGE
          ===================================================== */}

      {error && (
        <div className="dashboard-error">

          <AlertCircle size={18} />

          <span>{error}</span>

        </div>
      )}

      {/* =====================================================
          KPI STATISTICS
          ===================================================== */}

      <div className="dashboard-stats">

        {stats.map((stat) => {

          const Icon = stat.icon;

          return (
            <div
              className={`stat-card stat-${stat.className}`}
              key={stat.title}
            >

              <div
                className={`stat-icon ${stat.className}`}
              >
                <Icon size={21} />
              </div>

              <div className="stat-content">

                <span className="stat-title">
                  {stat.title}
                </span>

                <strong>
                  {loading ? "—" : stat.value}
                </strong>

                <small>
                  {stat.description}
                </small>

              </div>

            </div>
          );
        })}

      </div>

      {/* =====================================================
          MAIN DASHBOARD GRID
          ===================================================== */}

      <div className="dashboard-grid">

        {/* ===================================================
            PAYROLL OVERVIEW
            =================================================== */}

        <div className="dashboard-card payroll-card">

          <div className="card-header">

            <div>

              <span className="card-eyebrow">
                PAYROLL
              </span>

              <h2>
                Payroll Overview
              </h2>

              <p>
                Current payroll processing status
              </p>

            </div>

            <div className="card-header-icon payroll-header-icon">
              <TrendingUp size={19} />
            </div>

          </div>

          {/* Payroll Progress */}

          <div className="payroll-progress-section">

            <div className="progress-header">

              <span>
                Processing Progress
              </span>

              <strong>
                {loading
                  ? "—"
                  : `${payrollProgress}%`}
              </strong>

            </div>

            <div className="progress-track">

              <div
                className="progress-fill"
                style={{
                  width: loading
                    ? "0%"
                    : `${payrollProgress}%`,
                }}
              />

            </div>

          </div>

          {/* Payroll Details */}

          <div className="payroll-overview">

            <div className="overview-row">

              <div className="overview-label">

                <span className="dot blue-dot" />

                <span>
                  Employees Processed
                </span>

              </div>

              <strong>
                {loading
                  ? "—"
                  : dashboard?.totalEmployeesProcessed ?? 0}
              </strong>

            </div>

            <div className="overview-row">

              <div className="overview-label">

                <span className="dot orange-dot" />

                <span>
                  Pending Payroll
                </span>

              </div>

              <strong>
                {loading
                  ? "—"
                  : dashboard?.pendingPayroll ?? 0}
              </strong>

            </div>

            <div className="overview-row">

              <div className="overview-label">

                <span className="dot green-dot" />

                <span>
                  Payslips Sent
                </span>

              </div>

              <strong>
                {loading
                  ? "—"
                  : dashboard?.payslipsSentSuccessfully ?? 0}
              </strong>

            </div>

            <div className="overview-row">

              <div className="overview-label">

                <span className="dot red-dot" />

                <span>
                  Failed Emails
                </span>

              </div>

              <strong>
                {loading
                  ? "—"
                  : dashboard?.failedEmailDeliveries ?? 0}
              </strong>

            </div>

          </div>

        </div>

        {/* ===================================================
            LEAVE BALANCE
            =================================================== */}

        <div className="dashboard-card leave-card">

          <div className="card-header">

            <div>

              <span className="card-eyebrow">
                LEAVE MANAGEMENT
              </span>

              <h2>
                Leave Balance Summary
              </h2>

              <p>
                Total available leave across employees
              </p>

            </div>

            <div className="card-header-icon leave-icon">
              <CalendarDays size={19} />
            </div>

          </div>

          <div className="leave-summary">

            {/* Casual Leave */}

            <div className="leave-item">

              <div className="leave-item-left">

                <div className="leave-badge casual">
                  CL
                </div>

                <div className="leave-text">

                  <strong>
                    Casual Leave
                  </strong>

                  <span>
                    Available balance
                  </span>

                </div>

              </div>

              <strong className="leave-number">

                {loading
                  ? "—"
                  : leaveSummary.totalCasualLeaveBalance}

              </strong>

            </div>

            {/* Sick Leave */}

            <div className="leave-item">

              <div className="leave-item-left">

                <div className="leave-badge sick">
                  SL
                </div>

                <div className="leave-text">

                  <strong>
                    Sick Leave
                  </strong>

                  <span>
                    Available balance
                  </span>

                </div>

              </div>

              <strong className="leave-number">

                {loading
                  ? "—"
                  : leaveSummary.totalSickLeaveBalance}

              </strong>

            </div>

            {/* Earned Leave */}

            <div className="leave-item">

              <div className="leave-item-left">

                <div className="leave-badge earned">
                  EL
                </div>

                <div className="leave-text">

                  <strong>
                    Earned Leave
                  </strong>

                  <span>
                    Available balance
                  </span>

                </div>

              </div>

              <strong className="leave-number">

                {loading
                  ? "—"
                  : leaveSummary.totalEarnedLeaveBalance}

              </strong>

            </div>

          </div>

        </div>

      </div>

      {/* =====================================================
          SYSTEM STATUS
          ===================================================== */}

      <div className="dashboard-card system-status">

        <div className="card-header system-header">

          <div>

            <span className="card-eyebrow">
              SYSTEM
            </span>

            <h2>
              System Status
            </h2>

            <p>
              Current HRM Payroll system health
            </p>

          </div>

          <div className="status-badge">

            <CheckCircle2 size={16} />

            All Systems Operational

          </div>

        </div>

        <div className="system-items">

          {/* Backend */}

          <div className="system-item">

            <div className="system-item-info">

              <span className="system-indicator" />

              <span>
                Backend API
              </span>

            </div>

            <strong>
              Online
            </strong>

          </div>

          {/* Database */}

          <div className="system-item">

            <div className="system-item-info">

              <span className="system-indicator" />

              <span>
                Database
              </span>

            </div>

            <strong>
              Connected
            </strong>

          </div>

          {/* Email */}

          <div className="system-item">

            <div className="system-item-info">

              <span className="system-indicator" />

              <span>
                Email Service
              </span>

            </div>

            <strong>
              Active
            </strong>

          </div>

          {/* Authentication */}

          <div className="system-item">

            <div className="system-item-info">

              <span className="system-indicator" />

              <span>
                Authentication
              </span>

            </div>

            <strong>
              Active
            </strong>

          </div>

        </div>

      </div>

    </div>
  );
};

export default Dashboard;