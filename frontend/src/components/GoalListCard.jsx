import React, { useState } from "react";
import GoalCard from "./GoalCard"; 
import "../styles/goalListCard.css";

export default function GoalListCard({ title, goals, type = "recent", onComplete, onAdd }) {
  const [message, setMessage] = useState("");

  const handleComplete = (goal) => {
    if (onComplete) {
      onComplete(goal);
      setMessage("✅ Goal completed!");
      setTimeout(() => setMessage(""), 2000); // clear after 2s
    }
  };

  const handleAdd = (goal) => {
    if (onAdd) {
      onAdd(goal);
      setMessage("🎯 Goal added!");
      setTimeout(() => setMessage(""), 2000);
    }
  };

  return (
    <div className="goal-list-card-new">
      <h2 className="goal-list-heading">{title}</h2>
      <div className="goal-list">
        {goals.map((g, i) => (
          <GoalCard
            key={i}
            symbol={g.emoji}
            heading={g.heading}
            desc={g.description}
            type={type}
            onComplete={() => handleComplete(g)}
            onAdd={() => handleAdd(g)}
          />
        ))}
      </div>
      {message && <p className="goal-message">{message}</p>}
    </div>
  );
}
