export type MusicProvider = "YouTube" | "YouTube Music" | "Spotify" | "Apple Music" | "SoundCloud" | "Music Link";

export interface MusicPreview {
  provider: MusicProvider;
  externalUrl: string;
  embedUrl: string | null;
  imageUrl: string | null;
  title: string;
}

function toUrl(value?: string | null) {
  if (!value) return null;
  try {
    return new URL(value);
  } catch {
    return null;
  }
}

function getYouTubeVideoId(url: URL) {
  if (url.hostname === "youtu.be") return url.pathname.split("/").filter(Boolean)[0] || null;
  if (url.pathname === "/watch") return url.searchParams.get("v");
  const parts = url.pathname.split("/").filter(Boolean);
  if (["embed", "shorts", "live"].includes(parts[0])) return parts[1] || null;
  return url.searchParams.get("v");
}

function getSpotifyEmbed(url: URL) {
  const parts = url.pathname.split("/").filter(Boolean);
  const supportedTypes = ["album", "artist", "episode", "playlist", "show", "track"];
  const typeIndex = parts.findIndex((part) => supportedTypes.includes(part));
  if (typeIndex < 0 || !parts[typeIndex + 1]) return null;
  return "https://open.spotify.com/embed/" + parts[typeIndex] + "/" + parts[typeIndex + 1];
}

function getAppleMusicEmbed(url: URL) {
  return "https://embed.music.apple.com" + url.pathname + url.search;
}

export function getMusicPreview(value?: string | null, fallbackTitle = "Music preview"): MusicPreview | null {
  const url = toUrl(value);
  if (!url) return null;

  const host = url.hostname.replace(/^www\./, "");
  const lowerHost = host.toLowerCase();

  if (lowerHost === "youtu.be" || lowerHost.endsWith("youtube.com")) {
    const videoId = getYouTubeVideoId(url);
    const isYouTubeMusic = lowerHost.includes("music.youtube.com");
    return {
      provider: isYouTubeMusic ? "YouTube Music" : "YouTube",
      externalUrl: url.toString(),
      embedUrl: videoId ? "https://www.youtube.com/embed/" + videoId + "?rel=0" : null,
      imageUrl: videoId ? "https://img.youtube.com/vi/" + videoId + "/hqdefault.jpg" : null,
      title: fallbackTitle
    };
  }

  if (lowerHost === "open.spotify.com") {
    return {
      provider: "Spotify",
      externalUrl: url.toString(),
      embedUrl: getSpotifyEmbed(url),
      imageUrl: null,
      title: fallbackTitle
    };
  }

  if (lowerHost === "music.apple.com") {
    return {
      provider: "Apple Music",
      externalUrl: url.toString(),
      embedUrl: getAppleMusicEmbed(url),
      imageUrl: null,
      title: fallbackTitle
    };
  }

  if (lowerHost.endsWith("soundcloud.com")) {
    return {
      provider: "SoundCloud",
      externalUrl: url.toString(),
      embedUrl: "https://w.soundcloud.com/player/?visual=true&url=" + encodeURIComponent(url.toString()),
      imageUrl: null,
      title: fallbackTitle
    };
  }

  return {
    provider: "Music Link",
    externalUrl: url.toString(),
    embedUrl: null,
    imageUrl: null,
    title: fallbackTitle
  };
}
