import Image from "next/image";

/**
 * Simple image grid (contract §22). Renders nothing for an empty gallery -
 * none of the seeded trips/destinations have real photos yet (TODO_ASSET),
 * so this is exercised structurally but not visually until real images
 * are supplied.
 */
export function ImageGallery({
  images,
  label,
}: {
  images: string[];
  label: string;
}) {
  if (images.length === 0) return null;

  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
      {images.map((src, index) => (
        <Image
          key={src}
          src={src}
          alt={`Photo ${index + 1} - ${label}`}
          width={400}
          height={300}
          className="aspect-[4/3] rounded-xl object-cover"
        />
      ))}
    </div>
  );
}
