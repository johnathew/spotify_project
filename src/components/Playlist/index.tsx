import { AuthContext } from "@/context/auth-context";
import { useContext } from "react";

const Playlist = () => {
  const ctx = useContext(AuthContext);

  const fetchUsersPlaylists = async () => {
    try {
      const response = await fetch(
        `https://api.spotify.com/v1/users/${ctx.userData?.id}/playlists?limit=30`,
        {
          method: "GET",
          headers: {
            Authorization: "Bearer " + ctx.accessToken,
          },
        }
      );
      if (!response.ok) {
        throw new Error("Something went wrong.");
      }
      const playlists = await response.json();
      console.log(playlists);
    } catch (error) {
      console.log(error);
    }
  };

  const createPlaylistHandler = () => {
    return;
  };

  return (
    <div className="text-black" onClick={fetchUsersPlaylists}>
      Fetch playlists
    </div>
  );
};

export default Playlist;
