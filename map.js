/**
 * 🌍 Map Component (Native Web Component)
 * Developed by yagizyagli
 * Production-ready, zero-boilerplate interactive mapping framework.
 */

// 1. Automatically load Leaflet Core Styling if not already present
if (!document.querySelector('link[href*="leaflet.css"]')) {
    const leafletCSS = document.createElement('link');
    leafletCSS.rel = 'stylesheet';
    leafletCSS.href = 'https://unpkg.com';
    document.head.appendChild(leafletCSS);
}

// 2. Inject Premium Modern Global Styles into Document Architecture
const styleDocument = document.createElement('style');
styleDocument.textContent = `
  custom-map {
    animation: mapFrameworkFadeIn 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards;
    opacity: 0;
  }
  @keyframes mapFrameworkFadeIn { to { opacity: 1; } }

  .custom-map-container .leaflet-popup-content-wrapper {
    background: rgba(255, 255, 255, 0.95) !important;
    backdrop-filter: blur(8px) !important;
    border-radius: 12px !important;
    box-shadow: 0 8px 24px rgba(0,0,0,0.12) !important;
    padding: 6px !important;
    border: 1px solid rgba(0,0,0,0.04) !important;
  }
  .custom-map-container .leaflet-popup-content {
    font-size: 14px !important;
    line-height: 1.5 !important;
    color: #0f172a !important;
    margin: 8px 12px !important;
  }
  .custom-map-container .leaflet-popup-tip {
    background: rgba(255, 255, 255, 0.95) !important;
    backdrop-filter: blur(8px) !important;
  }
  .custom-map-container .leaflet-container a.leaflet-popup-close-button {
    color: #64748b !important;
    padding: 8px 12px 0 0 !important;
  }
`;
document.head.appendChild(styleDocument);

// 3. Dynamically Load Leaflet Core Engine Script with Absolute Isolation
if (typeof L === 'undefined') {
    const leafletJS = document.createElement('script');
    leafletJS.src = 'https://unpkg.com';
    document.head.appendChild(leafletJS);

    leafletJS.onload = () => {
        initializeMapFramework();
    };
} else {
    initializeMapFramework();
}

// 4. Framework Orchestration and Custom Elements Registry
function initializeMapFramework() {
    // Explicitly fix Leaflet's broken default marker icon image asset paths globally
    delete L.Icon.Default.prototype._getIconUrl;
    L.Icon.Default.mergeOptions({
        iconRetinaUrl: 'https://unpkg.com',
        iconUrl: 'https://unpkg.com',
        shadowUrl: 'https://unpkg.com',
    });

    if (!customElements.get('custom-map')) {
        customElements.define('custom-map', CustomMap);
    }
    if (!customElements.get('map-pin')) {
        customElements.define('map-pin', MapPin);
    }
}

// 5. Define Main <custom-map> Component Architecture
class CustomMap extends HTMLElement {
    connectedCallback() {
        // Double nested frame rendering buffer to secure bounding box piksels
        requestAnimationFrame(() => {
            requestAnimationFrame(() => {
                if (!this.id) {
                    this.id = 'map-' + Math.random().toString(36).substr(2, 9);
                }

                this.classList.add('custom-map-container');
                this.style.display = 'block';

                const lat = parseFloat(this.getAttribute('lat')) || 41.0082;
                const lng = parseFloat(this.getAttribute('lng')) || 28.9784;
                const zoom = parseInt(this.getAttribute('zoom')) || 13;

                // Instantiate Leaflet Context Map safely
                this.map = L.map(this.id, {
                    zoomControl: true,
                    scrollWheelZoom: true,
                    trackResize: true
                }).setView([lat, lng], zoom);

                // Attach secure mapping tiles from OpenStreetMap CDN
                L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                    maxZoom: 19,
                    attribution: '&copy; <a href="https://openstreetmap.org">OpenStreetMap</a> contributors'
                }).addTo(this.map);

                // Scan and parse children nodes markup for Map Pins
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
                
                // Force size re-calculations to destroy all gray tile constraints natively
                setTimeout(() => {
                    if (this.map) {
                        this.map.invalidateSize(true);
                        window.dispatchEvent(new Event('resize'));
                    }
                }, 400);
            });
        });
    }
}

// 6. Define Meta <map-pin> Data Node
class MapPin extends HTMLElement {
    connectedCallback() {
        this.style.display = 'none';
    }
}
