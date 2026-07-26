// 1. Inject Premium CSS Styles into Document Head Safely
const styleDocument = document.createElement('style');
styleDocument.textContent = `
  custom-map {
    animation: mapFadeIn 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards;
    opacity: 0;
  }
  @keyframes mapFadeIn { to { opacity: 1; } }

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

// 2. Load Leaflet Core Engine Script
const leafletJS = document.createElement('script');
leafletJS.src = 'https://unpkg.com';
document.head.appendChild(leafletJS);

leafletJS.onload = () => {
    // Override default marker asset paths securely
    delete L.Icon.Default.prototype._getIconUrl;
    L.Icon.Default.mergeOptions({
        iconRetinaUrl: 'https://unpkg.com',
        iconUrl: 'https://unpkg.com',
        shadowUrl: 'https://unpkg.com',
    });

    customElements.define('custom-map', CustomMap);
    customElements.define('map-pin', MapPin);
};

// 3. Define Main <custom-map> Component
class CustomMap extends HTMLElement {
    connectedCallback() {
        // Use MutationObserver or double nested requestAnimationFrame to ensure DOM is fully ready
        requestAnimationFrame(() => {
            requestAnimationFrame(() => {
                if (!this.id) {
                    this.id = 'map-' + Math.random().toString(36).substr(2, 9);
                }

                this.classList.add('custom-map-container');

                const lat = parseFloat(this.getAttribute('lat')) || 41.0082;
                const lng = parseFloat(this.getAttribute('lng')) || 28.9784;
                const zoom = parseInt(this.getAttribute('zoom')) || 13;

                // Initialize Map Object
                this.map = L.map(this.id, {
                    zoomControl: true,
                    scrollWheelZoom: true,
                    trackResize: true
                }).setView([lat, lng], zoom);

                // Load Tile Layer map graphics securely from OpenStreetMap CDN
                L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                    maxZoom: 19,
                    attribution: '&copy; <a href="https://openstreetmap.org">OpenStreetMap</a> contributors'
                }).addTo(this.map);

                // Process Interactive Map Pins
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
                
                // 🛠️ THE ULTIMATE ENGINE FIX: Trigger size re-calculations multi-dimensionally
                // This forcefully renders the map blocks directly into the allocated grid box layout!
                setTimeout(() => {
                    if (this.map) {
                        this.map.invalidateSize(true);
                        window.dispatchEvent(new Event('resize'));
                    }
                }, 500);
            });
        });
    }
}

class MapPin extends HTMLElement {
    connectedCallback() {
        this.style.display = 'none';
    }
}
