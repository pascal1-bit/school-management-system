const express = require("express");
const router = express.Router();
const Student = require("../models/Student");
const auth = require("../middleware/auth");

// GET all students
router.get("/", auth, async (req, res) => {
  const students = await Student.find();
  res.json(students);
});

// ADD student
router.post("/", auth, async (req, res) => {
  const student = new Student(req.body);
  await student.save();
  res.json(student);
  console.log("Student routes loaded ");
});

//update
router.put("/:id", auth, async (req, res) => {
  try {
    const updatedStudent = await Student.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    res.json(updatedStudent);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

//delete
router.delete("/:id", auth, async (req, res) => {
  try {
    await Student.findByIdAndDelete(req.params.id);
    res.json({ message: "Student deleted successfully " });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;