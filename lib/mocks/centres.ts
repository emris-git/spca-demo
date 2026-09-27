// Sample data. Centre names follow SPCA's public centre list; coordinates are approximate,
// and phone numbers and opening hours are placeholders invented for the demo.

export type Hours = [open: number, close: number] | null; // minutes from midnight

export type Centre = {
  id: string;
  name: string;
  area: string;
  lat: number;
  lng: number;
  phone: string;
  /** Sunday-first, like Date#getUTCDay(). */
  hours: [Hours, Hours, Hours, Hours, Hours, Hours, Hours];
};

const H = (open: number, close: number): Hours => [open * 60, close * 60];
const WEEK = [H(10, 15), H(10, 17), H(10, 17), H(10, 17), H(10, 17), H(10, 17), H(10, 16)] as Centre["hours"];
const SMALL = [null, H(10, 16), H(10, 16), H(10, 16), H(10, 16), H(10, 16), H(10, 14)] as Centre["hours"];

export const CENTRES: Centre[] = [
  { id: "auckland", name: "Auckland Centre", area: "Māngere, Auckland", lat: -36.968, lng: 174.797, phone: "09 000 0101", hours: WEEK },
  { id: "hobsonville", name: "Hobsonville Centre", area: "Hobsonville, Auckland", lat: -36.792, lng: 174.659, phone: "09 000 0102", hours: WEEK },
  { id: "waikato", name: "Waikato Centre", area: "Hamilton", lat: -37.787, lng: 175.279, phone: "07 000 0103", hours: WEEK },
  { id: "tauranga", name: "Tauranga Centre", area: "Tauranga", lat: -37.687, lng: 176.165, phone: "07 000 0104", hours: WEEK },
  { id: "rotorua", name: "Rotorua Centre", area: "Rotorua", lat: -38.137, lng: 176.251, phone: "07 000 0105", hours: SMALL },
  { id: "hawkes-bay", name: "Hawke's Bay Centre", area: "Hastings", lat: -39.64, lng: 176.843, phone: "06 000 0106", hours: SMALL },
  { id: "taranaki", name: "Taranaki Centre", area: "New Plymouth", lat: -39.057, lng: 174.075, phone: "06 000 0107", hours: SMALL },
  { id: "manawatu", name: "Manawatū Centre", area: "Palmerston North", lat: -40.356, lng: 175.611, phone: "06 000 0108", hours: SMALL },
  { id: "wellington", name: "Wellington Centre", area: "Newtown, Wellington", lat: -41.31, lng: 174.779, phone: "04 000 0109", hours: WEEK },
  { id: "nelson", name: "Nelson Centre", area: "Nelson", lat: -41.271, lng: 173.284, phone: "03 000 0110", hours: SMALL },
  { id: "christchurch", name: "Christchurch Centre", area: "Christchurch", lat: -43.532, lng: 172.637, phone: "03 000 0111", hours: WEEK },
  { id: "dunedin", name: "Dunedin Centre", area: "Dunedin", lat: -45.874, lng: 170.503, phone: "03 000 0112", hours: SMALL },
  { id: "southland", name: "Southland Centre", area: "Invercargill", lat: -46.413, lng: 168.353, phone: "03 000 0113", hours: SMALL },
];

export type AfterHoursVet = { id: string; name: string; area: string; lat: number; lng: number; phone: string };

// Invented clinics — there is no real after-hours vet data in the demo.
export const AFTER_HOURS_VETS: AfterHoursVet[] = [
  { id: "vet-akl", name: "Harbour After Hours Vets (sample)", area: "Auckland", lat: -36.87, lng: 174.76, phone: "09 000 0901" },
  { id: "vet-ham", name: "Waikato Emergency Pet Clinic (sample)", area: "Hamilton", lat: -37.79, lng: 175.28, phone: "07 000 0902" },
  { id: "vet-bop", name: "Bay Animal Emergency (sample)", area: "Tauranga", lat: -37.69, lng: 176.16, phone: "07 000 0903" },
  { id: "vet-pn", name: "Central Districts Night Vet (sample)", area: "Palmerston North", lat: -40.35, lng: 175.61, phone: "06 000 0904" },
  { id: "vet-wlg", name: "Capital Emergency Vets (sample)", area: "Wellington", lat: -41.29, lng: 174.78, phone: "04 000 0905" },
  { id: "vet-chc", name: "Canterbury Animal ER (sample)", area: "Christchurch", lat: -43.53, lng: 172.62, phone: "03 000 0906" },
  { id: "vet-dud", name: "Otago After Hours Vets (sample)", area: "Dunedin", lat: -45.87, lng: 170.5, phone: "03 000 0907" },
];

export const EMERGENCY = { police: "111", docHotline: "0800 362 468" } as const;
