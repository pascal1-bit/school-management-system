const mongoose = require("mongoose");

const studentSchema = new mongoose.Schema({
  name: String,
  class: String,
  age: Number,
  parentPhone: String,
});

module.exports = mongoose.model("Student", studentSchema);