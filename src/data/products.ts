import { Product } from "../components/ProductCard";

export const PRODUCTS: Product[] = [
  {
    id: 1,
    name: "Porsche 911 GT3 RS",
    price: 1299,
    originalPrice: 1799,
    image: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&q=90&w=1200",
    color: "#FF2200",
    description: "Racing Red Taillight Edition",
    category: "cars",
    sizes: ["A3 — 30×42cm", "A2 — 42×59cm", "A1 — 59×84cm"],
    ledColors: ["#FF2200", "#FF6B00"],
    badge: "Best Seller",
    ledGlowPosition: "65% 72%",
    whatLightsUp: "Only the rear taillights & brake light bar glow warm Racing Red. The rest of the poster stays dark.",
    ledEffect: "Precision LED strip placed behind the taillight cutouts. When switched ON, only the taillights and brake bar illuminate in warm red-orange — exactly like the real car parked on your wall at night.",
    specs: {
      print: "300 GSM UV-resistant matte art print",
      frame: "3mm aluminium composite backing",
      led: "SMD 5050 LED strip · 60 LEDs/meter",
      controller: "24-key RF wireless remote · 16 colors · 4 dynamic modes",
      power: "12V 2A DC adapter · 3m transparent cable",
      warranty: "1 Year on all LED components",
    },
    inBox: ["Poster with pre-mounted LED strip", "24-key wireless RF remote", "12V 2A adapter + 3m cable", "Wall mounting kit + spirit level"],
  },
  {
    id: 2,
    name: "BMW M4 Competition",
    price: 1299,
    originalPrice: 1799,
    image: "https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&q=90&w=1200",
    color: "#00BFFF",
    description: "Angel Eye Blue Edition",
    category: "cars",
    sizes: ["A3 — 30×42cm", "A2 — 42×59cm", "A1 — 59×84cm"],
    ledColors: ["#00BFFF", "#FFFFFF"],
    badge: "Hot",
    ledGlowPosition: "50% 52%",
    whatLightsUp: "Dual circular LED angel eye headlight rings glow vivid electric blue. Only the headlights — not the frame.",
    ledEffect: "LED strip behind both headlight ring cutouts. When ON, the iconic BMW angel eyes light up in electric blue with a cool-white inner glow — the signature M4 look, wall-mounted.",
    specs: {
      print: "300 GSM UV-resistant matte art print",
      frame: "3mm aluminium composite backing",
      led: "SMD 5050 LED strip · 60 LEDs/meter",
      controller: "24-key RF wireless remote · 16 colors · 4 dynamic modes",
      power: "12V 2A DC adapter · 3m transparent cable",
      warranty: "1 Year on all LED components",
    },
    inBox: ["Poster with pre-mounted LED strip", "24-key wireless RF remote", "12V 2A adapter + 3m cable", "Wall mounting kit + spirit level"],
  },
];

export const SIZES = ["A3 — 30×42cm", "A2 — 42×59cm", "A1 — 59×84cm"];
export const SIZE_PRICES: Record<string, number> = {
  "A3 — 30×42cm": 999,
  "A2 — 42×59cm": 1299,
  "A1 — 59×84cm": 1699,
};
