import { useState } from "react";

import { SpotifyTrack, UserProfile } from "./types/SpotifyAPITypes";
import SearchBar from "./components/SearchBar";
import SpotifyLogin from "./auth";

import { AuthContext } from "./context/auth-context";
import SearchResults from "./components/SearchResults";
import Playlist from "./components/Playlist";

function App() {
  let localUserInfo = localStorage.getItem("user-profile");
  let parsedUserInfo = JSON.parse(localUserInfo!);
  let localToken = localStorage.getItem("access-token");

  const [token, setToken] = useState(localToken);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(
    parsedUserInfo
  );
  const [tracks, setTracks] = useState<SpotifyTrack[]>([]);

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
        <Playlist />
      </div>
    </AuthContext.Provider>
  );
}

export default App;
