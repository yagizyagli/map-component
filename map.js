// 1. Inject Premium CSS Styles directly into Head
const styleDocument = document.createElement('style');
styleDocument.textContent = `
  custom-map {
    animation: mapFadeIn 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards;
    opacity: 0;
  }
  @keyframes mapFadeIn { to { opacity: 1; } }

  custom-map.custom-map-container {
    border-radius: 16px;
    overflow: hidden;
    box-shadow: 0 10px 30px -10px rgba(0, 0, 0, 0.5);
    border: 1px solid rgba(255, 255, 255, 0.1);
  }

  .custom-map-container .leaflet-popup-content-wrapper {
    background: rgba(255, 255, 255, 0.95) !important;
    backdrop-filter: blur(8px) !important;
    border-radius: 12px !important;
    padding: 6px !important;
  }
  .custom-map-container .leaflet-popup-content {
    color: #0f172a !important;
  }
`;
document.head.appendChild(styleDocument);

// 2. Override default marker asset paths securely
if (typeof L !== 'undefined') {
    delete L.Icon.Default.prototype._getIconUrl;
    L.Icon.Default.mergeOptions({
        iconRetinaUrl: 'https://unpkg.com',
        iconUrl: 'https://unpkg.com',
        shadowUrl: 'https://unpkg.com',
    });
}

// 3. Define Main <custom-map> Component
class CustomMap extends HTMLElement {
    connectedCallback() {
        setTimeout(() => {
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
                scrollWheelZoom: true
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
            
            // Force rendering recalculation
            setTimeout(() => { 
                this.map.invalidateSize(); 
                window.dispatchEvent(new Event('resize'));
            }, 200);
        }, 150);
    }
}

class MapPin extends HTMLElement {
    connectedCallback() {
        this.style.display = 'none';
    }
}

// Register Web Components safely
if (!customElements.get('custom-map')) {
    customElements.define('custom-map', CustomMap);
}
if (!customElements.get('map-pin')) {
    customElements.define('map-pin', MapPin);
}
