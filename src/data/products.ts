import { Product } from "../components/ProductCard";

export const PRODUCTS: Product[] = [
  {
    id: 1,
    name: "Porsche 911 GT3 RS",
    price: 1299,
    originalPrice: 1799,
    // Real product photos — before (LED off) and after (LED on)
    image: "/porsche-off-v2.jpg",
    imageOn: "/porsche-on-v2.jpg",
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
      print: "High-resolution UV-resistant art print",
      frame: "Premium acrylic board backing",
      led: "Integrated neon LED strip · pre-mounted behind cutouts",
      power: "Plug-in adapter · energy-efficient LED",
      mounting: "Pre-installed hooks · easy wall mount",
      warranty: "1 Year on all LED components",
    },
    inBox: ["Acrylic art board with pre-mounted LED strip", "Power adapter + cable", "Wall mounting hooks + screws", "Step-by-step hanging guide"],
  },
  {
    id: 2,
    name: "Lamborghini Revuelto",
    price: 1299,
    originalPrice: 1799,
    // Real product photos — before (LED off) and after (LED on)
    image: "/lambo-off.jpg",
    imageOn: "/lambo-on.jpg",
    color: "#FF6B00",
    description: "Arancio Borealis Edition",
    category: "cars",
    sizes: ["A3 — 30×42cm", "A2 — 42×59cm", "A1 — 59×84cm"],
    ledColors: ["#FF6B00", "#FFFFFF"],
    badge: "Hot",
    ledGlowPosition: "50% 45%",
    whatLightsUp: "The iconic Y-shaped LED headlight DRLs glow bright white. Only the headlights — not the frame.",
    ledEffect: "Precision LED strip placed behind the Y-shaped headlight cutouts. When switched ON, only the signature Revuelto headlight blades illuminate in crisp white — the most recognisable supercar face, wall-mounted.",
    specs: {
      print: "High-resolution UV-resistant art print",
      frame: "Premium acrylic board backing",
      led: "Integrated neon LED strip · pre-mounted behind cutouts",
      power: "Plug-in adapter · energy-efficient LED",
      mounting: "Pre-installed hooks · easy wall mount",
      warranty: "1 Year on all LED components",
    },
    inBox: ["Acrylic art board with pre-mounted LED strip", "Power adapter + cable", "Wall mounting hooks + screws", "Step-by-step hanging guide"],
  },
];

export const SIZES = ["A3 — 30×42cm", "A2 — 42×59cm", "A1 — 59×84cm"];
export const SIZE_PRICES: Record<string, number> = {
  "A3 — 30×42cm": 999,
  "A2 — 42×59cm": 1299,
  "A1 — 59×84cm": 1699,
};
