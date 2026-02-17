import React, { useState, useEffect } from 'react';
import '../styles/streak.css';

export default function Streak() {
  const [days, setDays] = useState(0);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      window.location.href = "/login"; // redirect if no token
      return;
    }

    fetch("https://moodlight-3gm2.onrender.com/api/streak", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => {
        if (res.status === 400 || res.status === 401) {
          localStorage.removeItem("token");
          window.location.href = "/login";
          return null;
        }
        return res.json();
      })
      .then((data) => {
        if (data && data.currStreak !== undefined) {
          setDays(data.currStreak);
        }
      })
      .catch((err) => console.error("Error fetching streak:", err));
  }, []);

  const hasShadow = days > 0;

  return (
    <div className="streak-wrapper">
      {/* Circle + Thunder */}
      <div className={`streak-circle ${hasShadow ? 'with-shadow' : ''}`}>
        <svg
          className={`thunder-icon ${hasShadow ? 'with-shadow' : ''}`}
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
        >
          <path
            d="M13 2 L3 14 H11 L9 22 L21 10 H13 Z"
            fill={days === 0 ? "none" : "white"}   // ✅ only border when days=0
            stroke="white"
            strokeWidth="2"
          />
        </svg>
      </div>

      {/* Number in its own div */}
      {days > 0 && (
        <div className="streak-days">
          {days}
        </div>
      )}
    </div>
  );
}
