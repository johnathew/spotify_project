import { TrackTypes } from "../../types/SpotifyAPITypes";
import { TableCell, TableRow } from "@/components/ui/table";

const Track = ({
  name,
  artists,
  album,
  duration_ms,
  url,
  uri,
  onSelect,
  plus,
}: TrackTypes) => {
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
    <TableRow className="md:text-xs shrink">
      <TableCell onClick={() => onSelect!(uri!)}>{plus}</TableCell>
      <TableCell className="flex align-middle items-center text-white">
        <img src={url} className="md:h-14 h-5 w-auto" />
        <div className="flex flex-col w-full ml-2 ">
          {name}
          <div className="font-light">{artists}</div>
        </div>
      </TableCell>
      <TableCell className="text-center w-[144px]">{album}</TableCell>
      <TableCell className="text-right">
        {convertMsToMinutesSeconds(duration_ms)}
      </TableCell>
    </TableRow>
  );
};

export default Track;
