import { useEffect, useState } from "react";
import api from "../services/api";

function Teachers() {
  const [teachers, setTeachers] = useState([]);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [subject, setSubject] = useState("");
  const [qualification, setQualification] = useState("");
  const [experience, setExperience] = useState("");
  const [salary, setSalary] = useState("");
  const [editId, setEditId] = useState(null);
  const [search, setSearch] = useState("");

  // GET teachers
  const fetchTeachers = () => {
    api.get("/teacher")
      .then(res => setTeachers(res.data))
      .catch(err => console.log(err));
  };

  useEffect(() => {
    fetchTeachers();
  }, []);

  // RESET FORM
  const resetForm = () => {
    setName("");
    setEmail("");
    setPhone("");
    setSubject("");
    setQualification("");
    setExperience("");
    setSalary("");
  };

  // ADD teacher
  const addTeacher = (e) => {
    e.preventDefault();

    api.post("/teacher", {
      name,
      email,
      phone,
      subject,
      qualification,
      experience: Number(experience),
      salary: Number(salary)
    })
    .then(() => {
      fetchTeachers();
      resetForm();
    })
    .catch(err => console.log(err));
  };

  // DELETE teacher
  const deleteTeacher = (id) => {
    api.delete(`/teacher/${id}`)
      .then(() => fetchTeachers())
      .catch(err => console.log(err));
  };

  // START EDIT
  const startEdit = (teacher) => {
    setEditId(teacher._id);
    setName(teacher.name);
    setEmail(teacher.email);
    setPhone(teacher.phone);
    setSubject(teacher.subject);
    setQualification(teacher.qualification);
    setExperience(teacher.experience);
    setSalary(teacher.salary);
  };

  // UPDATE teacher
  const updateTeacher = (e) => {
    e.preventDefault();

    api.put(`/teacher/${editId}`, {
      name,
      email,
      phone,
      subject,
      qualification,
      experience: Number(experience),
      salary: Number(salary)
    })
    .then(() => {
      fetchTeachers();
      resetForm();
      setEditId(null);
    })
    .catch(err => console.log(err));
  };

  return (
    <div style={{ maxWidth: "800px", margin: "auto", fontFamily: "Arial" }}>
      <h2>Teachers Management</h2>

      {/* SEARCH */}
      <input
        placeholder="Search teacher..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        style={{ width: "100%", padding: "8px", marginBottom: "10px" }}
      />

      {/* FORM */}
      <form onSubmit={editId ? updateTeacher : addTeacher} style={{ 
        backgroundColor: "#f8f9fa", 
        padding: "20px", 
        borderRadius: "8px", 
        marginBottom: "20px" 
      }}>
        <h3>{editId ? "Edit Teacher" : "Add New Teacher"}</h3>
        
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
          <input
            placeholder="Full Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            style={{ padding: "8px" }}
          />
          <input
            placeholder="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={{ padding: "8px" }}
          />
          <input
            placeholder="Phone"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            style={{ padding: "8px" }}
          />
          <input
            placeholder="Subject"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            style={{ padding: "8px" }}
          />
          <input
            placeholder="Qualification"
            value={qualification}
            onChange={(e) => setQualification(e.target.value)}
            style={{ padding: "8px" }}
          />
          <input
            placeholder="Experience (years)"
            type="number"
            value={experience}
            onChange={(e) => setExperience(e.target.value)}
            style={{ padding: "8px" }}
          />
          <input
            placeholder="Salary"
            type="number"
            value={salary}
            onChange={(e) => setSalary(e.target.value)}
            style={{ padding: "8px" }}
          />
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
          {editId ? "Update Teacher" : "Add Teacher"}
        </button>
      </form>

      {/* LIST */}
      <div style={{ display: "grid", gap: "10px" }}>
        {teachers
          .filter(t =>
            t.name.toLowerCase().includes(search.toLowerCase()) ||
            t.subject.toLowerCase().includes(search.toLowerCase())
          )
          .map((teacher) => (
            <div key={teacher._id} style={{ 
              border: "1px solid #ddd", 
              padding: "15px", 
              borderRadius: "8px",
              backgroundColor: "white"
            }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start" }}>
                <div>
                  <h3 style={{ margin: "0 0 10px 0" }}>{teacher.name}</h3>
                  <p style={{ margin: "5px 0" }}><strong>Email:</strong> {teacher.email}</p>
                  <p style={{ margin: "5px 0" }}><strong>Phone:</strong> {teacher.phone}</p>
                  <p style={{ margin: "5px 0" }}><strong>Subject:</strong> {teacher.subject}</p>
                  <p style={{ margin: "5px 0" }}><strong>Qualification:</strong> {teacher.qualification}</p>
                  <p style={{ margin: "5px 0" }}><strong>Experience:</strong> {teacher.experience} years</p>
                  <p style={{ margin: "5px 0" }}><strong>Salary:</strong> ${teacher.salary}</p>
                </div>
                <div style={{ display: "flex", gap: "5px", flexDirection: "column" }}>
                  <button 
                    onClick={() => startEdit(teacher)}
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
                    onClick={() => deleteTeacher(teacher._id)}
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

export default Teachers;
