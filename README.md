# 🗺️ Mapbox POI Explorer - Lake Nona South

A premium, localized Points of Interest (POI) explorer for the Lake Nona South neighborhood. This project features a high-end landing page with an integrated Mapbox component that allows users to discover local amenities like restaurants, parks, grocery stores, and more with a sleek, modern UI.

![Project Preview](https://via.placeholder.com/1200x600.png?text=Mapbox+POI+Explorer+Preview)

## ✨ Key Features

- **Premium UI/UX**: Professional landing page with a glassmorphic explorer component.
- **Neighborhood Focused**: Locked to Lake Nona South (Orlando, FL) with a custom red dashed boundary.
- **Smart POI Search**: Powered by **Mapbox Search API v1 (Search Box)** with an intelligent Geocoding fallback system.
- **Rich Data Cards**: Interactive cards featuring review scores, counts, price levels, and current "Open/Closed" status.
- **Responsive Iframe Integration**: The explorer is fully containerized and designed to scale within any landing page.

## 🚀 Tech Stack

- **Frontend**: Vite 7 + Vanilla TypeScript
- **Map Engine**: Mapbox GL JS v3
- **Styling**: Vanilla CSS with modern design tokens
- **Build Tool**: Multi-page (MPA) configuration for landing/explorer separation.

## 🛠️ Setup & Installation

### 1. Clone the repository
```bash
git clone https://github.com/[your-username]/MapBox.git
cd MapBox
```

### 2. Install dependencies
```bash
npm install
```

### 3. Configure Mapbox API Key
When you first launch the application, a setup modal will appear. Paste your **Mapbox Public Access Token** (starting with `pk.`) to initialize the map. The key is securely stored in your browser's local storage.

### 4. Run Development Server
```bash
npm run dev
```
The app will be available at `http://localhost:4173/`.

## 📦 Deployment

To build the project for production:
```bash
npm run build
```
The optimized assets will be generated in the `dist/` directory, ready to be hosted on Netlify, Vercel, or GitHub Pages.

## 📄 License
This project is licensed under the MIT License.

---
*Built with love for Lake Nona South.*
