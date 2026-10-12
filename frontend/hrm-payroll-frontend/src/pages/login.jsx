import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  LockKeyhole,
  User,
  Eye,
  EyeOff,
  LogIn,
} from "lucide-react";

import api from "../services/api";
import { useAuth } from "../context/AuthContext";

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    setError("");

    if (!formData.username.trim()) {
      setError("Please enter your username.");
      return;
    }

    if (!formData.password) {
      setError("Please enter your password.");
      return;
    }

    try {
      setLoading(true);

      const response = await api.post("/auth/login", formData);

      // Save token, username and role
      login(response.data);

      // Redirect according to user role
      const role = response.data?.role?.toUpperCase();

      if (role === "HR") {
        navigate("/dashboard");
      } else if (role === "EMPLOYEE") {
        navigate("/employee-dashboard");
      } else {
        setError("Invalid user role.");
      }
    } catch (err) {
      if (err.response?.status === 401) {
        setError("Invalid username or password.");
      } else {
        setError(
          "Unable to connect to the server. Make sure the Spring Boot backend is running."
        );
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-left">
        <div className="brand-section">
          <div className="brand-icon">H</div>

          <h1>HRM Payroll</h1>

          <p>
            Payroll & Leave Management
            <br />
            made simple.
          </p>
        </div>

        <div className="login-info">
          <div className="info-item">
            <span>✓</span>
            <p>Automated payroll processing</p>
          </div>

          <div className="info-item">
            <span>✓</span>
            <p>Leave management</p>
          </div>

          <div className="info-item">
            <span>✓</span>
            <p>Payslip generation & email delivery</p>
          </div>
        </div>
      </div>

      <div className="login-right">
        <div className="login-card">
          <div className="mobile-brand">
            <div className="brand-icon">H</div>
            <h1>HRM Payroll</h1>
          </div>

          <div className="login-header">
            <h2>Welcome back</h2>
            <p>Sign in to access your HRM portal</p>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="username">Username</label>

              <div className="input-wrapper">
                <User size={19} />

                <input
                  id="username"
                  name="username"
                  type="text"
                  placeholder="Enter your username"
                  value={formData.username}
                  onChange={handleChange}
                  autoComplete="username"
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="password">Password</label>

              <div className="input-wrapper">
                <LockKeyhole size={19} />

                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={handleChange}
                  autoComplete="current-password"
                />

                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff size={19} />
                  ) : (
                    <Eye size={19} />
                  )}
                </button>
              </div>
            </div>

            {error && <div className="error-message">{error}</div>}

            <button
              type="submit"
              className="login-button"
              disabled={loading}
            >
              {loading ? (
                "Signing in..."
              ) : (
                <>
                  <LogIn size={19} />
                  Sign In
                </>
              )}
            </button>
          </form>

          <div className="login-footer">
            <p>HRM Payroll Management System</p>
            <span>Secure JWT Authentication</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;