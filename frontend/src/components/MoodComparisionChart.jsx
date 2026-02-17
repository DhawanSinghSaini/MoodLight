import React, { useEffect, useRef } from "react";
import { Chart } from "chart.js/auto";
import "../styles/moodComparisonChart.css";

export default function MoodComparisonChart({ highMoods = 4, lowMoods = 3 }) {
  const chartRef = useRef(null);
  const chartInstanceRef = useRef(null);

  useEffect(() => {
    const ctx = chartRef.current.getContext("2d");

    // ✅ Destroy old chart if exists
    if (chartInstanceRef.current) {
      chartInstanceRef.current.destroy();
    }

    chartInstanceRef.current = new Chart(ctx, {
      type: "doughnut",
      data: {
        labels: ["High Moods", "Low Moods"],
        datasets: [
          {
            data: [highMoods, lowMoods],
            backgroundColor: ["#A8E6CF", "#FF8C94"], // ✅ pastel green & pastel pink
            borderWidth: 2,
          },
        ],
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            position: "bottom",
            labels: {
              color: "#333",
              font: { size: 14 },
            },
          },
        },
      },
    });

    return () => {
      if (chartInstanceRef.current) {
        chartInstanceRef.current.destroy();
      }
    };
  }, [highMoods, lowMoods]);

  return (
    <div className="insight-card mood-comparison-card">
      <h2>Mood Comparison (This Week)</h2>
      <canvas ref={chartRef} />
    </div>
  );
}
