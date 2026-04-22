const mongoose = require("mongoose");

const classSchema = new mongoose.Schema({
  name: { type: String, required: true },
  grade: { type: String, required: true },
  teacher: { type: mongoose.Schema.Types.ObjectId, ref: "Teacher" },
  students: [{ type: mongoose.Schema.Types.ObjectId, ref: "Student" }],
  subject: String,
  schedule: {
    days: [String],
    time: String,
    room: String
  },
  maxStudents: { type: Number, default: 30 },
  academicYear: String,
  semester: String,
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Class", classSchema);
