/**
 * 🌍 Map Component (Native Web Component Framework)
 * Developed by yagizyagli
 */

if (!document.querySelector('link[href*="leaflet.css"]')) {
    const leafletCSS = document.createElement('link');
    leafletCSS.rel = 'stylesheet';
    leafletCSS.href = 'https://unpkg.com';
    document.head.appendChild(leafletCSS);
}

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
  }
  .custom-map-container .leaflet-popup-content {
    font-size: 14px !important;
    line-height: 1.5 !important;
    color: #0f172a !important;
    margin: 8px 12px !important;
  }
`;
document.head.appendChild(styleDocument);

if (typeof L === 'undefined') {
    const leafletJS = document.createElement('script');
    leafletJS.src = 'https://unpkg.com';
    document.head.appendChild(leafletJS);
    leafletJS.onload = () => { initializeMapFramework(); };
} else {
    initializeMapFramework();
}

function initializeMapFramework() {
    delete L.Icon.Default.prototype._getIconUrl;
    L.Icon.Default.mergeOptions({
        iconRetinaUrl: 'https://unpkg.com',
        iconUrl: 'https://unpkg.com',
        shadowUrl: 'https://unpkg.com',
    });

    if (!customElements.get('custom-map')) customElements.define('custom-map', CustomMap);
    if (!customElements.get('map-pin')) customElements.define('map-pin', MapPin);
}

class CustomMap extends HTMLElement {
    connectedCallback() {
        setTimeout(() => {
            if (!this.id) this.id = 'map-' + Math.random().toString(36).substr(2, 9);
            this.classList.add('custom-map-container');

            const lat = parseFloat(this.getAttribute('lat')) || 41.0082;
            const lng = parseFloat(this.getAttribute('lng')) || 28.9784;
            const zoom = parseInt(this.getAttribute('zoom')) || 13;

            this.map = L.map(this.id, { zoomControl: true, scrollWheelZoom: true }).setView([lat, lng], zoom);

            // 🛠️ CROSS ORIGIN ENFORCED SAFELY FOR ALL USER IMPLEMENTATIONS
            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                maxZoom: 19,
                crossOrigin: true,
                attribution: '&copy; OpenStreetMap contributors'
            }).addTo(this.map);

            const pins = this.querySelectorAll('map-pin');
            pins.forEach(pin => {
                const pLat = parseFloat(pin.getAttribute('lat'));
                const pLng = parseFloat(pin.getAttribute('lng'));
                const content = pin.innerHTML.trim();
                if (pLat && pLng) {
                    const marker = L.marker([pLat, pLng]).addTo(this.map);
                    if (content) marker.bindPopup(content);
                }
            });
            
            setTimeout(() => {
                if (this.map) {
                    this.map.invalidateSize();
                    window.dispatchEvent(new Event('resize'));
                }
            }, 400);
        }, 200);
    }
}

class MapPin extends HTMLElement { connectedCallback() { this.style.display = 'none'; } }
