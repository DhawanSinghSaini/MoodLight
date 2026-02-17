import React, { useState, useEffect } from "react";
import MusicCard from "../components/MusicCard";
import "../styles/soundscape.css";

export default function Soundscape() {
  const [tracks, setTracks] = useState([]);
  const [currentTrackId, setCurrentTrackId] = useState(null); // ✅ track currently playing

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      window.location.href = "/login";
      return;
    }

    fetch("https://moodlight-3gm2.onrender.com/api/soundscape/tracks", {
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
          setTracks(data);
        }
      })
      .catch((err) => console.error("Error fetching tracks:", err));
  }, []);

  // ✅ Cleanup when navigating away (component unmount)
  useEffect(() => {
    return () => {
      // Reset current track so MusicCard stops playback
      setCurrentTrackId(null);
    };
  }, []);

  return (
    <div className="soundscape-page">
      <h1 className="soundscape-heading">Soundscape</h1>

      <div className="soundscape-grid">
        <div className="soundscape-grid">
          {Array.isArray(tracks) &&
            tracks.map((track) => (
              <MusicCard
                key={track._id}
                title={track.title}
                artist={track.artist}
                url={track.url}
                trackId={track._id}
                currentTrackId={currentTrackId}
                setCurrentTrackId={setCurrentTrackId}
              />
            ))}
        </div>
      </div>
    </div>
  );
}
