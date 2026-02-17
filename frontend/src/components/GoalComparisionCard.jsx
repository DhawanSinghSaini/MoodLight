import React from "react";
import "../styles/goalsComparisonCard.css";

export default function GoalsComparisonCard({ currentWeek = 5, lastWeek = 3 }) {
  const difference = currentWeek - lastWeek;
  const percentageChange = lastWeek === 0 ? 0 : Math.round((difference / lastWeek) * 100);
  const isIncrease = difference > 0;
  const isSame = difference === 0;

  return (
    <div className="goals-comparison-card">
      <h3 className="card-heading">Weekly Goals Comparison</h3>
      <div className="card-row">
        <div className="card-left">
          <p>This week: <strong>{currentWeek}</strong></p>
          <p>Last week: <strong>{lastWeek}</strong></p>
        </div>
        <div className={`card-right ${isIncrease ? "increase" : isSame ? "neutral" : "decrease"}`}>
          {isSame ? "→" : isIncrease ? "▲" : "▼"} {Math.abs(percentageChange)}%
        </div>
      </div>
    </div>
  );
}
