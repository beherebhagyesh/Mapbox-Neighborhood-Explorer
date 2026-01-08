# 🗺️ Mapbox Neighborhood POI Explorer

A premium, localized Points of Interest (POI) explorer that displays real businesses within a customizable neighborhood boundary. Built with Vite, TypeScript, and Mapbox GL JS.

![Explorer Preview](https://loremflickr.com/800/400/map,technology/all)

## ✨ Features

- **Real Business Names** - Uses Mapbox Search Box API for actual POI data
- **Geofenced Map** - Users cannot pan/zoom outside the defined neighborhood
- **Category Filtering** - Highlights, Grocery, Food & Drink, Parks, Shopping, Sports, Entertainment
- **Premium UI** - Landing page with About section, iframe integration, rich POI cards
- **Responsive Design** - Works on desktop and mobile

---

## 🚀 Quick Start

```bash
# Clone the repo
git clone https://github.com/beherebhagyesh/Mapbox-Neighborhood-Explorer.git
cd Mapbox-Neighborhood-Explorer

# Install dependencies
npm install

# Start development server
npm run dev
```

Open [http://localhost:4173](http://localhost:4173) and enter your Mapbox Public Access Token.

---

## 🔧 Customizing the Neighborhood

All neighborhood configuration is in `src/main.ts`. Here's how to change it:

### 1. Set the Center Point

Find your neighborhood's center coordinates (longitude, latitude):

```typescript
// src/main.ts - Line 17
const NEIGHBORHOOD_CENTER: [number, number] = [-81.272, 28.368]; // [lng, lat]
```

**How to find coordinates:**
- Use [Google Maps](https://maps.google.com) - Right-click → "What's here?"
- Use [geojson.io](https://geojson.io) for precise coordinates

### 2. Define the Boundary Polygon

The red dashed boundary shown on the map:

```typescript
// src/main.ts - Lines 19-25
const NEIGHBORHOOD_BOUNDARY = [
  [-81.298, 28.398],  // Northwest corner
  [-81.246, 28.398],  // Northeast corner
  [-81.246, 28.338],  // Southeast corner
  [-81.298, 28.338],  // Southwest corner
  [-81.298, 28.398]   // Close the polygon (same as first point)
];
```

### 3. Set the Map Bounds (Geofencing)

This restricts how far users can pan/zoom:

```typescript
// src/main.ts - Lines 28-31
const MAP_BOUNDS: [[number, number], [number, number]] = [
  [-81.32, 28.32],  // Southwest corner (add ~0.02 padding)
  [-81.22, 28.42]   // Northeast corner (add ~0.02 padding)
];
```

> **Tip:** Make MAP_BOUNDS slightly larger than NEIGHBORHOOD_BOUNDARY for better UX.

### 4. Complete Example: Changing to a New Neighborhood

To switch from Lake Nona South to **Downtown Orlando**:

```typescript
// Downtown Orlando configuration
const NEIGHBORHOOD_CENTER: [number, number] = [-81.379, 28.538];

const NEIGHBORHOOD_BOUNDARY = [
  [-81.395, 28.555],
  [-81.360, 28.555],
  [-81.360, 28.520],
  [-81.395, 28.520],
  [-81.395, 28.555]
];

const MAP_BOUNDS: [[number, number], [number, number]] = [
  [-81.42, 28.50],
  [-81.34, 28.58]
];
```

---

## 📁 Project Structure

```
├── index.html          # Landing page with About section
├── explorer.html       # Map component (embedded via iframe)
├── src/
│   ├── main.ts         # Core logic, Mapbox integration, POI fetching
│   └── style.css       # Premium styling
├── vite.config.ts      # Multi-page Vite configuration
└── package.json
```

---

## 🔑 API Configuration

This app requires a **Mapbox Public Access Token**:

1. Create a free account at [mapbox.com](https://www.mapbox.com/)
2. Go to Account → Tokens
3. Copy your default public token (starts with `pk.`)
4. Paste it in the app's setup modal

The token is stored in `localStorage` for convenience.

---

## 🏷️ Version History

| Version | Description |
|---------|-------------|
| v1.0 | Production release with real POI data, geofencing, and documentation |
| v0.2 | Landing page integration, localized search |
| v0.1 | Initial prototype |

---

## 📄 License

MIT License - Feel free to use and modify for your projects.

---

*Built for Lake Nona South, Orlando, FL*
