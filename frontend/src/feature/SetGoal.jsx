import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; 
import "../styles/setgoal.css";
import "../styles/goalcard.css";
import H2 from "../components/H2";
import NavButton from "../components/NavButton";

export default function SetGoal() {
  const [emoji, setEmoji] = useState("");
  const [heading, setHeading] = useState("");
  const [desc, setDesc] = useState("");
  const [date, setDate] = useState(""); 
  const [submitted, setSubmitted] = useState(false);
  const [savedGoal, setSavedGoal] = useState(null);

  const navigate = useNavigate();

  // ✅ Calculate today’s date in YYYY-MM-DD format for min attribute
  const today = new Date().toISOString().split("T")[0];

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
    }
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/login");
      return;
    }

    try {
      if (!date) {
        console.error("No date selected");
        return;
      }

      const selectedDate = new Date(date + "T00:00:00"); // force valid parse
      const res = await fetch("https://moodlight-3gm2.onrender.com/api/goals", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          emoji,
          heading,
          description: desc,
          dueYear: selectedDate.getFullYear(),
          dueMonth: selectedDate.getMonth() + 1,
          dueDay: selectedDate.getDate()
        })
      });

      const data = await res.json();
      setSavedGoal(data);
      setSubmitted(true);
      console.log("Goal saved:", data);
    } catch (err) {
      console.error("Error saving goal:", err);
    }
  };

  // ✅ Helper to format date as dd-mm-yyyy
  const formatDate = (goal) => {
    if (!goal.dueYear || !goal.dueMonth || !goal.dueDay) return "";
    const d = new Date(goal.dueYear, goal.dueMonth - 1, goal.dueDay);
    const day = String(d.getDate()).padStart(2, "0");
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const year = d.getFullYear();
    return `${day}-${month}-${year}`;
  };

  return (
    <div className="setgoal-page">
      {!submitted && (
        <>
          <H2>Set a Goal</H2>
          <p className="setgoal-desc">Enter your goal details below.</p>

          <form className="setgoal-form" onSubmit={handleSubmit}>
            <input
              type="text"
              placeholder="Goal Emoji : 👟"
              value={emoji}
              onChange={(e) => setEmoji(e.target.value)}
              className="setgoal-input"
              maxLength={2}
              required
            />
            <input
              type="text"
              placeholder="Goal Heading"
              value={heading}
              onChange={(e) => setHeading(e.target.value)}
              className="setgoal-input"
              required
            />
            <input
              type="text"
              placeholder="Short Description"
              value={desc}
              onChange={(e) => setDesc(e.target.value)}
              className="setgoal-input"
              required
            />
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="setgoal-input setgoal-date"
              min={today}
              required
            />
            <div className="submit-btn-wrapper">
              <NavButton text="Save Goal" />
            </div>
          </form>
        </>
      )}

      {submitted && savedGoal && (
        <div className="goal-summary">
          <h3>🎯 Goal Saved!</h3>
          <div className="goal-box">
            <div className="goal-symbol">{savedGoal.emoji}</div>
            <div className="goal-text">
              <p className="goal-heading">{savedGoal.heading}</p>
              <p className="goal-desc">{savedGoal.description}</p>
              <p className="goal-date">{formatDate(savedGoal)}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
