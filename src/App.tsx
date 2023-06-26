import "./App.css";
import { useState, useEffect, createContext } from "react";
import SearchResults from "./components/SearchResults";
import { SpotifyTrack } from "./types/SpotifyAPITypes";

export const TrackContext = createContext<SpotifyTrack[] | null>(null);

function App() {
  const CLIENT_ID = import.meta.env.VITE_SPOTIFY_CID;
  const CLIENT_SECRET = import.meta.env.VITE_CLIENT_SECRET;
  const REDIRECT_URI = import.meta.env.VITE_REACT_APP_SPOTIFY_REDIRECT_URI;
  const AUTH_ENDPOINT = import.meta.env.VITE_REACT_APP_SPOTIFY_AUTH_ENDPOINT;
  const RESPONSE_TYPE = import.meta.env.VITE_REACT_APP_SPOTIFY_RESPONSE_TYPE;

  const [token, setToken] = useState("");
  const [query, setQuery] = useState("");
  const [tracks, setTracks] = useState<SpotifyTrack[] | null>(null);
  const [error, setError] = useState({});

  useEffect(() => {
    let authParameters = {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body:
        "grant_type=client_credentials&client_id=" +
        CLIENT_ID +
        "&client_secret=" +
        CLIENT_SECRET,
    };

    fetch("https://accounts.spotify.com/api/token", authParameters)
      .then((res) => res.json())
      .then((data) => setToken(data.access_token))
      .catch((err) => setError(err));
  }, []);

  const songSearchHandler = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    let trackParameters = {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
    };
    if (query.length >= 1) {
      fetch(
        `https://api.spotify.com/v1/search?q=${query}&type=track`,
        trackParameters
      )
        .then((res) => res.json())
        .then((data) => setTracks(data.tracks.items));
    }
  };
  return (
    <TrackContext.Provider value={tracks}>
      <div>
        Spotify Project
        <form onSubmit={songSearchHandler}>
          <input
            type="text"
            value={query}
            placeholder="Search for a song"
            onChange={(e) => setQuery(e.target.value)}
          />
          <button>Track Search</button>
        </form>
        <SearchResults />
      </div>
    </TrackContext.Provider>
  );
}

export default App;
