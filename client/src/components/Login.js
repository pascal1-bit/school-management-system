import { useState } from "react";
import api from "../services/api";
import { useNavigate } from "react-router-dom";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await api.post("/auth/login", { email, password });
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));
      navigate("/dashboard");
    } catch (err) {
      setError("Invalid email or password");
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
      <h2>Login to School System</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}
      
      <form onSubmit={handleLogin}>
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

        <button 
          type="submit"
          style={{ 
            width: "100%", 
            padding: "10px", 
            backgroundColor: "#007bff",
            color: "white",
            border: "none",
            borderRadius: "4px"
          }}
        >
          Login
        </button>
      </form>

      <p style={{ marginTop: "20px", textAlign: "center" }}>
        Don't have an account? <a href="/register">Register here</a>
      </p>
    </div>
  );
}

export default Login;
