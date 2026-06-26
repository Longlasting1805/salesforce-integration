const express = require("express");
const cors = require("cors");
require("dotenv").config();

const leadRoutes = require("./routes/leadRoutes");

const app = express();

app.use(express.json());
app.use(cors());

app.use("/", leadRoutes);

app.listen(3000, () => {
  console.log("Server running on port 3000");
});