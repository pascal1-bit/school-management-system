import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Students from "./Students";
import Teachers from "./Teachers";
import Classes from "./Classes";
import Attendance from "./Attendance";

function Dashboard() {
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState("students");
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    const userData = localStorage.getItem("user");
    
    if (!token) {
      navigate("/login");
      return;
    }

    if (userData) {
      setUser(JSON.parse(userData));
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  const renderContent = () => {
    switch (activeTab) {
      case "students":
        return <Students />;
      case "teachers":
        return <Teachers />;
      case "classes":
        return <Classes />;
      case "attendance":
        return <Attendance />;
      case "grades":
        return <div style={{ padding: "20px" }}>
          <h2>Grades Management</h2>
          <p>Grading system coming soon...</p>
        </div>;
      default:
        return <Students />;
    }
  };

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div style={{ fontFamily: "Arial" }}>
      {/* Header */}
      <header style={{ 
        backgroundColor: "#007bff", 
        color: "white", 
        padding: "1rem",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center"
      }}>
        <h1 style={{ margin: 0 }}>School Management System</h1>
        <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
          <span>Welcome, {user.name}</span>
          <button 
            onClick={handleLogout}
            style={{
              backgroundColor: "#dc3545",
              color: "white",
              border: "none",
              padding: "0.5rem 1rem",
              borderRadius: "4px",
              cursor: "pointer"
            }}
          >
            Logout
          </button>
        </div>
      </header>

      {/* Navigation */}
      <nav style={{ 
        backgroundColor: "#f8f9fa", 
        padding: "1rem",
        borderBottom: "1px solid #ddd"
      }}>
        <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
          <button
            onClick={() => setActiveTab("students")}
            style={{
              padding: "0.5rem 1rem",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
              backgroundColor: activeTab === "students" ? "#007bff" : "#e9ecef",
              color: activeTab === "students" ? "white" : "black"
            }}
          >
            Students
          </button>
          <button
            onClick={() => setActiveTab("teachers")}
            style={{
              padding: "0.5rem 1rem",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
              backgroundColor: activeTab === "teachers" ? "#007bff" : "#e9ecef",
              color: activeTab === "teachers" ? "white" : "black"
            }}
          >
            Teachers
          </button>
          <button
            onClick={() => setActiveTab("classes")}
            style={{
              padding: "0.5rem 1rem",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
              backgroundColor: activeTab === "classes" ? "#007bff" : "#e9ecef",
              color: activeTab === "classes" ? "white" : "black"
            }}
          >
            Classes
          </button>
          <button
            onClick={() => setActiveTab("attendance")}
            style={{
              padding: "0.5rem 1rem",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
              backgroundColor: activeTab === "attendance" ? "#007bff" : "#e9ecef",
              color: activeTab === "attendance" ? "white" : "black"
            }}
          >
            Attendance
          </button>
          <button
            onClick={() => setActiveTab("grades")}
            style={{
              padding: "0.5rem 1rem",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
              backgroundColor: activeTab === "grades" ? "#007bff" : "#e9ecef",
              color: activeTab === "grades" ? "white" : "black"
            }}
          >
            Grades
          </button>
        </div>
      </nav>

      {/* Main Content */}
      <main style={{ minHeight: "calc(100vh - 120px)" }}>
        {renderContent()}
      </main>
    </div>
  );
}

export default Dashboard;
