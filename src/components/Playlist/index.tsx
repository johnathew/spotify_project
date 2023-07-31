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

const Playlist = () => {
  const ctx = useContext(AuthContext);
  const [playlists, setPlaylists] = useState<PlaylistTypes[]>();
  const [playlistTracks, setPlaylistTracks] = useState<Item[]>();

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
      console.log(playlistTracks.items);
    } catch (error) {
      console.log(error);
    }
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

  if (playlistTracks?.length !== undefined) {
    tracks = playlistTracks.map((trk) => {
      return (
        <Track
          name={trk.track.name}
          artists={trk.track.album.artists[0].name}
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
    <div className="flex flex-col w-full">
      <div className="flex items-center align-middle justify-between px-2">
        <h1 className="text-black font-bold underline underline-offset-8">User's Playlist Songs</h1>
      <Select onValueChange={(id) => fetchSongsInPlaylist(id)}>
        <SelectTrigger className="w-[180px] text-black">
          <SelectValue className="text-black" placeholder="Playlists" />
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
            <TableHead className="w-3/4">Song & Album</TableHead>
            <TableHead className="text-center">Artist</TableHead>
            <TableHead className="text-right">Duration</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody className="text-black">{tracks}</TableBody>
      </Table>
    </div>
  );
};

export default Playlist;
