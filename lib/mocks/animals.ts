import type { PhotoKey } from "@/lib/photos.generated";

// Invented animals with openly licensed stock photos — none of these are real SPCA animals.

export type Species = "dog" | "cat" | "rabbit" | "small";
export type Size = "small" | "medium" | "large";
export type Energy = "low" | "medium" | "high";
export type Experience = "first-time" | "some" | "experienced";

export type Animal = {
  id: string;
  name: string;
  species: Species;
  breed: string;
  sex: "Female" | "Male" | "Pair";
  ageMonths: number;
  size: Size;
  energy: Energy;
  experience: Experience;
  goodWithChildren: "yes" | "older" | "no";
  goodWithAnimals: boolean;
  animalsNote: string;
  centreId: string;
  inFoster: boolean;
  /** Days in care on the demo's "today" — listing dates are derived from it, so they move with the simulated date. */
  daysInCare: number;
  fee: number;
  photo: PhotoKey;
  headline: string;
  story: string;
  traits: string[];
};

export const ANIMALS: Animal[] = [
  {
    id: "A10231", name: "Tui", species: "dog", breed: "Retriever cross", sex: "Female", ageMonths: 36, size: "medium",
    energy: "high", experience: "some", goodWithChildren: "yes", goodWithAnimals: true, animalsNote: "Loves other dogs; not yet tested with cats.",
    centreId: "wellington", inFoster: false, daysInCare: 12, fee: 350, photo: "dog-tui",
    headline: "Two settings: fetch, and one more fetch.",
    story: "Tui arrived with a tennis ball and has not put it down since. She's a clever, bouncy girl who wants a family that loves the beach, the hills and a game that never quite ends. Give her a job and she'll give you her whole heart.",
    traits: ["Loves water", "Knows sit and drop", "Walks well on a lead"],
  },
  {
    id: "A10244", name: "Moana", species: "dog", breed: "Mastiff cross", sex: "Female", ageMonths: 60, size: "large",
    energy: "medium", experience: "experienced", goodWithChildren: "older", goodWithAnimals: false, animalsNote: "Would like to be your only pet.",
    centreId: "auckland", inFoster: true, daysInCare: 94, fee: 250, photo: "dog-moana",
    headline: "A big softie who takes a minute to trust.",
    story: "Moana is a gentle giant with a cautious start. Once she knows you, she leans her whole weight on your legs and sighs happily. She's looking for a calm, experienced home with no other pets and plenty of patience.",
    traits: ["Loves a slow sniffy walk", "House-trained", "Needs a confident handler"],
  },
  {
    id: "A10257", name: "Pip", species: "dog", breed: "Border collie", sex: "Male", ageMonths: 24, size: "medium",
    energy: "high", experience: "experienced", goodWithChildren: "older", goodWithAnimals: true, animalsNote: "Fine with dogs; will try to herd cats.",
    centreId: "waikato", inFoster: false, daysInCare: 20, fee: 350, photo: "dog-pip",
    headline: "Brains, stamina and opinions about sheep.",
    story: "Pip is a working dog without a job, and he'd like one. Agility, scent work, long runs: he's up for all of it. A quiet flat would bore him silly; an active home with an experienced owner would make him the happiest dog in the Waikato.",
    traits: ["Learns fast", "Needs 2+ hours of exercise", "Great recall"],
  },
  {
    id: "A10262", name: "Kiri", species: "dog", breed: "Beagle cross", sex: "Female", ageMonths: 4, size: "medium",
    energy: "high", experience: "some", goodWithChildren: "yes", goodWithAnimals: true, animalsNote: "Raised with dogs and cats in foster.",
    centreId: "tauranga", inFoster: true, daysInCare: 3, fee: 450, photo: "dog-kiri",
    headline: "Puppy. Nose. Chaos. Joy.",
    story: "Kiri is a busy, curious pup who follows her nose everywhere it goes. She's in a foster home learning her manners and would love a family ready for puppy school, chewed shoelaces and a lot of cuddles.",
    traits: ["Puppy school ready", "Crate training started", "Loves people"],
  },
  {
    id: "A10270", name: "Honey", species: "dog", breed: "Golden retriever cross", sex: "Female", ageMonths: 5, size: "large",
    energy: "medium", experience: "first-time", goodWithChildren: "yes", goodWithAnimals: true, animalsNote: "Gentle with cats and dogs.",
    centreId: "hobsonville", inFoster: false, daysInCare: 6, fee: 450, photo: "dog-honey",
    headline: "Sweet as her name, and still growing.",
    story: "Honey is a mellow pup with a soft mouth and a big heart. She'll grow into a large dog, so she needs room to stretch out and a family who'll keep up her training. Great first dog for a patient household.",
    traits: ["Gentle", "Toilet training well", "Loves a cuddle"],
  },
  {
    id: "A10198", name: "Nana", species: "dog", breed: "Golden retriever", sex: "Female", ageMonths: 120, size: "large",
    energy: "low", experience: "first-time", goodWithChildren: "yes", goodWithAnimals: true, animalsNote: "Happy to share the couch with anyone.",
    centreId: "christchurch", inFoster: true, daysInCare: 121, fee: 150, photo: "dog-nana",
    headline: "Retired. Available for naps and knitting.",
    story: "Nana has done the zoomies; now she's into sunny spots and short strolls. She's calm, kind and asks for very little. Her ideal home has a soft bed, a gentle routine and someone who thinks grey muzzles are beautiful.",
    traits: ["Senior", "Low maintenance", "Fully house-trained"],
  },
  {
    id: "A10205", name: "Bruno", species: "dog", breed: "Labrador cross", sex: "Male", ageMonths: 84, size: "large",
    energy: "low", experience: "first-time", goodWithChildren: "yes", goodWithAnimals: true, animalsNote: "Good with dogs his size.",
    centreId: "manawatu", inFoster: false, daysInCare: 73, fee: 250, photo: "dog-bruno",
    headline: "Professional couch tester, seven years' experience.",
    story: "Bruno is a laid-back gentleman who loves food, pats and more food. He's been waiting a while, and we can't work out why. He'd suit a relaxed family who'll take him for a daily wander and let him supervise the barbecue.",
    traits: ["Long-stay", "Calm", "Food motivated"],
  },
  {
    id: "A10276", name: "Scruff", species: "dog", breed: "Terrier cross", sex: "Male", ageMonths: 96, size: "small",
    energy: "medium", experience: "some", goodWithChildren: "older", goodWithAnimals: false, animalsNote: "Prefers to be the only pet.",
    centreId: "dunedin", inFoster: false, daysInCare: 58, fee: 150, photo: "dog-scruff",
    headline: "Small dog, large personality, excellent eyebrows.",
    story: "Scruff has strong views about the postie and softer views about you. He's loyal, funny and loves a lap. He'd be best as the only pet in an adult or older-children home.",
    traits: ["Loyal", "Lap dog", "Needs a fenced yard"],
  },
  {
    id: "A10281", name: "Sunny", species: "dog", breed: "Labrador cross", sex: "Female", ageMonths: 36, size: "large",
    energy: "high", experience: "some", goodWithChildren: "yes", goodWithAnimals: true, animalsNote: "Plays nicely with dogs; fine with calm cats.",
    centreId: "hawkes-bay", inFoster: false, daysInCare: 9, fee: 350, photo: "dog-sunny",
    headline: "Permanently happy. Slightly damp.",
    story: "Sunny thinks every day is the best day ever. She loves swimming, running and meeting new people. She'd suit an active family who can match her energy and don't mind a muddy paw print or two.",
    traits: ["Loves water", "Friendly with everyone", "Good on walks"],
  },
  {
    id: "A10212", name: "Rangi", species: "dog", breed: "German shepherd", sex: "Male", ageMonths: 72, size: "large",
    energy: "medium", experience: "experienced", goodWithChildren: "older", goodWithAnimals: false, animalsNote: "Needs to be the only pet.",
    centreId: "rotorua", inFoster: false, daysInCare: 88, fee: 250, photo: "dog-rangi",
    headline: "Loyal, clever, and looking for his person.",
    story: "Rangi is a smart, sensitive dog who bonds deeply with one or two people. He knows lots of commands and loves structured training. He needs an experienced shepherd owner and a quiet home.",
    traits: ["Long-stay", "Very trainable", "Needs an experienced home"],
  },
  {
    id: "A10288", name: "Jazz", species: "dog", breed: "Jack Russell cross", sex: "Female", ageMonths: 24, size: "small",
    energy: "high", experience: "some", goodWithChildren: "older", goodWithAnimals: true, animalsNote: "Good with dogs; not suited to homes with small pets.",
    centreId: "nelson", inFoster: false, daysInCare: 15, fee: 350, photo: "dog-jazz",
    headline: "Pocket-sized, rocket-powered.",
    story: "Jazz is small but mighty. She loves chasing balls, digging and exploring, then collapsing in a warm lap. She'd love an active home with older kids and a secure garden.",
    traits: ["Playful", "Loves toys", "Escape artist — secure fence please"],
  },
  {
    id: "A10292", name: "Biscuit", species: "dog", breed: "Corgi cross", sex: "Male", ageMonths: 6, size: "small",
    energy: "medium", experience: "first-time", goodWithChildren: "yes", goodWithAnimals: true, animalsNote: "Raised with a cat and an older dog.",
    centreId: "taranaki", inFoster: true, daysInCare: 2, fee: 450, photo: "dog-biscuit",
    headline: "Short legs, long list of admirers.",
    story: "Biscuit is a cheerful young pup with a waggy bottom and a big smile. He's friendly with everyone, learning fast and would make a brilliant first dog for a family ready for puppy training.",
    traits: ["Puppy", "Friendly", "Crate trained"],
  },
  {
    id: "A20114", name: "Oreo", species: "cat", breed: "Domestic long hair", sex: "Male", ageMonths: 48, size: "medium",
    energy: "low", experience: "first-time", goodWithChildren: "yes", goodWithAnimals: true, animalsNote: "Has lived with a calm dog.",
    centreId: "wellington", inFoster: false, daysInCare: 40, fee: 150, photo: "cat-oreo",
    headline: "Dressed for a gala, happiest on the sofa.",
    story: "Oreo is a relaxed, fluffy gentleman who loves a brush and a warm windowsill. He's easy-going with visitors and would slot into almost any calm home.",
    traits: ["Loves brushing", "Indoor/outdoor", "Easy-going"],
  },
  {
    id: "A20121", name: "Maple", species: "cat", breed: "Tortoiseshell", sex: "Female", ageMonths: 72, size: "medium",
    energy: "low", experience: "some", goodWithChildren: "older", goodWithAnimals: false, animalsNote: "Wants to be your only pet.",
    centreId: "auckland", inFoster: false, daysInCare: 102, fee: 50, photo: "cat-maple",
    headline: "Full of tortitude. Worth every bit.",
    story: "Maple knows what she likes: quiet mornings, chin scratches on her terms and absolutely no other cats. Respect her boundaries and she'll follow you from room to room purring.",
    traits: ["Long-stay", "Independent", "Only-cat home"],
  },
  {
    id: "A20130", name: "Tigger", species: "cat", breed: "Tabby", sex: "Male", ageMonths: 12, size: "medium",
    energy: "high", experience: "first-time", goodWithChildren: "yes", goodWithAnimals: true, animalsNote: "Plays well with other young cats.",
    centreId: "waikato", inFoster: false, daysInCare: 11, fee: 150, photo: "cat-tigger",
    headline: "Bounces first, asks questions later.",
    story: "Tigger is a young cat with endless curiosity. Wand toys, boxes and paper bags are his favourite things. He'd love a playful family, or a home with another young cat to wrestle.",
    traits: ["Playful", "Confident", "Loves wand toys"],
  },
  {
    id: "A20133", name: "Luna", species: "cat", breed: "Siamese cross", sex: "Female", ageMonths: 36, size: "medium",
    energy: "medium", experience: "some", goodWithChildren: "older", goodWithAnimals: true, animalsNote: "Fine with relaxed cats.",
    centreId: "christchurch", inFoster: true, daysInCare: 25, fee: 150, photo: "cat-luna",
    headline: "Chatty. Very chatty. You've been warned.",
    story: "Luna will tell you about her day, your day and the bird outside. She's affectionate and loves company, so she'd suit a home where someone is around most of the time.",
    traits: ["Talkative", "Affectionate", "Loves company"],
  },
  {
    id: "A20097", name: "Mr Fluff", species: "cat", breed: "Maine coon cross", sex: "Male", ageMonths: 108, size: "large",
    energy: "low", experience: "first-time", goodWithChildren: "yes", goodWithAnimals: true, animalsNote: "Gets on with other cats.",
    centreId: "hobsonville", inFoster: false, daysInCare: 131, fee: 50, photo: "cat-mr-fluff",
    headline: "Nine years young. Mostly fur.",
    story: "Mr Fluff is a big, gentle senior who loves the garden and a daily brush. He's been with us a while; senior cats often wait longest, but they settle fastest.",
    traits: ["Senior", "Long-stay", "Needs daily grooming"],
  },
  {
    id: "A20140", name: "Patches", species: "cat", breed: "Calico", sex: "Female", ageMonths: 24, size: "medium",
    energy: "medium", experience: "first-time", goodWithChildren: "yes", goodWithAnimals: false, animalsNote: "Would rather not share with other pets.",
    centreId: "tauranga", inFoster: false, daysInCare: 30, fee: 150, photo: "cat-patches",
    headline: "A patchwork of good qualities.",
    story: "Patches is sweet, curious and great with gentle children. She likes a sunny spot and a regular routine and would be happiest as the only pet.",
    traits: ["Sweet", "Good with kids", "Only pet"],
  },
  {
    id: "A20102", name: "Smokey", species: "cat", breed: "Domestic short hair", sex: "Male", ageMonths: 132, size: "medium",
    energy: "low", experience: "first-time", goodWithChildren: "older", goodWithAnimals: true, animalsNote: "Relaxed around calm dogs and cats.",
    centreId: "dunedin", inFoster: true, daysInCare: 77, fee: 50, photo: "cat-smokey",
    headline: "Expert napper seeks warm lap.",
    story: "Smokey is a quiet senior who wants a peaceful home and a lap at the end of the day. He's in a foster home and doing beautifully.",
    traits: ["Senior", "Lap cat", "Quiet"],
  },
  {
    id: "A20151", name: "Pumpkin", species: "cat", breed: "Ginger kitten", sex: "Male", ageMonths: 3, size: "small",
    energy: "high", experience: "first-time", goodWithChildren: "yes", goodWithAnimals: true, animalsNote: "Raised with siblings and a dog in foster.",
    centreId: "manawatu", inFoster: true, daysInCare: 1, fee: 175, photo: "cat-pumpkin",
    headline: "Small, orange, unstoppable.",
    story: "Pumpkin is a confident kitten who explores everything. He'll be desexed, vaccinated and microchipped before he goes home.",
    traits: ["Kitten", "Confident", "Litter trained"],
  },
  {
    id: "A20152", name: "Pebble", species: "cat", breed: "Domestic short hair kitten", sex: "Female", ageMonths: 3, size: "small",
    energy: "high", experience: "first-time", goodWithChildren: "yes", goodWithAnimals: true, animalsNote: "Loves other kittens.",
    centreId: "southland", inFoster: true, daysInCare: 4, fee: 175, photo: "cat-pebble",
    headline: "Tiny paws, huge purr.",
    story: "Pebble is a gentle kitten who loves to be held once she's finished playing. She'd be great with another kitten or a calm older cat.",
    traits: ["Kitten", "Gentle", "Litter trained"],
  },
  {
    id: "A20155", name: "Salt & Pepper", species: "cat", breed: "Tabby kittens (bonded pair)", sex: "Pair", ageMonths: 4, size: "small",
    energy: "high", experience: "first-time", goodWithChildren: "yes", goodWithAnimals: true, animalsNote: "Go home together — they're best friends.",
    centreId: "nelson", inFoster: true, daysInCare: 5, fee: 300, photo: "cat-salt-pepper",
    headline: "Sold separately? Absolutely not.",
    story: "These two siblings do everything together: play, eat, nap in a heap. Two kittens are often easier than one, because they wear each other out.",
    traits: ["Bonded pair", "Kittens", "Playful"],
  },
  {
    id: "A20118", name: "Kōwhai", species: "cat", breed: "Tabby", sex: "Female", ageMonths: 60, size: "medium",
    energy: "medium", experience: "some", goodWithChildren: "yes", goodWithAnimals: true, animalsNote: "Has lived with a dog.",
    centreId: "hawkes-bay", inFoster: false, daysInCare: 62, fee: 150, photo: "cat-kowhai",
    headline: "Green eyes, golden heart.",
    story: "Kōwhai is shy for the first day and a sweetheart forever after. She loves a quiet corner to retreat to and will come and find you when she's ready.",
    traits: ["Long-stay", "Shy at first", "Affectionate"],
  },
  {
    id: "A30021", name: "Clover", species: "rabbit", breed: "Lop", sex: "Female", ageMonths: 24, size: "small",
    energy: "low", experience: "some", goodWithChildren: "older", goodWithAnimals: false, animalsNote: "Could be bonded with a neutered male rabbit.",
    centreId: "rotorua", inFoster: false, daysInCare: 45, fee: 60, photo: "rabbit-clover",
    headline: "Ears for days, and very good at listening.",
    story: "Clover is a calm lop who loves hay, herbs and gentle strokes. Rabbits need space, company and know-how; we'll help you get set up.",
    traits: ["Calm", "Litter trained", "Desexed"],
  },
  {
    id: "A30025", name: "Snow", species: "rabbit", breed: "New Zealand white", sex: "Male", ageMonths: 12, size: "small",
    energy: "medium", experience: "first-time", goodWithChildren: "older", goodWithAnimals: true, animalsNote: "Could live with another rabbit.",
    centreId: "wellington", inFoster: false, daysInCare: 14, fee: 60, photo: "rabbit-snow",
    headline: "Does zoomies. Calls them 'binkies'.",
    story: "Snow is a curious young rabbit who loves exploring and leaping for joy. He'd love a big run and a family that enjoys watching him show off.",
    traits: ["Curious", "Desexed", "Vaccinated"],
  },
  {
    id: "A30019", name: "Hop & Scotch", species: "rabbit", breed: "Rabbits (bonded pair)", sex: "Pair", ageMonths: 36, size: "small",
    energy: "low", experience: "some", goodWithChildren: "older", goodWithAnimals: true, animalsNote: "Must go home together.",
    centreId: "christchurch", inFoster: false, daysInCare: 80, fee: 100, photo: "rabbit-duo",
    headline: "A package deal with twice the nose wiggles.",
    story: "Hop and Scotch have been together since they were babies. They groom each other, share every meal and would love a spacious, predator-proof home.",
    traits: ["Bonded pair", "Long-stay", "Desexed"],
  },
  {
    id: "A40007", name: "Kūmara & Rīwai", species: "small", breed: "Guinea pigs (pair)", sex: "Pair", ageMonths: 12, size: "small",
    energy: "low", experience: "first-time", goodWithChildren: "yes", goodWithAnimals: true, animalsNote: "Must go home together.",
    centreId: "auckland", inFoster: false, daysInCare: 22, fee: 40, photo: "gp-duo",
    headline: "Will squeak for vegetables.",
    story: "These two love fresh veg, a roomy hutch and a daily cuddle. Guinea pigs are social and chatty, which makes them a lovely first pet for families.",
    traits: ["Pair", "Gentle", "Great first pets"],
  },
];

export const SPECIES_LABEL: Record<Species, string> = { dog: "Dog", cat: "Cat", rabbit: "Rabbit", small: "Small animal" };
export const ENERGY_LABEL: Record<Energy, string> = { low: "Low energy", medium: "Medium energy", high: "High energy" };
export const EXPERIENCE_LABEL: Record<Experience, string> = {
  "first-time": "Great for first-timers",
  some: "Some experience helps",
  experienced: "Needs an experienced home",
};
export const SIZE_LABEL: Record<Size, string> = { small: "Small", medium: "Medium", large: "Large" };

export type AgeGroup = "young" | "adult" | "senior";
export function ageGroup(a: Animal): AgeGroup {
  if (a.ageMonths < 12) return "young";
  const seniorFrom = a.species === "dog" ? 84 : a.species === "cat" ? 96 : 60;
  return a.ageMonths >= seniorFrom ? "senior" : "adult";
}

export function ageLabel(months: number) {
  if (months < 12) return `${months} month${months === 1 ? "" : "s"}`;
  const years = Math.floor(months / 12);
  return `${years} year${years === 1 ? "" : "s"}`;
}

export const LONG_STAY_DAYS = 60;
