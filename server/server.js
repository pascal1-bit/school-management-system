const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
require("dotenv").config();

const app = express();

// --- 1. MIDDLEWARES (Zigomba kuza mbere y'ama-routes) ---
app.use(cors()); // Kwemerera React kuvugana na Node
app.use(express.json()); // Ituma Node isoma JSON body (Ikosora rya kosa 500)
app.use(express.urlencoded({ extended: true }));

// --- 2. ROUTES ---
// Genzura niba file yawe yitwa 'autRouters.js' cyangwa 'authRoutes.js' muri folder ya routes
const authRoutes = require("./routes/autRouters"); 
const studentRoutes = require("./routes/studentRoutes");
const teacherRoutes = require("./routes/teacherRoutes");
const classRoutes = require("./routes/classRoutes");
const attendanceRoutes = require("./routes/attendanceRoutes");

app.use("/api/auth", authRoutes);
app.use("/api/student", studentRoutes);
app.use("/api/teacher", teacherRoutes);
app.use("/api/class", classRoutes);
app.use("/api/attendance", attendanceRoutes);

// --- 3. MONGODB CONNECTION ---
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected "))
  .catch(err => console.log("Ikosa rya Mongo:", err));

// Test route
app.get("/", (req, res) => {
  res.send("API iri gukora neza 🚀");
});

const PORT = 5000;
app.listen(PORT, () => {
  console.log("Server running on port " + PORT);
});