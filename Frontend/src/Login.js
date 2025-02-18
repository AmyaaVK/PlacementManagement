import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Login.css";

const Login = () => {
  const [role, setRole] = useState("");
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const navigate = useNavigate();

  // Select Role
  const handleRoleSelection = (selectedRole) => {
    setRole(selectedRole);
  };

  // Handle Input Changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle Login
  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://127.0.0.1:8000/api/login/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: formData.email, password: formData.password }),
      });

      const data = await response.json();

      if (response.ok) {
        alert(`Login successful! Welcome, ${data.email} (${data.role})`);
        localStorage.setItem("user", JSON.stringify(data)); // Save user details

        // Redirect to specific dashboards based on role
        switch (data.role) {
          case "student":
            navigate("/student-dashboard");
            break;
          case "recruiter":
            navigate("/recruiter-dashboard");
            break;
          case "admin":
            navigate("/admin-dashboard");
            break;
          default:
            navigate("/dashboard"); // Fallback route
        }
      } else {
        alert(data.error || "Invalid credentials");
      }
    } catch (error) {
      alert("Error logging in. Please try again.");
    }
  };

  return (
    <div className="login-container">
      {!role ? (
        <div className="role-selection">
          <h2>Select Your Role</h2>
          <button className="role-btn" onClick={() => handleRoleSelection("student")}>
            Student
          </button>
          <button className="role-btn" onClick={() => handleRoleSelection("recruiter")}>
            Recruiter
          </button>
          <button className="role-btn" onClick={() => handleRoleSelection("admin")}>
            Teacher/Admin
          </button>
        </div>
      ) : (
        <div className="form-container">
          <h3>Login as {role.charAt(0).toUpperCase() + role.slice(1)}</h3>
          <form onSubmit={handleLogin}>
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              required
            />
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              required
            />
            <button type="submit">Login</button>
          </form>
        </div>
      )}
    </div>
  );
};

export default Login;
