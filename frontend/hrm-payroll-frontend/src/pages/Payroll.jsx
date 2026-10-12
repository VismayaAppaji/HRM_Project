import { useEffect, useState } from "react";
import { useOutletContext } from "react-router-dom";
import {
  Calculator,
  CheckCircle2,
  Clock3,
  IndianRupee,
  RefreshCw,
  Search,
  XCircle,
} from "lucide-react";
import api from "../services/api";
import "./Payroll.css";

function Payroll() {
  const { payPeriod } = useOutletContext();

  const [payrolls, setPayrolls] = useState([]);
  const [employees, setEmployees] = useState([]);

  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const [selectedEmployee, setSelectedEmployee] = useState("");
  const [selectedPeriod, setSelectedPeriod] = useState(
    payPeriod || "2026-12"
  );

  useEffect(() => {
    setSelectedPeriod(payPeriod || "2026-12");
  }, [payPeriod]);

  useEffect(() => {
    loadData();
  }, [payPeriod]);

  const loadData = async () => {
    try {
      setLoading(true);
      setError("");

      const [payrollResponse, employeeResponse] = await Promise.all([
        api.get("/payrolls"),
        api.get("/employees"),
      ]);

      setPayrolls(
        Array.isArray(payrollResponse.data)
          ? payrollResponse.data
          : []
      );

      setEmployees(
        Array.isArray(employeeResponse.data)
          ? employeeResponse.data
          : []
      );
    } catch (err) {
      console.error("Payroll loading error:", err);

      if (err.response?.status === 401) {
        setError("Your session has expired. Please login again.");
      } else if (err.response?.status === 403) {
        setError("You do not have permission to access payroll.");
      } else {
        setError("Unable to load payroll data.");
      }
    } finally {
      setLoading(false);
    }
  };

  const getEmployee = (employeeId) => {
    return employees.find(
      (employee) => employee.id === employeeId
    );
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(value || 0);
  };

  const formatEmployeeName = (employeeId) => {
    const employee = getEmployee(employeeId);

    if (!employee) {
      return "Unknown Employee";
    }

    return `${employee.firstName} ${employee.lastName}`;
  };

  const filteredPayrolls = payrolls.filter((payroll) => {
    const employee = getEmployee(payroll.employeeId);

    const employeeName = employee
      ? `${employee.firstName} ${employee.lastName}`.toLowerCase()
      : "";

    const employeeCode =
      employee?.employeeCode?.toLowerCase() || "";

    const searchValue = search.toLowerCase();

    return (
      employeeName.includes(searchValue) ||
      employeeCode.includes(searchValue) ||
      payroll.payPeriod?.toLowerCase().includes(searchValue)
    );
  });

  const processedCount = payrolls.filter(
    (payroll) => payroll.payPeriod === selectedPeriod
  ).length;

  const totalNetSalary = payrolls
    .filter(
      (payroll) => payroll.payPeriod === selectedPeriod
    )
    .reduce(
      (total, payroll) =>
        total + Number(payroll.netSalary || 0),
      0
    );

  const totalDeductions = payrolls
    .filter(
      (payroll) => payroll.payPeriod === selectedPeriod
    )
    .reduce(
      (total, payroll) =>
        total + Number(payroll.totalDeductions || 0),
      0
    );

  const generatePayroll = async (event) => {
    event.preventDefault();

    console.log("Generate Payroll button clicked");

    setMessage("");
    setError("");

    if (!selectedEmployee) {
      setError("Please select an employee.");
      console.log("No employee selected");
      return;
    }

    if (!selectedPeriod) {
      setError("Please select a pay period.");
      console.log("No pay period selected");
      return;
    }

    console.log("Payroll request:", {
      employeeId: selectedEmployee,
      payPeriod: selectedPeriod,
    });

    try {
      setGenerating(true);

      const response = await api.post(
        "/payrolls/generate",
        {
          employeeId: selectedEmployee,
          payPeriod: selectedPeriod,
        }
      );

      console.log(
        "Payroll generated successfully:",
        response.data
      );

      setMessage(
        `Payroll generated successfully for ${selectedPeriod}.`
      );

      setSelectedEmployee("");

      await loadData();

    } catch (err) {
      console.error(
        "Generate payroll error:",
        err
      );

      console.error(
        "Response status:",
        err.response?.status
      );

      console.error(
        "Response data:",
        err.response?.data
      );

      if (err.response?.status === 401) {
        setError(
          "Session expired. Please logout and login again."
        );
      } else if (err.response?.status === 403) {
        setError(
          "Access denied. HR permission is required to generate payroll."
        );
      } else if (err.response?.status === 400) {
        const backendMessage =
          err.response?.data?.message ||
          err.response?.data;

        setError(
          typeof backendMessage === "string"
            ? backendMessage
            : "Invalid payroll request."
        );
      } else if (err.response?.status === 500) {
        const backendMessage =
          err.response?.data?.message ||
          err.response?.data;

        setError(
          typeof backendMessage === "string"
            ? backendMessage
            : "Server error while generating payroll."
        );
      } else {
        setError(
          "Unable to generate payroll. Please try again."
        );
      }

    } finally {
      setGenerating(false);
    }
  };

  return (
    <div className="payroll-page">

      {/* Header */}
      <div className="page-header">
        <div>
          <div className="page-eyebrow">
            HR MANAGEMENT
          </div>

          <h1>Payroll Management</h1>

          <p>
            Generate and manage employee monthly payroll
          </p>
        </div>

        <button
          type="button"
          className="refresh-btn"
          onClick={loadData}
          disabled={loading}
        >
          <RefreshCw size={17} />
          Refresh
        </button>
      </div>

      {/* Success message */}
      {message && (
        <div className="success-message">
          <CheckCircle2 size={18} />
          {message}
        </div>
      )}

      {/* Error message */}
      {error && (
        <div className="error-message">
          <XCircle size={18} />
          {error}
        </div>
      )}

      {/* Summary cards */}
      <div className="payroll-summary">

        <div className="payroll-card">
          <div className="payroll-card-icon blue">
            <Calculator size={20} />
          </div>

          <div>
            <span>Processed Payroll</span>
            <strong>{processedCount}</strong>
          </div>
        </div>

        <div className="payroll-card">
          <div className="payroll-card-icon green">
            <CheckCircle2 size={20} />
          </div>

          <div>
            <span>Net Payroll</span>
            <strong>
              {formatCurrency(totalNetSalary)}
            </strong>
          </div>
        </div>

        <div className="payroll-card">
          <div className="payroll-card-icon orange">
            <IndianRupee size={20} />
          </div>

          <div>
            <span>Total Deductions</span>
            <strong>
              {formatCurrency(totalDeductions)}
            </strong>
          </div>
        </div>

        <div className="payroll-card">
          <div className="payroll-card-icon purple">
            <Clock3 size={20} />
          </div>

          <div>
            <span>Pay Period</span>
            <strong>{selectedPeriod}</strong>
          </div>
        </div>

      </div>

      {/* Generate Payroll */}
      <section className="generate-section">

        <div className="section-heading">
          <div>
            <h2>Generate Payroll</h2>

            <p>
              Generate monthly payroll and payslip
              for an employee
            </p>
          </div>
        </div>

        <form
          className="generate-form"
          onSubmit={generatePayroll}
        >

          <div className="form-group">

            <label htmlFor="employee">
              Employee
            </label>

            <select
              id="employee"
              value={selectedEmployee}
              onChange={(e) => {
                setSelectedEmployee(e.target.value);
                setError("");
                setMessage("");
              }}
              disabled={generating}
            >
              <option value="">
                Select Employee
              </option>

              {employees.map((employee) => (
                <option
                  key={employee.id}
                  value={employee.id}
                >
                  {employee.employeeCode} -{" "}
                  {employee.firstName}{" "}
                  {employee.lastName}
                </option>
              ))}
            </select>

          </div>

          <div className="form-group">

            <label htmlFor="payPeriod">
              Pay Period
            </label>

            <input
              id="payPeriod"
              type="month"
              value={selectedPeriod}
              onChange={(e) => {
                setSelectedPeriod(e.target.value);
                setError("");
                setMessage("");
              }}
              disabled={generating}
            />

          </div>

          <button
            type="submit"
            className="generate-btn"
            disabled={
              generating ||
              !selectedEmployee ||
              !selectedPeriod
            }
          >
            <Calculator size={17} />

            {generating
              ? "Generating..."
              : "Generate Payroll"}
          </button>

        </form>

      </section>

      {/* Payroll Records */}
      <section className="payroll-table-section">

        <div className="section-heading">

          <div>
            <h2>Payroll Records</h2>

            <p>
              Employee monthly payroll history
            </p>
          </div>

        </div>

        <div className="payroll-toolbar">

          <div className="search-box">

            <Search size={17} />

            <input
              type="text"
              placeholder="Search employee, code or pay period..."
              value={search}
              onChange={(e) =>
                setSearch(e.target.value)
              }
            />

          </div>

        </div>

        {loading ? (

          <div className="empty-state">
            Loading payroll records...
          </div>

        ) : filteredPayrolls.length === 0 ? (

          <div className="empty-state">

            <Calculator size={35} />

            <h3>
              No payroll records found
            </h3>

            <p>
              Generate payroll for an employee
              to see records here.
            </p>

          </div>

        ) : (

          <div className="table-wrapper">

            <table>

              <thead>
                <tr>
                  <th>EMPLOYEE</th>
                  <th>PAY PERIOD</th>
                  <th>BASIC</th>
                  <th>HRA</th>
                  <th>GROSS</th>
                  <th>DEDUCTIONS</th>
                  <th>NET SALARY</th>
                  <th>STATUS</th>
                </tr>
              </thead>

              <tbody>

                {filteredPayrolls.map((payroll) => (

                  <tr key={payroll.id}>

                    <td>

                      <div className="employee-cell">

                        <div className="employee-avatar">
                          {formatEmployeeName(
                            payroll.employeeId
                          )
                            .charAt(0)
                            .toUpperCase()}
                        </div>

                        <div>

                          <strong>
                            {formatEmployeeName(
                              payroll.employeeId
                            )}
                          </strong>

                          <span>
                            {getEmployee(
                              payroll.employeeId
                            )?.employeeCode || "-"}
                          </span>

                        </div>

                      </div>

                    </td>

                    <td>
                      <strong>
                        {payroll.payPeriod}
                      </strong>
                    </td>

                    <td>
                      {formatCurrency(
                        payroll.basicSalary
                      )}
                    </td>

                    <td>
                      {formatCurrency(
                        payroll.hra
                      )}
                    </td>

                    <td>
                      <strong>
                        {formatCurrency(
                          payroll.grossSalary
                        )}
                      </strong>
                    </td>

                    <td className="deduction">
                      {formatCurrency(
                        payroll.totalDeductions
                      )}
                    </td>

                    <td className="net-salary">
                      {formatCurrency(
                        payroll.netSalary
                      )}
                    </td>

                    <td>

                      <span className="status-badge">

                        <span className="status-dot"></span>

                        {payroll.status ||
                          "GENERATED"}

                      </span>

                    </td>

                  </tr>

                ))}

              </tbody>

            </table>

          </div>

        )}

      </section>

    </div>
  );
}

export default Payroll;