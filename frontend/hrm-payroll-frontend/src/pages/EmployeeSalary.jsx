import { useEffect, useMemo, useState } from "react";
import {
  Search,
  Plus,
  RefreshCw,
  WalletCards,
  Users,
  CheckCircle2,
  X,
  Pencil,
  Trash2,
} from "lucide-react";
import api from "../services/api";
import "./EmployeeSalary.css";

const emptyForm = {
  employeeId: "",
  salaryStructureId: "",
  basicSalary: "",
  hra: "",
  specialAllowance: "",
  grossSalary: "",
  effectiveFrom: "",
  effectiveTo: "",
  active: true,
};

function EmployeeSalary() {
  const [employees, setEmployees] = useState([]);
  const [salaryStructures, setSalaryStructures] = useState([]);
  const [employeeSalaries, setEmployeeSalaries] = useState([]);

  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const [form, setForm] = useState(emptyForm);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      setError("");

      const [employeesResponse, structuresResponse] =
        await Promise.all([
          api.get("/employees"),
          api.get("/salary-structures"),
        ]);

      setEmployees(employeesResponse.data || []);
      setSalaryStructures(structuresResponse.data || []);

      const salaryResults = [];

      for (const employee of employeesResponse.data || []) {
        try {
          const response = await api.get(
            `/employee-salaries/employee/${employee.id}`
          );

          (response.data || []).forEach((salary) => {
            salaryResults.push({
              ...salary,
              employee,
            });
          });
        } catch (err) {
          console.error(
            `Unable to load salary for employee ${employee.id}`,
            err
          );
        }
      }

      setEmployeeSalaries(salaryResults);
    } catch (err) {
      console.error(err);
      setError("Unable to load employee salary data.");
    } finally {
      setLoading(false);
    }
  };

  const handleEmployeeChange = (employeeId) => {
    setForm((previous) => ({
      ...previous,
      employeeId,
    }));
  };

  const handleStructureChange = (structureId) => {
    const structure = salaryStructures.find(
      (item) => item.id === structureId
    );

    if (!structure) {
      setForm((previous) => ({
        ...previous,
        salaryStructureId: structureId,
      }));
      return;
    }

    setForm((previous) => ({
      ...previous,
      salaryStructureId: structureId,
      basicSalary: structure.basicSalary ?? "",
      hra: structure.hra ?? "",
      specialAllowance: structure.specialAllowance ?? "",
      grossSalary: structure.grossSalary ?? "",
    }));
  };

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const openAddModal = () => {
    setEditingId(null);
    setForm(emptyForm);
    setError("");
    setSuccess("");
    setShowModal(true);
  };

  const openEditModal = (salary) => {
    setEditingId(salary.id);

    setForm({
      employeeId: salary.employeeId || "",
      salaryStructureId: salary.salaryStructureId || "",
      basicSalary: salary.basicSalary ?? "",
      hra: salary.hra ?? "",
      specialAllowance: salary.specialAllowance ?? "",
      grossSalary: salary.grossSalary ?? "",
      effectiveFrom: salary.effectiveFrom || "",
      effectiveTo: salary.effectiveTo || "",
      active: salary.active ?? true,
    });

    setError("");
    setSuccess("");
    setShowModal(true);
  };

  const closeModal = () => {
    if (saving) return;

    setShowModal(false);
    setEditingId(null);
    setForm(emptyForm);
  };

  const validateForm = () => {
    if (!form.employeeId) {
      return "Please select an employee.";
    }

    if (!form.salaryStructureId) {
      return "Please select a salary structure.";
    }

    if (!form.basicSalary || Number(form.basicSalary) < 0) {
      return "Please enter a valid basic salary.";
    }

    if (!form.hra || Number(form.hra) < 0) {
      return "Please enter a valid HRA.";
    }

    if (
      form.specialAllowance === "" ||
      Number(form.specialAllowance) < 0
    ) {
      return "Please enter a valid special allowance.";
    }

    if (!form.grossSalary || Number(form.grossSalary) <= 0) {
      return "Please enter a valid gross salary.";
    }

    if (!form.effectiveFrom) {
      return "Please select an effective from date.";
    }

    if (
      form.effectiveTo &&
      form.effectiveTo < form.effectiveFrom
    ) {
      return "Effective to date cannot be before effective from date.";
    }

    return "";
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const validationError = validateForm();

    if (validationError) {
      setError(validationError);
      return;
    }

    try {
      setSaving(true);
      setError("");
      setSuccess("");

      const payload = {
        employeeId: form.employeeId,
        salaryStructureId: form.salaryStructureId,
        basicSalary: Number(form.basicSalary),
        hra: Number(form.hra),
        specialAllowance: Number(form.specialAllowance),
        grossSalary: Number(form.grossSalary),
        effectiveFrom: form.effectiveFrom,
        effectiveTo: form.effectiveTo || null,
        active: form.active,
      };

      if (editingId) {
        await api.put(
          `/employee-salaries/${editingId}`,
          payload
        );

        setSuccess("Employee salary updated successfully.");
      } else {
        await api.post("/employee-salaries", payload);

        setSuccess("Salary assigned to employee successfully.");
      }

      closeModal();
      await loadData();

      setTimeout(() => {
        setSuccess("");
      }, 4000);
    } catch (err) {
      console.error(err);

      const message =
        err.response?.data?.message ||
        err.response?.data ||
        "Unable to save employee salary.";

      setError(
        typeof message === "string"
          ? message
          : "Unable to save employee salary."
      );
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this employee salary?"
    );

    if (!confirmed) return;

    try {
      setError("");
      setSuccess("");

      await api.delete(`/employee-salaries/${id}`);

      setSuccess("Employee salary deleted successfully.");

      await loadData();

      setTimeout(() => {
        setSuccess("");
      }, 4000);
    } catch (err) {
      console.error(err);

      const message =
        err.response?.data?.message ||
        "Unable to delete employee salary.";

      setError(
        typeof message === "string"
          ? message
          : "Unable to delete employee salary."
      );
    }
  };

  const getEmployeeName = (employee) => {
    if (!employee) return "Unknown Employee";

    return `${employee.firstName || ""} ${
      employee.lastName || ""
    }`.trim();
  };

  const getStructureName = (salaryStructureId) => {
    const structure = salaryStructures.find(
      (item) => item.id === salaryStructureId
    );

    return structure?.structureName || "Salary Structure";
  };

  const filteredSalaries = useMemo(() => {
    const query = search.trim().toLowerCase();

    if (!query) {
      return employeeSalaries;
    }

    return employeeSalaries.filter((salary) => {
      const employeeName = getEmployeeName(
        salary.employee
      ).toLowerCase();

      const employeeCode =
        salary.employee?.employeeCode?.toLowerCase() || "";

      const structureName = getStructureName(
        salary.salaryStructureId
      ).toLowerCase();

      return (
        employeeName.includes(query) ||
        employeeCode.includes(query) ||
        structureName.includes(query)
      );
    });
  }, [search, employeeSalaries, salaryStructures]);

  const activeCount = employeeSalaries.filter(
    (salary) => salary.active
  ).length;

  return (
    <div className="employee-salary-page">
      {/* Header */}
      <div className="employee-salary-header">
        <div>
          <div className="page-eyebrow">HR MANAGEMENT</div>

          <h1>Employee Salary</h1>

          <p>
            Assign and manage salary structures for employees
          </p>
        </div>

        <div className="employee-salary-actions">
          <button
            className="secondary-button"
            onClick={loadData}
            disabled={loading}
          >
            <RefreshCw size={17} />
            Refresh
          </button>

          <button
            className="primary-button"
            onClick={openAddModal}
          >
            <Plus size={18} />
            Assign Salary
          </button>
        </div>
      </div>

      {/* Alerts */}
      {success && (
        <div className="success-alert">
          <CheckCircle2 size={18} />
          <span>{success}</span>
        </div>
      )}

      {error && !showModal && (
        <div className="error-alert">
          <span>{error}</span>

          <button onClick={() => setError("")}>
            <X size={17} />
          </button>
        </div>
      )}

      {/* Summary */}
      <div className="salary-summary-grid">
        <div className="salary-summary-card">
          <div className="summary-icon blue">
            <WalletCards size={21} />
          </div>

          <div>
            <span>Total Assignments</span>
            <strong>{employeeSalaries.length}</strong>
          </div>
        </div>

        <div className="salary-summary-card">
          <div className="summary-icon green">
            <CheckCircle2 size={21} />
          </div>

          <div>
            <span>Active Salaries</span>
            <strong>{activeCount}</strong>
          </div>
        </div>

        <div className="salary-summary-card">
          <div className="summary-icon purple">
            <Users size={21} />
          </div>

          <div>
            <span>Employees</span>
            <strong>{employees.length}</strong>
          </div>
        </div>
      </div>

      {/* Main Card */}
      <div className="employee-salary-card">
        <div className="section-heading">
          <div>
            <h2>Employee Salary Assignments</h2>
            <p>
              Manage current salary and salary history for
              employees
            </p>
          </div>
        </div>

        {/* Search */}
        <div className="salary-toolbar">
          <div className="search-box">
            <Search size={18} />

            <input
              type="text"
              placeholder="Search employee, code or salary structure..."
              value={search}
              onChange={(event) =>
                setSearch(event.target.value)
              }
            />
          </div>
        </div>

        {/* Table */}
        <div className="table-wrapper">
          {loading ? (
            <div className="empty-state">
              <div className="loading-spinner"></div>
              <p>Loading employee salary data...</p>
            </div>
          ) : filteredSalaries.length === 0 ? (
            <div className="empty-state">
              <WalletCards size={42} />

              <h3>No salary assignments found</h3>

              <p>
                Assign a salary structure to an employee to
                get started.
              </p>

              <button
                className="primary-button"
                onClick={openAddModal}
              >
                <Plus size={17} />
                Assign Salary
              </button>
            </div>
          ) : (
            <table className="salary-table">
              <thead>
                <tr>
                  <th>EMPLOYEE</th>
                  <th>STRUCTURE</th>
                  <th>BASIC</th>
                  <th>HRA</th>
                  <th>SPECIAL ALLOWANCE</th>
                  <th>GROSS SALARY</th>
                  <th>EFFECTIVE FROM</th>
                  <th>STATUS</th>
                  <th>ACTIONS</th>
                </tr>
              </thead>

              <tbody>
                {filteredSalaries.map((salary) => (
                  <tr key={salary.id}>
                    <td>
                      <div className="employee-cell">
                        <div className="employee-avatar">
                          {salary.employee?.firstName
                            ?.charAt(0)
                            ?.toUpperCase() || "E"}
                        </div>

                        <div>
                          <strong>
                            {getEmployeeName(
                              salary.employee
                            )}
                          </strong>

                          <span>
                            {salary.employee?.employeeCode ||
                              "-"}
                          </span>
                        </div>
                      </div>
                    </td>

                    <td>
                      <span className="structure-name">
                        {getStructureName(
                          salary.salaryStructureId
                        )}
                      </span>
                    </td>

                    <td>
                      ₹
                      {Number(
                        salary.basicSalary || 0
                      ).toLocaleString("en-IN")}
                    </td>

                    <td>
                      ₹
                      {Number(
                        salary.hra || 0
                      ).toLocaleString("en-IN")}
                    </td>

                    <td>
                      ₹
                      {Number(
                        salary.specialAllowance || 0
                      ).toLocaleString("en-IN")}
                    </td>

                    <td>
                      <strong>
                        ₹
                        {Number(
                          salary.grossSalary || 0
                        ).toLocaleString("en-IN")}
                      </strong>
                    </td>

                    <td>
                      {salary.effectiveFrom || "-"}
                    </td>

                    <td>
                      <span
                        className={`status-badge ${
                          salary.active
                            ? "active"
                            : "inactive"
                        }`}
                      >
                        {salary.active
                          ? "ACTIVE"
                          : "INACTIVE"}
                      </span>
                    </td>

                    <td>
                      <div className="action-buttons">
                        <button
                          className="icon-button edit"
                          title="Edit"
                          onClick={() =>
                            openEditModal(salary)
                          }
                        >
                          <Pencil size={16} />
                        </button>

                        <button
                          className="icon-button delete"
                          title="Delete"
                          onClick={() =>
                            handleDelete(salary.id)
                          }
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {!loading && filteredSalaries.length > 0 && (
          <div className="table-footer">
            Showing {filteredSalaries.length} of{" "}
            {employeeSalaries.length} salary assignments
          </div>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="modal-overlay">
          <div className="salary-modal">
            <div className="modal-header">
              <div>
                <h2>
                  {editingId
                    ? "Edit Employee Salary"
                    : "Assign Salary"}
                </h2>

                <p>
                  {editingId
                    ? "Update employee salary details"
                    : "Assign a salary structure to an employee"}
                </p>
              </div>

              <button
                className="modal-close"
                onClick={closeModal}
                disabled={saving}
              >
                <X size={20} />
              </button>
            </div>

            {error && (
              <div className="modal-error">
                {error}
              </div>
            )}

            <form
              className="salary-form"
              onSubmit={handleSubmit}
            >
              <div className="form-grid">
                <div className="form-group full-width">
                  <label>
                    Employee <span>*</span>
                  </label>

                  <select
                    name="employeeId"
                    value={form.employeeId}
                    onChange={(event) =>
                      handleEmployeeChange(
                        event.target.value
                      )
                    }
                    disabled={saving}
                  >
                    <option value="">
                      Select employee
                    </option>

                    {employees.map((employee) => (
                      <option
                        key={employee.id}
                        value={employee.id}
                      >
                        {employee.employeeCode} -{" "}
                        {getEmployeeName(employee)}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-group full-width">
                  <label>
                    Salary Structure <span>*</span>
                  </label>

                  <select
                    name="salaryStructureId"
                    value={form.salaryStructureId}
                    onChange={(event) =>
                      handleStructureChange(
                        event.target.value
                      )
                    }
                    disabled={saving}
                  >
                    <option value="">
                      Select salary structure
                    </option>

                    {salaryStructures.map((structure) => (
                      <option
                        key={structure.id}
                        value={structure.id}
                      >
                        {structure.structureName} - ₹
                        {Number(
                          structure.grossSalary || 0
                        ).toLocaleString("en-IN")}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label>
                    Basic Salary <span>*</span>
                  </label>

                  <input
                    type="number"
                    name="basicSalary"
                    value={form.basicSalary}
                    onChange={handleChange}
                    min="0"
                    step="0.01"
                    disabled={saving}
                  />
                </div>

                <div className="form-group">
                  <label>
                    HRA <span>*</span>
                  </label>

                  <input
                    type="number"
                    name="hra"
                    value={form.hra}
                    onChange={handleChange}
                    min="0"
                    step="0.01"
                    disabled={saving}
                  />
                </div>

                <div className="form-group">
                  <label>
                    Special Allowance <span>*</span>
                  </label>

                  <input
                    type="number"
                    name="specialAllowance"
                    value={form.specialAllowance}
                    onChange={handleChange}
                    min="0"
                    step="0.01"
                    disabled={saving}
                  />
                </div>

                <div className="form-group">
                  <label>
                    Gross Salary <span>*</span>
                  </label>

                  <input
                    type="number"
                    name="grossSalary"
                    value={form.grossSalary}
                    onChange={handleChange}
                    min="0"
                    step="0.01"
                    disabled={saving}
                  />
                </div>

                <div className="form-group">
                  <label>
                    Effective From <span>*</span>
                  </label>

                  <input
                    type="date"
                    name="effectiveFrom"
                    value={form.effectiveFrom}
                    onChange={handleChange}
                    disabled={saving}
                  />
                </div>

                <div className="form-group">
                  <label>Effective To</label>

                  <input
                    type="date"
                    name="effectiveTo"
                    value={form.effectiveTo}
                    onChange={handleChange}
                    disabled={saving}
                  />
                </div>

                <div className="form-group checkbox-group">
                  <label className="checkbox-label">
                    <input
                      type="checkbox"
                      name="active"
                      checked={form.active}
                      onChange={handleChange}
                      disabled={saving}
                    />

                    <span>Active Salary</span>
                  </label>
                </div>
              </div>

              <div className="modal-footer">
                <button
                  type="button"
                  className="cancel-button"
                  onClick={closeModal}
                  disabled={saving}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="primary-button"
                  disabled={saving}
                >
                  {saving ? (
                    "Saving..."
                  ) : editingId ? (
                    "Update Salary"
                  ) : (
                    <>
                      <Plus size={17} />
                      Assign Salary
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default EmployeeSalary;