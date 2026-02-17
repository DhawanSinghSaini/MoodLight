import React, { useState, useEffect } from "react";
import Note from "../components/Note";
import FixNote from "../components/FixNote";
import PastJournal from "../feature/PastJournal";
import "../styles/journal.css";

export default function Journal() {
  const [showPast, setShowPast] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      window.location.href = "/login";
    }
  }, []);

  if (showPast) {
    return <PastJournal />;
  }

  return (
    <div className="journal-page">
      <h1 className="journal-heading">Journal</h1>

      <div className="stack-container">
        <div className="fixnote-wrapper tilt-left">
          <FixNote
            heading="Keep Going"
            date="17 January 2026"
            content="Keep Going after your goals. You are closer than you think."
          />
        </div>

        <div className="fixnote-wrapper tilt-right">
          <FixNote
            heading="Have a great day"
            date="16 January 2026"
            content="If you are reading this. I wish you have the best day ever."
          />
        </div>

        <div className="note-wrapper">
          <Note onSaved={() => setShowPast(true)} />
        </div>
      </div>

      <div className="old-entries-container">
        <button 
          className="old-entries-btn" 
          onClick={() => setShowPast(true)}
        >
          View Past Entries
        </button>
      </div>
    </div>
  );
}
