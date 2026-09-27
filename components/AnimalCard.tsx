import Link from "next/link";
import { ENERGY_LABEL, SPECIES_LABEL, ageLabel } from "@/lib/mocks/animals";
import { LocationService } from "@/lib/services/location";
import type { Listing } from "@/lib/services/adoption";
import { distance } from "@/lib/format";
import { FavouriteButton } from "./FavouriteButton";
import { Icon } from "./Icon";
import { Photo } from "./Photo";

export function AnimalCard({ animal, priority = false, isNew = false }: { animal: Listing; priority?: boolean; isNew?: boolean }) {
  const centre = LocationService.getCentre(animal.centreId);
  return (
    <article className="group relative flex h-full flex-col overflow-hidden rounded-3xl border border-line bg-paper shadow-[0_1px_0_rgba(19,35,58,0.04)] transition-shadow hover:shadow-lg">
      <div className="relative aspect-[4/3] overflow-hidden bg-sand">
        <Photo
          photo={animal.photo}
          sizes="(min-width: 1024px) 360px, (min-width: 640px) 50vw, 100vw"
          priority={priority}
          className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
        />
        <div className="absolute left-3 top-3 flex flex-wrap gap-1.5">
          {animal.longStay ? (
            <span className="rounded-full bg-orange px-2.5 py-1 text-xs font-extrabold text-navy">Long-stay legend</span>
          ) : null}
          {isNew ? <span className="rounded-full bg-paper px-2.5 py-1 text-xs font-extrabold text-navy">New</span> : null}
          {animal.inFoster ? (
            <span className="rounded-full bg-navy/85 px-2.5 py-1 text-xs font-bold text-cream">In foster care</span>
          ) : null}
        </div>
        <div className="absolute right-3 top-3 z-10">
          <FavouriteButton id={animal.id} name={animal.name} />
        </div>
      </div>
      <div className="flex flex-1 flex-col p-4">
        <h3 className="font-serif text-xl font-bold">
          <Link href={`/adopt/${animal.id}`} className="after:absolute after:inset-0 focus-visible:outline-none">
            {animal.name}
          </Link>
        </h3>
        <p className="text-sm text-muted">
          {SPECIES_LABEL[animal.species]} · {animal.breed} · {ageLabel(animal.ageMonths)}
        </p>
        <p className="mt-2 line-clamp-2 text-[15px] text-ink">{animal.headline}</p>
        <div className="mt-auto flex flex-wrap items-center gap-x-3 gap-y-1 pt-3 text-sm text-muted">
          <span className="inline-flex items-center gap-1">
            <Icon name="pin" className="size-4 text-blue" />
            {centre?.name.replace(" Centre", "")}
            {animal.km !== null ? ` · ${distance(animal.km)}` : ""}
          </span>
          <span className="inline-flex items-center gap-1">
            <Icon name="bolt" className="size-4 text-blue" />
            {ENERGY_LABEL[animal.energy]}
          </span>
        </div>
      </div>
    </article>
  );
}
