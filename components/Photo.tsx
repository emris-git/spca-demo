import Image from "next/image";
import { PHOTOS, type PhotoKey } from "@/lib/photos.generated";

type Props = {
  photo: PhotoKey;
  sizes: string;
  className?: string;
  priority?: boolean;
  alt?: string;
};

/** A stock photo that fills its (relatively positioned) parent, with a blurred preview. */
export function Photo({ photo, sizes, className = "object-cover", priority = false, alt }: Props) {
  const meta = PHOTOS[photo];
  return (
    <Image
      src={`/photos/${photo}`}
      alt={alt ?? meta.alt}
      fill
      sizes={sizes}
      loading={priority ? "eager" : "lazy"}
      fetchPriority={priority ? "high" : "auto"}
      placeholder="blur"
      blurDataURL={meta.blur}
      className={className}
    />
  );
}
