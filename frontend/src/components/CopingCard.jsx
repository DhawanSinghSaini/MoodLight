import React from "react";
import "../styles/copingCard.css";

export default function CopingCard({ title, description, icon }) {
  return (
    <div className="coping-card">
      <div className="coping-icon">{icon}</div>
      <div className="coping-info">
        <h3 className="coping-title">{title}</h3>
        <p className="coping-description">{description}</p>
      </div>
    </div>
  );
}
