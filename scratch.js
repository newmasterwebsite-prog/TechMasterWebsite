const fs = require('fs');

const mediaUrl = (value) => {
  if (typeof value === "string") return value || undefined;
  if (!value || typeof value !== "object") return undefined;

  const media = value;
  for (const key of ["url", "cloudinaryUrl", "secure_url", "imageUrl", "videoUrl"]) {
    if (typeof media[key] === "string" && media[key]) return media[key];
  }
  return undefined;
};

const normalizeCmsMedia = (value) => {
  if (Array.isArray(value)) return value.map(normalizeCmsMedia);
  if (!value || typeof value !== "object") return value;

  const normalized = {};
  for (const [key, child] of Object.entries(value)) normalized[key] = normalizeCmsMedia(child);

  const resolve = (...keys) => {
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
    if (url) {
      normalized.videoUrl ??= url;
      normalized.video ??= url;
    }
  }

  return normalized;
};

console.log(normalizeCmsMedia({ thumbnail: 'https://foo.com/img.jpg' }));
