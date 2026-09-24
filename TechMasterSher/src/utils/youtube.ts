export interface YouTubeVideoInfo {
  videoId: string;
  youtubeUrl: string;
  startTime: number;
  endTime?: number;
  title?: string;
  authorName?: string;
  thumbnailUrl?: string;
  views?: string;
}

export function extractYouTubeId(url: string): string {
  if (!url) return "";
  if (url.length === 11 && !url.includes("/") && !url.includes(".")) return url;
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
  const match = url.match(regExp);
  return match && match[2].length === 11 ? match[2] : "";
}

export function parseTimeToSeconds(timeInput?: string | number): number {
  if (typeof timeInput === "number") return timeInput;
  if (!timeInput) return 0;
  const str = timeInput.toString().trim();
  if (!str) return 0;
  const parts = str.split(":").map((p) => parseInt(p, 10));
  if (parts.some(isNaN)) return 0;
  if (parts.length === 3) return parts[0] * 3600 + parts[1] * 60 + parts[2];
  if (parts.length === 2) return parts[0] * 60 + parts[1];
  return Number(str) || 0;
}

export function getYouTubeThumbnail(videoId: string): string {
  if (!videoId) return "";
  return `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
}

const videoMetadataCache: Record<string, { title: string; authorName: string }> = {};

export async function fetchYouTubeMetadata(videoId: string): Promise<{ title: string; authorName: string }> {
  if (!videoId) return { title: "Featured Video", authorName: "TechMaster" };
  if (videoMetadataCache[videoId]) return videoMetadataCache[videoId];

  try {
    const res = await fetch(`https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${videoId}&format=json`);
    if (res.ok) {
      const data = await res.json();
      const meta = {
        title: data.title || "Featured Video",
        authorName: data.author_name || "TechMaster",
      };
      videoMetadataCache[videoId] = meta;
      return meta;
    }
  } catch (e) {
    // Failover
  }

  return { title: "Featured Video", authorName: "TechMaster" };
}
