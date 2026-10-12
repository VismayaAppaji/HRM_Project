import { useEffect, useMemo, useState } from "react";
import {
  Plus,
  RefreshCw,
  Search,
  Pencil,
  Trash2,
  X,
  WalletCards,
  CheckCircle2,
  IndianRupee,
  AlertCircle,
} from "lucide-react";

import api from "../services/api";
import "./Salary.css";

const emptyForm = {
  structureName: "",
  basicSalary: "",
  hra: "",
  specialAllowance: "",
  grossSalary: "",
  active: true,
};

const Salary = () => {
  const [salaryStructures, setSalaryStructures] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [search, setSearch] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const [form, setForm] = useState(emptyForm);

  // =========================================================
  // LOAD SALARY STRUCTURES
  // =========================================================
  const loadSalaryStructures = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get("/salary-structures");

      setSalaryStructures(response.data || []);
    } catch (err) {
      console.error("Salary structure loading error:", err);

      if (err.response?.status === 401) {
        setError("Your session has expired. Please login again.");
      } else if (err.response?.status === 403) {
        setError(
          "You do not have permission to manage salary structures."
        );
      } else {
        setError("Unable to load salary structures.");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSalaryStructures();
  }, []);

  // =========================================================
  // CALCULATE GROSS SALARY
  // =========================================================
  useEffect(() => {
    const basic = Number(form.basicSalary) || 0;
    const hra = Number(form.hra) || 0;
    const special = Number(form.specialAllowance) || 0;

    const gross = basic + hra + special;

    setForm((previous) => {
      const currentGross = Number(previous.grossSalary) || 0;

      if (currentGross === gross) {
        return previous;
      }

      return {
        ...previous,
        grossSalary: gross,
      };
    });
  }, [
    form.basicSalary,
    form.hra,
    form.specialAllowance,
  ]);

  // =========================================================
  // SEARCH
  // =========================================================
  const filteredStructures = useMemo(() => {
    const value = search.trim().toLowerCase();

    if (!value) {
      return salaryStructures;
    }

    return salaryStructures.filter((salary) =>
      salary.structureName?.toLowerCase().includes(value)
    );
  }, [salaryStructures, search]);

  // =========================================================
  // FORM HANDLING
  // =========================================================
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
      structureName: salary.structureName || "",
      basicSalary: salary.basicSalary ?? "",
      hra: salary.hra ?? "",
      specialAllowance: salary.specialAllowance ?? "",
      grossSalary: salary.grossSalary ?? "",
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

  // =========================================================
  // VALIDATION
  // =========================================================
  const validateForm = () => {
    if (!form.structureName.trim()) {
      return "Salary structure name is required.";
    }

    if (Number(form.basicSalary) <= 0) {
      return "Basic salary must be greater than 0.";
    }

    if (Number(form.hra) < 0) {
      return "HRA cannot be negative.";
    }

    if (Number(form.specialAllowance) < 0) {
      return "Special allowance cannot be negative.";
    }

    if (Number(form.grossSalary) <= 0) {
      return "Gross salary must be greater than 0.";
    }

    return "";
  };

  // =========================================================
  // SAVE
  // =========================================================
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
        structureName: form.structureName.trim(),
        basicSalary: Number(form.basicSalary),
        hra: Number(form.hra),
        specialAllowance: Number(form.specialAllowance),
        grossSalary: Number(form.grossSalary),
        active: form.active,
      };

      if (editingId) {
        await api.put(
          `/salary-structures/${editingId}`,
          payload
        );

        setSuccess("Salary structure updated successfully.");
      } else {
        await api.post("/salary-structures", payload);

        setSuccess("Salary structure created successfully.");
      }

      setShowModal(false);
      setEditingId(null);
      setForm(emptyForm);

      await loadSalaryStructures();
    } catch (err) {
      console.error("Salary structure save error:", err);

      const backendMessage =
        err.response?.data?.message ||
        err.response?.data?.error;

      setError(
        backendMessage ||
          "Unable to save salary structure. Please try again."
      );
    } finally {
      setSaving(false);
    }
  };

  // =========================================================
  // DELETE
  // =========================================================
  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this salary structure?"
    );

    if (!confirmed) {
      return;
    }

    try {
      setError("");
      setSuccess("");

      await api.delete(`/salary-structures/${id}`);

      setSuccess("Salary structure deleted successfully.");

      await loadSalaryStructures();
    } catch (err) {
      console.error("Salary structure delete error:", err);

      const backendMessage =
        err.response?.data?.message ||
        err.response?.data?.error;

      setError(
        backendMessage ||
          "Unable to delete salary structure."
      );
    }
  };

  // =========================================================
  // FORMAT CURRENCY
  // =========================================================
  const formatCurrency = (value) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(Number(value) || 0);
  };

  // =========================================================
  // COUNTS
  // =========================================================
  const totalStructures = salaryStructures.length;

  const activeStructures = salaryStructures.filter(
    (salary) => salary.active === true
  ).length;

  return (
    <div className="salary-page">
      {/* =====================================================
          HEADER
      ====================================================== */}
      <div className="salary-header">
        <div className="salary-heading">
          <span className="page-eyebrow">
            HR MANAGEMENT
          </span>

          <h1>Salary Management</h1>

          <p>
            Configure and manage employee salary structures.
          </p>
        </div>

        <div className="salary-header-actions">
          <button
            className="refresh-button"
            onClick={loadSalaryStructures}
            disabled={loading}
          >
            <RefreshCw
              size={17}
              className={loading ? "spin" : ""}
            />
            Refresh
          </button>

          <button
            className="add-salary-button"
            onClick={openAddModal}
          >
            <Plus size={18} />
            Add Salary Structure
          </button>
        </div>
      </div>

      {/* =====================================================
          ALERTS
      ====================================================== */}
      {error && (
        <div className="salary-alert error">
          <AlertCircle size={18} />
          <span>{error}</span>

          <button onClick={() => setError("")}>
            <X size={16} />
          </button>
        </div>
      )}

      {success && (
        <div className="salary-alert success">
          <CheckCircle2 size={18} />
          <span>{success}</span>

          <button onClick={() => setSuccess("")}>
            <X size={16} />
          </button>
        </div>
      )}

      {/* =====================================================
          SUMMARY CARDS
      ====================================================== */}
      <div className="salary-summary">
        <div className="salary-summary-card">
          <div className="summary-icon blue">
            <WalletCards size={21} />
          </div>

          <div>
            <span>Total Structures</span>
            <strong>
              {loading ? "—" : totalStructures}
            </strong>
          </div>
        </div>

        <div className="salary-summary-card">
          <div className="summary-icon green">
            <CheckCircle2 size={21} />
          </div>

          <div>
            <span>Active Structures</span>
            <strong>
              {loading ? "—" : activeStructures}
            </strong>
          </div>
        </div>
      </div>

      {/* =====================================================
          SALARY STRUCTURES TABLE
      ====================================================== */}
      <div className="salary-card">
        <div className="salary-card-header">
          <div>
            <h2>Salary Structures</h2>

            <p>
              Define basic salary, HRA and special allowance
              for employees.
            </p>
          </div>
        </div>

        <div className="salary-toolbar">
          <div className="salary-search">
            <Search size={18} />

            <input
              type="text"
              placeholder="Search salary structure"
              value={search}
              onChange={(event) =>
                setSearch(event.target.value)
              }
            />
          </div>
        </div>

        <div className="salary-table-wrapper">
          <table className="salary-table">
            <thead>
              <tr>
                <th>STRUCTURE</th>
                <th>BASIC SALARY</th>
                <th>HRA</th>
                <th>SPECIAL ALLOWANCE</th>
                <th>GROSS SALARY</th>
                <th>STATUS</th>
                <th>ACTIONS</th>
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr>
                  <td
                    colSpan="7"
                    className="table-message"
                  >
                    Loading salary structures...
                  </td>
                </tr>
              ) : filteredStructures.length === 0 ? (
                <tr>
                  <td
                    colSpan="7"
                    className="table-message"
                  >
                    <div className="empty-state">
                      <WalletCards size={30} />
                      <strong>
                        No salary structures found
                      </strong>
                      <span>
                        Add a salary structure to get started.
                      </span>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredStructures.map((salary) => (
                  <tr key={salary.id}>
                    <td>
                      <div className="structure-cell">
                        <div className="structure-icon">
                          <IndianRupee size={17} />
                        </div>

                        <div>
                          <strong>
                            {salary.structureName}
                          </strong>

                          <span>
                            Salary Structure
                          </span>
                        </div>
                      </div>
                    </td>

                    <td>
                      {formatCurrency(
                        salary.basicSalary
                      )}
                    </td>

                    <td>
                      {formatCurrency(salary.hra)}
                    </td>

                    <td>
                      {formatCurrency(
                        salary.specialAllowance
                      )}
                    </td>

                    <td className="gross-salary">
                      {formatCurrency(
                        salary.grossSalary
                      )}
                    </td>

                    <td>
                      <span
                        className={`status-badge ${
                          salary.active
                            ? "active"
                            : "inactive"
                        }`}
                      >
                        <span></span>

                        {salary.active
                          ? "ACTIVE"
                          : "INACTIVE"}
                      </span>
                    </td>

                    <td>
                      <div className="table-actions">
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
                ))
              )}
            </tbody>
          </table>
        </div>

        {!loading && filteredStructures.length > 0 && (
          <div className="table-footer">
            Showing {filteredStructures.length} of{" "}
            {salaryStructures.length} salary structures
          </div>
        )}
      </div>

      {/* =====================================================
          ADD / EDIT MODAL
      ====================================================== */}
      {showModal && (
        <div
          className="modal-overlay"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              closeModal();
            }
          }}
        >
          <div className="salary-modal">
            <div className="modal-header">
              <div>
                <span className="modal-eyebrow">
                  {editingId ? "EDIT" : "NEW"}
                </span>

                <h2>
                  {editingId
                    ? "Edit Salary Structure"
                    : "Add Salary Structure"}
                </h2>

                <p>
                  Configure the employee salary components.
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

            <form
              className="salary-form"
              onSubmit={handleSubmit}
            >
              <div className="form-group full-width">
                <label>
                  Structure Name
                  <span>*</span>
                </label>

                <input
                  type="text"
                  name="structureName"
                  value={form.structureName}
                  onChange={handleChange}
                  placeholder="Example: Standard Developer"
                  required
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>
                    Basic Salary
                    <span>*</span>
                  </label>

                  <div className="input-with-icon">
                    <IndianRupee size={16} />

                    <input
                      type="number"
                      name="basicSalary"
                      value={form.basicSalary}
                      onChange={handleChange}
                      placeholder="20000"
                      min="0"
                      step="0.01"
                      required
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label>
                    HRA
                    <span>*</span>
                  </label>

                  <div className="input-with-icon">
                    <IndianRupee size={16} />

                    <input
                      type="number"
                      name="hra"
                      value={form.hra}
                      onChange={handleChange}
                      placeholder="9000"
                      min="0"
                      step="0.01"
                      required
                    />
                  </div>
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>
                    Special Allowance
                    <span>*</span>
                  </label>

                  <div className="input-with-icon">
                    <IndianRupee size={16} />

                    <input
                      type="number"
                      name="specialAllowance"
                      value={form.specialAllowance}
                      onChange={handleChange}
                      placeholder="6000"
                      min="0"
                      step="0.01"
                      required
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label>
                    Gross Salary
                  </label>

                  <div className="input-with-icon gross-input">
                    <IndianRupee size={16} />

                    <input
                      type="number"
                      name="grossSalary"
                      value={form.grossSalary}
                      readOnly
                    />
                  </div>

                  <small>
                    Basic + HRA + Special Allowance
                  </small>
                </div>
              </div>

              <label className="active-checkbox">
                <input
                  type="checkbox"
                  name="active"
                  checked={form.active}
                  onChange={handleChange}
                />

                <span>
                  <strong>Active Structure</strong>
                  <small>
                    This salary structure can be assigned
                    to employees.
                  </small>
                </span>
              </label>

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
                  className="save-button"
                  disabled={saving}
                >
                  {saving ? (
                    <>
                      <RefreshCw
                        size={16}
                        className="spin"
                      />
                      Saving...
                    </>
                  ) : (
                    <>
                      <CheckCircle2 size={16} />
                      {editingId
                        ? "Update Structure"
                        : "Create Structure"}
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
};

export default Salary;