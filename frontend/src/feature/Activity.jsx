import React, { useEffect, useState } from "react";
import "../styles/activity.css";
import H2 from "../components/H2";
import GoalCard from "../components/GoalCard";

export default function Activity() {
  const [pendingGoals, setPendingGoals] = useState([]);
  const [recentGoals, setRecentGoals] = useState([]);
  const [suggestedGoals, setSuggestedGoals] = useState([]);
  const [streak, setStreak] = useState(null);

  const API_BASE = "https://moodlight-3gm2.onrender.com"; // backend URL

  useEffect(() => {
    const token = localStorage.getItem("token");

    const today = new Date();
    const todayYear = today.getFullYear();
    const todayMonth = today.getMonth() + 1;
    const todayDay = today.getDate();

    // Fetch pending goals
    fetch(`${API_BASE}/api/goals/pending`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => {
        const todaysGoals = data.filter(goal =>
          goal.dueYear === todayYear &&
          goal.dueMonth === todayMonth &&
          goal.dueDay === todayDay
        );
        setPendingGoals(todaysGoals);
      });

    // Fetch recent goals
    fetch(`${API_BASE}/api/goals/recent`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => {
        const unique = [];
        const seen = new Set();
        for (const g of data) {
          const key = `${g.emoji}-${g.heading}-${g.description}`;
          if (!seen.has(key)) {
            seen.add(key);
            unique.push(g);
          }
        }
        setRecentGoals(unique.slice(0, 3));
      });

    // Fetch suggested goals (randomized)
    fetch(`${API_BASE}/api/activities`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => {
        const shuffled = data.sort(() => 0.5 - Math.random());
        setSuggestedGoals(shuffled.slice(0, 10));
      });

    // Fetch current streak info
    fetch(`${API_BASE}/api/streak`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => setStreak(data.currStreak));
  }, []);

  const markComplete = async (goalId) => {
    const token = localStorage.getItem("token");

    await fetch(`${API_BASE}/api/goals/${goalId}/complete`, {
      method: "PUT",
      headers: { Authorization: `Bearer ${token}` }
    });

    setPendingGoals(pendingGoals.filter(g => g._id !== goalId));

    const res = await fetch(`${API_BASE}/api/streak/update`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` }
    });
    const data = await res.json();
    setStreak(data.currStreak);
  };

  const addGoal = async (goal) => {
    const token = localStorage.getItem("token");
    try {
      const today = new Date();
      const res = await fetch(`${API_BASE}/api/goals`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          emoji: goal.emoji || goal.symbol,
          heading: goal.heading,
          description: goal.description || goal.desc,
          dueYear: today.getFullYear(),
          dueMonth: today.getMonth() + 1,
          dueDay: today.getDate()
        })
      });

      const newGoal = await res.json();

      // Only add if due today
      if (
        newGoal.dueYear === today.getFullYear() &&
        newGoal.dueMonth === today.getMonth() + 1 &&
        newGoal.dueDay === today.getDate()
      ) {
        setPendingGoals((prev) => [...prev, newGoal]);
      }

      // Refresh recent goals
      const recentRes = await fetch(`${API_BASE}/api/goals/recent`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const recentData = await recentRes.json();

      const unique = [];
      const seen = new Set();
      for (const g of recentData) {
        const key = `${g.emoji}-${g.heading}-${g.description}`;
        if (!seen.has(key)) {
          seen.add(key);
          unique.push(g);
        }
      }
      setRecentGoals(unique.slice(0, 3));
    } catch (err) {
      console.error("Error adding goal:", err);
    }
  };

  return (
    <div className="activity-page">
      <H2>Today's Goals</H2>
      {pendingGoals.length === 0 ? (
        <p className="activity-desc">
          No goals scheduled for today. Select some goals below or create fresh ones in the Set Goal page.
        </p>
      ) : (
        <div className="activity-grid">
          {pendingGoals.map((goal) => (
            <GoalCard
              key={goal._id}
              symbol={goal.emoji}
              heading={goal.heading}
              desc={goal.description}
              type="pending"
              onComplete={() => markComplete(goal._id)}
            />
          ))}
        </div>
      )}

      {recentGoals.length > 0 && (
        <>
          <H2>Recent Goals</H2>
          <div className="activity-grid">
            {recentGoals.map((goal) => (
              <GoalCard
                key={goal._id}
                symbol={goal.emoji}
                heading={goal.heading}
                desc={goal.description}
                type="recent"
              />
            ))}
          </div>
        </>
      )}

      <H2>Suggested Goals</H2>
      <div className="activity-grid">
        {suggestedGoals.map((goal, index) => (
          <GoalCard
            key={index}
            symbol={goal.emoji || goal.symbol}
            heading={goal.heading}
            desc={goal.description || goal.desc}
            type="suggested"
            onAdd={() => addGoal(goal)}
          />
        ))}
      </div>
    </div>
  );
}
