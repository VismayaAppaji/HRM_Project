import { useEffect, useMemo, useState } from "react";
import {
  Plus,
  Search,
  Users,
  Pencil,
  Trash2,
  X,
  UserPlus,
  Mail,
  Phone,
  Building2,
  BriefcaseBusiness,
  CalendarDays,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";

import api from "../services/api";
import "./Employees.css";

const initialForm = {
  employeeCode: "",
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  department: "",
  designation: "",
  joiningDate: "",
  active: true,
};

function Employees() {
  const [employees, setEmployees] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  const [showModal, setShowModal] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState(null);

  const [formData, setFormData] = useState(initialForm);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    loadEmployees();
  }, []);

  const loadEmployees = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get("/employees");

      setEmployees(response.data || []);
    } catch (err) {
      console.error(err);
      setError("Unable to load employees.");
    } finally {
      setLoading(false);
    }
  };

  const filteredEmployees = useMemo(() => {
    const search = searchTerm.toLowerCase().trim();

    if (!search) {
      return employees;
    }

    return employees.filter((employee) => {
      const fullName =
        `${employee.firstName || ""} ${employee.lastName || ""}`.toLowerCase();

      return (
        fullName.includes(search) ||
        (employee.employeeCode || "").toLowerCase().includes(search) ||
        (employee.department || "").toLowerCase().includes(search) ||
        (employee.designation || "").toLowerCase().includes(search) ||
        (employee.email || "").toLowerCase().includes(search)
      );
    });
  }, [employees, searchTerm]);

  const handleInputChange = (event) => {
    const { name, value, type, checked } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const openAddModal = () => {
    setEditingEmployee(null);
    setFormData(initialForm);
    setError("");
    setShowModal(true);
  };

  const openEditModal = (employee) => {
    setEditingEmployee(employee);

    setFormData({
      employeeCode: employee.employeeCode || "",
      firstName: employee.firstName || "",
      lastName: employee.lastName || "",
      email: employee.email || "",
      phone: employee.phone || "",
      department: employee.department || "",
      designation: employee.designation || "",
      joiningDate: employee.joiningDate || "",
      active: employee.active ?? true,
    });

    setError("");
    setShowModal(true);
  };

  const closeModal = () => {
    if (saving) return;

    setShowModal(false);
    setEditingEmployee(null);
    setFormData(initialForm);
    setError("");
  };

  const validateForm = () => {
    if (!formData.employeeCode.trim()) {
      return "Employee code is required.";
    }

    if (!formData.firstName.trim()) {
      return "First name is required.";
    }

    if (!formData.lastName.trim()) {
      return "Last name is required.";
    }

    if (!formData.email.trim()) {
      return "Email is required.";
    }

    if (!formData.phone.trim()) {
      return "Phone number is required.";
    }

    if (!formData.department.trim()) {
      return "Department is required.";
    }

    if (!formData.designation.trim()) {
      return "Designation is required.";
    }

    if (!formData.joiningDate) {
      return "Joining date is required.";
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(formData.email)) {
      return "Please enter a valid email address.";
    }

    if (!/^\d{10}$/.test(formData.phone)) {
      return "Phone number must contain exactly 10 digits.";
    }

    return "";
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    setError("");
    setSuccess("");

    const validationError = validateForm();

    if (validationError) {
      setError(validationError);
      return;
    }

    try {
      setSaving(true);

      if (editingEmployee) {
        await api.put(`/employees/${editingEmployee.id}`, formData);

        setSuccess("Employee updated successfully.");
      } else {
        await api.post("/employees", formData);

        setSuccess("Employee added successfully.");
      }

      await loadEmployees();

      setShowModal(false);
      setEditingEmployee(null);
      setFormData(initialForm);

      setTimeout(() => {
        setSuccess("");
      }, 3000);
    } catch (err) {
      console.error(err);

      const backendMessage =
        err.response?.data?.message ||
        err.response?.data?.error ||
        "Unable to save employee.";

      setError(backendMessage);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (employee) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete ${employee.firstName} ${employee.lastName}?`
    );

    if (!confirmed) return;

    try {
      setError("");
      setSuccess("");

      await api.delete(`/employees/${employee.id}`);

      setSuccess("Employee deleted successfully.");

      await loadEmployees();

      setTimeout(() => {
        setSuccess("");
      }, 3000);
    } catch (err) {
      console.error(err);

      setError(
        err.response?.data?.message || "Unable to delete employee."
      );
    }
  };

  return (
    <div className="employees-page">

      {/* PAGE HEADER */}
      <div className="employees-header">
        <div className="employees-title-section">
          <div className="employees-title-icon">
            <Users size={24} />
          </div>

          <div>
            <span className="page-eyebrow">HR MANAGEMENT</span>

            <h1>Employees</h1>

            <p>
              Manage employee information and account status
            </p>
          </div>
        </div>

        <button
          className="add-employee-button"
          onClick={openAddModal}
        >
          <Plus size={18} />
          Add Employee
        </button>
      </div>

      {/* ALERTS */}
      {success && (
        <div className="employee-alert success-alert">
          <CheckCircle2 size={19} />
          <span>{success}</span>
        </div>
      )}

      {error && !showModal && (
        <div className="employee-alert error-alert">
          <AlertCircle size={19} />
          <span>{error}</span>
        </div>
      )}

      {/* TOOLBAR */}
      <div className="employees-toolbar">
        <div className="employee-search">
          <Search size={19} />

          <input
            type="text"
            placeholder="Search by name, employee code, department..."
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
          />

          {searchTerm && (
            <button
              className="clear-search"
              onClick={() => setSearchTerm("")}
            >
              <X size={16} />
            </button>
          )}
        </div>

        <div className="employee-count">
          <strong>{filteredEmployees.length}</strong>
          <span>
            {filteredEmployees.length === 1
              ? "Employee"
              : "Employees"}
          </span>
        </div>
      </div>

      {/* TABLE */}
      <div className="employees-table-card">
        {loading ? (
          <div className="employees-loading">
            <div className="loading-spinner"></div>
            <p>Loading employees...</p>
          </div>
        ) : filteredEmployees.length === 0 ? (
          <div className="employees-empty">
            <div className="empty-icon">
              <Users size={28} />
            </div>

            <h3>No employees found</h3>

            <p>
              {searchTerm
                ? "Try changing your search."
                : "Start by adding your first employee."}
            </p>

            {!searchTerm && (
              <button
                className="add-empty-button"
                onClick={openAddModal}
              >
                <Plus size={17} />
                Add Employee
              </button>
            )}
          </div>
        ) : (
          <div className="table-wrapper">
            <table className="employees-table">
              <thead>
                <tr>
                  <th>EMPLOYEE</th>
                  <th>DEPARTMENT</th>
                  <th>DESIGNATION</th>
                  <th>EMAIL</th>
                  <th>JOINING DATE</th>
                  <th>STATUS</th>
                  <th>ACTIONS</th>
                </tr>
              </thead>

              <tbody>
                {filteredEmployees.map((employee) => (
                  <tr key={employee.id}>

                    <td>
                      <div className="employee-name-cell">
                        <div className="employee-avatar">
                          {employee.firstName?.charAt(0)?.toUpperCase()}
                        </div>

                        <div>
                          <strong>
                            {employee.firstName} {employee.lastName}
                          </strong>

                          <span>{employee.employeeCode}</span>
                        </div>
                      </div>
                    </td>

                    <td>
                      <div className="table-with-icon">
                        <Building2 size={15} />
                        {employee.department}
                      </div>
                    </td>

                    <td>
                      <div className="table-with-icon">
                        <BriefcaseBusiness size={15} />
                        {employee.designation}
                      </div>
                    </td>

                    <td>
                      <div className="table-with-icon">
                        <Mail size={15} />
                        {employee.email}
                      </div>
                    </td>

                    <td>
                      {employee.joiningDate || "-"}
                    </td>

                    <td>
                      <span
                        className={`status-badge ${
                          employee.active
                            ? "status-active"
                            : "status-inactive"
                        }`}
                      >
                        <span className="status-dot"></span>

                        {employee.active
                          ? "Active"
                          : "Inactive"}
                      </span>
                    </td>

                    <td>
                      <div className="employee-actions">
                        <button
                          className="action-button edit-action"
                          title="Edit employee"
                          onClick={() =>
                            openEditModal(employee)
                          }
                        >
                          <Pencil size={16} />
                        </button>

                        <button
                          className="action-button delete-action"
                          title="Delete employee"
                          onClick={() =>
                            handleDelete(employee)
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
          </div>
        )}
      </div>

      {/* ADD / EDIT MODAL */}
      {showModal && (
        <div
          className="modal-overlay"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              closeModal();
            }
          }}
        >
          <div className="employee-modal">

            {/* MODAL HEADER */}
            <div className="modal-header">
              <div className="modal-title-wrapper">
                <div className="modal-icon">
                  {editingEmployee ? (
                    <Pencil size={20} />
                  ) : (
                    <UserPlus size={20} />
                  )}
                </div>

                <div>
                  <h2>
                    {editingEmployee
                      ? "Edit Employee"
                      : "Add Employee"}
                  </h2>

                  <p>
                    {editingEmployee
                      ? "Update employee information"
                      : "Enter employee information below"}
                  </p>
                </div>
              </div>

              <button
                className="modal-close"
                onClick={closeModal}
                disabled={saving}
              >
                <X size={20} />
              </button>
            </div>

            {/* MODAL ERROR */}
            {error && (
              <div className="modal-error">
                <AlertCircle size={18} />
                <span>{error}</span>
              </div>
            )}

            {/* FORM */}
            <form
              className="employee-form"
              onSubmit={handleSubmit}
            >

              <div className="form-section-title">
                Basic Information
              </div>

              <div className="form-grid">

                <div className="form-field">
                  <label>
                    Employee Code
                    <span>*</span>
                  </label>

                  <input
                    name="employeeCode"
                    value={formData.employeeCode}
                    onChange={handleInputChange}
                    placeholder="EMP002"
                  />
                </div>

                <div className="form-field">
                  <label>
                    Joining Date
                    <span>*</span>
                  </label>

                  <div className="input-with-icon">
                    <CalendarDays size={17} />

                    <input
                      type="date"
                      name="joiningDate"
                      value={formData.joiningDate}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>

                <div className="form-field">
                  <label>
                    First Name
                    <span>*</span>
                  </label>

                  <input
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    placeholder="Enter first name"
                  />
                </div>

                <div className="form-field">
                  <label>
                    Last Name
                    <span>*</span>
                  </label>

                  <input
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    placeholder="Enter last name"
                  />
                </div>

              </div>

              <div className="form-section-title">
                Contact Information
              </div>

              <div className="form-grid">

                <div className="form-field">
                  <label>
                    Email Address
                    <span>*</span>
                  </label>

                  <div className="input-with-icon">
                    <Mail size={17} />

                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="employee@company.com"
                    />
                  </div>
                </div>

                <div className="form-field">
                  <label>
                    Phone Number
                    <span>*</span>
                  </label>

                  <div className="input-with-icon">
                    <Phone size={17} />

                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      placeholder="10 digit phone number"
                      maxLength="10"
                    />
                  </div>
                </div>

              </div>

              <div className="form-section-title">
                Employment Information
              </div>

              <div className="form-grid">

                <div className="form-field">
                  <label>
                    Department
                    <span>*</span>
                  </label>

                  <div className="input-with-icon">
                    <Building2 size={17} />

                    <input
                      name="department"
                      value={formData.department}
                      onChange={handleInputChange}
                      placeholder="Engineering"
                    />
                  </div>
                </div>

                <div className="form-field">
                  <label>
                    Designation
                    <span>*</span>
                  </label>

                  <div className="input-with-icon">
                    <BriefcaseBusiness size={17} />

                    <input
                      name="designation"
                      value={formData.designation}
                      onChange={handleInputChange}
                      placeholder="Software Engineer"
                    />
                  </div>
                </div>

              </div>

              <label className="active-toggle">
                <input
                  type="checkbox"
                  name="active"
                  checked={formData.active}
                  onChange={handleInputChange}
                />

                <span className="custom-checkbox">
                  {formData.active && "✓"}
                </span>

                <span>
                  <strong>Active Employee</strong>
                  <small>
                    Employee is currently active in the organization
                  </small>
                </span>
              </label>

              {/* MODAL FOOTER */}
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
                  className="save-employee-button"
                  disabled={saving}
                >
                  {saving ? (
                    <>
                      <span className="button-spinner"></span>
                      Saving...
                    </>
                  ) : (
                    <>
                      {editingEmployee ? (
                        <Pencil size={17} />
                      ) : (
                        <UserPlus size={17} />
                      )}

                      {editingEmployee
                        ? "Update Employee"
                        : "Add Employee"}
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

export default Employees;