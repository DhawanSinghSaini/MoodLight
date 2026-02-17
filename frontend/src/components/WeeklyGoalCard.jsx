import React, { useEffect, useRef, useState } from "react";
import { Chart } from "chart.js/auto";
import "../styles/weeklyGoalCard.css";

export default function WeeklyGoalCard() {
  const chartRef = useRef(null);
  const chartInstanceRef = useRef(null);
  const token = localStorage.getItem("token");

  const [completed, setCompleted] = useState(0);
  const [incomplete, setIncomplete] = useState(0);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!token) {
      window.location.href = "/login";
      return;
    }

    const fetchWeeklyGoals = async () => {
      try {
        const now = new Date();
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(now.getDate() - 7);

        const res = await fetch("https://moodlight-3gm2.onrender.com/api/goals", {
          headers: { Authorization: `Bearer ${token}` }
        });

        if (!res.ok) {
          const errText = await res.text();
          throw new Error(`Request failed: ${res.status} ${res.statusText} - ${errText}`);
        }

        const goals = await res.json();

        let totalCompleted = 0;
        let totalIncomplete = 0;

        goals.forEach(goal => {
          if (goal.complete) {
            if (goal.completeYear && goal.completeMonth && goal.completeDay) {
              const completedDate = new Date(
                goal.completeYear,
                goal.completeMonth - 1,
                goal.completeDay
              );
              if (completedDate >= sevenDaysAgo && completedDate <= now) {
                totalCompleted++;
              }
            }
          } else {
            const dueDate = new Date(goal.dueYear, goal.dueMonth - 1, goal.dueDay);
            if (dueDate >= sevenDaysAgo && dueDate <= now) {
              totalIncomplete++;
            }
          }
        });

        setCompleted(totalCompleted);
        setIncomplete(totalIncomplete);
        setError(null);
      } catch (err) {
        console.error("Error fetching weekly goals:", err);
        setError(err.message);
      }
    };

    fetchWeeklyGoals();
  }, [token]);

  useEffect(() => {
    if (error) return;

    const ctx = chartRef.current?.getContext("2d");
    if (!ctx) return;

    if (chartInstanceRef.current) chartInstanceRef.current.destroy();

    chartInstanceRef.current = new Chart(ctx, {
      type: "doughnut",
      data: {
        labels: ["Completed", "Incomplete"],
        datasets: [
          {
            data: [completed, incomplete],
            backgroundColor: ["hsl(140, 70%, 60%)", "hsl(0, 70%, 70%)"],
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
  }, [completed, incomplete, error]);

  return (
    <div className="insight-card weekly-goal-card">
      <h3 className="card-heading">Weekly Goals (This Week)</h3>
      {error ? (
        <p style={{ color: "red" }}>⚠️ Error: {error}</p>
      ) : (
        <canvas ref={chartRef} width={350} height={300} />
      )}
    </div>
  );
}


