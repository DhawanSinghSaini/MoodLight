import React from "react";
import "../styles/fixnote.css";

export default function FixNote({ heading, date, content }) {
  return (
    <div className="fixnote-box">
      <h3 className="fixnote-heading">{heading}</h3>
      {date && <p className="fixnote-date">{date}</p>}
      <p className="fixnote-content">{content}</p>
    </div>
  );
}
