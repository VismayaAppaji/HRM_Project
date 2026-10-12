import { useEffect, useState } from "react";
import {
  UserRound,
  CalendarDays,
  FileText,
  WalletCards,
  RefreshCw,
} from "lucide-react";

import api from "../services/api";
import "./EmployeeDashboard.css";

const EmployeeDashboard = () => {
  const [employee, setEmployee] = useState(null);
  const [leaveBalance, setLeaveBalance] = useState(null);
  const [payslips, setPayslips] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadEmployeeDashboard = async () => {
    try {
      setLoading(true);
      setError("");

      // Get the currently logged-in employee
      const employeeResponse = await api.get("/employees/me");

      const currentEmployee = employeeResponse.data;

      if (!currentEmployee) {
        setError("Employee profile not found.");
        return;
      }

      setEmployee(currentEmployee);

      /*
       * Use /me endpoints for employee-specific data.
       * The backend identifies the employee from the JWT.
       */
      const [leaveResponse, payslipResponse] = await Promise.all([
        api.get("/leave-balances/me"),
        api.get("/payrolls/me"),
      ]);

      setLeaveBalance(leaveResponse.data);
      setPayslips(payslipResponse.data || []);
    } catch (err) {
      console.error("Failed to load employee dashboard:", err);

      if (err.response?.status === 401) {
        setError("Your session has expired. Please login again.");
      } else if (err.response?.status === 403) {
        setError("You do not have permission to access this page.");
      } else {
        setError("Failed to load employee dashboard.");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadEmployeeDashboard();
  }, []);

  if (loading) {
    return (
      <div className="employee-dashboard-page">
        <div className="employee-dashboard-message">
          Loading employee dashboard...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="employee-dashboard-page">
        <div className="employee-dashboard-error">
          <h2>Unable to load dashboard</h2>
          <p>{error}</p>

          <button
            className="employee-refresh-button"
            onClick={loadEmployeeDashboard}
          >
            <RefreshCw size={17} />
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="employee-dashboard-page">
      {/* Header */}
      <div className="employee-dashboard-header">
        <div>
          <h1>Employee Dashboard</h1>
          <p>
            Welcome back, {employee?.firstName || "Employee"}.
          </p>
        </div>

        <button
          className="employee-refresh-button"
          onClick={loadEmployeeDashboard}
        >
          <RefreshCw size={17} />
          Refresh
        </button>
      </div>

      {/* Employee Profile */}
      <div className="employee-profile-card">
        <div className="employee-profile-icon">
          <UserRound size={28} />
        </div>

        <div className="employee-profile-info">
          <h2>
            {employee?.firstName} {employee?.lastName}
          </h2>

          <p>{employee?.designation || "Employee"}</p>

          <div className="employee-profile-details">
            <span>
              Employee ID: {employee?.employeeCode || "-"}
            </span>

            <span>
              Department: {employee?.department || "-"}
            </span>

            <span>
              Email: {employee?.email || "-"}
            </span>
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="employee-summary-grid">
        <div className="employee-summary-card">
          <div className="summary-card-icon">
            <CalendarDays size={22} />
          </div>

          <div>
            <span>Casual Leave</span>
            <strong>
              {leaveBalance?.casualLeaveBalance ?? 0}
            </strong>
            <small>Days available</small>
          </div>
        </div>

        <div className="employee-summary-card">
          <div className="summary-card-icon">
            <CalendarDays size={22} />
          </div>

          <div>
            <span>Sick Leave</span>
            <strong>
              {leaveBalance?.sickLeaveBalance ?? 0}
            </strong>
            <small>Days available</small>
          </div>
        </div>

        <div className="employee-summary-card">
          <div className="summary-card-icon">
            <CalendarDays size={22} />
          </div>

          <div>
            <span>Earned Leave</span>
            <strong>
              {leaveBalance?.earnedLeaveBalance ?? 0}
            </strong>
            <small>Days available</small>
          </div>
        </div>

        <div className="employee-summary-card">
          <div className="summary-card-icon">
            <FileText size={22} />
          </div>

          <div>
            <span>Payslips</span>
            <strong>{payslips.length}</strong>
            <small>Generated</small>
          </div>
        </div>
      </div>

      {/* Leave Balance */}
      <div className="employee-dashboard-card">
        <div className="employee-card-header">
          <div>
            <h2>My Leave Balance</h2>
            <p>Your current available leave balance.</p>
          </div>

          <CalendarDays size={22} />
        </div>

        <div className="leave-balance-grid">
          <div className="leave-balance-item">
            <span>Casual Leave (CL)</span>

            <strong>
              {leaveBalance?.casualLeaveBalance ?? 0}
            </strong>

            <small>
              of {leaveBalance?.casualLeaveAllocated ?? 0} allocated
            </small>
          </div>

          <div className="leave-balance-item">
            <span>Sick Leave (SL)</span>

            <strong>
              {leaveBalance?.sickLeaveBalance ?? 0}
            </strong>

            <small>
              of {leaveBalance?.sickLeaveAllocated ?? 0} allocated
            </small>
          </div>

          <div className="leave-balance-item">
            <span>Earned Leave (EL)</span>

            <strong>
              {leaveBalance?.earnedLeaveBalance ?? 0}
            </strong>

            <small>
              of {leaveBalance?.earnedLeaveAllocated ?? 0} allocated
            </small>
          </div>
        </div>
      </div>

      {/* Payslips */}
      <div className="employee-dashboard-card">
        <div className="employee-card-header">
          <div>
            <h2>My Payslips</h2>
            <p>Your recently generated payroll records.</p>
          </div>

          <WalletCards size={22} />
        </div>

        {payslips.length === 0 ? (
          <div className="employee-empty-state">
            <FileText size={38} />

            <h3>No payslips available</h3>

            <p>
              Your generated payslips will appear here.
            </p>
          </div>
        ) : (
          <div className="employee-payslip-table-wrapper">
            <table className="employee-payslip-table">
              <thead>
                <tr>
                  <th>Pay Period</th>
                  <th>Gross Salary</th>
                  <th>Deductions</th>
                  <th>Net Salary</th>
                  <th>Status</th>
                </tr>
              </thead>

              <tbody>
                {payslips.map((payslip) => (
                  <tr key={payslip.id}>
                    <td>
                      {payslip.payPeriod || "-"}
                    </td>

                    <td>
                      ₹
                      {Number(
                        payslip.grossSalary || 0
                      ).toLocaleString("en-IN")}
                    </td>

                    <td>
                      ₹
                      {Number(
                        payslip.totalDeductions || 0
                      ).toLocaleString("en-IN")}
                    </td>

                    <td>
                      ₹
                      {Number(
                        payslip.netSalary || 0
                      ).toLocaleString("en-IN")}
                    </td>

                    <td>
                      <span className="employee-status-badge">
                        {payslip.status || "GENERATED"}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default EmployeeDashboard;