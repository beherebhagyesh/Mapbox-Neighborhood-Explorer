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
    // API KEY SAVE
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
      maxBounds: [
        [-81.32, 28.32],  // Southwest corner (with padding)
        [-81.22, 28.42]   // Northeast corner (with padding)
      ],
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
    const mapping: Record<string, string> = {
      'highlights': 'tourist_attraction',
      'grocery': 'grocery',
      'food-drink': 'food_and_drink',
      'parks': 'park',
      'shopping': 'shopping',
      'sports': 'fitness',
      'entertainment': 'entertainment'
    };
    return mapping[category] || 'point_of_interest';
  }

  private async fetchPOIs() {
    if (!this.map || !this.accessToken) return;

    const cardsList = document.getElementById('poi-cards-list');
    if (cardsList) cardsList.innerHTML = '<div class="loading-state">Exploring the neighborhood...</div>';

    const [lng, lat] = NEIGHBORHOOD_CENTER;
    const category = this.getSearchCategory(this.currentCategory);

    // Primary Search: Mapbox Search Box API (v1) - Category specific
    // This is the most modern and robust way to find POIs by category
    const url = `https://api.mapbox.com/search/searchbox/v1/category/${category}?proximity=${lng},${lat}&access_token=${this.accessToken}&limit=12`;

    try {
      const response = await fetch(url);
      const data = await response.json();

      if (!data.features || data.features.length === 0) {
        // Switch to fallback if Search Box returns nothing
        await this.fetchPOIsFallback();
        return;
      }

      this.displayPOIs(data.features, 'searchbox');
    } catch (error) {
      console.error('Search Box API error, trying fallback...', error);
      await this.fetchPOIsFallback();
    }
  }

  private async fetchPOIsFallback() {
    if (!this.map || !this.accessToken) return;

    const [lng, lat] = NEIGHBORHOOD_CENTER;
    const query = this.currentCategory.replace('-', ' ');

    // Fallback Search: Mapbox Geocoding API (v5) - Free text
    // We remove the 'types=poi' to be more broad if specific POIs aren't found
    const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(query)}.json?proximity=${lng},${lat}&access_token=${this.accessToken}&limit=12`;

    try {
      const response = await fetch(url);
      const data = await response.json();

      const cardsList = document.getElementById('poi-cards-list');
      if (!data.features || data.features.length === 0) {
        if (cardsList) cardsList.innerHTML = '<div class="no-results">No locations found. Try another category or zoom out.</div>';
        this.clearMarkers();
        return;
      }

      this.displayPOIs(data.features, 'geocoding');
    } catch (error) {
      console.error('Fallback error:', error);
      const cardsList = document.getElementById('poi-cards-list');
      if (cardsList) cardsList.innerHTML = '<div class="no-results">Error connecting to map services.</div>';
    }
  }

  private displayPOIs(features: any[], type: 'searchbox' | 'geocoding') {
    this.clearMarkers();
    const cardsList = document.getElementById('poi-cards-list');
    if (!cardsList) return;
    cardsList.innerHTML = '';

    const pois: POI[] = features.map(f => {
      const p = f.properties || {};
      const name = type === 'searchbox' ? p.name : f.text;

      // Better Mock Data for Premium Feel
      const rating = 4 + (Math.random() * 0.9);
      const reviews = Math.floor(Math.random() * 500) + 50;
      const priceOptions = ['$', '$$', '$$$', '$$$$'];
      const priceLevel = priceOptions[Math.floor(Math.random() * 3)];

      return {
        id: f.id,
        name: name || 'Local Spot',
        address: type === 'searchbox' ? p.full_address || p.address || 'Lake Nona' : f.place_name?.split(',')[0] || 'Lake Nona South',
        category: (type === 'searchbox' ? p.poi_category?.[0] : p.category) || this.currentCategory.replace('-', ' '),
        coordinates: f.geometry?.coordinates || f.center,
        rating: parseFloat(rating.toFixed(1)),
        reviews: reviews,
        imageUrl: `https://loremflickr.com/400/250/${this.currentCategory.replace('-', ',')},modern/all?lock=${f.id.length}`,
        priceLevel: priceLevel,
        isOpen: Math.random() > 0.3
      };
    });

    pois.forEach((poi) => {
      const finalImg = poi.imageUrl;

      // Marker
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

      // Card
      const card = document.createElement('div');
      card.className = 'poi-card';
      card.innerHTML = `
        <div class="poi-image" style="background-image: url('${finalImg}')">
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
        this.map?.flyTo({ center: poi.coordinates, zoom: 16, duration: 2000 });
        marker.togglePopup();
      };
      cardsList.appendChild(card);
    });

    if (pois.length > 0 && this.map) {
      const bounds = new mapboxgl.LngLatBounds();
      pois.forEach(poi => bounds.extend(poi.coordinates));
      this.map.fitBounds(bounds, { padding: { top: 100, bottom: 350, left: 60, right: 60 }, maxZoom: 15 });
    }
  }

  private clearMarkers() {
    this.markers.forEach(m => m.remove());
    this.markers = [];
  }
}

new NeighborhoodExplorer();
