import React from "react";
import "../styles/quoteOfTheWeek.css";

export default function QuoteOfTheWeek({ quote, author }) {
  return (
    <div className="quote-card">
      <h2 className="quote-heading">Quote of the Week</h2>
      <p className="quote-text">“{quote}”</p>
      {author && <p className="quote-author">— {author}</p>}
    </div>
  );
}
