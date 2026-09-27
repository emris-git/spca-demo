// Maps next/image requests onto the pre-generated WebP variants in /public/photos.
// `src` is "/photos/<key>", widths match WIDTHS in scripts/build-photos.mjs.
export default function photoLoader({ src, width }: { src: string; width: number }) {
  return `${src}-${width}.webp`;
}
