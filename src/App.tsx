import { useState } from "react";

import { SpotifyTrack } from "./types/SpotifyAPITypes";
import SearchBar from "./components/SearchBar";
import SpotifyLogin from "./auth";

import { AuthContext } from "./context/auth-context";
import SearchResults from "./components/SearchResults";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [token, setToken] = useState<string>("");
  const [tracks, setTracks] = useState<SpotifyTrack[]>([]);

  const handleAuth = (accessToken: string) => {
    return setToken(accessToken);
  };

  const handleData = (trackData: any) => {
    return setTracks(trackData);
  };
  return (
    <AuthContext.Provider
      value={{
        accessToken: token,
        trackData: tracks,
        isLoggedIn: isLoggedIn,

      }}
    >
      <div className="bg-wallpaper bg-cover justify-center flex flex-col text-white w-full h-full items-center p-2">
        <h1 className="text-black">Spotify Playlist Project</h1>
        <SpotifyLogin authorized={handleAuth} />
        <SearchBar trackResults={handleData} />
        {tracks.length > 1 && <SearchResults />}
      </div>
    </AuthContext.Provider>
  );
}

export default App;

// useEffect(() => {
//   let authParameters = {
//     method: "POST",
//     headers: {
//       "Content-Type": "application/x-www-form-urlencoded",
//     },
//     body:
//       "grant_type=client_credentials&client_id=" +
//       CLIENT_ID +
//       "&client_secret=" +
//       CLIENT_SECRET,
//   };

//   fetch("https://accounts.spotify.com/api/token", authParameters)
//     .then((res) => res.json())
//     .then((data) => setToken(data.access_token))
//     .catch((err) => setError(err));
// }, []);

// initial setup
