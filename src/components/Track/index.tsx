import { TrackTypes } from "../../types/SpotifyAPITypes";
import { BsPlusCircle } from "react-icons/bs";

const Track = ({ name, artists, album, id }: TrackTypes) => {
  return (
    <ul
      key={id}
      className="border-2 w-1/2 space-x-10 h-full bg-black rounded-lg flex justify-between"
    >
      <li>{name}</li>
      <li>{artists}</li>
      <li>{album}</li>
      <button>
        <BsPlusCircle />
      </button>
    </ul>
  );
};

export default Track;
