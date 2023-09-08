import spotifyLogo from "../../assets/Spotify.svg"
import {AiFillGithub} from "react-icons/ai"

const Header = () => {

  const handleClick = () => {
    window.open("https://github.com/johnathew/spotify_project");
  };

  return (
    <header className="text-white p-2 w-full h-auto flex justify-between items-center sticky top-0 z-10 bg-blue-700 shadow-lg border-gray-400">
      <div className="flex space-x-2 items-center">
      <h1 className="text-sm font-thin">John's Spotify Playlist Project</h1>
      <button onClick={handleClick}><AiFillGithub className="text-xl text-green-500"/></button>
      </div>
      <div className=" w-auto">
    <img src={spotifyLogo} alt="Spotify logo" className="w-auto h-10"/>
      </div>  
    </header>
  );
};

export default Header;
