import { useState } from "react";
import api from "../services/api";
import { useNavigate } from "react-router-dom";

function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    try {
      await api.post("/auth/register", { name, email, password });
      setSuccess("Account created successfully! Redirecting to login...");
      setTimeout(() => navigate("/login"), 2000);
    } catch (err) {
      setError("Email already exists or registration failed");
    }
  };

  return (
    <div style={{ 
      maxWidth: "400px", 
      margin: "100px auto", 
      padding: "20px",
      border: "1px solid #ddd",
      borderRadius: "8px",
      fontFamily: "Arial"
    }}>
      <h2>Register Account</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}
      {success && <p style={{ color: "green" }}>{success}</p>}
      
      <form onSubmit={handleRegister}>
        <div style={{ marginBottom: "10px" }}>
          <label>Full Name:</label><br />
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            style={{ width: "100%", padding: "8px" }}
          />
        </div>

        <div style={{ marginBottom: "10px" }}>
          <label>Email:</label><br />
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={{ width: "100%", padding: "8px" }}
          />
        </div>

        <div style={{ marginBottom: "10px" }}>
          <label>Password:</label><br />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={{ width: "100%", padding: "8px" }}
          />
        </div>

        <div style={{ marginBottom: "10px" }}>
          <label>Confirm Password:</label><br />
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            style={{ width: "100%", padding: "8px" }}
          />
        </div>

        <button 
          type="submit"
          style={{ 
            width: "100%", 
            padding: "10px", 
            backgroundColor: "#28a745",
            color: "white",
            border: "none",
            borderRadius: "4px"
          }}
        >
          Register
        </button>
      </form>

      <p style={{ marginTop: "20px", textAlign: "center" }}>
        Already have an account? <a href="/login">Login here</a>
      </p>
    </div>
  );
}

export default Register;
