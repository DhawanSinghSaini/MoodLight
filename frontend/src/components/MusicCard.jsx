import React, { useState, useEffect } from "react";
import "../styles/musiccard.css";

let currentAudio = null;

export default function MusicCard({ cover, title, artist, url, trackId, currentTrackId, setCurrentTrackId }) {
  const [audio, setAudio] = useState(null);

  useEffect(() => {
    // If this card is not the active track, reset its audio state
    if (currentTrackId !== trackId && audio) {
      audio.pause();
      audio.currentTime = 0;
    }
  }, [currentTrackId, trackId, audio]);

  // ✅ Cleanup when navigating away (component unmount)
  useEffect(() => {
    return () => {
      if (audio) {
        audio.pause();
        audio.currentTime = 0;
      }
      if (currentAudio === audio) {
        currentAudio = null;
      }
    };
  }, [audio]);

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

  const handlePlayPause = () => {
    if (currentTrackId === trackId) {
      // Pause if already playing
      audio.pause();
      setCurrentTrackId(null);
    } else {
      // Stop any other track
      if (currentAudio && currentAudio !== audio) {
        currentAudio.pause();
        currentAudio.currentTime = 0;
      }

      // Create audio if not already
      if (!audio) {
        const newAudio = new Audio(url);

        // When track finishes, increment listen count AND update streak
        newAudio.onended = () => {
          setCurrentTrackId(null);

          // ✅ Update listen count
          fetch(`https://moodlight-3gm2.onrender.com/api/soundscape/${trackId}/listen`, {
            method: "POST",
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
              "Content-Type": "application/json",
            },
          })
            .then((res) => res.json())
            .then((data) => console.log("Listen count updated:", data))
            .catch((err) => console.error("Error updating listen count:", err));

          // ✅ Update streak only when track finishes
          updateStreak();
        };

        setAudio(newAudio);
        currentAudio = newAudio;
        newAudio.play();
      } else {
        currentAudio = audio;
        audio.play();
      }

      setCurrentTrackId(trackId);
    }
  };

  return (
    <div className="music-card">
      {/* Cover Art (optional) */}
      {cover ? (
        <img src={cover} alt={`${title} cover`} className="music-cover" />
      ) : (
        <div className="music-cover placeholder">🎵</div>
      )}

      {/* Song Info */}
      <div className="music-info">
        <h3 className="music-title">{title}</h3>
        <p className="music-artist">{artist}</p>
      </div>

      {/* Controls */}
      <div className="music-controls">
        <button className="music-btn" onClick={() => audio && (audio.currentTime = 0)}>⏮</button>
        <button className="music-btn play-btn" onClick={handlePlayPause}>
          {currentTrackId === trackId ? "⏸" : "▶"}
        </button>
        <button className="music-btn" onClick={() => audio && audio.pause()}>⏭</button>
      </div>
    </div>
  );
}
