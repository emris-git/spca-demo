// A small hand-drawn icon set (24px grid, stroke icons), so no icon library ships to the client.

const PATHS = {
  paw: "M8.5 9.5a1.8 2.3 0 1 0 0-.01M15.5 9.5a1.8 2.3 0 1 0 0-.01M5 13.5a1.6 2 0 1 0 0-.01M19 13.5a1.6 2 0 1 0 0-.01M12 12.5c-2.8 0-5 3-5 5 0 1.8 1.5 2.5 3 2l2-.6 2 .6c1.5.5 3-.2 3-2 0-2-2.2-5-5-5z",
  heart: "M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.6-7 10-7 10z",
  phone: "M5 4h3l2 5-2.5 1.5a11 11 0 0 0 6 6L15 14l5 2v3a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2z",
  pin: "M12 21s-7-6.2-7-11.5a7 7 0 0 1 14 0C19 14.8 12 21 12 21zM12 12.2a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5z",
  clock: "M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18zM12 7v5l3 2",
  calendar: "M5 5h14a1 1 0 0 1 1 1v13a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1zM4 10h16M8 3v4M16 3v4",
  gift: "M4 11h16v9H4zM3 7h18v4H3zM12 7v13M12 7c-1.5-3-5-3.5-5-1.5S10 7 12 7zm0 0c1.5-3 5-3.5 5-1.5S14 7 12 7z",
  alert: "M12 4 2.8 19.5h18.4L12 4zM12 10v4.5M12 17.2v.3",
  search: "M11 18a7 7 0 1 0 0-14 7 7 0 0 0 0 14zM20 20l-4-4",
  sliders: "M4 7h10M18 7h2M4 17h4M12 17h8M16 5v4M10 15v4",
  x: "M6 6l12 12M18 6 6 18",
  "chevron-right": "M9 5l7 7-7 7",
  "chevron-left": "M15 5l-7 7 7 7",
  "chevron-down": "M5 9l7 7 7-7",
  "arrow-right": "M4 12h15M13 6l6 6-6 6",
  check: "M4.5 12.5l5 5L19.5 7",
  menu: "M4 7h16M4 12h16M4 17h16",
  sparkle: "M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8L12 3zM19 16l.7 1.8 1.8.7-1.8.7L19 21l-.7-1.8-1.8-.7 1.8-.7L19 16z",
  locate: "M12 19a7 7 0 1 0 0-14 7 7 0 0 0 0 14zM12 2v3M12 19v3M2 12h3M19 12h3M12 14.5a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5z",
  card: "M3 6h18v12H3zM3 10h18M7 15h4",
  lock: "M6 11h12v9H6zM8.5 11V8a3.5 3.5 0 0 1 7 0v3",
  info: "M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18zM12 11v6M12 7.5v.3",
  users: "M9 11a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7zM2.5 20c.5-3.5 3.2-5.5 6.5-5.5s6 2 6.5 5.5M16 4.5a3.5 3.5 0 0 1 0 6.5M18 14.8c2 .6 3.3 2.4 3.5 5.2",
  home: "M4 11 12 4l8 7v9h-5v-6H9v6H4z",
  hand: "M7 11V6.5a1.5 1.5 0 0 1 3 0V11M10 10V4.5a1.5 1.5 0 0 1 3 0V10M13 10V5.5a1.5 1.5 0 0 1 3 0V12M16 9.5a1.5 1.5 0 0 1 3 0V14c0 4-2.5 7-6.5 7S7 19 5.5 16.5L3.8 13.6a1.5 1.5 0 0 1 2.6-1.5L7 13",
  leaf: "M5 19C5 10 10 5 20 4c0 9-5 15-13 15H5zM5 19l7-7",
  bolt: "M13 2 4 14h7l-1 8 9-12h-7l1-8z",
  star: "M12 3.5l2.6 5.3 5.9.9-4.3 4.1 1 5.8L12 16.9l-5.2 2.7 1-5.8-4.3-4.1 5.9-.9L12 3.5z",
  mail: "M3 6h18v12H3zM3 7l9 6 9-6",
  hourglass: "M6 3h12M6 21h12M7 3c0 5 5 6 5 9s-5 4-5 9M17 3c0 5-5 6-5 9s5 4 5 9",
  settings: "M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM19.4 13a7.6 7.6 0 0 0 0-2l2-1.6-2-3.4-2.4 1a7.4 7.4 0 0 0-1.7-1L15 3.5h-4l-.4 2.5a7.4 7.4 0 0 0-1.7 1l-2.4-1-2 3.4 2 1.6a7.6 7.6 0 0 0 0 2l-2 1.6 2 3.4 2.4-1c.5.4 1.1.8 1.7 1l.4 2.5h4l.4-2.5c.6-.2 1.2-.6 1.7-1l2.4 1 2-3.4-2-1.6z",
  external: "M14 4h6v6M20 4l-9 9M18 14v6H4V6h6",
  bucket: "M4 8h16l-2 12H6L4 8zM4 8c0-2 3.6-4 8-4s8 2 8 4M9 12v4M15 12v4",
  cake: "M4 20h16v-7H4zM4 16c2 1.5 4 1.5 5.3 0 1.3 1.5 4 1.5 5.4 0 1.3 1.5 3.3 1.5 5.3 0M12 13V9M12 6.5c-1-1-.5-2.5 0-3.5.5 1 1 2.5 0 3.5z",
} as const;

export type IconName = keyof typeof PATHS;

export function Icon({
  name,
  className = "size-5",
  filled = false,
  title,
}: {
  name: IconName;
  className?: string;
  filled?: boolean;
  title?: string;
}) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      fill={filled ? "currentColor" : "none"}
      stroke="currentColor"
      strokeWidth={1.9}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden={title ? undefined : true}
      role={title ? "img" : undefined}
    >
      {title ? <title>{title}</title> : null}
      <path d={PATHS[name]} />
    </svg>
  );
}
