// ============================================================
//  plans-data.js  –  ISP Plan Management Portal Data Store
//  Updated with real price data from Sakthi Internet Service
// ============================================================

const PROVIDER_MATRIX = {
  speeds: [20, 30, 40, 50, 60, 75, 100, 150, 200, 300],
  providers: [
    { id: "bsnl",    name: "BSNL",            logo: "🔵", color: "#0070C0" },
    { id: "tic",     name: "TIC Fiber",        logo: "🟣", color: "#E91E8C" },
    { id: "megnet",  name: "MEG NET",          logo: "🟠", color: "#FF8C00" },
    { id: "rail",    name: "RailWire",         logo: "🔴", color: "#CC0000" },
    { id: "fiber",   name: "Fiber Flow",       logo: "🔷", color: "#00AEEF" },
    { id: "kovai",   name: "Kovai Fibernet",   logo: "⚫", color: "#8b949e" },
    { id: "giotech", name: "GioTech Fibernet", logo: "🟡", color: "#F7A800" }
  ],
  prices: {
    20:  { bsnl: 329,  tic: 299,  megnet: null, rail: null,  fiber: null,  kovai: null, giotech: null },
    30:  { bsnl: 399,  tic: null, megnet: 299,  rail: null,  fiber: null,  kovai: 299,  giotech: null },
    40:  { bsnl: 499,  tic: 399,  megnet: 399,  rail: null,  fiber: null,  kovai: null, giotech: 499  },
    50:  { bsnl: null, tic: null, megnet: 449,  rail: 499,   fiber: 499,   kovai: 399,  giotech: 555  },
    60:  { bsnl: 599,  tic: null, megnet: null, rail: 599,   fiber: null,  kovai: null, giotech: null },
    75:  { bsnl: null, tic: 499,  megnet: 599,  rail: null,  fiber: 599,   kovai: 499,  giotech: 666  },
    100: { bsnl: 777,  tic: 599,  megnet: 649,  rail: 699,   fiber: 699,   kovai: 599,  giotech: 777  },
    150: { bsnl: 999,  tic: 666,  megnet: 777,  rail: 999,   fiber: 899,   kovai: 699,  giotech: null },
    200: { bsnl: 1299, tic: null, megnet: 849,  rail: 1249,  fiber: null,  kovai: 899,  giotech: null },
    300: { bsnl: 1799, tic: null, megnet: 1049, rail: null,  fiber: null,  kovai: null, giotech: null }
  },
  // Value-for-money picks: provider IDs that offer the best overall value at each speed
  valuePicks: {
    20:  ["tic"],
    30:  ["megnet", "kovai"],
    40:  ["tic", "megnet"],
    50:  ["kovai"],
    60:  ["bsnl", "rail"],
    75:  ["tic", "kovai"],
    100: ["tic", "kovai"],
    150: ["tic"],
    200: ["megnet"],
    300: ["megnet"]
  }
};

const RECHARGE_PLANS = {
  monthly: [
    {
      id: "starter",
      name: "Starter Spark",
      speed: "50 Mbps",
      speedValue: 50,
      price: 449,
      validity: "30 Days",
      data: "Truly Unlimited Data",
      badge: "Budget Pick",
      badgeColor: "#22c55e",
      benefits: ["Free Installation", "24/7 Basic Support", "Fair Usage Policy"],
      popular: false,
      ott: [],
      savings: null
    },
    {
      id: "value",
      name: "Value Blaze",
      speed: "100 Mbps",
      speedValue: 100,
      price: 649,
      validity: "30 Days",
      data: "Truly Unlimited Data",
      badge: "Best Value",
      badgeColor: "#00f0ff",
      benefits: ["Free Router", "24/7 Priority Support", "Static IP Option"],
      popular: true,
      ott: ["Disney+ Hotstar", "SonyLIV"],
      savings: null
    },
    {
      id: "gaming",
      name: "Gaming Titan",
      speed: "200 Mbps",
      speedValue: 200,
      price: 849,
      validity: "30 Days",
      data: "Truly Unlimited Data",
      badge: "Gaming Special",
      badgeColor: "#a855f7",
      benefits: ["Low Ping Guarantee", "Gaming DNS", "24/7 Priority Support", "Free Router"],
      popular: false,
      ott: ["Netflix Basic", "Disney+ Hotstar", "Amazon Prime"],
      savings: null
    },
    {
      id: "ultra",
      name: "Ultra Storm",
      speed: "300 Mbps",
      speedValue: 300,
      price: 1049,
      validity: "30 Days",
      data: "Truly Unlimited Data",
      badge: "Unlimited",
      badgeColor: "#f59e0b",
      benefits: ["Free Premium Router", "Dedicated Fiber Line", "24/7 Priority Support", "Free Landline"],
      popular: false,
      ott: ["Netflix 4K", "Disney+ Hotstar", "Amazon Prime", "ZEE5", "SonyLIV"],
      savings: null
    }
  ],
  quarterly: [
    {
      id: "starter-q",
      name: "Starter Spark",
      speed: "50 Mbps",
      speedValue: 50,
      price: 1199,
      validity: "90 Days",
      data: "Truly Unlimited Data",
      badge: "Budget Pick",
      badgeColor: "#22c55e",
      savings: "Save ₹148",
      benefits: ["Free Installation", "24/7 Basic Support", "Fair Usage Policy"],
      popular: false,
      ott: []
    },
    {
      id: "value-q",
      name: "Value Blaze",
      speed: "100 Mbps",
      speedValue: 100,
      price: 1749,
      validity: "90 Days",
      data: "Truly Unlimited Data",
      badge: "Best Value",
      badgeColor: "#00f0ff",
      savings: "Save ₹198",
      benefits: ["Free Router", "24/7 Priority Support", "Static IP Option"],
      popular: true,
      ott: ["Disney+ Hotstar", "SonyLIV", "Amazon Prime"]
    },
    {
      id: "gaming-q",
      name: "Gaming Titan",
      speed: "200 Mbps",
      speedValue: 200,
      price: 2299,
      validity: "90 Days",
      data: "Truly Unlimited Data",
      badge: "Gaming Special",
      badgeColor: "#a855f7",
      savings: "Save ₹248",
      benefits: ["Low Ping Guarantee", "Gaming DNS", "24/7 Priority Support", "Free Router"],
      popular: false,
      ott: ["Netflix Basic", "Disney+ Hotstar", "Amazon Prime"]
    },
    {
      id: "ultra-q",
      name: "Ultra Storm",
      speed: "300 Mbps",
      speedValue: 300,
      price: 2849,
      validity: "90 Days",
      data: "Truly Unlimited Data",
      badge: "Unlimited",
      badgeColor: "#f59e0b",
      savings: "Save ₹298",
      benefits: ["Free Premium Router", "Dedicated Fiber Line", "24/7 Priority Support", "Free Landline"],
      popular: false,
      ott: ["Netflix 4K", "Disney+ Hotstar", "Amazon Prime", "ZEE5", "SonyLIV"]
    }
  ],
  annual: [
    {
      id: "starter-a",
      name: "Starter Spark",
      speed: "50 Mbps",
      speedValue: 50,
      price: 4299,
      validity: "365 Days",
      data: "Truly Unlimited Data",
      badge: "Budget Pick",
      badgeColor: "#22c55e",
      savings: "Save ₹1089",
      benefits: ["Free Installation", "Free Router", "24/7 Basic Support", "Fair Usage Policy"],
      popular: false,
      ott: ["Disney+ Hotstar"]
    },
    {
      id: "value-a",
      name: "Value Blaze",
      speed: "100 Mbps",
      speedValue: 100,
      price: 6499,
      validity: "365 Days",
      data: "Truly Unlimited Data",
      badge: "Best Value",
      badgeColor: "#00f0ff",
      savings: "Save ₹1289",
      benefits: ["Free Premium Router", "24/7 Priority Support", "Static IP", "Free OTT Setup"],
      popular: true,
      ott: ["Netflix Basic", "Disney+ Hotstar", "SonyLIV", "Amazon Prime"]
    },
    {
      id: "gaming-a",
      name: "Gaming Titan",
      speed: "200 Mbps",
      speedValue: 200,
      price: 8499,
      validity: "365 Days",
      data: "Truly Unlimited Data",
      badge: "Gaming Special",
      badgeColor: "#a855f7",
      savings: "Save ₹1689",
      benefits: ["Low Ping Guarantee", "Gaming DNS", "24/7 Priority Support", "Free Premium Router"],
      popular: false,
      ott: ["Netflix 4K", "Disney+ Hotstar", "Amazon Prime", "ZEE5"]
    },
    {
      id: "ultra-a",
      name: "Ultra Storm",
      speed: "300 Mbps",
      speedValue: 300,
      price: 10999,
      validity: "365 Days",
      data: "Truly Unlimited Data",
      badge: "Unlimited",
      badgeColor: "#f59e0b",
      savings: "Save ₹1589",
      benefits: ["Free Premium Mesh Router", "Dedicated Fiber Line", "24/7 Priority Support", "Free Landline", "Free Installation"],
      popular: false,
      ott: ["Netflix 4K", "Disney+ Hotstar", "Amazon Prime", "ZEE5", "SonyLIV", "Voot"]
    }
  ]
};

const SAMPLE_CUSTOMERS = {
  "NF-1024": {
    name: "Ramesh Kumar",
    mobile: "9876543210",
    plan: "Value Blaze 100 Mbps",
    status: "Active",
    expiry: "2026-08-25",
    dataUsed: 312,
    dataTotal: "Unlimited",
    speed: 100,
    usagePercent: 62
  },
  "9876543210": {
    name: "Ramesh Kumar",
    mobile: "9876543210",
    plan: "Value Blaze 100 Mbps",
    status: "Active",
    expiry: "2026-08-25",
    dataUsed: 312,
    dataTotal: "Unlimited",
    speed: 100,
    usagePercent: 62
  },
  "NF-2048": {
    name: "Priya Devi",
    mobile: "9123456789",
    plan: "Gaming Titan 200 Mbps",
    status: "Active",
    expiry: "2026-08-10",
    dataUsed: 890,
    dataTotal: "Unlimited",
    speed: 200,
    usagePercent: 88
  },
  "9123456789": {
    name: "Priya Devi",
    mobile: "9123456789",
    plan: "Gaming Titan 200 Mbps",
    status: "Active",
    expiry: "2026-08-10",
    dataUsed: 890,
    dataTotal: "Unlimited",
    speed: 200,
    usagePercent: 88
  },
  "NF-3072": {
    name: "Arun Selvam",
    mobile: "9988776655",
    plan: "Starter Spark 50 Mbps",
    status: "Expiring Soon",
    expiry: "2026-08-05",
    dataUsed: 180,
    dataTotal: "Unlimited",
    speed: 50,
    usagePercent: 45
  }
};
