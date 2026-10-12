import { useState } from "react";
import { Outlet } from "react-router-dom";

import Sidebar from "./Sidebar";
import Topbar from "./Topbar";

import "./AppLayout.css";

function AppLayout() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  // Shared pay period for the HRM application
  const [payPeriod, setPayPeriod] = useState("2026-12");

  // Get the logged-in user's role
  const role = localStorage.getItem("role")?.toUpperCase() || "";

  const handleSidebarToggle = () => {
    setSidebarCollapsed((previousState) => !previousState);
  };

  const handlePayPeriodChange = (newPayPeriod) => {
    setPayPeriod(newPayPeriod);
  };

  return (
    <div className="app-layout">
      {/* ==================== SIDEBAR ==================== */}

      <Sidebar
        collapsed={sidebarCollapsed}
        onToggle={handleSidebarToggle}
        role={role}
      />

      {/* ==================== MAIN APPLICATION ==================== */}

      <div
        className={`app-main ${
          sidebarCollapsed ? "app-main-expanded" : ""
        }`}
      >
        {/* ==================== TOPBAR ==================== */}

        <Topbar
          payPeriod={payPeriod}
          onPayPeriodChange={handlePayPeriodChange}
        />

        {/* ==================== PAGE CONTENT ==================== */}

        <main className="app-content">
          <Outlet
            context={{
              payPeriod,
              setPayPeriod: handlePayPeriodChange,
            }}
          />
        </main>
      </div>
    </div>
  );
}

export default AppLayout;