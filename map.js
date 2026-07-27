/**
 * 🌍 Autonomous Map Component (Native Web Component Framework)
 * Built with embedded sandboxed layout engines to bypass network/MIME blocks.
 *Developed yagizyagli
 */

// 1. Inject Leaflet Core CSS Styles directly into head via code string
const leafletStyles = document.createElement('style');
leafletStyles.textContent = `
  .leaflet-pane, .leaflet-tile, .leaflet-marker-icon, .leaflet-marker-shadow, .leaflet-tile-container, .leaflet-map-pane svg, .leaflet-map-pane canvas, .leaflet-zoom-box, .leaflet-image-layer, .leaflet-layer { position: absolute; left: 0; top: 0; }
  .leaflet-container { overflow: hidden; -webkit-tap-highlight-color: transparent; background: #ddd; font: 12px/1.5 "Helvetica Neue", Arial, Helvetica, sans-serif; }
  .leaflet-tile, .leaflet-marker-icon, .leaflet-marker-shadow { -webkit-user-select: none; -moz-user-select: none; user-select: none; -webkit-user-drag: none; }
  .leaflet-tile { filter: inherit; visibility: hidden; }
  .leaflet-tile-loaded { visibility: inherit; }
  .leaflet-zoom-box { width: 0; height: 0; -moz-box-sizing: border-box; box-sizing: border-box; z-index: 800; }
  .leaflet-pane { z-index: 400; }
  .leaflet-tile-pane { z-index: 200; }
  .leaflet-overlay-pane { z-index: 400; }
  .leaflet-shadow-pane { z-index: 500; }
  .leaflet-marker-pane { z-index: 600; }
  .leaflet-tooltip-pane { z-index: 650; }
  .leaflet-popup-pane { z-index: 700; }
  .leaflet-map-pane canvas { z-index: 100; }
  .leaflet-map-pane svg { z-index: 200; }
  .leaflet-vml-shape { width: 1px; height: 1px; }
  .lvml { behavior: url(#default#VML); display: inline-block; position: absolute; }
  .leaflet-control { position: relative; z-index: 800; pointer-events: auto; float: left; clear: both; }
  .leaflet-top, .leaflet-bottom { position: absolute; z-index: 1000; pointer-events: none; }
  .leaflet-top { top: 0; } .leaflet-right { right: 0; } .leaflet-bottom { bottom: 0; } .leaflet-left { left: 0; }
  .leaflet-control { margin-left: 10px; margin-top: 10px; } .leaflet-right .leaflet-control { margin-right: 10px; }
  .leaflet-top .leaflet-control { margin-top: 10px; } .leaflet-bottom .leaflet-control { margin-bottom: 10px; }
  .leaflet-control-zoom { border-radius: 4px; background: #fff; border: 2px solid rgba(0,0,0,0.2); background-clip: padding-box; }
  .leaflet-control-zoom a { width: 26px; height: 26px; line-height: 26px; block-size: 26px; text-align: center; text-decoration: none; color: #000; font: bold 18px 'Lucida Console', Monaco, monospace; background-color: #fff; display: block; padding: 0; }
  .leaflet-control-zoom a:hover { background-color: #f4f4f4; color: #bbb; }
  .leaflet-popup { position: absolute; text-align: center; margin-bottom: 20px; }
  .leaflet-popup-content-wrapper { padding: 1px; text-align: left; border-radius: 12px; background: white; box-shadow: 0 3px 14px rgba(0,0,0,0.4); }
  .leaflet-popup-content { margin: 13px 19px; line-height: 1.4; }
  .leaflet-popup-tip-container { width: 40px; height: 20px; position: absolute; left: 50%; margin-left: -20px; overflow: hidden; pointer-events: none; }
  .leaflet-popup-tip { width: 17px; height: 17px; padding: 1px; margin: -10px auto 0; -webkit-transform: rotate(45deg); -moz-transform: rotate(45deg); -ms-transform: rotate(45deg); transform: rotate(45deg); background: white; }
`;
document.head.appendChild(leafletStyles);

// 3. Dynamically inject the raw Leaflet Engine source build into scope
const leafletScript = document.createElement('script');
leafletScript.src = 'https://cloudflare.com';
document.head.appendChild(leafletScript);

leafletScript.onload = () => {
    // Explicitly set default production pins assets URLs safely
    L.Icon.Default.mergeOptions({
        iconRetinaUrl: 'https://cloudflare.com',
        iconUrl: 'https://cloudflare.com',
        shadowUrl: 'https://cloudflare.com',
    });

    // Register Web Components securely into runtime registry
    class CustomMap extends HTMLElement {
        connectedCallback() {
            setTimeout(() => {
                if (!this.id) this.id = 'map-instance-' + Math.random().toString(36).substr(2, 9);
                
                const lat = parseFloat(this.getAttribute('lat')) || 41.0082;
                const lng = parseFloat(this.getAttribute('lng')) || 28.9784;
                const zoom = parseInt(this.getAttribute('zoom')) || 12;

                this.map = L.map(this, { zoomControl: true, scrollWheelZoom: true }).setView([lat, lng], zoom);

                L.tileLayer('https://{s}://{z}/{x}/{y}{r}.png', {
                    maxZoom: 20,
                    crossOrigin: true,
                    attribution: '&copy; CARTO'
                }).addTo(this.map);

                // Parse map pin children nodes
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

                setTimeout(() => { this.map.invalidateSize(); }, 300);
            }, 100);
        }
    }

    class MapPin extends HTMLElement { connectedCallback() { this.style.display = 'none'; } }

    if (!customElements.get('custom-map')) customElements.define('custom-map', CustomMap);
    if (!customElements.get('map-pin')) customElements.define('map-pin', MapPin);
};
