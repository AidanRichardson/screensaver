import { FastAverageColor } from "fast-average-color";
import React, { useEffect, useRef, useState } from "react";

interface SpotifyTrack {
  name: string;
  artists: { name: string }[];
  album: { images: { url: string }[] };
  duration_ms: number;
}

interface SpotifyResponse {
  progress_ms: number;
  item: SpotifyTrack;
  is_playing: boolean;
}

interface SpotifyWidgetProps {
  scale: number;
  colour: string;
  showPlayingDetails: boolean;
}

const SpotifyWidget: React.FC<SpotifyWidgetProps> = ({
  scale,
  colour,
  showPlayingDetails,
}) => {
  const [track, setTrack] = useState<SpotifyTrack | null>(null);
  const [progress, setProgress] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [dominantColour, setDominantColour] = useState<string>(colour);

  const lastUpdateRef = useRef<number>(0);

  async function fetchTrack() {
    try {
      const tokenResp = await fetch("/api/spotifyauth/token");
      const { access_token } = await tokenResp.json();

      if (!access_token) {
        setIsAuthenticated(false);
        return;
      }

      setIsAuthenticated(true);

      const resp = await fetch(
        "https://api.spotify.com/v1/me/player/currently-playing",
        {
          headers: { Authorization: `Bearer ${access_token}` },
        }
      );

      if (resp.status === 204) {
        setTrack(null);
        return;
      }

      const data: SpotifyResponse = await resp.json();
      setTrack(data.item);
      setProgress(data.progress_ms);
      setIsPlaying(data.is_playing);
      lastUpdateRef.current = Date.now();
    } catch (err) {
      console.error(err);
      setIsAuthenticated(false);
    }
  }

  useEffect(() => {
    fetchTrack();
    const poll = setInterval(fetchTrack, 2000);
    return () => clearInterval(poll);
  }, []);

  // Smooth local progress increment
  useEffect(() => {
    if (!isPlaying) return;

    const tick = () => {
      if (track) {
        const now = Date.now();
        const elapsed = now - lastUpdateRef.current;
        lastUpdateRef.current = now;
        setProgress((p) => Math.min(p + elapsed, track.duration_ms));
      }
      requestAnimationFrame(tick);
    };

    const id = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(id);
  }, [track, isPlaying]);

  // Extract dominant colour whenever track changes
  useEffect(() => {
    if (!track) return;
    const fac = new FastAverageColor();
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.src = track.album.images[0].url;

    img.onload = () => {
      const color = fac.getColor(img);
      setDominantColour(color.hex);
    };
  }, [track]);

  if (!isAuthenticated) {
    return (
      <div className="flex items-center justify-center bg-black text-white p-4 rounded-xl shadow-lg h-full">
        <a
          href="/api/spotifyauth/login"
          className="bg-green-500 hover:bg-green-600 px-4 py-2 rounded-lg font-bold text-white"
        >
          Login with Spotify
        </a>
      </div>
    );
  }

  if (!track) {
    return (
      <div className="flex flex-col items-center justify-center text-white p-4 rounded-xl">
        <img src={"https://tham.ink/nowplaying/album.png"} alt="album" />
        <div style={{ color: colour }}>
          <h4 className="font-bold">Nothing Playing...</h4>
        </div>
      </div>
    );
  }

  const progressPercent = track.duration_ms
    ? (progress / track.duration_ms) * 100
    : 0;

  return (
    <div className="flex flex-col items-center justify-center text-white p-4 rounded-xl w-full">
      <img src={track.album.images[0].url} alt="album" className="mb-1" />

      {/* Progress bar with dominant colour */}
      <div className="w-full bg-gray-700 rounded-full h-2 overflow-hidden">
        <div
          className="h-2 rounded-full"
          style={{
            width: `${progressPercent}%`,
            backgroundColor: dominantColour,
          }}
        />
      </div>

      {showPlayingDetails && (
        <div style={{ color: colour }} className="w-full text-center">
          <h4 className="font-bold">{track.name}</h4>
          <p className="text-sm">
            {track.artists.map((a) => a.name).join(", ")}
          </p>
        </div>
      )}
    </div>
  );
};

export default SpotifyWidget;
