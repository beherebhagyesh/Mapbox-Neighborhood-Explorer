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

## 🔧 Customizing Neighborhoods

The app now supports multiple neighborhoods! All configuration is in `src/config.ts`.

### Default Neighborhoods Included

1. **Lake Nona South** - Orlando, Florida (default)
2. **River Oaks** - Denton, Texas  
3. **Government Hill** - San Antonio, Texas
4. **North Hollywood** - Los Angeles, California
5. **Shadyside** - Pittsburgh, Pennsylvania
6. **Downtown Orlando** - Orlando, Florida
7. **Winter Park** - Orlando, Florida

### Adding Your Own Neighborhood

Add a new neighborhood to the `NEIGHBORHOODS` array in `src/config.ts`:

```typescript
{
  id: 'your-neighborhood',
  name: 'Your Neighborhood Name',
  center: [-81.379, 28.538], // [lng, lat]
  defaultZoom: 13.8,
  boundary: [
    [-81.395, 28.555], // Northwest corner
    [-81.360, 28.555], // Northeast corner  
    [-81.360, 28.520], // Southeast corner
    [-81.395, 28.520], // Southwest corner
    [-81.395, 28.555]  // Close the polygon
  ],
  bounds: [
    [-81.42, 28.50],  // Southwest corner (add ~0.02 padding)
    [-81.34, 28.58]   // Northeast corner (add ~0.02 padding)
  ]
}
```

### How to Find Coordinates

- **Center Point**: Use [Google Maps](https://maps.google.com) - Right-click → "What's here?"
- **Boundary Polygon**: Use [geojson.io](https://geojson.io) to draw precise boundaries
- **Bounds**: Make bounds slightly larger than boundary for better UX

### Neighborhood Switching

Users can now switch between neighborhoods using the dropdown selector at the top of the map. The app will:
- Update map center and bounds
- Reload POIs for the new area
- Maintain the selected category filter

---

## 📁 Project Structure

```
├── index.html          # Landing page with About section
├── explorer.html       # Map component (embedded via iframe)
├── src/
│   ├── config.ts       # Neighborhood configurations
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
