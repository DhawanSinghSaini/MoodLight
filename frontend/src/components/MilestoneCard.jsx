import React from "react";
import "../styles/milestone.css";

export default function MilestoneCard({ title, description }) {
  return (
    <div className="milestone-card">
      <h3 className="milestone-title">{title}</h3>
      <p className="milestone-desc">{description}</p>
    </div>
  );
}
