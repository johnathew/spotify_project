export interface SpotifyTrack {
  album: Album;
  artists: Artist[];
  available_markets: string[];
  disc_number: number;
  duration_ms: number;
  explicit: boolean;
  external_ids: ExternalIDS;
  external_urls: ExternalUrls;
  href: string;
  id: string;
  is_local: boolean;
  name: string;
  popularity: number;
  preview_url: null;
  track_number: number;
  type: string;
  uri: string;
}
[];

export interface Album {
  album_type: string;
  artists: Artist[];
  available_markets: string[];
  external_urls: ExternalUrls;
  href: string;
  id: string;
  images: Image[];
  name: string;
  release_date: Date;
  release_date_precision: string;
  total_tracks: number;
  type: string;
  uri: string;
}

export interface Artist {
  external_urls: ExternalUrls;
  href: string;
  id: string;
  name: string;
  type: string;
  uri: string;
}

export interface Image {
  height: number;
  url: string;
  width: number;
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
  url: string;
};

export interface UserProfile {
  country: string;
  display_name: string;
  email: string;
  explicit_content: {
    filter_enabled: boolean;
    filter_locked: boolean;
  };
  external_urls: { spotify: string };
  followers: { href: string; total: number };
  href: string;
  id: string;
  images: Image[];
  product: string;
  type: string;
  uri: string;
}

export type PlaylistTypes = {
  collaborative: boolean;
  description: string;
  externalUrls: ExternalUrls;
  href: string;
  id: string;
  images: Image[];
  name: string;
  owner: Owner;
  primaryColor: null;
  public: boolean;
  snapshotID: string;
  tracks: Tracks;
  type: string;
  uri: string;
};

export type Owner = {
  displayName: string;
  externalUrls: ExternalUrls;
  href: string;
  type: string;
  uri: string;
};

export type Tracks = {
  href: string;
  total: number;
};

export type PlaylistTrackTypes = {
  href: string;
  limit: number;
  next: string;
  offset: number;
  previous: string;
  total: number;
  items: Item[];
};

export type Item = {
  addedAt: string;
  addedBy: AddedBy;
  isLocal: boolean;
  track: Track;
};

export type AddedBy = {
  externalUrls: ExternalUrls;
  followers?: Followers;
  href: string;
  id: string;
  type: string;
  uri: string;
  name?: string;
};

export type ExternalUrls = {
  spotify: string;
};

export type Followers = {
  href: string;
  total: number;
};

export type Track = {
  album: Album;
  artists: Artist[];
  availableMarkets: string[];
  discNumber: number;
  durationMS: number;
  explicit: boolean;
  externalIDS: ExternalIDS;
  externalUrls: ExternalUrls;
  href: string;
  id: string;
  isPlayable: boolean;
  linkedFrom: LinkedFrom;
  restrictions: Restrictions;
  name: string;
  popularity: number;
  previewURL: string;
  trackNumber: number;
  type: string;
  uri: string;
  isLocal: boolean;
};

export type Copyright = {
  text: string;
  type: string;
};

export type Restrictions = {
  reason: string;
};

export type LinkedFrom = {};
