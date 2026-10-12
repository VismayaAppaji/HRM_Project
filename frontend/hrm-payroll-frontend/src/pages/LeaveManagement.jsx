import { useEffect, useMemo, useState } from "react";
import {
  CalendarDays,
  Check,
  Clock3,
  FileText,
  RefreshCw,
  Search,
  X,
} from "lucide-react";
import api from "../services/api";
import "./LeaveManagement.css";

function LeaveManagement() {
  const [leaves, setLeaves] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState("");
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [typeFilter, setTypeFilter] = useState("ALL");

  const loadData = async () => {
    try {
      setLoading(true);
      setError("");

      const [leaveResponse, employeeResponse] = await Promise.all([
        api.get("/leave-applications"),
        api.get("/employees"),
      ]);

      setLeaves(
        Array.isArray(leaveResponse.data) ? leaveResponse.data : []
      );

      setEmployees(
        Array.isArray(employeeResponse.data)
          ? employeeResponse.data
          : []
      );
    } catch (err) {
      console.error(err);
      setError("Unable to load leave management data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const employeeMap = useMemo(() => {
    const map = {};

    employees.forEach((employee) => {
      map[employee.id] = employee;
    });

    return map;
  }, [employees]);

  const getEmployeeName = (employeeId) => {
    const employee = employeeMap[employeeId];

    if (!employee) {
      return employeeId || "Unknown Employee";
    }

    return `${employee.firstName || ""} ${
      employee.lastName || ""
    }`.trim();
  };

  const getEmployeeCode = (employeeId) => {
    const employee = employeeMap[employeeId];

    return employee?.employeeCode || "—";
  };

  const filteredLeaves = useMemo(() => {
    return leaves.filter((leave) => {
      const employeeName = getEmployeeName(
        leave.employeeId
      ).toLowerCase();

      const employeeCode = getEmployeeCode(
        leave.employeeId
      ).toLowerCase();

      const searchValue = search.toLowerCase();

      const matchesSearch =
        !searchValue ||
        employeeName.includes(searchValue) ||
        employeeCode.includes(searchValue) ||
        String(leave.leaveType || "")
          .toLowerCase()
          .includes(searchValue);

      const matchesStatus =
        statusFilter === "ALL" ||
        leave.status === statusFilter;

      const matchesType =
        typeFilter === "ALL" ||
        leave.leaveType === typeFilter;

      return matchesSearch && matchesStatus && matchesType;
    });
  }, [
    leaves,
    search,
    statusFilter,
    typeFilter,
    employeeMap,
  ]);

  const pendingCount = leaves.filter(
    (leave) => leave.status === "PENDING"
  ).length;

  const approvedCount = leaves.filter(
    (leave) => leave.status === "APPROVED"
  ).length;

  const rejectedCount = leaves.filter(
    (leave) => leave.status === "REJECTED"
  ).length;

  const handleApprove = async (leaveId) => {
    try {
      setActionLoading(leaveId);
      setError("");

      await api.put(
        `/leave-applications/${leaveId}/approve`
      );

      await loadData();
    } catch (err) {
      console.error(err);

      const message =
        err.response?.data?.message ||
        err.response?.data ||
        "Unable to approve the leave application.";

      setError(message);
    } finally {
      setActionLoading("");
    }
  };

  const handleReject = async (leaveId) => {
    try {
      setActionLoading(leaveId);
      setError("");

      await api.put(
        `/leave-applications/${leaveId}/reject`
      );

      await loadData();
    } catch (err) {
      console.error(err);

      const message =
        err.response?.data?.message ||
        err.response?.data ||
        "Unable to reject the leave application.";

      setError(message);
    } finally {
      setActionLoading("");
    }
  };

  const formatDate = (date) => {
    if (!date) return "—";

    return new Date(date).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const getStatusClass = (status) => {
    switch (status) {
      case "APPROVED":
        return "status-approved";

      case "REJECTED":
        return "status-rejected";

      case "PENDING":
      default:
        return "status-pending";
    }
  };

  const getLeaveTypeClass = (type) => {
    switch (type) {
      case "CASUAL":
        return "leave-casual";

      case "SICK":
        return "leave-sick";

      case "EARNED":
        return "leave-earned";

      default:
        return "leave-default";
    }
  };

  return (
    <div className="leave-page">
      {/* Page Header */}
      <div className="leave-page-header">
        <div className="leave-title-section">
          <div className="leave-title-icon">
            <CalendarDays size={24} />
          </div>

          <div>
            <div className="eyebrow">HR MANAGEMENT</div>

            <h1>Leave Management</h1>

            <p>
              Review and manage employee leave applications
            </p>
          </div>
        </div>

        <button
          className="refresh-button"
          onClick={loadData}
        >
          <RefreshCw size={17} />
          Refresh
        </button>
      </div>

      {/* Summary Cards */}
      <div className="leave-summary">
        <div className="leave-summary-card">
          <div className="summary-icon pending-icon">
            <Clock3 size={20} />
          </div>

          <div>
            <span>Pending Requests</span>
            <strong>{pendingCount}</strong>
          </div>
        </div>

        <div className="leave-summary-card">
          <div className="summary-icon approved-icon">
            <Check size={20} />
          </div>

          <div>
            <span>Approved</span>
            <strong>{approvedCount}</strong>
          </div>
        </div>

        <div className="leave-summary-card">
          <div className="summary-icon rejected-icon">
            <X size={20} />
          </div>

          <div>
            <span>Rejected</span>
            <strong>{rejectedCount}</strong>
          </div>
        </div>

        <div className="leave-summary-card">
          <div className="summary-icon total-icon">
            <FileText size={20} />
          </div>

          <div>
            <span>Total Applications</span>
            <strong>{leaves.length}</strong>
          </div>
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="leave-error">
          <span>{error}</span>

          <button onClick={() => setError("")}>
            <X size={16} />
          </button>
        </div>
      )}

      {/* Main Table Card */}
      <div className="leave-table-card">
        <div className="leave-table-header">
          <div>
            <h2>Leave Applications</h2>

            <p>
              Manage employee leave requests and approvals
            </p>
          </div>
        </div>

        {/* Filters */}
        <div className="leave-filters">
          <div className="leave-search">
            <Search size={18} />

            <input
              type="text"
              placeholder="Search employee, code or leave type..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <select
            value={statusFilter}
            onChange={(e) =>
              setStatusFilter(e.target.value)
            }
          >
            <option value="ALL">All Status</option>
            <option value="PENDING">Pending</option>
            <option value="APPROVED">Approved</option>
            <option value="REJECTED">Rejected</option>
          </select>

          <select
            value={typeFilter}
            onChange={(e) =>
              setTypeFilter(e.target.value)
            }
          >
            <option value="ALL">All Leave Types</option>
            <option value="CASUAL">
              Casual Leave
            </option>
            <option value="SICK">
              Sick Leave
            </option>
            <option value="EARNED">
              Earned Leave
            </option>
          </select>
        </div>

        {/* Table */}
        {loading ? (
          <div className="leave-loading">
            <RefreshCw
              className="loading-spinner"
              size={24}
            />

            <p>Loading leave applications...</p>
          </div>
        ) : filteredLeaves.length === 0 ? (
          <div className="leave-empty">
            <div className="empty-icon">
              <CalendarDays size={28} />
            </div>

            <h3>No leave applications found</h3>

            <p>
              There are no applications matching the selected
              filters.
            </p>
          </div>
        ) : (
          <div className="leave-table-wrapper">
            <table className="leave-table">
              <thead>
                <tr>
                  <th>EMPLOYEE</th>
                  <th>LEAVE TYPE</th>
                  <th>FROM</th>
                  <th>TO</th>
                  <th>DAYS</th>
                  <th>REASON</th>
                  <th>STATUS</th>
                  <th>ACTION</th>
                </tr>
              </thead>

              <tbody>
                {filteredLeaves.map((leave) => (
                  <tr key={leave.id}>
                    <td>
                      <div className="employee-cell">
                        <div className="employee-avatar">
                          {getEmployeeName(
                            leave.employeeId
                          )
                            .charAt(0)
                            .toUpperCase()}
                        </div>

                        <div>
                          <strong>
                            {getEmployeeName(
                              leave.employeeId
                            )}
                          </strong>

                          <span>
                            {getEmployeeCode(
                              leave.employeeId
                            )}
                          </span>
                        </div>
                      </div>
                    </td>

                    <td>
                      <span
                        className={`leave-type ${getLeaveTypeClass(
                          leave.leaveType
                        )}`}
                      >
                        {leave.leaveType || "—"}
                      </span>
                    </td>

                    {/* FIXED: Backend uses fromDate */}
                    <td>
                      {formatDate(leave.fromDate)}
                    </td>

                    {/* FIXED: Backend uses toDate */}
                    <td>
                      {formatDate(leave.toDate)}
                    </td>

                    <td>
                      <strong className="days-value">
                        {leave.numberOfDays ?? "—"}
                      </strong>
                    </td>

                    <td>
                      <span className="reason-text">
                        {leave.reason || "—"}
                      </span>
                    </td>

                    <td>
                      <span
                        className={`leave-status ${getStatusClass(
                          leave.status
                        )}`}
                      >
                        <span className="status-dot"></span>

                        {leave.status || "PENDING"}
                      </span>
                    </td>

                    <td>
                      {leave.status === "PENDING" ? (
                        <div className="action-buttons">
                          <button
                            className="approve-button"
                            disabled={
                              actionLoading === leave.id
                            }
                            onClick={() =>
                              handleApprove(leave.id)
                            }
                            title="Approve leave"
                          >
                            <Check size={16} />
                            Approve
                          </button>

                          <button
                            className="reject-button"
                            disabled={
                              actionLoading === leave.id
                            }
                            onClick={() =>
                              handleReject(leave.id)
                            }
                            title="Reject leave"
                          >
                            <X size={16} />
                            Reject
                          </button>
                        </div>
                      ) : (
                        <span className="action-completed">
                          {leave.status === "APPROVED"
                            ? "Approved"
                            : "Rejected"}
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Footer */}
        {!loading && filteredLeaves.length > 0 && (
          <div className="leave-table-footer">
            Showing{" "}
            <strong>{filteredLeaves.length}</strong> of{" "}
            <strong>{leaves.length}</strong> applications
          </div>
        )}
      </div>
    </div>
  );
}

export default LeaveManagement;