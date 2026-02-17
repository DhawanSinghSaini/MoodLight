import React, { useState, useEffect } from "react";
import WeeklyComparisonCard from "../components/WeeklyComparisonCard";
import WeeklyDoughnutChart from "../components/WeeklyDoughnutChart";
import MoodTrendChart from "../components/MoodTrendChart";
import TopTracksContainer from "../components/TopTracksContainer";
import WeeklyGoalCard from "../components/WeeklyGoalCard";
import GoalListCard from "../components/GoalListCard";
import "../styles/insight.css";
import H2 from "../components/H2";
import ReflectionCard from "../components/ReflectionCard";


export default function Insights() {
  const token = localStorage.getItem("token");

  // State
  const [recentCompletedGoals, setRecentCompletedGoals] = useState([]);
  const [recentIncompleteGoals, setRecentIncompleteGoals] = useState([]);

  const [goodMoodsThisWeek, setGoodMoodsThisWeek] = useState(0);
  const [goodMoodsLastWeek, setGoodMoodsLastWeek] = useState(0);
  const [badMoodsThisWeek, setBadMoodsThisWeek] = useState(0);
  const [badMoodsLastWeek, setBadMoodsLastWeek] = useState(0);

  useEffect(() => {
    if (!token) return;

    const fetchWeeklyMoods = async () => {
      try {
        const now = new Date();

        const startOfThisWeek = new Date(now);
        startOfThisWeek.setDate(now.getDate() - 7);

        const startOfLastWeek = new Date(now);
        startOfLastWeek.setDate(now.getDate() - 14);

        let thisWeekGood = 0,
          lastWeekGood = 0;
        let thisWeekBad = 0,
          lastWeekBad = 0;

        // Loop through past 14 days
        for (let i = 0; i < 14; i++) {
          const d = new Date();
          d.setDate(d.getDate() - i);
          const isoDate = d.toISOString().split("T")[0];

          const res = await fetch(
            `https://moodlight-3gm2.onrender.com/api/dailystats/${isoDate}`,
            {
              headers: { Authorization: `Bearer ${token}` },
            },
          );

          if (!res.ok) continue;
          const stats = await res.json();

          let goodCount = 0,
            badCount = 0;
          (stats.feelings || []).forEach((f) => {
            if (
              [
                "Happy",
                "Loved",
                "Excited",
                "Proud",
                "Surprised",
                "Neutral",
                "Relaxed",
                "Calm",
              ].includes(f.label)
            ) {
              goodCount += f.count;
            } else {
              badCount += f.count;
            }
          });

          const dayDate = new Date(d);

          if (dayDate >= startOfThisWeek && dayDate <= now) {
            thisWeekGood += goodCount;
            thisWeekBad += badCount;
          } else if (dayDate >= startOfLastWeek && dayDate < startOfThisWeek) {
            lastWeekGood += goodCount;
            lastWeekBad += badCount;
          }
        }

        setGoodMoodsThisWeek(thisWeekGood);
        setGoodMoodsLastWeek(lastWeekGood);
        setBadMoodsThisWeek(thisWeekBad);
        setBadMoodsLastWeek(lastWeekBad);
      } catch (err) {
        console.error("Error fetching weekly moods:", err);
      }
    };

    fetchWeeklyMoods();
  }, [token]);

  // State for weely goal comoparision card
  const [completedThisWeek, setCompletedThisWeek] = useState(0);
  const [completedLastWeek, setCompletedLastWeek] = useState(0);

  //state chane for ^
  useEffect(() => {
    if (!token) return;

    const fetchWeeklyGoals = async () => {
      try {
        const now = new Date();

        // Define week ranges
        const startOfThisWeek = new Date(now);
        startOfThisWeek.setDate(now.getDate() - 7);

        const startOfLastWeek = new Date(now);
        startOfLastWeek.setDate(now.getDate() - 14);

        const res = await fetch("https://moodlight-3gm2.onrender.com/api/goals", {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!res.ok) return;
        const goals = await res.json();

        let thisWeekCompleted = 0;
        let lastWeekCompleted = 0;

        goals.forEach((goal) => {
          if (
            goal.complete &&
            goal.completeYear &&
            goal.completeMonth &&
            goal.completeDay
          ) {
            const completedDate = new Date(
              goal.completeYear,
              goal.completeMonth - 1,
              goal.completeDay,
            );

            if (completedDate >= startOfThisWeek && completedDate <= now) {
              thisWeekCompleted++;
            } else if (
              completedDate >= startOfLastWeek &&
              completedDate < startOfThisWeek
            ) {
              lastWeekCompleted++;
            }
          }
        });

        setCompletedThisWeek(thisWeekCompleted);
        setCompletedLastWeek(lastWeekCompleted);
      } catch (err) {
        console.error("Error fetching weekly goals:", err);
      }
    };

    fetchWeeklyGoals();
  }, [token]);

  // ✅ Fetch overdue goals
  useEffect(() => {
    if (!token) return;

    fetch("https://moodlight-3gm2.onrender.com/api/goals/overdue", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => {
        setRecentIncompleteGoals(data);
      })
      .catch((err) => console.error("Error fetching overdue goals:", err));
  }, [token]);

  // ✅ Fetch recent completed goals
  useEffect(() => {
    if (!token) return;

    const fetchCompletedGoals = async () => {
      try {
        const res = await fetch("https://moodlight-3gm2.onrender.com/api/goals/recent", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();

        let completed = data.filter((g) => g.complete === true);

        if (completed.length < 5) {
          const actRes = await fetch("https://moodlight-3gm2.onrender.com/api/activities", {
            headers: { Authorization: `Bearer ${token}` },
          });
          const activities = await actRes.json();

          const shuffled = activities.sort(() => 0.5 - Math.random());
          const needed = 5 - completed.length;
          const fillers = shuffled.slice(0, needed).map((a) => ({
            emoji: a.emoji || a.symbol || "✨",
            heading: a.heading,
            description: a.description || a.desc,
            complete: false,
          }));

          completed = [...completed, ...fillers];
        }

        setRecentCompletedGoals(completed);
      } catch (err) {
        console.error("Error fetching completed goals:", err);
      }
    };

    fetchCompletedGoals();
  }, [token]);

  // ✅ Handlers
  const markAsCompleted = async (goal) => {
    try {
      const res = await fetch(
        `https://moodlight-3gm2.onrender.com/api/goals/${goal._id}/complete`,
        {
          method: "PUT",
          headers: { Authorization: `Bearer ${token}` },
        },
      );

      if (res.ok) {
        setRecentIncompleteGoals((prev) =>
          prev.filter((g) => g._id !== goal._id),
        );
        setRecentCompletedGoals((prev) => [
          ...prev,
          { ...goal, emoji: "✅", complete: true },
        ]);
      }
    } catch (err) {
      console.error("Error marking goal complete:", err);
    }
  };

  const addGoalBack = async (goal) => {
    try {
      const today = new Date();
      const res = await fetch("https://moodlight-3gm2.onrender.com/api/goals", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          emoji: goal.emoji,
          heading: goal.heading,
          description: goal.description,
          dueYear: today.getFullYear(),
          dueMonth: today.getMonth() + 1,
          dueDay: today.getDate(),
        }),
      });

      if (res.ok) {
        const newGoal = await res.json();
        setRecentIncompleteGoals((prev) => [...prev, newGoal]);
      }
    } catch (err) {
      console.error("Error adding goal back:", err);
    }
  };

  return (
    <div className="insight-page">
      <H2 className="insight-heading">Insights Dashboard</H2>
      <p className="insight-subheading">
        Your progress and patterns at a glance
      </p>

      <div className="insight-grid-3x3">
        {/* Goals completed vs not completed */}
        <WeeklyGoalCard />

        {/* Mood distribution by feelings */}
        <WeeklyDoughnutChart
          title="Mood Distribution (7 days)"
          labels={[
            "Happy",
            "Neutral",
            "Sad",
            "Angry",
            "Loved",
            "Excited",
            "Tired",
            "Confused",
            "Relaxed",
            "Proud",
            "Surprised",
            "Nervous",
            "Calm",
          ]}
          data={[8, 5, 2, 2, 3, 4, 1, 2, 6, 2, 1, 2, 6]} // placeholder
          colors={[
            "#4CAF50",
            "#9E9E9E",
            "#F44336",
            "#FF5722",
            "#66BB6A",
            "#81C784",
            "#EF5350",
            "#E57373",
            "#2196F3",
            "#8BC34A",
            "#26A69A",
            "#FF7043",
            "#42A5F5",
          ]}
        />

        {/* Comparison cards */}
        <div className="comparison-group">
          <WeeklyComparisonCard
            title="Goals Comparison"
            currentWeek={completedThisWeek}
            lastWeek={completedLastWeek}
            metric="Goals"
            isPositive="true"
          />

          <WeeklyComparisonCard
            title="Good Moods Comparison"
            currentWeek={goodMoodsThisWeek}
            lastWeek={goodMoodsLastWeek}
            metric="Good Moods"
            isPositive="true"
          />
          <WeeklyComparisonCard
            title="Bad Moods Comparison"
            currentWeek={badMoodsThisWeek}
            lastWeek={badMoodsLastWeek}
            metric="Bad Moods"
            isPositive="false"
          />
        </div>

        {/* Mood trend now fetches its own data */}
        <MoodTrendChart />

        {/* ✅ Top 5 tracks from DB */}
        <TopTracksContainer />

        {/* Goals */}
        <GoalListCard
          title="Recent Completed Goals"
          goals={recentCompletedGoals}
          type="suggested"
          onAdd={addGoalBack}
        />

        {recentIncompleteGoals.length > 0 && (
          <GoalListCard
            title="Overdue Goals"
            goals={recentIncompleteGoals}
            type="pending"
            onComplete={markAsCompleted}
          />
        )}

        <ReflectionCard />
      </div>
    </div>
  );
}
