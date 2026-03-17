function getStatus(fill) {
  if (fill >= 80) return "full";
  if (fill >= 40) return "medium";
  return "empty";
}

export const bins = [
  {
    id: "BIN001",
    fillLevel: 92,
    status: getStatus(92),
    lat: 40.7128,
    lng: -74.006,
    lastUpdated: "2026-03-06 08:12",
    location: "Main St & 1st Ave",
  },
  {
    id: "BIN002",
    fillLevel: 45,
    status: getStatus(45),
    lat: 40.7148,
    lng: -74.009,
    lastUpdated: "2026-03-06 08:45",
    location: "Park Ave & 3rd St",
  },
  {
    id: "BIN003",
    fillLevel: 18,
    status: getStatus(18),
    lat: 40.711,
    lng: -74.003,
    lastUpdated: "2026-03-06 07:55",
    location: "Oak Blvd & 5th Ave",
  },
  {
    id: "BIN004",
    fillLevel: 78,
    status: getStatus(78),
    lat: 40.716,
    lng: -74.012,
    lastUpdated: "2026-03-06 09:00",
    location: "Elm St & Central Rd",
  },
  {
    id: "BIN005",
    fillLevel: 88,
    status: getStatus(88),
    lat: 40.708,
    lng: -74.015,
    lastUpdated: "2026-03-06 09:15",
    location: "River Dr & Bridge Ln",
  },
  {
    id: "BIN006",
    fillLevel: 33,
    status: getStatus(33),
    lat: 40.7195,
    lng: -74.001,
    lastUpdated: "2026-03-06 08:30",
    location: "West End Ave & 10th",
  },
  {
    id: "BIN007",
    fillLevel: 65,
    status: getStatus(65),
    lat: 40.7068,
    lng: -74.008,
    lastUpdated: "2026-03-06 08:00",
    location: "Market St & 7th Ave",
  },
  {
    id: "BIN008",
    fillLevel: 95,
    status: getStatus(95),
    lat: 40.7138,
    lng: -74.019,
    lastUpdated: "2026-03-06 09:22",
    location: "Commerce Blvd & 2nd",
  },
  {
    id: "BIN009",
    fillLevel: 10,
    status: getStatus(10),
    lat: 40.7175,
    lng: -74.005,
    lastUpdated: "2026-03-06 07:40",
    location: "North Park & Union St",
  },
  {
    id: "BIN010",
    fillLevel: 55,
    status: getStatus(55),
    lat: 40.7055,
    lng: -74.011,
    lastUpdated: "2026-03-06 08:50",
    location: "Harbor View & Port Rd",
  },
  {
    id: "BIN011",
    fillLevel: 82,
    status: getStatus(82),
    lat: 40.7205,
    lng: -74.014,
    lastUpdated: "2026-03-06 09:05",
    location: "Sunset Blvd & Hill St",
  },
  {
    id: "BIN012",
    fillLevel: 71,
    status: getStatus(71),
    lat: 40.7092,
    lng: -74.0,
    lastUpdated: "2026-03-06 08:20",
    location: "Green Ave & 4th St",
  },
];

export const statusColor = {
  empty: "#22c55e",
  medium: "#eab308",
  full: "#ef4444",
};

export const statusLabel = {
  empty: "Empty",
  medium: "Medium",
  full: "Full",
};
