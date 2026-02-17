import React, { useState, useEffect } from "react";
import FixNote from "../components/FixNote";
import "../styles/pastjournal.css";

export default function PastJournal() {
  const [pastNotes, setPastNotes] = useState([]);
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      window.location.href = "/login";
      return;
    }

    const fetchPast = async () => {
      try {
        const res = await fetch("https://moodlight-3gm2.onrender.com/api/journal/recent", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        setPastNotes(data);
        setIndex(0); // ✅ start at latest entry
      } catch (err) {
        console.error("Error fetching past journals:", err);
      }
    };

    fetchPast();
  }, []);

  const handlePrevious = () => {
    setIndex((prevIndex) =>
      prevIndex === pastNotes.length - 1 ? 0 : prevIndex + 1
    );
  };

  const handleNext = () => {
    setIndex((prevIndex) =>
      prevIndex === 0 ? pastNotes.length - 1 : prevIndex - 1
    );
  };

  // Helper to format date from year, month, day
  const formatDate = (note) => {
    if (!note.year || !note.month || !note.day) return "";
    const d = new Date(note.year, note.month - 1, note.day, note.hour || 0, note.minute || 0);
    return d.toLocaleDateString("en-GB", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  return (
    <div className="pastjournal-page">
      <h1 className="pastjournal-heading">Past Journal</h1>

      <div className="stack-container">
        <div className="fixnote-wrapper tilt-left">
          <FixNote
            heading="Keep Going"
            date=""
            content="Keep Going after your goals. You are closer than you think."
          />
        </div>

        <div className="fixnote-wrapper tilt-right">
          <FixNote
            heading="Have a great day"
            date=""
            content="If you are reading this. I wish you have the best day ever."
          />
        </div>

        {pastNotes.length > 0 && (
          <div className="note-wrapper">
            <FixNote
              heading={pastNotes[index].heading || "Journal Entry"}
              date={formatDate(pastNotes[index])}
              content={pastNotes[index].journal}
            />
          </div>
        )}
      </div>

      {pastNotes.length > 1 && (
        <div className="pastjournal-actions">
          <button className="nav-btn" onClick={handlePrevious}>← Previous</button>
          <button className="nav-btn" onClick={handleNext}>Next →</button>
        </div>
      )}
    </div>
  );
}
