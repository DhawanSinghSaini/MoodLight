import React, { useState, useEffect } from "react";
import H2 from "../components/H2";
import H1 from "../components/H1";
import Button from "../components/Button";
import "../styles/feeling.css";

export default function FeelingPage() {
  const [name] = useState("Buddy"); // Static default name
  const [selectedEmoji, setSelectedEmoji] = useState(null);
  const [noteText, setNoteText] = useState("");

  const emojis = [
    { symbol: "😀", label: "Happy" },
    { symbol: "😐", label: "Neutral" },
    { symbol: "😢", label: "Sad" },
    { symbol: "😡", label: "Angry" },
    { symbol: "😍", label: "Loved" },
    { symbol: "🤩", label: "Excited" },
    { symbol: "😴", label: "Tired" },
    { symbol: "😕", label: "Confused" },
    { symbol: "😌", label: "Relaxed" },
    { symbol: "🥳", label: "Proud" },
    { symbol: "😲", label: "Surprised" },
    { symbol: "😬", label: "Nervous" },
    { symbol: "🧘", label: "Calm" }
  ];

  // ✅ Redirect if JWT missing
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      window.location.href = "/login";
    }
  }, []);

  // ✅ Helper to update streak
  const updateStreak = async () => {
    try {
      const res = await fetch("https://moodlight-3gm2.onrender.com/api/streak/update", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "application/json",
        },
      });
      const data = await res.json();
      console.log("Streak updated:", data);
    } catch (err) {
      console.error("Error updating streak:", err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (selectedEmoji !== null) {
      const feeling = emojis[selectedEmoji].label;
      const note = noteText;
      const now = new Date();

      try {
        const res = await fetch("https://moodlight-3gm2.onrender.com/api/feelingentries", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            feeling,
            note,
            year: now.getFullYear(),
            month: now.getMonth() + 1,
            day: now.getDate(),
            hour: now.getHours(),
            minute: now.getMinutes(),
          }),
        });

        if (res.ok) {
          setNoteText("");
          setSelectedEmoji(null);

          // ✅ Update streak after successful save
          updateStreak();
        }
      } catch (err) {
        console.error("Error submitting feeling:", err);
      }
    }
  };

  return (
    <div className="feeling-page">
      <H2>Hi {name}!</H2>
      <H1>How are you feeling?</H1>

      {selectedEmoji === null && (
        <div className="emoji-container">
          {emojis.map((emoji, index) => (
            <div 
              key={index} 
              className="emoji-wrapper"
              onClick={() => setSelectedEmoji(index)}
            >
              <span className="emoji">{emoji.symbol}</span>
              <p className="emoji-label">{emoji.label}</p>
            </div>
          ))}
        </div>
      )}

      {selectedEmoji !== null && (
        <form onSubmit={handleSubmit} className="note-form">
          <div className="selected-emoji">
            <span className="emoji">{emojis[selectedEmoji].symbol}</span>
            <p className="emoji-label">{emojis[selectedEmoji].label}</p>
          </div>
          <textarea
            className="custom-textarea"
            placeholder={`What makes you feel ${emojis[selectedEmoji].label}?`}
            value={noteText}
            onChange={(e) => setNoteText(e.target.value)}
          />
          <Button type="submit" className="submit-btn">Submit</Button>
        </form>
      )}
    </div>
  );
}
