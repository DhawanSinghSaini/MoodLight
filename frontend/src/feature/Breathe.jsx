import React, { useState, useEffect, useRef } from "react";
import "../styles/breathe.css";
import H2 from "../components/H2";
import NavButton from "../components/NavButton";

export default function Breathe() {
  const [selectedDuration, setSelectedDuration] = useState(null);
  const [selectedSound, setSelectedSound] = useState("No Sound");
  const [isRunning, setIsRunning] = useState(false);
  const [phase, setPhase] = useState("inhale"); // inhale/exhale
  const [feedback, setFeedback] = useState(null); // "up" or "down"
  const [audioFiles, setAudioFiles] = useState({});
  const audioRef = useRef(null);
  const timerRef = useRef(null);

  // ✅ Check token immediately and fetch audio files
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      window.location.href = "/login"; // redirect if no token
      return;
    }

    fetch("https://moodlight-3gm2.onrender.com/api/timeraudio", {
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
        if (data && Array.isArray(data)) {
          const mapping = {};
          data.forEach((a) => {
            mapping[a.name] = a.url;
          });
          setAudioFiles(mapping);
        }
      })
      .catch((err) => console.error("Error fetching audio links:", err));
  }, []);

  // ✅ Helper to update streak
  const updateStreak = () => {
    fetch("https://moodlight-3gm2.onrender.com/api/streak/update", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
        "Content-Type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((data) => console.log("Streak updated:", data))
      .catch((err) => console.error("Error updating streak:", err));
  };

  const handleDurationClick = (duration) => setSelectedDuration(duration);
  const handleSoundClick = (sound) => setSelectedSound(sound);

  const handleStart = () => {
    if (!selectedDuration) return;
    setIsRunning(true);

    if (selectedSound && selectedSound !== "No Sound" && audioFiles[selectedSound]) {
      audioRef.current = new Audio(audioFiles[selectedSound]);
      audioRef.current.loop = true;
      audioRef.current.play();
    }

    const totalMinutes = parseInt(selectedDuration);
    const totalMs = totalMinutes * 60 * 1000;
    const startTime = Date.now();

    timerRef.current = setInterval(() => {
      setPhase((prev) => (prev === "inhale" ? "exhale" : "inhale"));

      if (Date.now() - startTime >= totalMs) {
        clearInterval(timerRef.current);
        setIsRunning(false);

        if (audioRef.current) {
          audioRef.current.pause();
          audioRef.current = null;
        }

        // ✅ Update streak only when breathing session finishes
        updateStreak();
      }
    }, 12000); // 12s inhale/exhale cycle
  };

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      if (audioRef.current) audioRef.current.pause();
    };
  }, []);

  const handleFeedback = (choice) => {
    setFeedback(choice);
    console.log("User feedback:", choice);
  };

  return (
    <div className="breathe-page">
      <H2>Breathe & Relax</H2>
      <p className="breathe-desc">Choose a duration and a soundscape to begin your relaxation.</p>

      {!isRunning && (
        <>
          <div className="duration-buttons">
            {["5", "10", "15", "20"].map((d) => (
              <button
                key={d}
                className={`duration-btn ${selectedDuration === d ? "active" : ""}`}
                onClick={() => handleDurationClick(d)}
              >
                {d} min
              </button>
            ))}
          </div>

          <div className="sound-buttons">
            {["No Sound", ...Object.keys(audioFiles)].map((s) => (
              <button
                key={s}
                className={`sound-btn ${selectedSound === s ? "active" : ""}`}
                onClick={() => handleSoundClick(s)}
              >
                {s}
              </button>
            ))}
          </div>

          <div className="start-btn-wrapper" onClick={handleStart}>
            <NavButton text="Start" />
          </div>
        </>
      )}

      {isRunning && (
        <>
          <div className={`breathing-circle ${phase}`}>
            <span>{phase === "inhale" ? "Inhale" : "Exhale"}</span>
          </div>
        </>
      )}
    </div>
  );
}
