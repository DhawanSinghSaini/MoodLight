import React, { useState } from "react";
import "../styles/reflectionCard.css";

export default function ReflectionCard() {
  const [text, setText] = useState("");
  const [status, setStatus] = useState(null);
  const token = localStorage.getItem("token");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!text.trim()) {
      setStatus("⚠️ Please enter a reflection before submitting.");
      return;
    }

    try {
      const res = await fetch("https://moodlight-3gm2.onrender.com/api/reflections", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ text })
      });

      if (!res.ok) {
        const errText = await res.text();
        throw new Error(`Request failed: ${res.status} ${res.statusText} - ${errText}`);
      }

      const data = await res.json();
      console.log("Reflection saved:", data);
      setStatus("✅ Reflection submitted successfully!");
      setText("");
    } catch (err) {
      console.error("Error submitting reflection:", err);
      setStatus(`❌ Error: ${err.message}`);
    }
  };

  return (
    <div className="reflection-card">
      <h3 className="card-heading">Daily Reflection</h3>
      <form onSubmit={handleSubmit} className="reflection-form">
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Write your reflection here..."
          rows={5}
          className="reflection-textarea"
        />
        <button type="submit" className="reflection-submit">
          Submit
        </button>
      </form>
      {status && <p className="reflection-status">{status}</p>}
    </div>
  );
}
