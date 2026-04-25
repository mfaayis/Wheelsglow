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
    name: "BMW M4 Competition",
    price: 1299,
    originalPrice: 1799,
    // Real product photos — before (LED off) and after (LED on)
    image: "/bmw-off.png",
    imageOn: "/bmw-on.png",
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
