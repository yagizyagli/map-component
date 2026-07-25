// 1. Inject CSS Rules (Using precise class selection to override default Leaflet styles naturally)
const styleDocument = document.createElement('style');
styleDocument.textContent = `
  @import url('https://unpkg.com');
  
  /* Smooth entry animation */
  custom-map {
    animation: mapFadeIn 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards;
    opacity: 0;
  }
  @keyframes mapFadeIn { to { opacity: 1; } }

  /* Premium Modern Map Container */
  custom-map.custom-map-container {
    border-radius: 16px;
    overflow: hidden;
    box-shadow: 0 10px 30px -10px rgba(0, 0, 0, 0.15);
    border: 1px solid rgba(0, 0, 0, 0.05);
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  }

  /* Natural specification overrides for Leaflet Popups */
  .custom-map-container .leaflet-popup-content-wrapper {
    background: rgba(255, 255, 255, 0.95);
    backdrop-filter: blur(8px);
    border-radius: 12px;
    box-shadow: 0 8px 24px rgba(0,0,0,0.12);
    padding: 6px;
    border: 1px solid rgba(0,0,0,0.04);
  }
  
  .custom-map-container .leaflet-popup-content {
    font-size: 14px;
    line-height: 1.5;
    color: #1e293b;
    margin: 8px 12px;
  }
  
  .custom-map-container .leaflet-popup-tip {
    background: rgba(255, 255, 255, 0.95);
    backdrop-filter: blur(8px);
  }
  
  .custom-map-container .leaflet-container a.leaflet-popup-close-button {
    color: #64748b;
    padding: 8px 12px 0 0;
  }
`;
document.head.appendChild(styleDocument);

// 2. Load Leaflet Core Engine
const leafletJS = document.createElement('script');
leafletJS.src = 'https://unpkg.com';
document.head.appendChild(leafletJS);

leafletJS.onload = () => {
    customElements.define('custom-map', CustomMap);
    customElements.define('map-pin', MapPin);
};

// 3. Define Main <custom-map> Component
class CustomMap extends HTMLElement {
    connectedCallback() {
        if (!this.id) {
            this.id = 'map-' + Math.random().toString(36).substr(2, 9);
        }

        this.classList.add('custom-map-container');
        this.style.display = 'block';
        this.style.width = this.getAttribute('width') || '100%';
        this.style.height = this.getAttribute('height') || '450px';

        const lat = parseFloat(this.getAttribute('lat')) || 41.0082;
        const lng = parseFloat(this.getAttribute('lng')) || 28.9784;
        const zoom = parseInt(this.getAttribute('zoom')) || 13;

        this.map = L.map(this.id, {
            zoomControl: true,
            scrollWheelZoom: true
        }).setView([lat, lng], zoom);

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '© OpenStreetMap contributors'
        }).addTo(this.map);

        setTimeout(() => {
            const pins = this.querySelectorAll('map-pin');
            pins.forEach(pin => {
                const pLat = parseFloat(pin.getAttribute('lat'));
                const pLng = parseFloat(pin.getAttribute('lng'));
                const content = pin.innerHTML.trim();

                if (pLat && pLng) {
                    const marker = L.marker([pLat, pLng]).addTo(this.map);
                    if (content) {
                        marker.bindPopup(content);
                    }
                }
            });
        }, 150);
    }
}

// 4. Define Meta <map-pin> Data Component
class MapPin extends HTMLElement {
    connectedCallback() {
        this.style.display = 'none';
    }
}
