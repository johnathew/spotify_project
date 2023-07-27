import { ReactNode, useContext } from "react";

import { AuthContext } from "@/context/auth-context";
import Track from "../Track";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";

const SearchResults = () => {
  const ctx = useContext(AuthContext);

  let content: ReactNode = (
    <TableBody>
    </TableBody>
  );
  if (ctx.trackData.length === 0) {
    content = (
      <TableBody className="text-black">
        <TableRow>
          <TableCell>No results found.</TableCell>
        </TableRow>
      </TableBody>
    );
  }

  if (ctx.trackData.length >= 1) {
    content = ctx.trackData.map((data) => {
      return (
        <Track
          name={data.name}
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
    <>
      <Table className="w-1/2 p-10">
        {ctx.trackData.length >= 1 && <TableCaption>Song list results</TableCaption>}
        <TableHeader>
          <TableRow>
            <TableHead></TableHead>
            <TableHead className="w-1/3">Title</TableHead>
            <TableHead className="w-1/3">Artist</TableHead>
            <TableHead className="text-right">Duration</TableHead>
          </TableRow>
        </TableHeader>
        {content}
      </Table>
    </>
  );
};

export default SearchResults;
