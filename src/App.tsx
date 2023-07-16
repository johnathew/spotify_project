import { useState } from "react";

import { SpotifyTrack } from "./types/SpotifyAPITypes";
import SearchBar from "./components/SearchBar";
import SpotifyLogin from "./auth";

import { AuthContext } from "./context/auth-context";
import SearchResults from "./components/SearchResults";

function App() {
  const [token, setToken] = useState<string>("");
  const [tracks, setTracks] = useState<SpotifyTrack[]>([]);

  const handleAuth = (accessToken: string) => {
    return setToken(accessToken);
  };

  const handleData = (trackData: SpotifyTrack[]) => {
    return setTracks(trackData);
  };
  return (
    <AuthContext.Provider
      value={{
        accessToken: token,
        trackData: tracks,
  
      }}
    >
      <div className="justify-center flex flex-col text-white w-full h-full items-center p-2">
        <h1 className="text-black">Spotify Playlist Project</h1>
        <SpotifyLogin authorized={handleAuth} />
        <SearchBar trackResults={handleData} />
        <SearchResults />
      </div>
    </AuthContext.Provider>
  );
}

export default App;

