import { useEffect, useState } from "react";
import api from "../services/api.js";

function Students() {
  const [students, setStudents] = useState([]);

  const [name, setName] = useState("");
  const [studentClass, setStudentClass] = useState("");
  const [age, setAge] = useState("");
  const [parentPhone, setParentPhone] = useState("");

  const [editId, setEditId] = useState(null);
  const [search, setSearch] = useState("");

  // GET students
  const fetchStudents = () => {
    api.get("/student")
      .then(res => setStudents(res.data))
      .catch(err => console.log(err));
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  // RESET FORM
  const resetForm = () => {
    setName("");
    setStudentClass("");
    setAge("");
    setParentPhone("");
  };

  // ADD student
  const addStudent = (e) => {
    e.preventDefault();

    api.post("/student", {
      name,
      class: studentClass,
      age,
      parentPhone
    })
    .then(() => {
      fetchStudents();
      resetForm();
    })
    .catch(err => console.log(err));
  };

  // DELETE student
  const deleteStudent = (id) => {
    api.delete(`/student/${id}`)
      .then(() => fetchStudents())
      .catch(err => console.log(err));
  };

  // START EDIT
  const startEdit = (student) => {
    setEditId(student._id);
    setName(student.name);
    setStudentClass(student.class);
    setAge(student.age);
    setParentPhone(student.parentPhone);
  };

  // UPDATE student
  const updateStudent = (e) => {
    e.preventDefault();

    api.put(`/student/${editId}`, {
      name,
      class: studentClass,
      age,
      parentPhone
    })
    .then(() => {
      fetchStudents();
      resetForm();
      setEditId(null);
    })
    .catch(err => console.log(err));
  };

  return (
    <div style={{ maxWidth: "600px", margin: "auto", fontFamily: "Arial" }}>
      <h1>Students Management 🎓</h1>

      {/* SEARCH */}
      <input
        placeholder="Search student..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        style={{ width: "100%", padding: "8px", marginBottom: "10px" }}
      />

      {/* FORM */}
      <form onSubmit={editId ? updateStudent : addStudent}>
        <input
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <br />

        <input
          placeholder="Class"
          value={studentClass}
          onChange={(e) => setStudentClass(e.target.value)}
        />
        <br />

        <input
          placeholder="Age"
          type="number"
          value={age}
          onChange={(e) => setAge(e.target.value)}
        />
        <br />

        <input
          placeholder="Parent Phone"
          value={parentPhone}
          onChange={(e) => setParentPhone(e.target.value)}
        />
        <br />

        <button type="submit">
          {editId ? "Update Student ✏️" : "Add Student ➕"}
        </button>
      </form>

      <hr />

      {/* LIST */}
      {students
        .filter(s =>
          s.name.toLowerCase().includes(search.toLowerCase())
        )
        .map((student) => (
          <div key={student._id} style={{ border: "1px solid gray", margin: "10px", padding: "10px" }}>
            <h3>{student.name}</h3>
            <p>Class: {student.class}</p>
            <p>Age: {student.age}</p>
            <p>Parent: {student.parentPhone}</p>

            <button onClick={() => startEdit(student)}>
              Edit ✏️
            </button>

            <button onClick={() => deleteStudent(student._id)}>
              Delete 🗑️
            </button>
          </div>
      ))}
    </div>
  );
}

export default Students;