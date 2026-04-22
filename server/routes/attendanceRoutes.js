const express = require("express");
const router = express.Router();
const Attendance = require("../models/Attendance");
const Student = require("../models/Student");
const Class = require("../models/Class");
const auth = require("../middleware/auth");

// GET attendance records
router.get("/", auth, async (req, res) => {
  try {
    const { date, class: classId, student } = req.query;
    let query = {};
    
    if (date) query.date = new Date(date);
    if (classId) query.class = classId;
    if (student) query.student = student;
    
    const attendance = await Attendance.find(query)
      .populate('student', 'name email class')
      .populate('class', 'name grade')
      .populate('markedBy', 'name')
      .sort({ date: -1 });
    
    res.json(attendance);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// MARK attendance for multiple students
router.post("/mark", auth, async (req, res) => {
  try {
    const { date, classId, attendanceRecords } = req.body;
    const dateObj = new Date(date);
    
    const results = [];
    
    for (const record of attendanceRecords) {
      const { studentId, status, notes } = record;
      
      // Check if attendance already exists
      const existing = await Attendance.findOne({
        student: studentId,
        class: classId,
        date: dateObj
      });
      
      if (existing) {
        // Update existing record
        existing.status = status;
        existing.notes = notes;
        existing.markedBy = req.user.id;
        await existing.save();
        results.push(existing);
      } else {
        // Create new record
        const attendance = new Attendance({
          student: studentId,
          class: classId,
          date: dateObj,
          status,
          notes,
          markedBy: req.user.id
        });
        await attendance.save();
        results.push(attendance);
      }
    }
    
    // Populate and return results
    const populatedResults = await Attendance.find({
      _id: { $in: results.map(r => r._id) }
    })
      .populate('student', 'name email class')
      .populate('class', 'name grade')
      .populate('markedBy', 'name');
    
    res.json(populatedResults);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// GET attendance for a specific class on a specific date
router.get("/class/:classId/date/:date", auth, async (req, res) => {
  try {
    const { classId, date } = req.params;
    const dateObj = new Date(date);
    
    // Get class details with students
    const classData = await Class.findById(classId).populate('students');
    
    if (!classData) {
      return res.status(404).json({ message: "Class not found" });
    }
    
    // Get existing attendance records
    const attendanceRecords = await Attendance.find({
      class: classId,
      date: dateObj
    }).populate('student', 'name email class');
    
    // Create attendance list for all students
    const attendanceList = classData.students.map(student => {
      const attendance = attendanceRecords.find(
        record => record.student._id.toString() === student._id.toString()
      );
      
      return {
        student,
        status: attendance?.status || "not_marked",
        notes: attendance?.notes || "",
        attendanceId: attendance?._id
      };
    });
    
    res.json({
      class: classData,
      date: dateObj,
      attendance: attendanceList
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET attendance statistics for a class
router.get("/stats/class/:classId", auth, async (req, res) => {
  try {
    const { classId } = req.params;
    const { startDate, endDate } = req.query;
    
    let dateQuery = {};
    if (startDate && endDate) {
      dateQuery = {
        date: {
          $gte: new Date(startDate),
          $lte: new Date(endDate)
        }
      };
    }
    
    const attendance = await Attendance.find({
      class: classId,
      ...dateQuery
    }).populate('student', 'name');
    
    const stats = attendance.reduce((acc, record) => {
      const studentId = record.student._id.toString();
      if (!acc[studentId]) {
        acc[studentId] = {
          student: record.student,
          total: 0,
          present: 0,
          absent: 0,
          late: 0,
          excused: 0
        };
      }
      
      acc[studentId].total++;
      acc[studentId][record.status]++;
      
      return acc;
    }, {});
    
    res.json(Object.values(stats));
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// DELETE attendance record
router.delete("/:id", auth, async (req, res) => {
  try {
    const deleted = await Attendance.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ message: "Attendance record not found" });
    }
    res.json({ message: "Attendance record deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
