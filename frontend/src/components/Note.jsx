import React, { useState, useEffect } from "react";
import "../styles/note.css";

export default function Note({ onSaved }) {
  const [heading, setHeading] = useState("");
  const [content, setContent] = useState("");

  const today = new Date();
  const formattedDate = today.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      window.location.href = "/login";
    }
  }, []);

  const handleSave = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      window.location.href = "/login";
      return;
    }

    const now = new Date();

    try {
      const res = await fetch("https://moodlight-3gm2.onrender.com/api/journal", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          heading,
          journal: content,
          year: now.getFullYear(),
          month: now.getMonth() + 1, // JS months are 0–11
          day: now.getDate(),
          hour: now.getHours(),
          minute: now.getMinutes(),
        }),
      });

      if (res.ok) {
        setHeading("");
        setContent("");
        if (onSaved) onSaved(); // ✅ switch to PastJournal
      } else {
        const data = await res.json();
        console.error("❌ Error:", data.error);
      }
    } catch (err) {
      console.error("Error saving journal:", err);
    }
  };

  return (
    <div className="note-box">
      <input
        type="text"
        placeholder="Note Heading"
        value={heading}
        onChange={(e) => setHeading(e.target.value)}
        className="note-heading-input"
      />

      <p className="note-date">{formattedDate}</p>

      <textarea
        placeholder="Write your journal entry here..."
        value={content}
        onChange={(e) => setContent(e.target.value)}
        className="note-textarea"
      />

      <div className="note-actions">
        <button
          className="note-save-btn"
          onClick={handleSave}
          aria-label="Save Note"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="paperplane-icon"
            width="22"
            height="22"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="22" y1="2" x2="11" y2="13"></line>
            <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
          </svg>
        </button>
      </div>
    </div>
  );
}
