import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useEffect, useState } from "react";
import { Label } from "@/components/ui/label";

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

const SpotifyLogin = ({ authorized }: { authorized: (T: string) => void }) => {
  const cToken = localStorage.getItem("code-verifier") || "";
  const aToken = localStorage.getItem("access-token") || "";

  const [token, setToken] = useState<string | null>(cToken);
  const [accessToken, setAccessToken] = useState<string | null>(aToken);
  const [userData, setUserData] = useState<any | null>({});
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<any | null>(null);

  const [auth, setAuth] = useState(false);
  useEffect(() => {
    let ignore = false;
    if (token && !accessToken && !ignore) {
      getAccessToken();
    } else {
      return;
    }

    return () => {
      ignore = true;
    };
  }, [token, accessToken]);

  useEffect(() => {
    if (token && accessToken && !auth) {
      getProfile(accessToken);
      authorized(accessToken);
    }
  }, [token, accessToken, auth]);

  let codeVerifier = generateRandomString(128);

  const loginHandler = () => {
    const win: Window = window;
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
    setToken(() => localStorage.getItem("code-verifier"));
  };

  const getAccessToken = () => {
    const urlParams = new URLSearchParams(window.location.search);
    let code = urlParams.get("code");
    let codeVerifier: string | null = localStorage.getItem("code-verifier");

    let body = new URLSearchParams({
      grant_type: "authorization_code",
      code: code!,
      redirect_uri: redirectUri,
      client_id: clientId,
      code_verifier: codeVerifier!,
    });

    fetch("https://accounts.spotify.com/api/token", {
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
        setAccessToken(() => localStorage.getItem("access-token"));
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

      const data = await response.json();
      setAuth(true);
      setUserData(data);
    } catch (error) {
      setError(error);
    }
    setIsLoading(false);
  };

  const clearCache = () => {
    window.localStorage.clear();
    console.log("cache clear");
  };

  const logoutHandler = () => {
    window.localStorage.clear();
    setAuth(false);
    setAccessToken("");
    setToken("");
    setUserData(null);
    
  };
  return (
    <>
      {!auth && (
        <>
          <Button onClick={loginHandler}>Login</Button>{" "}
          <Button onClick={clearCache}> Clear cache</Button>
        </>
      )}
      {auth && (
        <>
          <Button onClick={logoutHandler}>Logout</Button>{" "}
          {isLoading && <Skeleton className="w-[100px] h-[20px]" />}
          {!isLoading && !error && (
            <div className="bg-green-700 p-3 rounded-sm shadow-md">
              <div className="flex gap-2 items-center">
                <Avatar>
                  <AvatarImage src={userData.images[0].url} />
                  <AvatarFallback>{userData.display_name}</AvatarFallback>
                </Avatar>
                <div className="flex flex-col gap-y-2">
                  <Label>
                    <span className="font-light">Username: </span>
                    {userData.display_name}
                  </Label>
                  <Label>
                    <span className="font-light">Email: </span>
                    {userData.email}
                  </Label>
                  <Label>
                    <span className="font-light">Followers: </span>{" "}
                    {userData.followers.total}
                  </Label>
                </div>
              </div>
            </div>
          )}
          {!isLoading && error && <p>{error}</p>}
        </>
      )}
    </>
  );
};

export default SpotifyLogin;
