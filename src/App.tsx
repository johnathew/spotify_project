import { useState } from "react";
import { SpotifyTrack, UserProfile } from "./types/SpotifyAPITypes";
import SearchBar from "./components/SearchBar";
import SpotifyLogin from "./auth";
import { AuthContext } from "./context/auth-context";
import SearchResults from "./components/SearchResults";
import Playlist from "./components/Playlist";
import Header from "./components/Header";

function App() {
  const localUserInfo = localStorage.getItem("user-profile");
  const parsedUserInfo = JSON.parse(localUserInfo || "{}");
  const localToken = localStorage.getItem("access-token");
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
      <Header />
      <div className="text-white w-full h-screen flex flex-col justify-center bg-blue-700">
        <div className="flex h-[10%] w-auto md:justify-around items-center">
          <SpotifyLogin
            authorized={handleAuth}
            userProfile={handleUserProfile}
          />
        </div>
        {localToken && (
          <div className="flex w-full md:flex-row md:justify-center h-full md:max-h-[39rem] overflow-auto my-auto md:w-full bg-gradient-to-b from-zinc-800 to-zinc-950 rounded-md ">
            <SearchBar trackResults={handleData} />
            <div className="w-full">
              <SearchResults />
            </div>
            <div className="w-full">
              <Playlist />
            </div>
          </div>
        )}
      </div>
    </AuthContext.Provider>
  );
}

export default App;
