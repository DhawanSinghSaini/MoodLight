import React, { useEffect, useRef, useState } from "react";
import { Chart } from "chart.js/auto";
import "../styles/weeklyDoughnutChart.css";

export default function WeeklyDoughnutChart() {
  const chartRef = useRef(null);
  const chartInstanceRef = useRef(null);
  const token = localStorage.getItem("token");

  const [labels, setLabels] = useState([]);
  const [data, setData] = useState([]);
  const [colors, setColors] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!token) {
      window.location.href = "/login";
      return;
    }

    const fetchWeeklyFeelings = async () => {
      try {
        const aggregated = {};

        // Loop through past 7 days
        for (let i = 0; i < 7; i++) {
          const d = new Date();
          d.setDate(d.getDate() - i);

          // Format as YYYY-MM-DD
          const isoDate = d.toISOString().split("T")[0];

          const res = await fetch(`https://moodlight-3gm2.onrender.com/api/dailystats/${isoDate}`, {
            headers: { Authorization: `Bearer ${token}` }
          });

          if (!res.ok) {
            const errText = await res.text();
            throw new Error(`Request failed: ${res.status} ${res.statusText} - ${errText}`);
          }

          const stats = await res.json();

          (stats.feelings || []).forEach(f => {
            aggregated[f.label] = (aggregated[f.label] || 0) + f.count;
          });
        }

        const labelsArr = Object.keys(aggregated);
        const dataArr = Object.values(aggregated);

        const colorsArr = labelsArr.map((_, i) => {
          const hue = (i * 50) % 360;
          return `hsl(${hue}, 70%, 70%)`;
        });

        setLabels(labelsArr);
        setData(dataArr);
        setColors(colorsArr);
        setError(null);
      } catch (err) {
        console.error("Error fetching weekly feelings:", err);
        setError(err.message);
      }
    };

    fetchWeeklyFeelings();
  }, [token]);

  useEffect(() => {
    if (!labels.length || error) return;

    const ctx = chartRef.current.getContext("2d");
    if (chartInstanceRef.current) chartInstanceRef.current.destroy();

    chartInstanceRef.current = new Chart(ctx, {
      type: "doughnut",
      data: {
        labels,
        datasets: [
          {
            data,
            backgroundColor: colors,
            borderWidth: 2,
          },
        ],
      },
      options: {
        responsive: false,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: "bottom",
            labels: {
              color: "#333",
              font: { size: 14 },
            },
          },
          tooltip: {
            callbacks: {
              label: function (context) {
                return `${context.label}: ${context.raw}`;
              },
            },
          },
        },
      },
    });

    return () => chartInstanceRef.current?.destroy();
  }, [labels, data, colors, error]);

  return (
    <div className="insight-card weekly-doughnut-card">
      <h3 className="card-heading">Weekly Feelings (This Week)</h3>
      {error ? (
        <p style={{ color: "red" }}>⚠️ Error: {error}</p>
      ) : (
        <canvas ref={chartRef} width={350} height={300} />
      )}
    </div>
  );
}
