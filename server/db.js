const fs = require('fs');
const path = require('path');

const DB_PATH = path.join(__dirname, 'data.json');

const SEED_DATA = {
  products: [
    {
      id: 1,
      name: "Porsche 911 GT3 RS",
      description: "Racing Red Taillight Edition",
      price: 1299,
      originalPrice: 1799,
      image: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&q=90&w=1200",
      color: "#FF2200",
      category: "cars",
      badge: "Best Seller",
      ledGlowPosition: "65% 72%",
      whatLightsUp: "Only the rear taillights & brake light bar glow warm Racing Red. The rest of the poster stays dark.",
      sizes: ["A3 — 30×42cm", "A2 — 42×59cm", "A1 — 59×84cm"],
      sizePrices: { "A3 — 30×42cm": 999, "A2 — 42×59cm": 1299, "A1 — 59×84cm": 1699 },
      specs: {
        print: "300 GSM UV-resistant matte art print",
        frame: "3mm aluminium composite backing",
        led: "SMD 5050 LED strip · 60 LEDs/meter",
        controller: "24-key RF wireless remote · 16 colors · 4 dynamic modes",
        power: "12V 2A DC adapter · 3m transparent cable",
        warranty: "1 Year on all LED components"
      }
    },
    {
      id: 2,
      name: "BMW M4 Competition",
      description: "Angel Eye Blue Edition",
      price: 1299,
      originalPrice: 1799,
      image: "https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&q=90&w=1200",
      color: "#00BFFF",
      category: "cars",
      badge: "Hot",
      ledGlowPosition: "50% 52%",
      whatLightsUp: "Dual circular LED angel eye headlight rings glow vivid electric blue. Only the headlights — not the frame.",
      sizes: ["A3 — 30×42cm", "A2 — 42×59cm", "A1 — 59×84cm"],
      sizePrices: { "A3 — 30×42cm": 999, "A2 — 42×59cm": 1299, "A1 — 59×84cm": 1699 },
      specs: {
        print: "300 GSM UV-resistant matte art print",
        frame: "3mm aluminium composite backing",
        led: "SMD 5050 LED strip · 60 LEDs/meter",
        controller: "24-key RF wireless remote · 16 colors · 4 dynamic modes",
        power: "12V 2A DC adapter · 3m transparent cable",
        warranty: "1 Year on all LED components"
      }
    }
  ],
  orders: [
    { id: "WG1001", customerName: "Arjun Verma", customerEmail: "arjun@example.com", customerPhone: "9876543210", city: "Mumbai", state: "Maharashtra", pincode: "400001", address: "21 Marine Drive", productId: 1, productName: "Porsche 911 GT3 RS", size: "A2 — 42×59cm", amount: 1299, status: "Delivered", trackingId: "DTDC102938", notes: "", createdAt: "2026-03-28T10:22:00Z" },
    { id: "WG1002", customerName: "Priya Nair", customerEmail: "priya@example.com", customerPhone: "9876543211", city: "Bengaluru", state: "Karnataka", pincode: "560001", address: "42 MG Road", productId: 2, productName: "BMW M4 Competition", size: "A1 — 59×84cm", amount: 1699, status: "In Transit", trackingId: "DTDC102939", notes: "", createdAt: "2026-03-30T09:14:00Z" },
    { id: "WG1003", customerName: "Rahul Kumar", customerEmail: "rahul@example.com", customerPhone: "9876543212", city: "Delhi", state: "Delhi", pincode: "110001", address: "5 Connaught Place", productId: 1, productName: "Porsche 911 GT3 RS", size: "A3 — 30×42cm", amount: 999, status: "Processing", trackingId: "", notes: "", createdAt: "2026-04-01T08:30:00Z" },
    { id: "WG1004", customerName: "Sarah Mehta", customerEmail: "sarah@example.com", customerPhone: "9876543213", city: "Chennai", state: "Tamil Nadu", pincode: "600001", address: "7 Anna Salai", productId: 2, productName: "BMW M4 Competition", size: "A2 — 42×59cm", amount: 1299, status: "Delivered", trackingId: "DTDC102937", notes: "", createdAt: "2026-03-25T11:00:00Z" },
    { id: "WG1005", customerName: "Karan Singh", customerEmail: "karan@example.com", customerPhone: "9876543214", city: "Pune", state: "Maharashtra", pincode: "411001", address: "3 FC Road", productId: 1, productName: "Porsche 911 GT3 RS", size: "A1 — 59×84cm", amount: 1699, status: "Dispatched", trackingId: "DTDC102940", notes: "", createdAt: "2026-03-31T14:00:00Z" },
    { id: "WG1006", customerName: "Ananya Rao", customerEmail: "ananya@example.com", customerPhone: "9876543215", city: "Hyderabad", state: "Telangana", pincode: "500001", address: "10 Banjara Hills", productId: 2, productName: "BMW M4 Competition", size: "A2 — 42×59cm", amount: 1299, status: "Processing", trackingId: "", notes: "", createdAt: "2026-04-01T07:45:00Z" },
    { id: "WG1007", customerName: "Vijay Iyer", customerEmail: "vijay@example.com", customerPhone: "9876543216", city: "Kolkata", state: "West Bengal", pincode: "700001", address: "2 Park Street", productId: 1, productName: "Porsche 911 GT3 RS", size: "A2 — 42×59cm", amount: 1299, status: "Delivered", trackingId: "DTDC102936", notes: "", createdAt: "2026-03-22T16:00:00Z" },
    { id: "WG1008", customerName: "Deepika Patel", customerEmail: "deepika@example.com", customerPhone: "9876543217", city: "Ahmedabad", state: "Gujarat", pincode: "380001", address: "8 CG Road", productId: 2, productName: "BMW M4 Competition", size: "A1 — 59×84cm", amount: 1699, status: "Dispatched", trackingId: "DTDC102941", notes: "", createdAt: "2026-03-31T10:30:00Z" },
  ],
  contacts: [],
  orderCounter: 1009
};

function readDB() {
  try {
    if (!fs.existsSync(DB_PATH)) {
      writeDB(SEED_DATA);
      return SEED_DATA;
    }
    const raw = fs.readFileSync(DB_PATH, 'utf8');
    return JSON.parse(raw);
  } catch {
    writeDB(SEED_DATA);
    return SEED_DATA;
  }
}

function writeDB(data) {
  fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2), 'utf8');
}

module.exports = { readDB, writeDB };
