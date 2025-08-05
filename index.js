const express = require("express");
const connectDB = require("./config/db");
require("dotenv").config({ quiet: true });
const app = express();
app.use(express.json());
const cors = require("cors")

connectDB();
app.use(cors());
app.use("/api/users", require("./routes/UserRoutes"));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));