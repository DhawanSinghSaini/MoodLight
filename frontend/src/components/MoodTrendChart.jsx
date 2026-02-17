import React, { useEffect, useRef, useState } from "react";
import { Chart } from "chart.js/auto";
import "../styles/moodTrendChart.css";

export default function MoodTrendChart() {
  const chartRef = useRef(null);
  const chartInstanceRef = useRef(null);
  const token = localStorage.getItem("token");

  const [trendData, setTrendData] = useState({ days: [], high: [], low: [], zen: [] });
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!token) {
      window.location.href = "/login";
      return;
    }

    const fetchWeeklyFeelings = async () => {
      try {
        const days = [];
        const high = [];
        const low = [];
        const zen = [];

        // Loop through past 7 days
        for (let i = 0; i < 7; i++) {
          const d = new Date();
          d.setDate(d.getDate() - i);
          const isoDate = d.toISOString().split("T")[0];

          const res = await fetch(`https://moodlight-3gm2.onrender.com/api/dailystats/${isoDate}`, {
            headers: { Authorization: `Bearer ${token}` }
          });

          if (!res.ok) {
            const errText = await res.text();
            throw new Error(`Request failed: ${res.status} ${res.statusText} - ${errText}`);
          }

          const stats = await res.json();

          days.unshift(`${d.getDate()}/${d.getMonth() + 1}`); // keep chronological order

          let highCount = 0, lowCount = 0, zenCount = 0;
          (stats.feelings || []).forEach(f => {
            if (["Happy","Loved","Excited","Proud","Surprised"].includes(f.label)) {
              highCount += f.count;
            } else if (["Sad","Angry","Tired","Confused","Nervous"].includes(f.label)) {
              lowCount += f.count;
            } else if (["Neutral","Relaxed","Calm"].includes(f.label)) {
              zenCount += f.count;
            }
          });

          high.unshift(highCount);
          low.unshift(lowCount);
          zen.unshift(zenCount);
        }

        setTrendData({ days, high, low, zen });
        setError(null);
      } catch (err) {
        console.error("Error fetching weekly feelings:", err);
        setError(err.message);
        setTrendData({
          days: ["Day 1","Day 2","Day 3","Day 4","Day 5","Day 6","Day 7"],
          high: [0,0,0,0,0,0,0],
          low: [0,0,0,0,0,0,0],
          zen: [0,0,0,0,0,0,0]
        });
      }
    };

    fetchWeeklyFeelings();
  }, [token]);

  useEffect(() => {
    if (!trendData.days.length || error) return;

    const ctx = chartRef.current.getContext("2d");
    if (chartInstanceRef.current) chartInstanceRef.current.destroy();

    chartInstanceRef.current = new Chart(ctx, {
      type: "line",
      data: {
        labels: trendData.days,
        datasets: [
          { label: "High Moods", data: trendData.high, borderColor: "green", backgroundColor: "rgb(50, 204, 50)", tension: 0.4 },
          { label: "Low Moods", data: trendData.low, borderColor: "red", backgroundColor: "rgba(255, 0, 0, 0.93)", tension: 0.4 },
          { label: "Zen Moods", data: trendData.zen, borderColor: "blue", backgroundColor: "rgba(0, 251, 255, 0.94)", tension: 0.4 }
        ]
      },
      options: {
        responsive: false,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: false   // ✅ hides the bottom legend labels
          },
          tooltip: {
            enabled: true,   // ✅ still show stats on hover
            callbacks: {
              label: function (context) {
                return `${context.dataset.label}: ${context.raw}`;
              }
            }
          }
        }
      }
    });

    return () => chartInstanceRef.current?.destroy();
  }, [trendData, error]);

  return (
    <div className="mood-trend-card-new">
      <h2>Mood Trend (Past 7 Days)</h2>
      {error ? (
        <p style={{ color: "red" }}>⚠️ Error: {error}</p>
      ) : (
        <canvas ref={chartRef} className="mood-trend-canvas-new" />
      )}
    </div>
  );
}

