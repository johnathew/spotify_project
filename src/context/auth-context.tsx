import { SpotifyTrack, UserProfile } from "@/types/SpotifyAPITypes";
import React from "react";

type AuthContextType = {
  accessToken: string | null;
  trackData: SpotifyTrack[];
  userData: UserProfile | null
};

export const AuthContext = React.createContext<AuthContextType>({
  accessToken: "",
  trackData: [],
  userData: null
});
