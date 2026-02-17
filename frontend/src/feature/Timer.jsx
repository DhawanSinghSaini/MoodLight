import React, { useState, useEffect, useRef } from "react";
import "../styles/timer.css";
import H2 from "../components/H2";
import NavButton from "../components/NavButton";

export default function Timer() {
  const [time, setTime] = useState("");
  const [remaining, setRemaining] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  const [selectedSound, setSelectedSound] = useState("No Sound");

  const [audioFiles, setAudioFiles] = useState({});
  const audioRef = useRef(null);

  // ✅ Check token immediately on page load
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      window.location.href = "/login"; // redirect if no token
      return;
    }

    // ✅ Fetch audio links from MongoDB via backend with JWT check
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

  useEffect(() => {
    let interval;
    if (isRunning && !isPaused && remaining > 0) {
      interval = setInterval(() => {
        setRemaining((prev) => prev - 1);
      }, 1000);
    } else if (remaining === 0 && isRunning) {
      setIsRunning(false);
      setIsFinished(true);
      stopAudio();
      console.log("Timer finished!");

      // ✅ Update streak only when timer finishes
      updateStreak();
    }
    return () => clearInterval(interval);
  }, [isRunning, isPaused, remaining]);

  // ✅ Cleanup when navigating away (component unmount)
  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!time) return;

    const [hh, mm] = time.split(":").map(Number);
    const totalSeconds = hh * 3600 + mm * 60;

    setRemaining(totalSeconds);
    setIsRunning(true);
    setIsPaused(false);
    setIsFinished(false);

    if (selectedSound && selectedSound !== "No Sound" && audioFiles[selectedSound]) {
      audioRef.current = new Audio(audioFiles[selectedSound]);
      audioRef.current.loop = true;
      audioRef.current.play();
    }

    console.log("Timer started for:", time, "with sound:", selectedSound);
  };

  // ✅ Pause/Resume audio in sync with timer
  const handlePauseResume = () => {
    setIsPaused((prev) => {
      const newPaused = !prev;
      if (audioRef.current) {
        if (newPaused) {
          audioRef.current.pause();
        } else {
          audioRef.current.play();
        }
      }
      return newPaused;
    });
  };

  const handleStop = () => {
    setIsRunning(false);
    setIsPaused(false);
    setRemaining(0);
    setIsFinished(false);
    stopAudio();
    console.log("Timer stopped");
  };

  const stopAudio = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }
  };

  const formatTime = (secs) => {
    const h = Math.floor(secs / 3600);
    const m = Math.floor((secs % 3600) / 60);
    const s = secs % 60;
    return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
  };

  return (
    <div className="timer-page">
      {!isRunning && !isFinished && (
        <>
          <H2>Timer</H2>
          <p className="timer-desc">Enter the duration in HH:MM format and press Start.</p>
        </>
      )}

      {!isRunning && !isFinished && (
        <>
          <form className="timer-form" onSubmit={handleSubmit}>
            <input
              type="time"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              className="timer-input"
              required
            />
            <div className="start-btn-wrapper">
              <NavButton text="Start" />
            </div>
          </form>

          {/* ✅ Sound options now dynamic */}
          <div className="sound-buttons">
            {["No Sound", "Chimes", "Rain", "Waterfall", "River", "Birds"].map((s) => (
              <button
                key={s}
                className={`sound-btn ${selectedSound === s ? "active" : ""}`}
                onClick={() => setSelectedSound(s)}
              >
                {s}
              </button>
            ))}
          </div>
        </>
      )}

      {isRunning && (
        <>
          <div className="countdown-display">
            <h3>{formatTime(remaining)}</h3>
          </div>

          <div className="control-buttons">
            <button className="control-btn" onClick={handlePauseResume} aria-label="Pause/Resume">
              {isPaused ? (
                <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polygon points="5 3 19 12 5 21 5 3"></polygon>
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="6" y="4" width="4" height="16"></rect>
                  <rect x="14" y="4" width="4" height="16"></rect>
                </svg>
              )}
            </button>

            <button className="control-btn" onClick={handleStop} aria-label="Stop">
              <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="6" y="6" width="12" height="12"></rect>
              </svg>
            </button>
          </div>
        </>
      )}

      {isFinished && (
        <div className="timesup-message">
          ⏰ Times Up!
        </div>
      )}
    </div>
  );
}
