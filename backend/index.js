const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const mongoose = require("mongoose");
const path = require("path");
const connectDB = require("./config/db");


dotenv.config();
const app = express();


app.use(
  cors({
    origin:"http://localhost:5173", 
    credentials: true,
  })
);

const cookieParser = require("cookie-parser");
app.use(cookieParser());

app.use(express.json()); 
app.get("/test", (req, res) => {
  res.json({ msg: "hello" });
});

// Serve static files (assets) from a directory
app.use("/assets", express.static(path.join(__dirname, "assets")));


// Connect to the database
connectDB(process.env.MONGO_URI);

// Routes
const userRoutes = require("./routes/AuthRoutes");
const UsersRoutes = require("./routes/UsersRoutes");
const PlacesRoutes = require("./routes/PlacesRoutes");


app.use("/api/user", userRoutes);
app.use("/api/users", UsersRoutes);
app.use("/api/places", PlacesRoutes);





// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
