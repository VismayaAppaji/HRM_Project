import { useEffect, useState } from "react";
import {
  UserRound,
  Mail,
  Phone,
  Building2,
  BriefcaseBusiness,
  CalendarDays,
  BadgeCheck,
  RefreshCw,
} from "lucide-react";
import api from "../services/api";

const EmployeeProfile = () => {
  const [employee, setEmployee] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadProfile = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get("/employees/me");
      setEmployee(response.data);
    } catch (err) {
      console.error("Failed to load employee profile:", err);

      if (err.response?.status === 401) {
        setError("Your session has expired. Please login again.");
      } else if (err.response?.status === 403) {
        setError("You do not have permission to access your profile.");
      } else {
        setError("Failed to load employee profile.");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProfile();
  }, []);

  if (loading) {
    return (
      <div style={{ padding: "32px" }}>
        <p>Loading profile...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ padding: "32px" }}>
        <p>{error}</p>

        <button onClick={loadProfile}>
          <RefreshCw size={16} />
          Retry
        </button>
      </div>
    );
  }

  return (
    <div style={{ padding: "32px" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "24px",
        }}
      >
        <div>
          <h1>My Profile</h1>
          <p>View your employee information.</p>
        </div>

        <button onClick={loadProfile}>
          <RefreshCw size={16} />
          Refresh
        </button>
      </div>

      <div
        style={{
          background: "#ffffff",
          borderRadius: "12px",
          padding: "28px",
          boxShadow: "0 2px 10px rgba(0,0,0,0.08)",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "18px",
            marginBottom: "30px",
          }}
        >
          <div
            style={{
              width: "64px",
              height: "64px",
              borderRadius: "50%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              background: "#eef2ff",
            }}
          >
            <UserRound size={32} />
          </div>

          <div>
            <h2>
              {employee?.firstName} {employee?.lastName}
            </h2>

            <p>{employee?.designation || "Employee"}</p>

            <span>
              {employee?.active ? "Active Employee" : "Inactive Employee"}
            </span>
          </div>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
            gap: "22px",
          }}
        >
          <ProfileItem
            icon={<BadgeCheck size={20} />}
            label="Employee ID"
            value={employee?.employeeCode}
          />

          <ProfileItem
            icon={<Mail size={20} />}
            label="Email"
            value={employee?.email}
          />

          <ProfileItem
            icon={<Phone size={20} />}
            label="Phone"
            value={employee?.phone}
          />

          <ProfileItem
            icon={<Building2 size={20} />}
            label="Department"
            value={employee?.department}
          />

          <ProfileItem
            icon={<BriefcaseBusiness size={20} />}
            label="Designation"
            value={employee?.designation}
          />

          <ProfileItem
            icon={<CalendarDays size={20} />}
            label="Joining Date"
            value={employee?.joiningDate}
          />
        </div>
      </div>
    </div>
  );
};

const ProfileItem = ({ icon, label, value }) => {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: "14px",
        padding: "16px",
        border: "1px solid #e5e7eb",
        borderRadius: "10px",
      }}
    >
      {icon}

      <div>
        <div
          style={{
            fontSize: "13px",
            color: "#6b7280",
            marginBottom: "4px",
          }}
        >
          {label}
        </div>

        <div style={{ fontWeight: "600" }}>
          {value || "-"}
        </div>
      </div>
    </div>
  );
};

export default EmployeeProfile;