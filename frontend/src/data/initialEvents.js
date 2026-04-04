export const CATEGORY_COLORS = {
  Music: {
    bg: "bg-purple-500/15",
    text: "text-purple-300",
    border: "border-purple-500/30",
  },
  Technology: {
    bg: "bg-cyan-500/15",
    text: "text-cyan-300",
    border: "border-cyan-500/30",
  },
  Comedy: {
    bg: "bg-pink-500/15",
    text: "text-pink-300",
    border: "border-pink-500/30",
  },
  Food: {
    bg: "bg-orange-500/15",
    text: "text-orange-300",
    border: "border-orange-500/30",
  },
  Art: {
    bg: "bg-fuchsia-500/15",
    text: "text-fuchsia-300",
    border: "border-fuchsia-500/30",
  },
  Sports: {
    bg: "bg-green-500/15",
    text: "text-green-300",
    border: "border-green-500/30",
  },
};

export const INITIAL_EVENTS = [
  {
    id: "evt-001",
    name: "Lahore Beats Festival",
    category: "Music",
    date: "2026-05-16",
    time: "19:30",
    venue: "Expo Center",
    city: "Lahore",
    totalSeats: 400,
    bookedSeats: 210,
    reservedSeats: 34,
    price: 3500,
    description:
      "A high-energy evening featuring top Pakistani artists, immersive visuals, and food stalls.",
    image:
      "https://images.unsplash.com/photo-1506157786151-b8491531f063?w=1200&auto=format&fit=crop",
    tags: ["Live", "Festival", "Music"],
    featured: true,
  },
  {
    id: "evt-002",
    name: "Future Tech Summit",
    category: "Technology",
    date: "2026-06-08",
    time: "10:00",
    venue: "Nastp Hall",
    city: "Lahore",
    totalSeats: 280,
    bookedSeats: 120,
    reservedSeats: 18,
    price: 5000,
    description:
      "Talks and demos on AI, cloud-native apps, security, and startup growth.",
    image:
      "https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=1200&auto=format&fit=crop",
    tags: ["AI", "Cloud", "Startups"],
    featured: true,
  },
  {
    id: "evt-003",
    name: "Stand-up Saturday",
    category: "Comedy",
    date: "2026-04-21",
    time: "20:30",
    venue: "Alhamra Arts Council",
    city: "Lahore",
    totalSeats: 160,
    bookedSeats: 70,
    reservedSeats: 12,
    price: 2200,
    description:
      "A lineup of top comedians delivering an unforgettable night of laughs.",
    image:
      "https://images.unsplash.com/photo-1527224538127-2104bb71c51b?w=1200&auto=format&fit=crop",
    tags: ["Comedy", "Live"],
    featured: false,
  },
  {
    id: "evt-004",
    name: "Street Food Carnival",
    category: "Food",
    date: "2026-04-30",
    time: "17:00",
    venue: "Fortress Stadium",
    city: "Lahore",
    totalSeats: 500,
    bookedSeats: 140,
    reservedSeats: 45,
    price: 1200,
    description:
      "Taste signature dishes from the city’s best food trucks and home chefs.",
    image:
      "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=1200&auto=format&fit=crop",
    tags: ["Food", "Family"],
    featured: false,
  },
  {
    id: "evt-005",
    name: "Canvas & Coffee Night",
    category: "Art",
    date: "2026-05-05",
    time: "18:00",
    venue: "MM Alam Studio",
    city: "Lahore",
    totalSeats: 90,
    bookedSeats: 32,
    reservedSeats: 10,
    price: 1800,
    description:
      "Guided painting workshop with live music and curated coffee tasting.",
    image:
      "https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=1200&auto=format&fit=crop",
    tags: ["Workshop", "Art"],
    featured: false,
  },
  {
    id: "evt-006",
    name: "Midnight Futsal Cup",
    category: "Sports",
    date: "2026-06-15",
    time: "22:00",
    venue: "Johar Town Arena",
    city: "Lahore",
    totalSeats: 220,
    bookedSeats: 90,
    reservedSeats: 24,
    price: 2500,
    description:
      "Fast-paced local tournament with live commentary and fan zone access.",
    image:
      "https://images.unsplash.com/photo-1579952363873-27f3bade9f55?w=1200&auto=format&fit=crop",
    tags: ["Sports", "Futsal"],
    featured: true,
  },
];
