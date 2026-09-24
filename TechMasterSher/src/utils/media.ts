/** Resolve either a legacy string URL or a Media document returned by the API. */
export const mediaUrl = (value: unknown): string | undefined => {
  if (typeof value === "string") return value || undefined;
  if (!value || typeof value !== "object") return undefined;

  const media = value as Record<string, unknown>;
  for (const key of ["url", "cloudinaryUrl", "secure_url", "imageUrl", "videoUrl"]) {
    if (typeof media[key] === "string" && media[key]) return media[key] as string;
  }
  return undefined;
};

/**
 * Makes all CMS media aliases usable by the public site while retaining the
 * original content shape. This supports existing CMSData records and typed
 * Mongo media subdocuments alike.
 */
export const normalizeCmsMedia = (value: any): any => {
  if (Array.isArray(value)) return value.map(normalizeCmsMedia);
  if (!value || typeof value !== "object") return value;

  const normalized: Record<string, any> = {};
  for (const [key, child] of Object.entries(value)) normalized[key] = normalizeCmsMedia(child);

  const resolve = (...keys: string[]) => {
    for (const key of keys) {
      const url = mediaUrl(normalized[key]);
      if (url) return url;
    }
    return undefined;
  };

  const image = resolve("imageUrl", "image", "coverImage", "bannerImage", "thumbnailUrl", "thumbnail", "thumbnailFile");
  const video = resolve("videoUrl", "video");
  const mediaFile = mediaUrl(normalized.mediaFile);
  const isVideoFile = normalized.mediaFile?.mediaType === "video" || normalized.mediaType === "video" || normalized.type === "Video";

  if (image) {
    normalized.imageUrl ??= image;
    normalized.image ??= image;
    normalized.coverImage ??= image;
    normalized.bannerImage ??= image;
  }
  if (video || (mediaFile && isVideoFile)) {
    const url = video || mediaFile;
    normalized.videoUrl ??= url;
    normalized.video ??= url;
  }
  if (mediaFile) {
    normalized.mediaFile = mediaFile;
    if (!isVideoFile) normalized.imageUrl ??= mediaFile;
  }

  const thumbnail = resolve("thumbnailUrl", "thumbnail", "thumbnailFile", "imageUrl", "image", "coverImage");
  if (thumbnail) {
    normalized.thumbnailUrl ??= thumbnail;
    normalized.thumbnail ??= thumbnail;
  }
  return normalized;
};
