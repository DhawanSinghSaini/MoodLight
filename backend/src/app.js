const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const connectDB = require("./config/db");

dotenv.config();
connectDB();

const app = express();

app.use(cors());
app.use(express.json());

// Routes
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/users", require("./routes/userRoutes"));
app.use("/api/timeraudio", require("./routes/timerAudioRoutes"));
app.use("/api/soundscape", require("./routes/soundscapeRoutes")); 
app.use("/api/streak", require("./routes/streakRoutes"));         
app.use("/api/dailystats", require("./routes/dailyStatsRoutes")); 
app.use("/api/feelingentries", require("./routes/feelingEntryRoutes")); 
app.use("/api/journal", require("./routes/journalRoutes"));
app.use("/api/activities", require("./routes/activityRoutes")); 
app.use("/api/goals", require("./routes/goalRoutes"));      
app.use("/api/reflections", require("./routes/reflectionRoutes"));



// Root endpoint
app.get("/", (req, res) => {
  res.send("✅ Backend server is running and MongoDB connected");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
