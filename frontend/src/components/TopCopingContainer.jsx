import React from "react";
import CopingCard from "./CopingCard"; 
import "../styles/topCopingContainer.css";

export default function TopCopingContainer({ mechanisms = [] }) {
  // ✅ Only take top 5 coping mechanisms
  const topFive = mechanisms.slice(0, 5);

  return (
    <div className="top-coping-container">
      <h2 className="top-coping-heading">Top 5 Coping Mechanisms</h2>
      <div className="coping-list">
        {topFive.map((item, index) => (
          <CopingCard 
            key={index}
            title={item.title}
            description={item.description}
            icon={item.icon} // optional icon or image
          />
        ))}
      </div>
    </div>
  );
}
