import { useContext } from "react";
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

const SearchResults = () => {
  const ctx = useContext(AuthContext);
  let content;

  if (ctx.trackData.length === 0) {
    content = (
      <TableRow>
        <TableCell></TableCell>
        <TableCell>No results found.</TableCell>
      </TableRow>
    );
  }

  const selectHandler = (uri: string) => {
    console.log(uri);
  };
  if (ctx.trackData.length >= 1) {
    content = ctx.trackData.map((data) => {
      return (
        <Track
          uri={null}
          name={data.name}
          plus={<AiOutlinePlus />}
          onSelect={() => selectHandler(data.uri)}
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
    <div className="h-1/2 md:min-w-0 w-full ml-0 md:h-full overflow-auto">
      <h1 className="font-thin mt-4 text-center text-green-300">Songs</h1>
      <Table className="">
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
