export interface NeighborhoodConfig {
  id: string;
  name: string;
  center: [number, number];
  boundary: [number, number][];
  bounds: [[number, number], [number, number]];
  defaultZoom: number;
}

export const NEIGHBORHOODS: NeighborhoodConfig[] = [
  {
    id: 'lake-nona-south',
    name: 'Lake Nona South',
    center: [-81.2737, 28.3722],
    defaultZoom: 13.8,
    boundary: [
      [-81.298, 28.398],
      [-81.246, 28.398],
      [-81.246, 28.338],
      [-81.298, 28.338],
      [-81.298, 28.398]
    ],
    bounds: [
      [-81.32, 28.32],  // Southwest
      [-81.22, 28.42]   // Northeast
    ]
  },
  {
    id: 'river-oaks',
    name: 'River Oaks',
    center: [-97.1176, 33.1423],
    defaultZoom: 13.8,
    boundary: [
      [-97.143, 33.168],
      [-97.092, 33.168],
      [-97.092, 33.117],
      [-97.143, 33.117],
      [-97.143, 33.168]
    ],
    bounds: [
      [-97.16, 33.09],  // Southwest
      [-97.08, 33.20]   // Northeast
    ]
  },
  {
    id: 'government-hill',
    name: 'Government Hill',
    center: [-98.4611, 29.4401],
    defaultZoom: 13.8,
    boundary: [
      [-98.487, 29.466],
      [-98.435, 29.466],
      [-98.435, 29.414],
      [-98.487, 29.414],
      [-98.487, 29.466]
    ],
    bounds: [
      [-98.51, 29.39],  // Southwest
      [-98.41, 29.49]   // Northeast
    ]
  },
  {
    id: 'north-hollywood',
    name: 'North Hollywood',
    center: [-118.3904, 34.1896],
    defaultZoom: 13.8,
    boundary: [
      [-118.416, 34.216],
      [-118.365, 34.216],
      [-118.365, 34.163],
      [-118.416, 34.163],
      [-118.416, 34.216]
    ],
    bounds: [
      [-118.44, 34.14],  // Southwest
      [-118.34, 34.24]   // Northeast
    ]
  },
  {
    id: 'shadyside',
    name: 'Shadyside',
    center: [-79.9323, 40.4535],
    defaultZoom: 13.8,
    boundary: [
      [-79.958, 40.480],
      [-79.907, 40.480],
      [-79.907, 40.427],
      [-79.958, 40.427],
      [-79.958, 40.480]
    ],
    bounds: [
      [-79.98, 40.40],  // Southwest
      [-79.88, 40.51]   // Northeast
    ]
  },
  {
    id: 'downtown-orlando',
    name: 'Downtown Orlando',
    center: [-81.379, 28.538],
    defaultZoom: 13.8,
    boundary: [
      [-81.395, 28.555],
      [-81.360, 28.555],
      [-81.360, 28.520],
      [-81.395, 28.520],
      [-81.395, 28.555]
    ],
    bounds: [
      [-81.42, 28.50],  // Southwest
      [-81.34, 28.58]   // Northeast
    ]
  },
  {
    id: 'winter-park',
    name: 'Winter Park',
    center: [-81.353, 28.599],
    defaultZoom: 13.8,
    boundary: [
      [-81.375, 28.615],
      [-81.330, 28.615],
      [-81.330, 28.580],
      [-81.375, 28.580],
      [-81.375, 28.615]
    ],
    bounds: [
      [-81.40, 28.56],  // Southwest
      [-81.31, 28.64]   // Northeast
    ]
  }
];

export function getNeighborhoodById(id: string): NeighborhoodConfig | undefined {
  return NEIGHBORHOODS.find(n => n.id === id);
}

export function getDefaultNeighborhood(): NeighborhoodConfig {
  return NEIGHBORHOODS[0]; // Lake Nona South as default
}
