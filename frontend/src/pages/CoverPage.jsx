import React, { useEffect } from "react";
import "../styles/cover.css";
import { useNavigate } from "react-router-dom";

export default function CoverPage() {
  const navigate = useNavigate();

  useEffect(() => {
    // 🔹 Boot up backend by making a request when page loads
    fetch("https://moodlight-3gm2.onrender.com/")
      .then(() => console.log("Backend boot request sent"))
      .catch((err) => console.error("Backend boot error:", err));
  }, []);

  // helper function to delay navigation
  const handleNavigate = (path) => {
    setTimeout(() => {
      navigate(path);
    }, 2000); // 2 second pause
  };

  return (
    <div className="cover-page">
      {/* Navbar with only Logo */}
      <nav>
        <h1 className="Logo">MoodLight</h1>
      </nav>

      {/* Content */}
      <div className="content">
        <div className="textDesc">
          <p>A Wellness Tracking Application.</p>
          <p>
            Track moods, goals, reflections, and soundscapes for better mental health with ML.
          </p>
        </div>

        {/* Square buttons aligned left */}
        <div className="btn-square-ctr">
          <button
            className="square-btn"
            onClick={() => handleNavigate("/login")}
          >
            Log In
          </button>
          <button
            className="square-btn"
            onClick={() => handleNavigate("/signup")}
          >
            Sign Up
          </button>
        </div>

        {/* Images */}
        <div className="Images">
          <img src="/images/image1.png" alt="Preview 1" />
          <img src="/images/image2.png" alt="Preview 2" />
          <img src="/images/image3.png" alt="Preview 3" />
        </div>

        {/* Footer */}
        <footer>
          <p>Developed By Dhawan 💙</p>
        </footer>
      </div>
    </div>
  );
}
