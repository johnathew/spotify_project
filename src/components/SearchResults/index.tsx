import { useContext, useState } from "react";
import { AuthContext } from "@/context/auth-context";
import Track from "../Track";
import { AiOutlinePlus } from "react-icons/ai";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";

const SearchResults = ({ snapshotId }: { snapshotId: (T: string) => void }) => {
  const ctx = useContext(AuthContext);

  let content;
  console.log(ctx.trackData);

  if (ctx.trackData.length === 0) {
    content = (
      <TableRow>
        <TableCell></TableCell>
        <TableCell>No results found.</TableCell>
      </TableRow>
    );
  }

  async function addTrackToPlaylist(uri: string) {
    const url = `https://api.spotify.com/v1/playlists/${ctx.playlistID}/tracks?uris=${uri}`;
    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          Authorization: "Bearer " + ctx.accessToken,
          "Content-Type": "application/json",
        },
      });
      const data = await response.json();
      snapshotId(data.snapshot_id);
    } catch (error) {
      console.log(error);
    }
  }

  if (ctx.trackData.length >= 1) {
    content = ctx.trackData.map((data) => {
      return (
        <Track
          uri={null}
          name={data.name}
          plus={<AiOutlinePlus />}
          onSelect={() => addTrackToPlaylist(data.uri)}
          artists={data.album.artists[0].name}
          album={data.album.name}
          id={data.id}
          duration_ms={data.duration_ms}
          key={data.id}
          url={data.album.images[1].url}
        />
      );
    });
  }

  return (
    <div className="h-1/2 md:w-1/2 w-full ml-0 md:h-full overflow-auto md:border-r-[1px] border-b-[1px] border-green-500">
      <h1 className="font-thin p-2 bg-zinc-800 text-center text-green-300 sticky top-0 border-y-[0.5px] z-10">
        Search Results
      </h1>
      <Table>
        <TableCaption>Search Results</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead></TableHead>
            <TableHead>Song / Artist</TableHead>
            <TableHead className="text-center">Album</TableHead>
            <TableHead className="text-right">Duration</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody className="text-white text-sm">{content}</TableBody>
      </Table>
    </div>
  );
};

export default SearchResults;
