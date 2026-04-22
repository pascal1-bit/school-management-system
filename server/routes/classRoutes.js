const express = require("express");
const router = express.Router();
const Class = require("../models/Class");
const Teacher = require("../models/Teacher");
const Student = require("../models/Student");
const auth = require("../middleware/auth");

// GET all classes
router.get("/", auth, async (req, res) => {
  try {
    const classes = await Class.find()
      .populate('teacher', 'name email')
      .populate('students', 'name email');
    res.json(classes);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ADD class
router.post("/", auth, async (req, res) => {
  try {
    const classData = new Class(req.body);
    const savedClass = await classData.save();
    
    // Populate teacher and students info before returning
    const populatedClass = await Class.findById(savedClass._id)
      .populate('teacher', 'name email')
      .populate('students', 'name email');
    
    res.status(201).json(populatedClass);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// UPDATE class
router.put("/:id", auth, async (req, res) => {
  try {
    const updatedClass = await Class.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    ).populate('teacher', 'name email')
     .populate('students', 'name email');
    
    if (!updatedClass) {
      return res.status(404).json({ message: "Class not found" });
    }
    res.json(updatedClass);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// DELETE class
router.delete("/:id", auth, async (req, res) => {
  try {
    const deletedClass = await Class.findByIdAndDelete(req.params.id);
    if (!deletedClass) {
      return res.status(404).json({ message: "Class not found" });
    }
    res.json({ message: "Class deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET class by ID
router.get("/:id", auth, async (req, res) => {
  try {
    const classData = await Class.findById(req.params.id)
      .populate('teacher', 'name email phone')
      .populate('students', 'name email class parentPhone');
    
    if (!classData) {
      return res.status(404).json({ message: "Class not found" });
    }
    res.json(classData);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ADD student to class
router.post("/:id/students", auth, async (req, res) => {
  try {
    const { studentId } = req.body;
    const classData = await Class.findById(req.params.id);
    
    if (!classData) {
      return res.status(404).json({ message: "Class not found" });
    }
    
    if (!classData.students.includes(studentId)) {
      classData.students.push(studentId);
      await classData.save();
    }
    
    const updatedClass = await Class.findById(req.params.id)
      .populate('teacher', 'name email')
      .populate('students', 'name email');
    
    res.json(updatedClass);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// REMOVE student from class
router.delete("/:id/students/:studentId", auth, async (req, res) => {
  try {
    const classData = await Class.findById(req.params.id);
    
    if (!classData) {
      return res.status(404).json({ message: "Class not found" });
    }
    
    classData.students = classData.students.filter(
      student => student.toString() !== req.params.studentId
    );
    await classData.save();
    
    const updatedClass = await Class.findById(req.params.id)
      .populate('teacher', 'name email')
      .populate('students', 'name email');
    
    res.json(updatedClass);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// GET available teachers for assignment
router.get("/available/teachers", auth, async (req, res) => {
  try {
    const teachers = await Teacher.find();
    res.json(teachers);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET available students for enrollment
router.get("/available/students", auth, async (req, res) => {
  try {
    const students = await Student.find();
    res.json(students);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
