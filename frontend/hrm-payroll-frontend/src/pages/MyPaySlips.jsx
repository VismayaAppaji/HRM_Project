import { useEffect, useState } from "react";
import {
  FileText,
  Download,
  RefreshCw,
} from "lucide-react";
import api from "../services/api";

const MyPayslips = () => {
  const [payslips, setPayslips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [downloadingId, setDownloadingId] = useState(null);

  const loadPayslips = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get("/payrolls/me");
      setPayslips(response.data || []);
    } catch (err) {
      console.error("Failed to load payslips:", err);

      if (err.response?.status === 401) {
        setError("Your session has expired. Please login again.");
      } else if (err.response?.status === 403) {
        setError("You do not have permission to access your payslips.");
      } else {
        setError("Failed to load payslips.");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPayslips();
  }, []);

  const downloadPayslip = async (payrollId, payPeriod) => {
    try {
      setDownloadingId(payrollId);

      const response = await api.get(`/payslips/${payrollId}`, {
        responseType: "blob",
      });

      const blob = new Blob([response.data], {
        type: "application/pdf",
      });

      const url = window.URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = url;
      link.download = `Payslip-${payPeriod || "payroll"}.pdf`;

      document.body.appendChild(link);
      link.click();

      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Failed to download payslip:", err);
      alert("Failed to download payslip.");
    } finally {
      setDownloadingId(null);
    }
  };

  if (loading) {
    return (
      <div style={{ padding: "32px" }}>
        <p>Loading payslips...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ padding: "32px" }}>
        <p>{error}</p>

        <button onClick={loadPayslips}>
          <RefreshCw size={16} />
          Retry
        </button>
      </div>
    );
  }

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
          <h1>My Payslips</h1>
          <p>View and download your monthly payslips.</p>
        </div>

        <button onClick={loadPayslips}>
          <RefreshCw size={16} />
          Refresh
        </button>
      </div>

      {/* Empty State */}
      {payslips.length === 0 ? (
        <div
          style={{
            background: "#ffffff",
            borderRadius: "12px",
            padding: "50px",
            textAlign: "center",
            boxShadow: "0 2px 10px rgba(0,0,0,0.08)",
          }}
        >
          <FileText size={42} />

          <h2>No Payslips Available</h2>

          <p>
            Your payslips will appear here once payroll has been generated.
          </p>
        </div>
      ) : (
        <>
          {/* Summary Cards */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
              gap: "20px",
              marginBottom: "28px",
            }}
          >
            <SummaryCard
              title="Payslips"
              value={payslips.length}
            />

            <SummaryCard
              title="Latest Gross Salary"
              value={formatCurrency(payslips[0]?.grossSalary)}
            />

            <SummaryCard
              title="Latest Net Salary"
              value={formatCurrency(payslips[0]?.netSalary)}
            />
          </div>

          {/* Payslip Table */}
          <div
            style={{
              background: "#ffffff",
              borderRadius: "12px",
              padding: "24px",
              boxShadow: "0 2px 10px rgba(0,0,0,0.08)",
              overflowX: "auto",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "10px",
                marginBottom: "20px",
              }}
            >
              <FileText size={22} />
              <h2>Payslip History</h2>
            </div>

            <table
              style={{
                width: "100%",
                borderCollapse: "collapse",
                minWidth: "950px",
              }}
            >
              <thead>
                <tr>
                  <th style={cellStyle}>Pay Period</th>
                  <th style={cellStyle}>Basic</th>
                  <th style={cellStyle}>HRA</th>
                  <th style={cellStyle}>Special Allowance</th>
                  <th style={cellStyle}>Gross</th>
                  <th style={cellStyle}>Deductions</th>
                  <th style={cellStyle}>Net Salary</th>
                  <th style={cellStyle}>Status</th>
                  <th style={cellStyle}>Action</th>
                </tr>
              </thead>

              <tbody>
                {payslips.map((payslip) => (
                  <tr key={payslip.id}>
                    <td style={cellStyle}>
                      {payslip.payPeriod || "-"}
                    </td>

                    <td style={cellStyle}>
                      {formatCurrency(payslip.basicSalary)}
                    </td>

                    <td style={cellStyle}>
                      {formatCurrency(payslip.hra)}
                    </td>

                    <td style={cellStyle}>
                      {formatCurrency(payslip.specialAllowance)}
                    </td>

                    <td style={cellStyle}>
                      {formatCurrency(payslip.grossSalary)}
                    </td>

                    <td style={cellStyle}>
                      {formatCurrency(payslip.totalDeductions)}
                    </td>

                    <td
                      style={{
                        ...cellStyle,
                        fontWeight: "700",
                      }}
                    >
                      {formatCurrency(payslip.netSalary)}
                    </td>

                    <td style={cellStyle}>
                      <span
                        style={{
                          padding: "5px 10px",
                          borderRadius: "20px",
                          fontSize: "12px",
                          fontWeight: "600",
                          background:
                            payslip.status === "GENERATED"
                              ? "#dcfce7"
                              : "#f3f4f6",
                        }}
                      >
                        {payslip.status || "-"}
                      </span>
                    </td>

                    <td style={cellStyle}>
                      <button
                        onClick={() =>
                          downloadPayslip(
                            payslip.id,
                            payslip.payPeriod
                          )
                        }
                        disabled={downloadingId === payslip.id}
                        style={{
                          display: "inline-flex",
                          alignItems: "center",
                          gap: "6px",
                        }}
                      >
                        <Download size={15} />

                        {downloadingId === payslip.id
                          ? "Downloading..."
                          : "Download"}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
};

const SummaryCard = ({ title, value }) => {
  return (
    <div
      style={{
        background: "#ffffff",
        borderRadius: "12px",
        padding: "24px",
        boxShadow: "0 2px 10px rgba(0,0,0,0.08)",
      }}
    >
      <p
        style={{
          color: "#6b7280",
          marginBottom: "8px",
        }}
      >
        {title}
      </p>

      <h2>{value}</h2>
    </div>
  );
};

const formatCurrency = (value) => {
  const number = Number(value || 0);

  return `₹${number.toLocaleString("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
};

const cellStyle = {
  padding: "14px 12px",
  textAlign: "left",
  borderBottom: "1px solid #e5e7eb",
  whiteSpace: "nowrap",
};

export default MyPayslips;