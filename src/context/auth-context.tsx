import { SpotifyTrack, UserProfile } from "@/types/SpotifyAPITypes";
import React from "react";

type AuthContextType = {
  accessToken: string | null;
  trackData: SpotifyTrack[];
  userData: UserProfile | null;
  playlistID: string;
  snapshotID: string;
};

export const AuthContext = React.createContext<AuthContextType>({
  accessToken: "",
  trackData: [],
  userData: null,
  playlistID: '',
  snapshotID: '',
});
