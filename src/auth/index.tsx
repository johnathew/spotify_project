import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useEffect, useState } from "react";
import { Label } from "@/components/ui/label";
import { UserProfile } from "@/types/SpotifyAPITypes";
import { ImSpotify } from "react-icons/im";

const clientId = import.meta.env.VITE_SPOTIFY_CID;
const redirectUri = import.meta.env.VITE_REDIRECT_URI;

const codeVerifier = generateRandomString(128);

function generateRandomString(length: number) {
  let text = "";
  const possible =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

  for (let i = 0; i < length; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
}

async function generateCodeChallenge(codeVerifier: string) {
  function base64encode(string: ArrayBuffer) {
    return btoa(String.fromCharCode.apply(null, [...new Uint8Array(string)]))
      .replace(/\+/g, "-")
      .replace(/\//g, "_")
      .replace(/=+$/, "");
  }

  const encoder = new TextEncoder();
  const data = encoder.encode(codeVerifier);
  const digest = await window.crypto.subtle.digest("SHA-256", data);

  return base64encode(digest);
}

const SpotifyLogin = ({
  authorized,
  userProfile,
}: {
  authorized: (T: string) => void;
  userProfile: (T: UserProfile) => void;
}) => {
  const localUserProfile = localStorage.getItem("user-profile");
  const parsedUserData = JSON.parse(localUserProfile!);

  const [date, setDate] = useState(new Date().getMinutes());

  const [userData, setUserData] = useState<UserProfile | null>(
    parsedUserData || null
  );

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<any | null>(null);

  const loginHandler = () => {
    const win: Window = window;
    window.localStorage.clear();
    setError(null);

    generateCodeChallenge(codeVerifier).then((codeChallenge) => {
      const state = generateRandomString(16);
      const scope = "user-read-private user-read-email";

      localStorage.setItem("code-verifier", codeVerifier);

      const args = new URLSearchParams({
        response_type: "code",
        client_id: clientId,
        scope: scope,
        redirect_uri: redirectUri,
        state: state,
        code_challenge_method: "S256",
        code_challenge: codeChallenge,
      });
      win.location = "https://accounts.spotify.com/authorize?" + args;
    });
  };

  const getAccessToken = async () => {
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get("code");
    const codeVerifier = localStorage.getItem("code-verifier");

    const body = new URLSearchParams({
      grant_type: "authorization_code",
      code: code!,
      redirect_uri: redirectUri,
      client_id: clientId,
      code_verifier: codeVerifier!,
    });

    if (code) {
      await fetch("https://accounts.spotify.com/api/token", {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: body,
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error("HTTP status " + response.status);
          }
          return response.json();
        })
        .then((data) => {
          localStorage.setItem("access-token", data.access_token);
          localStorage.setItem("refresh-token", data.refresh_token);
          calculateTimeInOneHour();
          getProfile(data.access_token);
          authorized(data.access_token);
        })
        .catch((error) => {
          console.error("Error:", error);
        });
    }
  };

  const getProfile = async (accessToken: string | null) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch("https://api.spotify.com/v1/me", {
        headers: {
          Authorization: "Bearer " + accessToken,
        },
      });
      if (!response.ok) {
        throw new Error("Something went wrong.");
      }

      const data: UserProfile = await response.json();

      setUserData(data);
      userProfile(data);
      localStorage.setItem("user-profile", JSON.stringify(data));
    } catch (error) {
      setError(error);
    }

    setIsLoading(false);
  };

  const getRefreshToken = async (refreshToken: string) => {
    const body = new URLSearchParams({
      grant_type: "refresh_token",
      refresh_token: refreshToken!,
      client_id: clientId,
    });

    try {
      const response = await fetch("https://accounts.spotify.com/api/token", {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: body,
      });
      if (!response.ok) {
        throw new Error("Something went wrong.");
      }

      const data = await response.json();

      localStorage.setItem("access-token", data.access_token);
      localStorage.setItem("refresh-token", data.refresh_token);
      calculateTimeInOneHour();
    } catch (error) {
      setError(error);
    }
  };

  const calculateTimeInOneHour = () => {
    const now = new Date();
    const time = now.getMinutes() + 60;
    localStorage.setItem("expires_in", JSON.stringify(time));
  };

  useEffect(() => {
    const localCodeToken = localStorage.getItem("code-verifier");
    const refresh = localStorage.getItem("refresh-token");
    const expiration = localStorage.getItem("expires_in");

    const timer = setInterval(() => setDate(new Date().getMinutes()), 1000);

    if (userData) {
      if (+expiration! - date! <= 5 || +expiration! - date === 62) {
        getRefreshToken(refresh!);
      }
    }
    if (!userData && localCodeToken) {
      setTimeout(() => {
        getAccessToken();
      }, 200);
    }
    return () => {
      clearInterval(timer);
    };
  }, [userData, date]);

  const logoutHandler = () => {
    window.localStorage.clear();
    setUserData(null);
    authorized("");
  };

  const handleClick = () => {
    window.open(
      "https://auth0.com/docs/get-started/authentication-and-authorization-flow/authorization-code-flow-with-proof-key-for-code-exchange-pkce"
    );
  };

  return (
    <>
      {!userData && !isLoading && (
        <div className="flex flex-col h-auto items-center animate-fade-left animate-ease-in align-middle">
          <div className="bg-green-500 border-2 w-3/4 md:w-3/4 h-full flex md:p-10 p-4 shadow-slate-900 shadow-md rounded-xl justify-evenly items-center ">
            <h1 className="font-bold md:text-4xl text-3xl flex justify-start items-center align-middle text-black">
              <ImSpotify className="text-4xl mr-2" />
              Login to Spotify
            </h1>
            <Button onClick={loginHandler} className="h-auto w-auto">
              Login
            </Button>
          </div>
          <ul className="list-disc list-inside text-sm marker:text-green-500 w-3/4 h-full m-5">
            <li className="font-extralight">
              This app uses Spotify's API to search for songs and add them to a
              new or existing playlist.
            </li>
            <li className="font-extralight">
              You will need a Spotify account to use this app. If you don't have
              one you can create one, or login with Facebook.
            </li>
            <li className="font-extralight">
              This app does not store any of your data.
            </li>
            <li className="font-extralight">
              By utilizing{" "}
              <span className="font-bold">
                <button onClick={handleClick} className="hover:underline">
                  PKCE authentication
                </button>
              </span>
              , a user can login to Spotify without having to share their
              username and password with a third party.
            </li>
            <li className="font-extralight">
              This app is not affiliated with Spotify in any official capacity
              and is purely for demonstrational purposes.
            </li>
          </ul>
        </div>
      )}
      {!userData && isLoading && <Skeleton className="w-[200px] h-[100px]" />}
      {userData && (
        <div className="flex m-2 w-full md:w-1/4 h-full md:h-full justify-left shadow-md border-[0.5px] border-black">
          <div className="flex h-auto items-center align-middle bg-green-700 p-2 w-full rounded-sm shadow-sm">
            <Avatar>
              <AvatarImage
                src={userData?.images[0].url}
                className="h-auto w-10"
              />
              <AvatarFallback>{userData?.display_name}</AvatarFallback>
            </Avatar>
            <div className="flex flex-col px-2">
              <Label className="text-xs">
                <span className="font-light ">Username: </span>
                {userData?.display_name}
              </Label>
              <Label className="text-xs">
                <span className="font-light">Email: </span>
                {userData?.email}
              </Label>
              <Label className="text-xs">
                <span className="font-light">Followers: </span>{" "}
                {userData?.followers.total}
              </Label>
            </div>
            <Button
              className="w-1/5 h-auto text-[10px]"
              onClick={logoutHandler}
            >
              Logout
            </Button>
          </div>
        </div>
      )}
      {!isLoading && error && <p>{error.message}</p>}
    </>
  );
};

export default SpotifyLogin;
