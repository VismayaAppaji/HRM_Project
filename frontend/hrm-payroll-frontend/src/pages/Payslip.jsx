import { useEffect, useState } from "react";
import { Download, Eye, FileText } from "lucide-react";
import api from "../services/api";

function Payslips() {
  const [payrolls, setPayrolls] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadPayslips = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get("/payrolls");

      setPayrolls(response.data);
    } catch (err) {
      console.error("Failed to load payslips:", err);
      setError("Failed to load payslips.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPayslips();
  }, []);

  const openPayslip = async (payrollId) => {
    try {
      const response = await api.get(`/payslips/${payrollId}`, {
        responseType: "blob",
      });

      const pdfUrl = window.URL.createObjectURL(
        new Blob([response.data], { type: "application/pdf" })
      );

      window.open(pdfUrl, "_blank");
    } catch (err) {
      console.error("Failed to open payslip:", err);
      alert("Unable to open payslip.");
    }
  };

  const downloadPayslip = async (payrollId, payPeriod) => {
    try {
      const response = await api.get(`/payslips/${payrollId}`, {
        responseType: "blob",
      });

      const pdfUrl = window.URL.createObjectURL(
        new Blob([response.data], { type: "application/pdf" })
      );

      const link = document.createElement("a");
      link.href = pdfUrl;
      link.download = `Payslip-${payPeriod}.pdf`;
      document.body.appendChild(link);
      link.click();
      link.remove();

      window.URL.revokeObjectURL(pdfUrl);
    } catch (err) {
      console.error("Failed to download payslip:", err);
      alert("Unable to download payslip.");
    }
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h1>Payslips</h1>
          <p>View and download generated employee payslips.</p>
        </div>
      </div>

      {loading && <p>Loading payslips...</p>}

      {error && <p>{error}</p>}

      {!loading && !error && (
        <div className="table-card">
          <div className="table-card-header">
            <div>
              <h2>Generated Payslips</h2>
              <span>{payrolls.length} records</span>
            </div>
          </div>

          {payrolls.length === 0 ? (
            <div className="empty-state">
              <FileText size={40} />
              <h3>No payslips available</h3>
              <p>Generate payroll to create a payslip.</p>
            </div>
          ) : (
            <div className="table-wrapper">
              <table>
                <thead>
                  <tr>
                    <th>Pay Period</th>
                    <th>Employee ID</th>
                    <th>Gross Salary</th>
                    <th>Deductions</th>
                    <th>Net Salary</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>

                <tbody>
                  {payrolls.map((payroll) => (
                    <tr key={payroll.id}>
                      <td>{payroll.payPeriod}</td>

                      <td>
                        {payroll.employeeId}
                      </td>

                      <td>
                        ₹{Number(payroll.grossSalary).toLocaleString("en-IN")}
                      </td>

                      <td>
                        ₹
                        {Number(
                          payroll.totalDeductions
                        ).toLocaleString("en-IN")}
                      </td>

                      <td>
                        ₹{Number(payroll.netSalary).toLocaleString("en-IN")}
                      </td>

                      <td>
                        <span className="status-badge">
                          {payroll.status}
                        </span>
                      </td>

                      <td>
                        <div className="action-buttons">
                          <button
                            type="button"
                            title="View Payslip"
                            onClick={() => openPayslip(payroll.id)}
                          >
                            <Eye size={17} />
                          </button>

                          <button
                            type="button"
                            title="Download Payslip"
                            onClick={() =>
                              downloadPayslip(
                                payroll.id,
                                payroll.payPeriod
                              )
                            }
                          >
                            <Download size={17} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default Payslips;