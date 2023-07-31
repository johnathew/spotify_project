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

  let content: ReactNode = <TableRow></TableRow>;

  if (ctx.trackData.length === 0) {
    content = (
      <TableRow>
        <TableCell></TableCell>
        <TableCell>No results found.</TableCell>
      </TableRow>
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
      <Table className="w-full">
        <TableCaption>Search Results</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className="">Song & Album</TableHead>
            <TableHead className="text-center">Artist</TableHead>
            <TableHead className="text-right">Duration</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody className="text-black">{content}</TableBody>
      </Table>
    </>
  );
};

export default SearchResults;
