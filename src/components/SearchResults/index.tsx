import { useContext } from "react";
import { TrackContext } from "../../App";
import Track from "../Track";

const SearchResults = () => {
  const trackList = useContext(TrackContext);
  const trackData = trackList?.map((data) => {
    return (
      <Track
        name={data.name}
        artists={data.album.artists[0].name}
        album={data.album.name}
        id={data.id}
      />
    );
  });

  return <div>{trackData}</div>;
};

export default SearchResults;
