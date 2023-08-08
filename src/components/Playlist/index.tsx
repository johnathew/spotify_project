import { AuthContext } from "@/context/auth-context";
import { ReactNode, useContext, useState } from "react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Item, PlaylistTypes } from "@/types/SpotifyAPITypes";
import Track from "../Track";
import Loading from "../Loading";

const Playlist = () => {
  const ctx = useContext(AuthContext);
  const [playlists, setPlaylists] = useState<PlaylistTypes[]>();
  const [playlistTracks, setPlaylistTracks] = useState<Item[]>();
  const [loading, setLoading] = useState(false);

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
      const playlistData = await response.json();
      setPlaylists(playlistData.items);
    } catch (error) {
      console.log(error);
    }
  };

  const fetchSongsInPlaylist = async (id: string) => {
    setLoading(true);
    try {
      const response = await fetch(
        `https://api.spotify.com/v1/playlists/${id}/tracks`,
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
      const playlistTracks = await response.json();
      setPlaylistTracks(playlistTracks.items);
    } catch (error) {
      console.log(error);
    }
    setLoading(false);
    console.log(id);
  };

  if (ctx.accessToken && playlists === undefined) {
    setTimeout(() => {
      fetchUsersPlaylists();
    }, 200);
  }

  if (!ctx.accessToken && playlists !== undefined) {
    setPlaylists(undefined);
  }

  const content = playlists?.map((item) => {
    return (
      <SelectItem className="text-black text-xs" value={item.id} key={item.id}>
        {item.name}
      </SelectItem>
    );
  });

  let tracks: ReactNode = <TableRow></TableRow>;

  if (playlistTracks?.length === 0) {
    tracks = (
      <TableRow>
        <TableCell>Playlist is empty.</TableCell>
      </TableRow>
    );
  }

  if (loading) {
    tracks = <Loading />;
  }

  // typescript expecting a URI prop...but not needed here. dont know what to do but make it null
  if (playlistTracks?.length !== undefined && !loading) {
    tracks = playlistTracks.map((trk, num) => {
      return (
        <Track
          uri={null}
          name={trk.track.name}
          plus={num + 1}
          onSelect={() => {
            return;
          }}
          artists={trk.track.album.artists[0]?.name}
          album={trk.track.name}
          id={trk.track.id}
          duration_ms={trk.track.duration_ms}
          key={trk.track.id}
          url={trk.track.album.images[1].url}
        />
      );
    });
  }

  return (
    <div className=" h-1/2 md:min-w-0 w-full md:h-full overflow-auto">
      <div className="flex items-center align-middle justify-evenly">
        <h1 className="font-thin text-green-300">User's Playlist Songs</h1>
        <Select onValueChange={(id) => fetchSongsInPlaylist(id)}>
          <SelectTrigger className="md:w-[160px] w-auto text-center text-green-300">
            <SelectValue placeholder="Playlists" />
          </SelectTrigger>
          <SelectContent className="w-full">
            {!content ? "No playlists found." : content}
          </SelectContent>
        </Select>
      </div>
      <Table>
        <TableCaption>Playlist Tracks</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className="w-0">#</TableHead>
            <TableHead className="">Song / Artist</TableHead>
            <TableHead className="text-center">Album</TableHead>
            <TableHead className="text-right">Duration</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>{tracks}</TableBody>
      </Table>
    </div>
  );
};

export default Playlist;
