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

  return (
    <>
      {!userData && !isLoading && (
        <div className="bg-orange-300 w-auto  h-full flex flex-col animate-fade-left animate-ease-in p-10 shadow-slate-900 shadow-md rounded-xl justify-evenly ">
          <h1 className="font-bold text-4xl text-black space-x-2">
            <ImSpotify className="text-4xl" />
            Login to Spotify
          </h1>
          <Button onClick={loginHandler} className="h-auto w-auto">
            Login
          </Button>
        </div>
      )}
      {!userData && isLoading && <Skeleton className="w-[200px] h-[100px]" />}
      {userData && (
        <div className="flex w-auto h-full justify-left shadow-md shadow-black">
          <div className="flex gap-2 items-center align-middle bg-green-700 p-2 w-full rounded-sm shadow-sm">
            <Avatar>
              <AvatarImage
                src={userData?.images[0].url}
                className="h-auto w-10"
              />
              <AvatarFallback>{userData?.display_name}</AvatarFallback>
            </Avatar>
            <div className="flex flex-col gap-y-2">
              <Label>
                <span className="font-light">Username: </span>
                {userData?.display_name}
              </Label>
              <Label>
                <span className="font-light">Email: </span>
                {userData?.email}
              </Label>
              <Label>
                <span className="font-light">Followers: </span>{" "}
                {userData?.followers.total}
              </Label>
              <Button className="w-1/2 h-auto" onClick={logoutHandler}>
                Logout
              </Button>
            </div>
          </div>
        </div>
      )}
      {!isLoading && error && <p>{error.message}</p>}
    </>
  );
};

export default SpotifyLogin;
