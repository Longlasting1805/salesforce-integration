const express = require("express");
const cors = require("cors");
require("dotenv").config();

const connectDB = require("./config/db");
const leadRoutes = require("./routes/leadRoutes");
const authRoutes = require("./routes/authRoutes");

const app = express();

// ⬇️ THIS MUST COME BEFORE ROUTES
app.use(cors());
app.use(express.json());

// DB
connectDB();

// Routes
app.use("/", authRoutes);
app.use("/", leadRoutes);

// Start
app.listen(3000, () => {
  console.log("🚀 Server running on port 3000");
});