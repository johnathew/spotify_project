import spotifyLogo from "../../assets/Spotify.svg"
import {AiFillGithub} from "react-icons/ai"

const Header = () => {

  const handleClick = () => {
    window.open("https://github.com/johnathew/spotify_project");
  };

  return (
    <header className="text-white p-2 w-full h-auto flex justify-between items-center border-b-[1px] drop-shadow-lg bg-blue-700 border-gray-400">
      <div className="flex space-x-2 items-center">
      <h1 className="text-sm font-thin">John's Spotify Playlist Project</h1>
      <button onClick={handleClick}><AiFillGithub className="text-xl text-green-500"/></button>
      </div>
      <div className=" w-auto">
    <img src={spotifyLogo} alt="Spotify logo" className="w-auto h-5 md:h-10"/>
      </div>  
    </header>
  );
};

export default Header;
