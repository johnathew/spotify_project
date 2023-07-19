import { useContext } from "react";

import { AuthContext } from "@/context/auth-context";
import Track from "../Track";

const SearchResults = () => {
  const ctx = useContext(AuthContext);


  let content: React.ReactNode = (
    <p className="text-black">Song results go here</p>
  );

  if (ctx.trackData.length === 0) {
    content = <p className="text-black"> No results found.</p>;
  }

  if (ctx.trackData.length >= 1) {
    content = ctx.trackData.map((data) => {
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
  }

  return <>{content}</>;
};

export default SearchResults;
