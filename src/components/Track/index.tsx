import { TrackTypes } from "../../types/SpotifyAPITypes";
import { TableCell, TableRow } from "@/components/ui/table";

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
    <TableRow>
      <TableCell className="font-medium space-x-2 flex align-middle items-center text-white">
        <img src={url} className="h-14 w-auto" />
        <div className="flex flex-col space-y-2">
          {name}
          <div className="font-light">{artists}</div>
        </div>
      </TableCell>
      <TableCell className="text-center">{album}</TableCell>
      <TableCell className="text-right">
        {convertMsToMinutesSeconds(duration_ms)}
      </TableCell>
    </TableRow>
  );
};

export default Track;
