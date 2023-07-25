import { TrackTypes } from "../../types/SpotifyAPITypes";
import { BsPlusCircle } from "react-icons/bs";
import { TableBody, TableCell, TableRow } from "@/components/ui/table";

const Track = ({
  name,
  artists,
  album,
  duration_ms,
}: TrackTypes) => {

  function padTo2Digits(num: number) {
    return num.toString().padStart(2, '0');
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
        <TableCell className="font-medium w-1/4">{name}</TableCell>
        <TableCell>{artists}</TableCell>
        <TableCell>{album}</TableCell>
        <TableCell className="text-right">{convertMsToMinutesSeconds(duration_ms)}</TableCell>
      </TableRow>
    </TableBody>
  );
};

export default Track;
