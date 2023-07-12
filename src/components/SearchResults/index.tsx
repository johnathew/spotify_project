import { useContext } from "react";

import { AuthContext } from "@/context/auth-context";
import Track from "../Track";

const SearchResults = () => {

  const ctx = useContext(AuthContext)
  const results = ctx.trackData.map((data) => {
    return (
      <Track
        name={data.name}
        artists={data.album.artists[0].name}
        album={data.album.name}
        id={data.id}
        key={data.id}
      />
    );
  });



  if (ctx.trackData.length >= 1) {
    return <div>{results}</div>;
  }

};

export default SearchResults;
