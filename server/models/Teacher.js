const mongoose = require("mongoose");

const teacherSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  phone: String,
  subject: String,
  qualification: String,
  experience: Number,
  salary: Number,
  hireDate: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Teacher", teacherSchema);
