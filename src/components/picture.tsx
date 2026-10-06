import media from "@/content/media.json";

export type MediaSlug = keyof typeof media;

type PictureProps = {
  slug: MediaSlug;
  alt: string;
  sizes: string;
  priority?: boolean;
  className?: string;
  imgClassName?: string;
  draggable?: boolean;
};

export function mediaSrc(slug: MediaSlug, width?: number, ext: "webp" | "avif" = "webp") {
  const { widths } = media[slug];
  return `/media/${slug}-${width ?? widths[widths.length - 1]}.${ext}`;
}

/**
 * A responsive AVIF/WebP image from public/media. The static export has no
 * image server, so the variants are made ahead of time by `npm run images`.
 */
export function Picture({ slug, alt, sizes, priority, className, imgClassName, draggable }: PictureProps) {
  const { width, height, widths } = media[slug];
  const srcSet = (ext: "webp" | "avif") => widths.map((w) => `${mediaSrc(slug, w, ext)} ${w}w`).join(", ");

  return (
    <picture className={className}>
      <source type="image/avif" srcSet={srcSet("avif")} sizes={sizes} />
      <source type="image/webp" srcSet={srcSet("webp")} sizes={sizes} />
      <img
        src={mediaSrc(slug)}
        width={width}
        height={height}
        alt={alt}
        sizes={sizes}
        loading={priority ? "eager" : "lazy"}
        fetchPriority={priority ? "high" : undefined}
        decoding="async"
        draggable={draggable}
        className={imgClassName}
      />
    </picture>
  );
}
