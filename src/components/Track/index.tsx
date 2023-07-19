import { TrackTypes } from "../../types/SpotifyAPITypes";
import { BsPlusCircle } from "react-icons/bs";

const Track = ({ name, artists, album, id }: TrackTypes) => {
  return (
    <ul
      key={id}
      className="border-2  w-full h-full bg-black rounded-lg flex justify-around space-x-8 items-center"
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
