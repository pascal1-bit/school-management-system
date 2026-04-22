import { useEffect, useState } from "react";
import api from "../services/api";

function Classes() {
  const [classes, setClasses] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [students, setStudents] = useState([]);
  const [name, setName] = useState("");
  const [grade, setGrade] = useState("");
  const [subject, setSubject] = useState("");
  const [teacher, setTeacher] = useState("");
  const [schedule, setSchedule] = useState({ days: [], time: "", room: "" });
  const [maxStudents, setMaxStudents] = useState("30");
  const [academicYear, setAcademicYear] = useState("");
  const [semester, setSemester] = useState("");
  const [editId, setEditId] = useState(null);
  const [search, setSearch] = useState("");
  const [selectedStudents, setSelectedStudents] = useState([]);

  // GET classes
  const fetchClasses = () => {
    api.get("/class")
      .then(res => setClasses(res.data))
      .catch(err => console.log(err));
  };

  // GET teachers and students for dropdowns
  const fetchTeachersAndStudents = () => {
    api.get("/class/available/teachers")
      .then(res => setTeachers(res.data))
      .catch(err => console.log(err));
    
    api.get("/class/available/students")
      .then(res => setStudents(res.data))
      .catch(err => console.log(err));
  };

  useEffect(() => {
    fetchClasses();
    fetchTeachersAndStudents();
  }, []);

  // RESET FORM
  const resetForm = () => {
    setName("");
    setGrade("");
    setSubject("");
    setTeacher("");
    setSchedule({ days: [], time: "", room: "" });
    setMaxStudents("30");
    setAcademicYear("");
    setSemester("");
    setSelectedStudents([]);
  };

  // ADD class
  const addClass = (e) => {
    e.preventDefault();

    api.post("/class", {
      name,
      grade,
      subject,
      teacher,
      schedule,
      maxStudents: Number(maxStudents),
      academicYear,
      semester,
      students: selectedStudents
    })
    .then(() => {
      fetchClasses();
      resetForm();
    })
    .catch(err => console.log(err));
  };

  // DELETE class
  const deleteClass = (id) => {
    api.delete(`/class/${id}`)
      .then(() => fetchClasses())
      .catch(err => console.log(err));
  };

  // START EDIT
  const startEdit = (classData) => {
    setEditId(classData._id);
    setName(classData.name);
    setGrade(classData.grade);
    setSubject(classData.subject || "");
    setTeacher(classData.teacher?._id || "");
    setSchedule(classData.schedule || { days: [], time: "", room: "" });
    setMaxStudents(classData.maxStudents || "30");
    setAcademicYear(classData.academicYear || "");
    setSemester(classData.semester || "");
    setSelectedStudents(classData.students?.map(s => s._id) || []);
  };

  // UPDATE class
  const updateClass = (e) => {
    e.preventDefault();

    api.put(`/class/${editId}`, {
      name,
      grade,
      subject,
      teacher,
      schedule,
      maxStudents: Number(maxStudents),
      academicYear,
      semester,
      students: selectedStudents
    })
    .then(() => {
      fetchClasses();
      resetForm();
      setEditId(null);
    })
    .catch(err => console.log(err));
  };

  // Handle day selection
  const handleDayToggle = (day) => {
    setSchedule(prev => ({
      ...prev,
      days: prev.days.includes(day) 
        ? prev.days.filter(d => d !== day)
        : [...prev.days, day]
    }));
  };

  // Handle student selection
  const handleStudentToggle = (studentId) => {
    setSelectedStudents(prev => 
      prev.includes(studentId) 
        ? prev.filter(id => id !== studentId)
        : [...prev, studentId]
    );
  };

  const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];

  return (
    <div style={{ maxWidth: "900px", margin: "auto", fontFamily: "Arial" }}>
      <h2>Classes Management</h2>

      {/* SEARCH */}
      <input
        placeholder="Search class..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        style={{ width: "100%", padding: "8px", marginBottom: "10px" }}
      />

      {/* FORM */}
      <form onSubmit={editId ? updateClass : addClass} style={{ 
        backgroundColor: "#f8f9fa", 
        padding: "20px", 
        borderRadius: "8px", 
        marginBottom: "20px" 
      }}>
        <h3>{editId ? "Edit Class" : "Add New Class"}</h3>
        
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
          <input
            placeholder="Class Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            style={{ padding: "8px" }}
          />
          <input
            placeholder="Grade"
            value={grade}
            onChange={(e) => setGrade(e.target.value)}
            required
            style={{ padding: "8px" }}
          />
          <input
            placeholder="Subject"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            style={{ padding: "8px" }}
          />
          <select
            value={teacher}
            onChange={(e) => setTeacher(e.target.value)}
            style={{ padding: "8px" }}
          >
            <option value="">Select Teacher</option>
            {teachers.map(t => (
              <option key={t._id} value={t._id}>{t.name}</option>
            ))}
          </select>
          <input
            placeholder="Academic Year"
            value={academicYear}
            onChange={(e) => setAcademicYear(e.target.value)}
            style={{ padding: "8px" }}
          />
          <input
            placeholder="Semester"
            value={semester}
            onChange={(e) => setSemester(e.target.value)}
            style={{ padding: "8px" }}
          />
        </div>

        {/* Schedule */}
        <div style={{ marginTop: "10px" }}>
          <h4>Schedule</h4>
          <div style={{ marginBottom: "10px" }}>
            {days.map(day => (
              <label key={day} style={{ marginRight: "10px" }}>
                <input
                  type="checkbox"
                  checked={schedule.days.includes(day)}
                  onChange={() => handleDayToggle(day)}
                />
                {day}
              </label>
            ))}
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
            <input
              placeholder="Time (e.g., 9:00 AM - 10:00 AM)"
              value={schedule.time}
              onChange={(e) => setSchedule(prev => ({ ...prev, time: e.target.value }))}
              style={{ padding: "8px" }}
            />
            <input
              placeholder="Room"
              value={schedule.room}
              onChange={(e) => setSchedule(prev => ({ ...prev, room: e.target.value }))}
              style={{ padding: "8px" }}
            />
          </div>
        </div>

        {/* Students Selection */}
        <div style={{ marginTop: "10px" }}>
          <h4>Select Students</h4>
          <div style={{ maxHeight: "100px", overflowY: "auto", border: "1px solid #ddd", padding: "10px" }}>
            {students.map(student => (
              <label key={student._id} style={{ display: "block", marginBottom: "5px" }}>
                <input
                  type="checkbox"
                  checked={selectedStudents.includes(student._id)}
                  onChange={() => handleStudentToggle(student._id)}
                />
                {student.name} - {student.class}
              </label>
            ))}
          </div>
        </div>

        <button 
          type="submit"
          style={{ 
            marginTop: "10px",
            padding: "10px 20px", 
            backgroundColor: editId ? "#ffc107" : "#28a745",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer"
          }}
        >
          {editId ? "Update Class" : "Add Class"}
        </button>
      </form>

      {/* LIST */}
      <div style={{ display: "grid", gap: "10px" }}>
        {classes
          .filter(c =>
            c.name.toLowerCase().includes(search.toLowerCase()) ||
            c.grade.toLowerCase().includes(search.toLowerCase())
          )
          .map((classData) => (
            <div key={classData._id} style={{ 
              border: "1px solid #ddd", 
              padding: "15px", 
              borderRadius: "8px",
              backgroundColor: "white"
            }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start" }}>
                <div style={{ flex: 1 }}>
                  <h3 style={{ margin: "0 0 10px 0" }}>{classData.name}</h3>
                  <p style={{ margin: "5px 0" }}><strong>Grade:</strong> {classData.grade}</p>
                  <p style={{ margin: "5px 0" }}><strong>Subject:</strong> {classData.subject}</p>
                  <p style={{ margin: "5px 0" }}><strong>Teacher:</strong> {classData.teacher?.name || "Not assigned"}</p>
                  <p style={{ margin: "5px 0" }}><strong>Students:</strong> {classData.students?.length || 0}/{classData.maxStudents}</p>
                  <p style={{ margin: "5px 0" }}><strong>Schedule:</strong> {classData.schedule?.days?.join(", ") || "Not set"} - {classData.schedule?.time || "Not set"}</p>
                  <p style={{ margin: "5px 0" }}><strong>Room:</strong> {classData.schedule?.room || "Not set"}</p>
                </div>
                <div style={{ display: "flex", gap: "5px", flexDirection: "column" }}>
                  <button 
                    onClick={() => startEdit(classData)}
                    style={{
                      padding: "5px 10px",
                      backgroundColor: "#007bff",
                      color: "white",
                      border: "none",
                      borderRadius: "4px",
                      cursor: "pointer"
                    }}
                  >
                    Edit
                  </button>
                  <button 
                    onClick={() => deleteClass(classData._id)}
                    style={{
                      padding: "5px 10px",
                      backgroundColor: "#dc3545",
                      color: "white",
                      border: "none",
                      borderRadius: "4px",
                      cursor: "pointer"
                    }}
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
}

export default Classes;
