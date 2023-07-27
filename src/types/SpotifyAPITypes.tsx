export interface SpotifyTrack {
  album:             Album;
  artists:           Artist[];
  available_markets: string[];
  disc_number:       number;
  duration_ms:       number;
  explicit:          boolean;
  external_ids:      ExternalIDS;
  external_urls:     ExternalUrls;
  href:              string;
  id:                string;
  is_local:          boolean;
  name:              string;
  popularity:        number;
  preview_url:       null;
  track_number:      number;
  type:              string;
  uri:               string;
}[]

export interface Album {
  album_type:             string;
  artists:                Artist[];
  available_markets:      string[];
  external_urls:          ExternalUrls;
  href:                   string;
  id:                     string;
  images:                 Image[];
  name:                   string;
  release_date:           Date;
  release_date_precision: string;
  total_tracks:           number;
  type:                   string;
  uri:                    string;
}

export interface Artist {
  external_urls: ExternalUrls;
  href:          string;
  id:            string;
  name:          string;
  type:          string;
  uri:           string;
}

export interface ExternalUrls {
  spotify: string;
}

export interface Image {
  height: number;
  url:    string;
  width:  number;
}

export interface ExternalIDS {
  isrc: string;
}

  
export type TrackTypes = {
    name: string;
    artists: string;
    album: string;
    id: string;
    duration_ms: number;
    url: string
}

export interface UserProfile {
  country: string;
  display_name: string;
  email: string;
  explicit_content: {
      filter_enabled: boolean,
      filter_locked: boolean
  },
  external_urls: { spotify: string; };
  followers: { href: string; total: number; };
  href: string;
  id: string;
  images: Image[];
  product: string;
  type: string;
  uri: string;
}

export interface Image {
  url: string;
  height: number;
  width: number;
}