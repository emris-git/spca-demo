"use client";

import { toggleFavourite, useFavourites } from "@/lib/favourites";
import { Analytics } from "@/lib/services/analytics";
import { Icon } from "./Icon";

export function FavouriteButton({ id, name, variant = "overlay" }: { id: string; name: string; variant?: "overlay" | "bar" }) {
  const saved = useFavourites().includes(id);
  const onClick = () => {
    const nowSaved = toggleFavourite(id);
    Analytics.track(nowSaved ? "favourite_add" : "favourite_remove", { animal_id: id });
  };
  if (variant === "bar") {
    return (
      <button
        type="button"
        onClick={onClick}
        aria-pressed={saved}
        aria-label={saved ? `Remove ${name} from favourites` : `Save ${name} to favourites`}
        className="grid size-12 shrink-0 place-items-center rounded-full border-2 border-line bg-paper text-danger hover:border-danger/50"
      >
        <Icon name="heart" filled={saved} className="size-6" />
      </button>
    );
  }
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={saved}
      aria-label={saved ? `Remove ${name} from favourites` : `Save ${name} to favourites`}
      className="grid size-11 place-items-center rounded-full bg-paper/95 text-danger shadow-md backdrop-blur hover:scale-105"
    >
      <Icon name="heart" filled={saved} className="size-5" />
    </button>
  );
}
