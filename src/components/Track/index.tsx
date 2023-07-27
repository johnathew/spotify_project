import { TrackTypes } from "../../types/SpotifyAPITypes";
import { BsPlusCircle } from "react-icons/bs";
import { TableBody, TableCell, TableRow } from "@/components/ui/table";

const Track = ({ name, artists, album, duration_ms, url }: TrackTypes) => {
  function padTo2Digits(num: number) {
    return num.toString().padStart(2, "0");
  }

  function convertMsToMinutesSeconds(milliseconds: number) {
    const minutes = Math.floor(milliseconds / 60000);
    const seconds = Math.round((milliseconds % 60000) / 1000);

    return seconds === 60
      ? `${minutes + 1}:00`
      : `${minutes}:${padTo2Digits(seconds)}`;
  }

  return (
    <TableBody className="text-black">
      <TableRow>
        <TableCell>
          <BsPlusCircle />
        </TableCell>
        <TableCell className="font-medium flex space-x-2 w-full h-auto align-middle items-center">
          <img src={url} className="h-14 w-auto" />
          <div className="flex flex-col space-y-2">
            {name}
            <div className="font-light">{album}</div>
          </div>
        </TableCell>
        <TableCell>{artists}</TableCell>
        <TableCell className="text-right">
          {convertMsToMinutesSeconds(duration_ms)}
        </TableCell>
      </TableRow>
    </TableBody>
  );
};

export default Track;
