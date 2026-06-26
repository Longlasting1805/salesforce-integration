const express = require("express");
const cors = require("cors");
require("dotenv").config();

const connectDB = require("./config/db");
const leadRoutes = require("./routes/leadRoutes");

const app = express();

// Connect to MongoDB
connectDB();

app.use(express.json());
app.use(cors());

app.use("/", leadRoutes);

app.listen(3000, () => {
  console.log("🚀 Server running on port 3000");
});