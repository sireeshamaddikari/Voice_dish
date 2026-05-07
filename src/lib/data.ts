export type MenuItem = {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  emoji: string;
  popular?: boolean;
  spicy?: boolean;
  veg: boolean;
};

export const categories = ["Starters", "Mains", "Biryani", "Breads", "Desserts", "Drinks"] as const;

export const menu: MenuItem[] = [
  { id: "1", name: "Paneer Tikka", description: "Char-grilled cottage cheese, mint chutney", price: 280, category: "Starters", emoji: "🧀", popular: true, veg: true },
  { id: "2", name: "Chicken 65", description: "Crispy fried chicken, curry leaves, chillies", price: 320, category: "Starters", spicy: true, emoji: "🍗", veg: false },
  { id: "3", name: "Veg Manchurian", description: "Indo-Chinese street favourite", price: 240, category: "Starters", emoji: "🥦", veg: true },
  { id: "4", name: "Butter Chicken", description: "Slow-cooked tomato cream, fenugreek", price: 420, category: "Mains", popular: true, emoji: "🍛", veg: false },
  { id: "5", name: "Paneer Butter Masala", description: "Rich tomato gravy, kasuri methi", price: 360, category: "Mains", emoji: "🍲", veg: true },
  { id: "6", name: "Dal Makhani", description: "24-hour slow simmered black lentils", price: 280, category: "Mains", emoji: "🥣", veg: true },
  { id: "7", name: "Hyderabadi Chicken Biryani", description: "Dum-cooked basmati, saffron, raita", price: 380, category: "Biryani", popular: true, spicy: true, emoji: "🍚", veg: false },
  { id: "8", name: "Veg Dum Biryani", description: "Aromatic spices, fried onions", price: 320, category: "Biryani", emoji: "🍛", veg: true },
  { id: "9", name: "Garlic Naan", description: "Tandoor baked, butter brushed", price: 80, category: "Breads", emoji: "🫓", veg: true },
  { id: "10", name: "Butter Roti", description: "Whole wheat, tandoor", price: 40, category: "Breads", emoji: "🫓", veg: true },
  { id: "11", name: "Gulab Jamun", description: "Warm milk dumplings, rose syrup", price: 140, category: "Desserts", emoji: "🍮", veg: true },
  { id: "12", name: "Mango Lassi", description: "Alphonso mango, hung curd", price: 120, category: "Drinks", popular: true, emoji: "🥭", veg: true },
  { id: "13", name: "Masala Chai", description: "Cardamom, ginger, full cream milk", price: 60, category: "Drinks", emoji: "☕", veg: true },
];

export type OrderStatus = "received" | "preparing" | "ready" | "completed";

export type Order = {
  id: string;
  customer: string;
  channel: "voice" | "whatsapp" | "web";
  items: { name: string; qty: number; price: number }[];
  total: number;
  status: OrderStatus;
  placedAt: string;
};

export const sampleOrders: Order[] = [
  { id: "ORD-1042", customer: "Anjali (WhatsApp)", channel: "whatsapp", items: [{ name: "Butter Chicken", qty: 1, price: 420 }, { name: "Garlic Naan", qty: 2, price: 80 }], total: 580, status: "preparing", placedAt: "2 min ago" },
  { id: "ORD-1041", customer: "Voice +91••892", channel: "voice", items: [{ name: "Hyderabadi Biryani", qty: 2, price: 380 }], total: 760, status: "received", placedAt: "4 min ago" },
  { id: "ORD-1040", customer: "Rahul (Web)", channel: "web", items: [{ name: "Paneer Tikka", qty: 1, price: 280 }, { name: "Mango Lassi", qty: 2, price: 120 }], total: 520, status: "ready", placedAt: "12 min ago" },
  { id: "ORD-1039", customer: "Priya (Web)", channel: "web", items: [{ name: "Dal Makhani", qty: 1, price: 280 }, { name: "Butter Roti", qty: 4, price: 40 }], total: 440, status: "completed", placedAt: "32 min ago" },
];

export const salesData = [
  { day: "Mon", revenue: 18400, orders: 64 },
  { day: "Tue", revenue: 21200, orders: 71 },
  { day: "Wed", revenue: 19800, orders: 66 },
  { day: "Thu", revenue: 24600, orders: 82 },
  { day: "Fri", revenue: 32400, orders: 108 },
  { day: "Sat", revenue: 41800, orders: 142 },
  { day: "Sun", revenue: 38200, orders: 128 },
];

export const channelData = [
  { name: "Voice AI", value: 38 },
  { name: "WhatsApp", value: 42 },
  { name: "Web", value: 20 },
];
