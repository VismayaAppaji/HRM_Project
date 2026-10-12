import { Navigate, Route, Routes } from "react-router-dom";

import Login from "./pages/login";
import Dashboard from "./pages/Dashboard";
import Employees from "./pages/Employees";
import LeaveManagement from "./pages/LeaveManagement";
import Salary from "./pages/Salary";
import EmployeeSalary from "./pages/EmployeeSalary";
import Payroll from "./pages/Payroll";
import Payslips from "./pages/Payslip";
import EmailLogs from "./pages/EmailLogs";

import EmployeeDashboard from "./pages/EmployeeDashboard";
import EmployeeProfile from "./pages/EmployeeProfile";
import MyLeave from "./pages/MyLeave";
import MyPayslips from "./pages/MyPaySlips";

import AppLayout from "./components/AppLayout";


// ============================================================
// AUTHENTICATION PROTECTION
// ============================================================

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem("token");

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return children;
};


// ============================================================
// ROLE PROTECTION
// ============================================================

const RoleRoute = ({ allowedRole, children }) => {
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role")?.toUpperCase();

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  if (role !== allowedRole) {
    if (role === "EMPLOYEE") {
      return <Navigate to="/employee-dashboard" replace />;
    }

    if (role === "HR") {
      return <Navigate to="/dashboard" replace />;
    }

    return <Navigate to="/login" replace />;
  }

  return children;
};


// ============================================================
// DEFAULT DASHBOARD BASED ON ROLE
// ============================================================

const RoleBasedRedirect = () => {
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role")?.toUpperCase();

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  if (role === "EMPLOYEE") {
    return <Navigate to="/employee-dashboard" replace />;
  }

  if (role === "HR") {
    return <Navigate to="/dashboard" replace />;
  }

  return <Navigate to="/login" replace />;
};


// ============================================================
// APPLICATION
// ============================================================

function App() {
  return (
    <Routes>

      {/* ======================================================
          PUBLIC
          ====================================================== */}

      <Route
        path="/login"
        element={<Login />}
      />


      {/* ======================================================
          PROTECTED APPLICATION
          ====================================================== */}

      <Route
        element={
          <ProtectedRoute>
            <AppLayout />
          </ProtectedRoute>
        }
      >

        {/* ====================================================
            HR ROUTES
            ==================================================== */}

        <Route
          path="/dashboard"
          element={
            <RoleRoute allowedRole="HR">
              <Dashboard />
            </RoleRoute>
          }
        />

        <Route
          path="/employees"
          element={
            <RoleRoute allowedRole="HR">
              <Employees />
            </RoleRoute>
          }
        />

        <Route
          path="/leave-management"
          element={
            <RoleRoute allowedRole="HR">
              <LeaveManagement />
            </RoleRoute>
          }
        />

        <Route
          path="/salary"
          element={
            <RoleRoute allowedRole="HR">
              <Salary />
            </RoleRoute>
          }
        />

        <Route
          path="/employee-salary"
          element={
            <RoleRoute allowedRole="HR">
              <EmployeeSalary />
            </RoleRoute>
          }
        />

        <Route
          path="/payroll"
          element={
            <RoleRoute allowedRole="HR">
              <Payroll />
            </RoleRoute>
          }
        />

        <Route
          path="/payslips"
          element={
            <RoleRoute allowedRole="HR">
              <Payslips />
            </RoleRoute>
          }
        />

        <Route
          path="/email-logs"
          element={
            <RoleRoute allowedRole="HR">
              <EmailLogs />
            </RoleRoute>
          }
        />


        {/* ====================================================
            EMPLOYEE ROUTES
            ==================================================== */}

        <Route
          path="/employee-dashboard"
          element={
            <RoleRoute allowedRole="EMPLOYEE">
              <EmployeeDashboard />
            </RoleRoute>
          }
        />

        <Route
          path="/employee-profile"
          element={
            <RoleRoute allowedRole="EMPLOYEE">
              <EmployeeProfile />
            </RoleRoute>
          }
        />

        <Route
          path="/my-leave"
          element={
            <RoleRoute allowedRole="EMPLOYEE">
              <MyLeave />
            </RoleRoute>
          }
        />

        <Route
          path="/my-payslips"
          element={
            <RoleRoute allowedRole="EMPLOYEE">
              <MyPayslips />
            </RoleRoute>
          }
        />

      </Route>


      {/* ======================================================
          DEFAULT
          ====================================================== */}

      <Route
        path="/"
        element={<RoleBasedRedirect />}
      />


      {/* ======================================================
          INVALID ROUTES
          ====================================================== */}

      <Route
        path="*"
        element={<RoleBasedRedirect />}
      />

    </Routes>
  );
}

export default App;