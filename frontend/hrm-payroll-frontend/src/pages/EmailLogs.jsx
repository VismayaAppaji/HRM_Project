import { useEffect, useState } from "react";
import { Mail, RefreshCw } from "lucide-react";
import api from "../services/api";
import "./EmailLogs.css";

function EmailLogs() {
  const [emailLogs, setEmailLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadEmailLogs = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get("/email-logs");

      setEmailLogs(response.data);
    } catch (err) {
      console.error("Failed to load email logs:", err);
      setError("Failed to load email logs.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadEmailLogs();
  }, []);

  const getStatusClass = (status) => {
    if (!status) return "status-default";

    const value = status.toString().toUpperCase();

    if (
      value === "SENT" ||
      value === "SUCCESS" ||
      value === "DELIVERED"
    ) {
      return "status-success";
    }

    if (
      value === "FAILED" ||
      value === "FAILURE" ||
      value === "ERROR"
    ) {
      return "status-failed";
    }

    return "status-default";
  };

  return (
    <div className="email-logs-page">
      <div className="email-logs-header">
        <div>
          <h1>Email Logs</h1>
          <p>Track payslip email delivery status.</p>
        </div>

        <button
          className="refresh-button"
          onClick={loadEmailLogs}
          disabled={loading}
        >
          <RefreshCw size={17} />
          Refresh
        </button>
      </div>

      <div className="email-logs-card">
        <div className="email-logs-card-header">
          <div className="email-logs-title">
            <div className="email-logs-icon">
              <Mail size={20} />
            </div>

            <div>
              <h2>Email Delivery Logs</h2>
              <span>{emailLogs.length} records</span>
            </div>
          </div>
        </div>

        {loading && (
          <div className="email-logs-message">
            Loading email logs...
          </div>
        )}

        {!loading && error && (
          <div className="email-logs-message error-message">
            {error}
          </div>
        )}

        {!loading && !error && emailLogs.length === 0 && (
          <div className="email-logs-empty">
            <Mail size={42} />
            <h3>No email logs found</h3>
            <p>
              Email delivery records will appear here after a payslip
              is emailed.
            </p>
          </div>
        )}

        {!loading && !error && emailLogs.length > 0 && (
          <div className="email-logs-table-wrapper">
            <table className="email-logs-table">
              <thead>
                <tr>
                  <th>Employee ID</th>
                  <th>Payroll ID</th>
                  <th>Email</th>
                  <th>Status</th>
                  <th>Sent At</th>
                </tr>
              </thead>

              <tbody>
                {emailLogs.map((log) => (
                  <tr key={log.id}>
                    <td>{log.employeeId || "-"}</td>

                    <td>{log.payrollId || "-"}</td>

                    <td>{log.email || log.recipientEmail || "-"}</td>

                    <td>
                      <span
                        className={`email-status ${getStatusClass(
                          log.status
                        )}`}
                      >
                        {log.status || "UNKNOWN"}
                      </span>
                    </td>

                    <td>
                      {log.sentAt
                        ? new Date(log.sentAt).toLocaleString("en-IN")
                        : log.createdAt
                        ? new Date(log.createdAt).toLocaleString("en-IN")
                        : "-"}
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
}

export default EmailLogs;