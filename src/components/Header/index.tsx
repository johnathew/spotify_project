import spotifyLogo from "../../assets/Spotify.svg"
import {AiFillGithub} from "react-icons/ai"

const Header = () => {
  return (
    <header className="text-yellow-300 p-2 w-full h-auto flex justify-between items-center sticky top-0 bg-blue-700 border-b-[1px] border-solid border-gray-400">
      <div className="flex space-x-2 items-center">
      <h1 className="text-sm font-thin">John's Spotify Playlist Project</h1>
      <AiFillGithub className="text-xl"/>
      </div>
      <div className=" w-auto">
      <img src={spotifyLogo} alt="Spotify logo" className="w-auto h-10"/>
      </div>  
    </header>
  );
};

export default Header;
