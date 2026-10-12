import { useEffect, useState } from "react";
import {
  CalendarDays,
  RefreshCw,
  BriefcaseBusiness,
  Send,
} from "lucide-react";
import api from "../services/api";

const MyLeave = () => {
  const [leaveBalance, setLeaveBalance] = useState(null);
  const [employee, setEmployee] = useState(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    leaveType: "CASUAL",
    fromDate: "",
    toDate: "",
    reason: "",
  });

  const [submitting, setSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [formError, setFormError] = useState("");

  const loadData = async () => {
    try {
      setLoading(true);
      setError("");

      const [balanceResponse, employeeResponse] = await Promise.all([
        api.get("/leave-balances/me"),
        api.get("/employees/me"),
      ]);

      setLeaveBalance(balanceResponse.data);
      setEmployee(employeeResponse.data);
    } catch (err) {
      console.error("Failed to load leave data:", err);

      if (err.response?.status === 401) {
        setError("Your session has expired. Please login again.");
      } else if (err.response?.status === 403) {
        setError("You do not have permission to access your leave information.");
      } else {
        setError("Failed to load leave information.");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));

    setFormError("");
    setSuccessMessage("");
  };

  const handleApplyLeave = async (event) => {
    event.preventDefault();

    setFormError("");
    setSuccessMessage("");

    if (!employee?.id) {
      setFormError("Employee information could not be loaded.");
      return;
    }

    if (!formData.fromDate || !formData.toDate) {
      setFormError("Please select both from date and to date.");
      return;
    }

    if (formData.fromDate > formData.toDate) {
      setFormError("From date cannot be after to date.");
      return;
    }

    if (!formData.reason.trim()) {
      setFormError("Please enter a reason for your leave.");
      return;
    }

    try {
      setSubmitting(true);

      await api.post("/leave-applications", {
        employeeId: employee.id,
        leaveType: formData.leaveType,
        fromDate: formData.fromDate,
        toDate: formData.toDate,
        reason: formData.reason.trim(),
      });

      setSuccessMessage(
        "Leave application submitted successfully. It is now pending HR approval."
      );

      setFormData({
        leaveType: "CASUAL",
        fromDate: "",
        toDate: "",
        reason: "",
      });
    } catch (err) {
      console.error("Failed to apply leave:", err);

      if (err.response?.data?.message) {
        setFormError(err.response.data.message);
      } else if (err.response?.data) {
        setFormError(
          typeof err.response.data === "string"
            ? err.response.data
            : "Failed to submit leave application."
        );
      } else {
        setFormError("Failed to submit leave application.");
      }
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div style={{ padding: "32px" }}>
        <p>Loading leave information...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ padding: "32px" }}>
        <p>{error}</p>

        <button
          onClick={loadData}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            padding: "10px 16px",
            border: "none",
            borderRadius: "8px",
            cursor: "pointer",
          }}
        >
          <RefreshCw size={16} />
          Retry
        </button>
      </div>
    );
  }

  const leaveTypes = [
    {
      name: "Casual Leave",
      shortName: "CL",
      apiName: "CASUAL",
      allocated: leaveBalance?.casualLeaveAllocated ?? 0,
      balance: leaveBalance?.casualLeaveBalance ?? 0,
    },
    {
      name: "Sick Leave",
      shortName: "SL",
      apiName: "SICK",
      allocated: leaveBalance?.sickLeaveAllocated ?? 0,
      balance: leaveBalance?.sickLeaveBalance ?? 0,
    },
    {
      name: "Earned Leave",
      shortName: "EL",
      apiName: "EARNED",
      allocated: leaveBalance?.earnedLeaveAllocated ?? 0,
      balance: leaveBalance?.earnedLeaveBalance ?? 0,
    },
  ];

  return (
    <div style={{ padding: "32px" }}>
      {/* Header */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "28px",
        }}
      >
        <div>
          <h1>My Leave</h1>
          <p>View your leave balances and apply for leave.</p>
        </div>

        <button
          onClick={loadData}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            padding: "10px 16px",
            border: "1px solid #d1d5db",
            background: "#ffffff",
            borderRadius: "8px",
            cursor: "pointer",
          }}
        >
          <RefreshCw size={16} />
          Refresh
        </button>
      </div>

      {/* Leave Balance Cards */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
          gap: "20px",
        }}
      >
        {leaveTypes.map((leave) => (
          <div
            key={leave.shortName}
            style={{
              background: "#ffffff",
              borderRadius: "12px",
              padding: "24px",
              boxShadow: "0 2px 10px rgba(0,0,0,0.08)",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "12px",
                marginBottom: "20px",
              }}
            >
              <div
                style={{
                  width: "44px",
                  height: "44px",
                  borderRadius: "10px",
                  background: "#eef2ff",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <CalendarDays size={22} />
              </div>

              <div>
                <h3>{leave.name}</h3>
                <span>{leave.shortName}</span>
              </div>
            </div>

            <div style={{ marginBottom: "8px" }}>
              <span style={{ color: "#6b7280" }}>Remaining</span>

              <div
                style={{
                  fontSize: "32px",
                  fontWeight: "700",
                  marginTop: "4px",
                }}
              >
                {leave.balance}
              </div>
            </div>

            <div style={{ color: "#6b7280" }}>
              Allocated: {leave.allocated} days
            </div>
          </div>
        ))}
      </div>

      {/* Apply Leave */}
      <div
        style={{
          background: "#ffffff",
          borderRadius: "12px",
          padding: "28px",
          marginTop: "28px",
          boxShadow: "0 2px 10px rgba(0,0,0,0.08)",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "12px",
            marginBottom: "24px",
          }}
        >
          <CalendarDays size={22} />
          <div>
            <h2 style={{ margin: 0 }}>Apply for Leave</h2>
            <p
              style={{
                margin: "6px 0 0",
                color: "#6b7280",
              }}
            >
              Submit a leave request for HR approval.
            </p>
          </div>
        </div>

        <form onSubmit={handleApplyLeave}>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
              gap: "20px",
            }}
          >
            {/* Leave Type */}
            <div>
              <label
                style={{
                  display: "block",
                  marginBottom: "8px",
                  fontWeight: "600",
                }}
              >
                Leave Type
              </label>

              <select
                name="leaveType"
                value={formData.leaveType}
                onChange={handleChange}
                style={inputStyle}
              >
                <option value="CASUAL">Casual Leave</option>
                <option value="SICK">Sick Leave</option>
                <option value="EARNED">Earned Leave</option>
              </select>
            </div>

            {/* From Date */}
            <div>
              <label
                style={{
                  display: "block",
                  marginBottom: "8px",
                  fontWeight: "600",
                }}
              >
                From Date
              </label>

              <input
                type="date"
                name="fromDate"
                value={formData.fromDate}
                onChange={handleChange}
                style={inputStyle}
              />
            </div>

            {/* To Date */}
            <div>
              <label
                style={{
                  display: "block",
                  marginBottom: "8px",
                  fontWeight: "600",
                }}
              >
                To Date
              </label>

              <input
                type="date"
                name="toDate"
                value={formData.toDate}
                onChange={handleChange}
                style={inputStyle}
              />
            </div>

            {/* Reason */}
            <div>
              <label
                style={{
                  display: "block",
                  marginBottom: "8px",
                  fontWeight: "600",
                }}
              >
                Reason
              </label>

              <input
                type="text"
                name="reason"
                value={formData.reason}
                onChange={handleChange}
                placeholder="Enter reason for leave"
                style={inputStyle}
              />
            </div>
          </div>

          {/* Messages */}
          {formError && (
            <div
              style={{
                marginTop: "20px",
                padding: "12px 16px",
                borderRadius: "8px",
                background: "#fef2f2",
                color: "#b91c1c",
              }}
            >
              {formError}
            </div>
          )}

          {successMessage && (
            <div
              style={{
                marginTop: "20px",
                padding: "12px 16px",
                borderRadius: "8px",
                background: "#f0fdf4",
                color: "#15803d",
              }}
            >
              {successMessage}
            </div>
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={submitting}
            style={{
              marginTop: "20px",
              display: "flex",
              alignItems: "center",
              gap: "8px",
              padding: "12px 20px",
              border: "none",
              borderRadius: "8px",
              background: submitting ? "#9ca3af" : "#111827",
              color: "#ffffff",
              cursor: submitting ? "not-allowed" : "pointer",
              fontWeight: "600",
            }}
          >
            <Send size={16} />
            {submitting ? "Submitting..." : "Apply Leave"}
          </button>
        </form>
      </div>

      {/* Leave Summary */}
      <div
        style={{
          background: "#ffffff",
          borderRadius: "12px",
          padding: "28px",
          marginTop: "28px",
          boxShadow: "0 2px 10px rgba(0,0,0,0.08)",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "12px",
            marginBottom: "20px",
          }}
        >
          <BriefcaseBusiness size={22} />
          <h2>Leave Balance Summary</h2>
        </div>

        <div style={{ overflowX: "auto" }}>
          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
            }}
          >
            <thead>
              <tr>
                <th style={cellStyle}>Leave Type</th>
                <th style={cellStyle}>Allocated</th>
                <th style={cellStyle}>Remaining</th>
                <th style={cellStyle}>Used</th>
              </tr>
            </thead>

            <tbody>
              {leaveTypes.map((leave) => (
                <tr key={leave.shortName}>
                  <td style={cellStyle}>{leave.name}</td>
                  <td style={cellStyle}>{leave.allocated}</td>
                  <td style={cellStyle}>{leave.balance}</td>
                  <td style={cellStyle}>
                    {leave.allocated - leave.balance}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

const inputStyle = {
  width: "100%",
  boxSizing: "border-box",
  padding: "11px 12px",
  border: "1px solid #d1d5db",
  borderRadius: "8px",
  fontSize: "14px",
  background: "#ffffff",
};

const cellStyle = {
  padding: "14px 12px",
  textAlign: "left",
  borderBottom: "1px solid #e5e7eb",
};

export default MyLeave;