import { useState } from "react";

import { SpotifyTrack, UserProfile } from "./types/SpotifyAPITypes";
import SearchBar from "./components/SearchBar";
import SpotifyLogin from "./auth";

import { AuthContext } from "./context/auth-context";
import SearchResults from "./components/SearchResults";
import Playlist from "./components/Playlist";
import Header from "./components/Header";

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
      <div className="justify-center text-white md:min-w-fit h-full md:h-fit p-2 bg-emerald-950">
        <div className="flex justify-between items-center">
          <SearchBar trackResults={handleData} />
          <Header />
          <div className="flex items-center px-10">
            <SpotifyLogin
              authorized={handleAuth}
              userProfile={handleUserProfile}
            />
          </div>
        </div>
        <div className="flex w-full md:flex-row md:justify-center h-full md:max-h-[39rem] overflow-auto my-auto md:w-full bg-gradient-to-b from-zinc-800 to-zinc-950 rounded-md ">
          <div className="w-full">
            <SearchResults />
          </div>
          <div className="w-full">
            <Playlist />
          </div>
        </div>
      </div>
    </AuthContext.Provider>
  );
}

export default App;
