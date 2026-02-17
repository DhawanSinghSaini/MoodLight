import React, { useEffect, useRef } from "react";
import { Chart } from "chart.js/auto";
import "../styles/goalsOverview.css";

export default function GoalsOverview() {
  const chartRef = useRef(null);
  const chartInstanceRef = useRef(null);

  useEffect(() => {
    const ctx = chartRef.current.getContext("2d");

    // ✅ Destroy old chart if exists
    if (chartInstanceRef.current) {
      chartInstanceRef.current.destroy();
    }

    const completed = 3;
    const pending = 2;
    const total = completed + pending;
    const percentage = Math.round((completed / total) * 100);

    // ✅ Plugin to draw text in center
    const centerTextPlugin = {
      id: "centerText",
      beforeDraw: (chart) => {
        const { width, height } = chart;
        const ctx = chart.ctx;
        ctx.restore();
        const fontSize = (height / 100).toFixed(2);
        ctx.font = `${fontSize}em sans-serif`;
        ctx.textBaseline = "middle";
        ctx.fillStyle = "#379683"; // ✅ pastel green text
        const text = `${percentage}%`;
        const textX = Math.round((width - ctx.measureText(text).width) / 2);
        const textY = height / 2;
        ctx.fillText(text, textX, textY);
        ctx.save();
      },
    };

    chartInstanceRef.current = new Chart(ctx, {
      type: "doughnut",
      data: {
        labels: ["Completed", "Pending"],
        datasets: [
          {
            data: [completed, pending],
            backgroundColor: ["#A8E6CF", "#FF8C94"], // ✅ pastel green & pastel red
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
      plugins: [centerTextPlugin],
    });

    return () => {
      if (chartInstanceRef.current) {
        chartInstanceRef.current.destroy();
      }
    };
  }, []);

  return (
    <div className="insight-card">
      <h2>Goals Overview</h2>
      <canvas ref={chartRef} />
    </div>
  );
}
