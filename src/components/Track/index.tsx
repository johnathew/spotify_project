import { TrackTypes } from "../../types/SpotifyAPITypes";

const Track = ({ name, artists, album, id }: TrackTypes) => {
  return (
    <ul
      key={id}
      className="border-2 m-2 w-1/2 h-auto bg-black rounded-lg flex flex-col justify-center items-center "
    >
      <li>{name}</li>
      <li>{artists}</li>
      <li>{album}</li>
    </ul>
  );
};

export default Track;
