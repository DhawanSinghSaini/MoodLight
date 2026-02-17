import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import MoodLightCard from "../components/MoodLightCard";
import "../styles/welcome.css";

export default function Welcome() {
  const navigate = useNavigate();

  useEffect(() => {
    // 🔹 Boot up backend by making a request
    fetch("https://moodlight-3gm2.onrender.com/")
      .then(() => console.log("Backend boot request sent"))
      .catch((err) => console.error("Backend boot error:", err));

    // 🔹 Redirect after 5s with fade-out transition
    const timer = setTimeout(() => {
      const page = document.querySelector(".welcome-page");
      if (page) page.classList.add("fade-out");

      setTimeout(() => navigate("/home"), 500); // wait for fade-out
    }, 5000);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="welcome-page fade-in">
      <MoodLightCard />
    </div>
  );
}
