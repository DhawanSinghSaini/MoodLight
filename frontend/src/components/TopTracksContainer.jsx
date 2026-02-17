import React, { useEffect, useState } from "react";
import MusicCard from "./MusicCard"; 
import "../styles/topTracksContainer.css";

export default function TopTracksContainer() {
  const token = localStorage.getItem("token");
  const [userTracks, setUserTracks] = useState([]);
  const [currentTrackId, setCurrentTrackId] = useState(null); // ✅ track currently playing

  useEffect(() => {
    const fetchUserTracks = async () => {
      try {
        // Fetch all available tracks
        const res = await fetch("https://moodlight-3gm2.onrender.com/api/soundscape/tracks", {
          headers: { Authorization: `Bearer ${token}` }
        });
        const allTracks = await res.json();

        // Fetch user listens
        const listensRes = await fetch("https://moodlight-3gm2.onrender.com/api/soundscape/user/listens", {
          headers: { Authorization: `Bearer ${token}` }
        });
        const listensData = await listensRes.json();

        // Merge listen counts into tracks
        const tracksWithCounts = allTracks.map(track => {
          const listenEntry = listensData.tracks?.find(
            t => t.trackId._id === track._id
          );
          return {
            ...track,
            count: listenEntry ? listenEntry.count : 0
          };
        });

        // Sort by count and take top 5
        let topTracks = tracksWithCounts
          .sort((a, b) => b.count - a.count)
          .slice(0, 5);

        // If fewer than 5, fill with random tracks
        if (topTracks.length < 5) {
          const shuffled = [...allTracks].sort(() => 0.5 - Math.random());
          const fillers = shuffled
            .filter(t => !topTracks.find(tt => tt._id === t._id))
            .slice(0, 5 - topTracks.length)
            .map(t => ({ ...t, count: 0 }));
          topTracks = [...topTracks, ...fillers];
        }

        setUserTracks(topTracks);
      } catch (err) {
        console.error("Error fetching user tracks:", err);
      }
    };

    fetchUserTracks();
  }, [token]);

  // ✅ Cleanup when navigating away
  useEffect(() => {
    return () => {
      setCurrentTrackId(null);
    };
  }, []);

  return (
    <div className="top-tracks-container">
      <h2 className="top-tracks-heading">Top 5 Tracks</h2>
      <div className="tracks-list">
        {userTracks.length > 0 ? (
          userTracks.map(track => (
            <MusicCard 
              key={track._id}
              title={track.title}
              artist={track.artist}
              cover={track.cover || null}
              listens={track.count}
              url={track.url}              // ✅ pass audio URL
              trackId={track._id}          // ✅ unique ID
              currentTrackId={currentTrackId}
              setCurrentTrackId={setCurrentTrackId}
            />
          ))
        ) : (
          <p className="no-tracks">No tracks available yet.</p>
        )}
      </div>
    </div>
  );
}
