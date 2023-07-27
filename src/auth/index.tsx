import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useEffect, useState } from "react";
import { Label } from "@/components/ui/label";
import { UserProfile } from "@/types/SpotifyAPITypes";

const clientId = import.meta.env.VITE_SPOTIFY_CID;
const redirectUri = import.meta.env.VITE_REDIRECT_URI;

function generateRandomString(length: number) {
  let text = "";
  let possible =
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
  let localUserProfile = localStorage.getItem("user-profile");
  let parsedUserData = JSON.parse(localUserProfile!);

  const [date, setDate] = useState(new Date().getMinutes());

  const [userData, setUserData] = useState<UserProfile | null>(
    parsedUserData || null
  );

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<any | null>(null);

  let codeVerifier = generateRandomString(128);

  const loginHandler = () => {
    const win: Window = window;
    window.localStorage.clear();
    setError(null);

    generateCodeChallenge(codeVerifier).then((codeChallenge) => {
      let state = generateRandomString(16);
      let scope = "user-read-private user-read-email";

      localStorage.setItem("code-verifier", codeVerifier);

      let args = new URLSearchParams({
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
    let code = urlParams.get("code");
    let codeVerifier = localStorage.getItem("code-verifier");

    let body = new URLSearchParams({
      grant_type: "authorization_code",
      code: code!,
      redirect_uri: redirectUri,
      client_id: clientId,
      code_verifier: codeVerifier!,
    });

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
    let body = new URLSearchParams({
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
    let time = now.getMinutes() + 60;
    localStorage.setItem("expires_in", JSON.stringify(time));
  };

  useEffect(() => {
    let localCodeToken = localStorage.getItem("code-verifier");
    let refresh = localStorage.getItem("refresh-token");
    let expiration = localStorage.getItem("expires_in");

    const timer = setInterval(() => setDate(new Date().getMinutes()), 1000);

    if (userData) {
      if (+expiration! - date! <= 5) {
        getRefreshToken(refresh!);
      }
    }
    if (!userData && localCodeToken) {
      getAccessToken();
    }

    return () => {
      clearInterval(timer);
    };
  }, [userData]);

  console.log(date);
  const logoutHandler = () => {
    window.localStorage.clear();

    setUserData(null);
    authorized("");
  };

  return (
    <>
      {!userData && (
        <>
          <Button onClick={loginHandler}>Login</Button>
        </>
      )}
      {!userData && isLoading && <Skeleton className="w-[200px] h-[100px]" />}
      {userData && (
        <>
          <Button onClick={logoutHandler}>Logout</Button>
          {!isLoading && !error && (
            <div className="bg-green-700 p-3 rounded-sm shadow-md">
              <div className="flex gap-2 items-center">
                <Avatar>
                  <AvatarImage src={userData?.images[0].url} />
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
                </div>
              </div>
            </div>
          )}
        </>
      )}
      {!isLoading && error && <p>{error}</p>}
    </>
  );
};

export default SpotifyLogin;
