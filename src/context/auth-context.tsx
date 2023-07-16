import { SpotifyTrack } from "@/types/SpotifyAPITypes";
import React from "react";

type AuthContextType = {
  accessToken: string;
  trackData: SpotifyTrack[];
};

export const AuthContext = React.createContext<AuthContextType>({
  accessToken: "",
  trackData: [],
});
