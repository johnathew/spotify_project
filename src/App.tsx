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
  const [playlistID, setPlaylistID] = useState<string>("");
  const [snapshotID, setSnapshotID] = useState<string>("");

  const handleAuth = (accessToken: string) => {
    return setToken(accessToken);
  };

  const handleData = (trackData: SpotifyTrack[]) => {
    return setTracks(trackData);
  };

  const handleUserProfile = (userData: UserProfile) => {
    return setUserProfile(userData);
  };

  const handlePlaylistID = (playlistID: string) => {
    return setPlaylistID(playlistID);
  };
  const handleSnapshotID = (snapshotID: string) => {
    return setSnapshotID(snapshotID);
  }

  return (
    <AuthContext.Provider
      value={{
        accessToken: token,
        trackData: tracks,
        userData: userProfile,
        playlistID: playlistID,
        snapshotID: snapshotID,
      }}
    >
      <Header />
      <div className="text-white w-full h-screen flex flex-col justify-center bg-blue-700 overflow-auto">
        <div className="flex h-[10%] w-auto md:justify-between items-center m-2 align-middle">
          <SpotifyLogin
            authorized={handleAuth}
            userProfile={handleUserProfile}
          />
          {localToken && <SearchBar trackResults={handleData} />}
        </div>
        {localToken && (
          <>
            <div className="flex flex-col my-2 w-full md:flex-row md:justify-center h-full overflow-auto md:w-full bg-gradient-to-b mb-0 items-center from-zinc-800 to-zinc-950 rounded-md ">
              <SearchResults snapshotId={handleSnapshotID} />
              <Playlist playlistID={handlePlaylistID} />
            </div>
          </>
        )}
      </div>
    </AuthContext.Provider>
  );
}

export default App;
