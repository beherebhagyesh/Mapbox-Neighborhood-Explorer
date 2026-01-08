import mapboxgl from 'mapbox-gl';
import './style.css';

interface POI {
  id: string;
  name: string;
  address: string;
  category: string;
  coordinates: [number, number];
  rating: number;
  reviews: number;
  imageUrl: string;
  priceLevel?: string;
  isOpen?: boolean;
}

const NEIGHBORHOOD_CENTER: [number, number] = [-81.272, 28.368];
const DEFAULT_ZOOM = 13.8;
const NEIGHBORHOOD_BOUNDARY = [
  [-81.298, 28.398],
  [-81.246, 28.398],
  [-81.246, 28.338],
  [-81.298, 28.338],
  [-81.298, 28.398]
];

// Map bounds for Lake Nona South (with padding for user experience)
const MAP_BOUNDS: [[number, number], [number, number]] = [
  [-81.32, 28.32],  // Southwest
  [-81.22, 28.42]   // Northeast
];

class NeighborhoodExplorer {
  private map: mapboxgl.Map | null = null;
  private markers: mapboxgl.Marker[] = [];
  private accessToken: string = '';
  private currentCategory: string = 'highlights';

  constructor() {
    this.checkStoredToken();
    this.initEventListeners();
  }

  private checkStoredToken() {
    const token = localStorage.getItem('mapbox_token');
    if (token) {
      this.accessToken = token;
      const modal = document.getElementById('api-key-modal');
      if (modal) modal.classList.add('hidden');
      this.initMap();
    }
  }

  private initEventListeners() {
    document.getElementById('save-token')?.addEventListener('click', () => {
      const tokenInput = document.getElementById('mapbox-token') as HTMLInputElement;
      if (tokenInput.value) {
        this.accessToken = tokenInput.value;
        localStorage.setItem('mapbox_token', this.accessToken);
        const modal = document.getElementById('api-key-modal');
        if (modal) modal.classList.add('hidden');
        this.initMap();
      }
    });

    const nav = document.querySelector('.category-pill-bar');
    nav?.addEventListener('click', (e) => {
      const btn = (e.target as HTMLElement).closest('.category-pill') as HTMLButtonElement;
      if (!btn) return;

      const category = btn.dataset.category || 'highlights';
      document.querySelectorAll('.category-pill').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      this.currentCategory = category;
      this.fetchPOIs();
    });
  }

  private async initMap() {
    if (!this.accessToken) return;
    mapboxgl.accessToken = this.accessToken;

    this.map = new mapboxgl.Map({
      container: 'map',
      style: 'mapbox://styles/mapbox/light-v11',
      center: NEIGHBORHOOD_CENTER,
      zoom: DEFAULT_ZOOM,
      minZoom: 12,
      maxZoom: 18,
      maxBounds: MAP_BOUNDS,
      attributionControl: false
    });

    this.map.addControl(new mapboxgl.NavigationControl({ showCompass: false }), 'bottom-right');

    this.map.on('load', () => {
      this.addNeighborhoodBoundary();
      this.fetchPOIs();
    });
  }

  private addNeighborhoodBoundary() {
    if (!this.map) return;
    this.map.addSource('neighborhood-line', {
      type: 'geojson',
      data: {
        type: 'Feature',
        properties: {},
        geometry: { type: 'LineString', coordinates: NEIGHBORHOOD_BOUNDARY }
      }
    });

    this.map.addLayer({
      id: 'neighborhood-line-layer',
      type: 'line',
      source: 'neighborhood-line',
      paint: {
        'line-color': '#ef4444',
        'line-width': 3,
        'line-dasharray': [2, 2]
      }
    });
  }

  private getSearchCategory(category: string): string {
    // Mapbox Search Box API category IDs
    const mapping: Record<string, string> = {
      'highlights': 'restaurant',
      'grocery': 'grocery',
      'food-drink': 'restaurant',
      'parks': 'park',
      'shopping': 'shopping_mall',
      'sports': 'gym',
      'entertainment': 'movie_theater'
    };
    return mapping[category] || 'restaurant';
  }

  private async fetchPOIs() {
    if (!this.map || !this.accessToken) return;

    const cardsList = document.getElementById('poi-cards-list');
    if (cardsList) cardsList.innerHTML = '<div class="loading-state">Finding real places...</div>';

    const [lng, lat] = NEIGHBORHOOD_CENTER;
    const category = this.getSearchCategory(this.currentCategory);

    // Use Mapbox Search Box API - it returns REAL business names
    const url = `https://api.mapbox.com/search/searchbox/v1/category/${category}?proximity=${lng},${lat}&limit=15&access_token=${this.accessToken}`;

    try {
      const response = await fetch(url);
      const data = await response.json();

      console.log('Search Box API Response:', data);

      if (!data.features || data.features.length === 0) {
        if (cardsList) cardsList.innerHTML = '<div class="no-results">No places found. Try another category.</div>';
        this.clearMarkers();
        return;
      }

      // Filter to only show POIs within our neighborhood bounds
      const inBounds = data.features.filter((f: any) => {
        const coords = f.geometry?.coordinates;
        if (!coords) return false;
        const [poiLng, poiLat] = coords;
        return poiLng >= MAP_BOUNDS[0][0] && poiLng <= MAP_BOUNDS[1][0] &&
          poiLat >= MAP_BOUNDS[0][1] && poiLat <= MAP_BOUNDS[1][1];
      });

      if (inBounds.length === 0) {
        // If nothing in bounds, show nearby results anyway
        this.displayPOIs(data.features.slice(0, 8));
      } else {
        this.displayPOIs(inBounds);
      }
    } catch (error) {
      console.error('Search error:', error);
      if (cardsList) cardsList.innerHTML = '<div class="no-results">Error loading places. Check console.</div>';
    }
  }

  private displayPOIs(features: any[]) {
    this.clearMarkers();
    const cardsList = document.getElementById('poi-cards-list');
    if (!cardsList || !this.map) return;
    cardsList.innerHTML = '';

    const pois: POI[] = features.map(f => {
      const p = f.properties || {};

      // Search Box API returns name in properties.name
      const name = p.name || p.place_name || 'Local Business';
      const address = p.full_address || p.address || p.place_formatted || 'Lake Nona, FL';
      const poiCategory = p.poi_category?.[0] || this.currentCategory.replace('-', ' ');

      // Mock data for premium feel
      const rating = 4 + (Math.random() * 0.9);
      const reviews = Math.floor(Math.random() * 500) + 50;
      const priceOptions = ['$', '$$', '$$$'];
      const priceLevel = priceOptions[Math.floor(Math.random() * 3)];

      return {
        id: f.id || Math.random().toString(36),
        name: name,
        address: address,
        category: poiCategory,
        coordinates: f.geometry?.coordinates as [number, number],
        rating: parseFloat(rating.toFixed(1)),
        reviews: reviews,
        imageUrl: `https://loremflickr.com/400/250/${this.currentCategory},business/all?lock=${name.length}`,
        priceLevel: priceLevel,
        isOpen: Math.random() > 0.3
      };
    });

    pois.forEach((poi) => {
      if (!poi.coordinates || !Array.isArray(poi.coordinates)) {
        console.warn('Invalid coordinates for POI:', poi.name);
        return;
      }

      // Create marker
      const marker = new mapboxgl.Marker({ color: '#f97316' })
        .setLngLat(poi.coordinates)
        .setPopup(new mapboxgl.Popup({ offset: 25 }).setHTML(`
          <div class="map-popup">
            <b>${poi.name}</b><br/>
            <span style="font-size: 11px;">${poi.address}</span>
          </div>
        `))
        .addTo(this.map!);

      this.markers.push(marker);

      // Create card
      const card = document.createElement('div');
      card.className = 'poi-card';
      card.innerHTML = `
        <div class="poi-image" style="background-image: url('${poi.imageUrl}')">
          <div class="poi-badges">
            ${poi.isOpen ? '<span class="status-badge open">Open Now</span>' : '<span class="status-badge closed">Closed</span>'}
            <span class="price-badge">${poi.priceLevel}</span>
          </div>
        </div>
        <div class="poi-info">
          <h4>${poi.name}</h4>
          <span class="poi-cat-label">${poi.category}</span>
          <div class="poi-meta">
            <div class="rating-box">
              <span class="stars">★★★★★</span>
              <span class="score">${poi.rating}</span>
              <span class="count">(${poi.reviews})</span>
            </div>
          </div>
          <p class="poi-addr-short">${poi.address}</p>
        </div>
      `;

      card.onclick = () => {
        this.map?.flyTo({ center: poi.coordinates, zoom: 16, duration: 1500 });
        marker.togglePopup();
      };

      cardsList.appendChild(card);
    });

    // Fit map to show all markers (within bounds)
    if (pois.length > 0 && this.map) {
      const bounds = new mapboxgl.LngLatBounds();
      pois.forEach(poi => {
        if (poi.coordinates) bounds.extend(poi.coordinates);
      });

      // Only fit if we have valid bounds
      if (!bounds.isEmpty()) {
        this.map.fitBounds(bounds, {
          padding: { top: 80, bottom: 280, left: 50, right: 50 },
          maxZoom: 15,
          duration: 1000
        });
      }
    }
  }

  private clearMarkers() {
    this.markers.forEach(m => m.remove());
    this.markers = [];
  }
}

new NeighborhoodExplorer();
