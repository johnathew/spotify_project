import { useState } from "react";

import { SpotifyTrack, UserProfile } from "./types/SpotifyAPITypes";
import SearchBar from "./components/SearchBar";
import SpotifyLogin from "./auth";

import { AuthContext } from "./context/auth-context";
import SearchResults from "./components/SearchResults";

function App() {
  const [token, setToken] = useState(() => {
    let localToken = localStorage.getItem('access-token')
    return localToken
  });

  const [tracks, setTracks] = useState<SpotifyTrack[]>([]);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);

  const handleAuth = (accessToken: string) => {
    return setToken(accessToken);
  };

  const handleData = (trackData: SpotifyTrack[]) => {
    return setTracks(trackData);
  };

  const handleUserProfile = (userData: UserProfile) => {
    return setUserProfile(userData);
  };

  return (
    <AuthContext.Provider
      value={{
        accessToken: token,
        trackData: tracks,
        userData: userProfile,
      }}
    >
      <div className="justify-center flex flex-col text-white w-full h-full items-center p-2">
        <h1 className="text-black">Spotify Playlist Project</h1>
        <SpotifyLogin authorized={handleAuth} userProfile={handleUserProfile} />
        <SearchBar trackResults={handleData} />
        <SearchResults />
      </div>
    </AuthContext.Provider>
  );
}

export default App;
