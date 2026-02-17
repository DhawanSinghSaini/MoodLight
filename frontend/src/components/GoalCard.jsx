import React from "react";
import '../styles/goalcard.css';

export default function GoalCard({ 
  symbol = '👟', 
  heading = 'Run 1 Km', 
  desc = 'Go for a run in the neighbourhood',
  type = "pending",        // "pending", "suggested", or "recent"
  onComplete,              // handler for tick
  onAdd                    // handler for plus
}) {
  // ✅ helper to truncate text
  const truncateText = (text, maxLength) => {
    if (!text) return "";
    return text.length > maxLength ? text.slice(0, maxLength) + "..." : text;
  };

  return (
    <div className="goal-box">
      <div className="goal-symbol">{symbol}</div>
      <div className="goal-text">
        <p className="goal-heading">{truncateText(heading, 20)}</p>
        <p className="goal-desc">{truncateText(desc, 40)}</p>
      </div>

      {/* ✅ Action button changes based on section */}
      {type === "pending" && (
        <div className="goal-tick" onClick={onComplete}>
          ✓
        </div>
      )}

      {type === "suggested" && (
        <div className="goal-add" onClick={onAdd}>
          +
        </div>
      )}

      {/* ✅ If type is "recent", no button is shown */}
    </div>
  );
}
