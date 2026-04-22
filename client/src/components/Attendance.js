import { useEffect, useState } from "react";
import api from "../services/api";

function Attendance() {
  const [classes, setClasses] = useState([]);
  const [selectedClass, setSelectedClass] = useState("");
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [attendanceData, setAttendanceData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState(null);

  // GET classes for dropdown
  useEffect(() => {
    api.get("/class")
      .then(res => setClasses(res.data))
      .catch(err => console.log(err));
  }, []);

  // GET attendance when class and date are selected
  useEffect(() => {
    if (selectedClass && selectedDate) {
      fetchAttendance();
    }
  }, [selectedClass, selectedDate]);

  const fetchAttendance = () => {
    setLoading(true);
    api.get(`/attendance/class/${selectedClass}/date/${selectedDate}`)
      .then(res => {
        setAttendanceData(res.data.attendance || []);
        setLoading(false);
      })
      .catch(err => {
        console.log(err);
        setLoading(false);
      });
  };

  const fetchStats = () => {
    if (!selectedClass) return;
    
    const endDate = new Date();
    const startDate = new Date();
    startDate.setMonth(startDate.getMonth() - 1); // Last month
    
    api.get(`/attendance/stats/class/${selectedClass}`, {
      params: {
        startDate: startDate.toISOString().split('T')[0],
        endDate: endDate.toISOString().split('T')[0]
      }
    })
      .then(res => setStats(res.data))
      .catch(err => console.log(err));
  };

  const markAttendance = () => {
    const attendanceRecords = attendanceData.map(record => ({
      studentId: record.student._id,
      status: record.status,
      notes: record.notes
    }));

    api.post("/attendance/mark", {
      date: selectedDate,
      classId: selectedClass,
      attendanceRecords
    })
      .then(() => {
        alert("Attendance marked successfully!");
        fetchAttendance();
      })
      .catch(err => {
        console.log(err);
        alert("Failed to mark attendance");
      });
  };

  const handleStatusChange = (studentId, status) => {
    setAttendanceData(prev => 
      prev.map(record => 
        record.student._id === studentId 
          ? { ...record, status }
          : record
      )
    );
  };

  const handleNotesChange = (studentId, notes) => {
    setAttendanceData(prev => 
      prev.map(record => 
        record.student._id === studentId 
          ? { ...record, notes }
          : record
      )
    );
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "present": return "#28a745";
      case "absent": return "#dc3545";
      case "late": return "#ffc107";
      case "excused": return "#17a2b8";
      default: return "#6c757d";
    }
  };

  const getAttendanceRate = (studentStats) => {
    const presentDays = studentStats.present + studentStats.late;
    const totalDays = studentStats.total;
    return totalDays > 0 ? ((presentDays / totalDays) * 100).toFixed(1) : 0;
  };

  return (
    <div style={{ maxWidth: "1000px", margin: "auto", fontFamily: "Arial" }}>
      <h2>Attendance Tracking</h2>

      {/* Controls */}
      <div style={{ 
        backgroundColor: "#f8f9fa", 
        padding: "20px", 
        borderRadius: "8px", 
        marginBottom: "20px",
        display: "flex",
        gap: "15px",
        alignItems: "end",
        flexWrap: "wrap"
      }}>
        <div>
          <label style={{ display: "block", marginBottom: "5px" }}>Select Class:</label>
          <select
            value={selectedClass}
            onChange={(e) => setSelectedClass(e.target.value)}
            style={{ padding: "8px", minWidth: "200px" }}
          >
            <option value="">Choose a class</option>
            {classes.map(cls => (
              <option key={cls._id} value={cls._id}>
                {cls.name} - {cls.grade}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label style={{ display: "block", marginBottom: "5px" }}>Date:</label>
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            style={{ padding: "8px" }}
          />
        </div>

        <div style={{ display: "flex", gap: "10px" }}>
          <button
            onClick={fetchAttendance}
            disabled={!selectedClass || !selectedDate}
            style={{
              padding: "8px 16px",
              backgroundColor: "#007bff",
              color: "white",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer"
            }}
          >
            Load Attendance
          </button>

          <button
            onClick={markAttendance}
            disabled={!selectedClass || !selectedDate || attendanceData.length === 0}
            style={{
              padding: "8px 16px",
              backgroundColor: "#28a745",
              color: "white",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer"
            }}
          >
            Save Attendance
          </button>

          <button
            onClick={fetchStats}
            disabled={!selectedClass}
            style={{
              padding: "8px 16px",
              backgroundColor: "#17a2b8",
              color: "white",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer"
            }}
          >
            View Stats
          </button>
        </div>
      </div>

      {/* Statistics */}
      {stats && (
        <div style={{ 
          backgroundColor: "#e9ecef", 
          padding: "20px", 
          borderRadius: "8px", 
          marginBottom: "20px" 
        }}>
          <h3>Attendance Statistics (Last 30 Days)</h3>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: "15px" }}>
            {stats.map(studentStat => (
              <div key={studentStat.student._id} style={{ 
                backgroundColor: "white", 
                padding: "15px", 
                borderRadius: "8px",
                border: "1px solid #ddd"
              }}>
                <h4>{studentStat.student.name}</h4>
                <p><strong>Attendance Rate:</strong> {getAttendanceRate(studentStat)}%</p>
                <div style={{ fontSize: "12px", color: "#666" }}>
                  <span style={{ color: "#28a745" }}>Present: {studentStat.present}</span> | 
                  <span style={{ color: "#dc3545" }}> Absent: {studentStat.absent}</span> | 
                  <span style={{ color: "#ffc107" }}> Late: {studentStat.late}</span> | 
                  <span style={{ color: "#17a2b8" }}> Excused: {studentStat.excused}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Attendance List */}
      {loading ? (
        <div style={{ textAlign: "center", padding: "40px" }}>Loading...</div>
      ) : attendanceData.length > 0 ? (
        <div style={{ 
          backgroundColor: "white", 
          border: "1px solid #ddd", 
          borderRadius: "8px",
          overflow: "hidden"
        }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ backgroundColor: "#f8f9fa" }}>
                <th style={{ padding: "12px", textAlign: "left", borderBottom: "1px solid #ddd" }}>Student</th>
                <th style={{ padding: "12px", textAlign: "left", borderBottom: "1px solid #ddd" }}>Class</th>
                <th style={{ padding: "12px", textAlign: "left", borderBottom: "1px solid #ddd" }}>Status</th>
                <th style={{ padding: "12px", textAlign: "left", borderBottom: "1px solid #ddd" }}>Notes</th>
              </tr>
            </thead>
            <tbody>
              {attendanceData.map((record, index) => (
                <tr key={record.student._id} style={{ 
                  backgroundColor: index % 2 === 0 ? "white" : "#f8f9fa" 
                }}>
                  <td style={{ padding: "12px", borderBottom: "1px solid #ddd" }}>
                    <div>
                      <strong>{record.student.name}</strong>
                      <br />
                      <small style={{ color: "#666" }}>{record.student.email}</small>
                    </div>
                  </td>
                  <td style={{ padding: "12px", borderBottom: "1px solid #ddd" }}>
                    {record.student.class}
                  </td>
                  <td style={{ padding: "12px", borderBottom: "1px solid #ddd" }}>
                    <select
                      value={record.status}
                      onChange={(e) => handleStatusChange(record.student._id, e.target.value)}
                      style={{
                        padding: "4px 8px",
                        borderRadius: "4px",
                        border: `1px solid ${getStatusColor(record.status)}`,
                        backgroundColor: getStatusColor(record.status) + "20",
                        color: getStatusColor(record.status)
                      }}
                    >
                      <option value="not_marked">Not Marked</option>
                      <option value="present">Present</option>
                      <option value="absent">Absent</option>
                      <option value="late">Late</option>
                      <option value="excused">Excused</option>
                    </select>
                  </td>
                  <td style={{ padding: "12px", borderBottom: "1px solid #ddd" }}>
                    <input
                      type="text"
                      placeholder="Add notes..."
                      value={record.notes}
                      onChange={(e) => handleNotesChange(record.student._id, e.target.value)}
                      style={{ 
                        padding: "4px 8px", 
                        border: "1px solid #ddd", 
                        borderRadius: "4px",
                        width: "200px"
                      }}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : selectedClass && selectedDate ? (
        <div style={{ 
          textAlign: "center", 
          padding: "40px", 
          backgroundColor: "#f8f9fa",
          borderRadius: "8px" 
        }}>
          <p>No students found in this class or no data available.</p>
        </div>
      ) : (
        <div style={{ 
          textAlign: "center", 
          padding: "40px", 
          backgroundColor: "#f8f9fa",
          borderRadius: "8px" 
        }}>
          <p>Please select a class and date to mark attendance.</p>
        </div>
      )}
    </div>
  );
}

export default Attendance;
