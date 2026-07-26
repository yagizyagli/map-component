/**
 * 🌍 Map Component (Native Web Component Framework)
 * Developed by yagizyagli — v1.0.0 Production Ready
 * 
 * A zero-boilerplate, lightweight custom HTML element architecture 
 * built to integrate fully interactive maps using raw tags.
 */

// 1. Automatically inject secure Leaflet Core Styling inside document head if not present
if (!document.querySelector('link[href*="leaflet.css"]')) {
    const leafletCSS = document.createElement('link');
    leafletCSS.rel = 'stylesheet';
    leafletCSS.href = 'https://unpkg.com';
    document.head.appendChild(leafletCSS);
}

// 2. Inject Premium Modern Popups UI Styles into Document Head Architecture
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
`;
document.head.appendChild(styleDocument);

// 3. Dynamically Load Leaflet Core Engine Script securely across global runtime
if (typeof L === 'undefined') {
    const leafletJS = document.createElement('script');
    leafletJS.src = 'https://unpkg.com';
    document.head.appendChild(leafletJS);
    leafletJS.onload = () => { initializeMapFramework(); };
} else {
    initializeMapFramework();
}

/**
 * Orchestrates global component lifecycle and resolves image asset path assets
 */
function initializeMapFramework() {
    // Explicitly override and fix default marker asset paths globally across CDN bounds
    delete L.Icon.Default.prototype._getIconUrl;
    L.Icon.Default.mergeOptions({
        iconRetinaUrl: 'https://unpkg.com',
        iconUrl: 'https://unpkg.com',
        shadowUrl: 'https://unpkg.com',
    });

    // Securely register components into the custom elements registry
    if (!customElements.get('custom-map')) customElements.define('custom-map', CustomMap);
    if (!customElements.get('map-pin')) customElements.define('map-pin', MapPin);
}

// 4. Define Main Component HTMLElement Architecture
class CustomMap extends HTMLElement {
    connectedCallback() {
        setTimeout(() => {
            if (typeof L === 'undefined') return; // Lifecycle protection boundary
            if (!this.id) this.id = 'map-' + Math.random().toString(36).substr(2, 9);
            this.classList.add('custom-map-container');

            const lat = parseFloat(this.getAttribute('lat')) || 41.0082;
            const lng = parseFloat(this.getAttribute('lng')) || 28.9784;
            const zoom = parseInt(this.getAttribute('zoom')) || 13;

            // Instantiate native Leaflet viewport framework
            this.map = L.map(this.id, { zoomControl: true, scrollWheelZoom: true }).setView([lat, lng], zoom);

            // Fetch and mount robust secure CartoDB Voyager tile network layers
            L.tileLayer('https://{s}://{z}/{x}/{y}{r}.png', {
                maxZoom: 20,
                crossOrigin: true, // Bypass cross-origin isolation blocks natively
                attribution: '&copy; <a href="https://openstreetmap.org">OpenStreetMap</a> contributors &copy; <a href="https://carto.com">CARTO</a>',
                subdomains: 'abcd'
            }).addTo(this.map);

            // Scan, parse and deploy interactive child node pin markers
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
            
            // Force rendering recalculations to instantly destroy gray tile layout lag
            setTimeout(() => {
                if (this.map) {
                    this.map.invalidateSize();
                    window.dispatchEvent(new Event('resize'));
                }
            }, 300);
        }, 200);
    }
}

// 5. Define Meta Data Storage Element Node
class MapPin extends HTMLElement { 
    connectedCallback() { 
        this.style.display = 'none'; 
    } 
}
