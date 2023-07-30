import { AuthContext } from "@/context/auth-context";
import { useContext, useState } from "react";
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
import { PlaylistTypes } from "@/types/SpotifyAPITypes";

const Playlist = () => {
  const ctx = useContext(AuthContext);
  const [playlists, setPlaylists] = useState<PlaylistTypes[]>();
  const [playlistTracks, setPlaylistTracks] = useState<any>({});

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
    console.log(id);

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
      console.log(playlistTracks);
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

  return (
    <div className="flex flex-col w-full items-end">
      <Select onValueChange={(id) => fetchSongsInPlaylist(id)}>
        <SelectTrigger className="w-[180px] text-black">
          <SelectValue className="text-black" placeholder="Playlists" />
        </SelectTrigger>
        <SelectContent className="w-full overflow-scroll">
          {!content ? "No playlists found." : content}
        </SelectContent>
      </Select>
      <Table>
        <TableCaption>Playlist Tracks</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className="w-3/4">Song & Album</TableHead>
            <TableHead className="text-center">Artist</TableHead>
            <TableHead className="text-right">Duration</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow className="text-black">
            <TableCell className="font-medium">INV001</TableCell>
            <TableCell>Paid</TableCell>
            <TableCell>Credit Card</TableCell>
            <TableCell className="text-right">$250.00</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </div>
  );
};

export default Playlist;