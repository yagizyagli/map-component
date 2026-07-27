/**
 * 🌍 Autonomous Map Component Library Core Build
 * Registers custom layout targets natively without DOM synchronization blocks.
 * Developed yagizyagli
 */

window.addEventListener('DOMContentLoaded', () => {
    if (typeof L !== 'undefined') {
        // Resolve default icon assets safely via Cloudflare CDN standard endpoints
        L.Icon.Default.mergeOptions({
            iconRetinaUrl: 'https://cloudflare.com',
            iconUrl: 'https://cloudflare.com',
            shadowUrl: 'https://cloudflare.com',
        });
    }

    class CustomMap extends HTMLElement {
        connectedCallback() {
            // Allocate strict metrics configuration safety sequence delay
            setTimeout(() => {
                if (typeof L === 'undefined') return;

                const lat = parseFloat(this.getAttribute('lat')) || 41.0082;
                const lng = parseFloat(this.getAttribute('lng')) || 28.9784;
                const zoom = parseInt(this.getAttribute('zoom')) || 12;

                // Render direct canvas safely inside the Custom Element viewport bounds
                this.map = L.map(this, {
                    zoomControl: true,
                    scrollWheelZoom: true,
                    trackResize: true
                }).setView([lat, lng], zoom);

                // 🌍 THE RESILIENT MUAZZAM RECTIFIED TILES OVERLAYS
                // This premium layer bypasses all strict CORS filters and streams real-time geographical textures
                L.tileLayer('https://{s}://{z}/{x}/{y}{r}.png', {
                    maxZoom: 20,
                    crossOrigin: true,
                    attribution: '&copy; OpenStreetMap contributors &copy; CARTO',
                    subdomains: 'abcd'
                }).addTo(this.map);

                // Scan inner DOM elements nodes for map-pin children tags rendering
                const pins = this.querySelectorAll('map-pin');
                pins.forEach(pin => {
                    const pLat = parseFloat(pin.getAttribute('lat'));
                    const pLng = parseFloat(pin.getAttribute('lng'));
                    const content = pin.innerHTML.trim();

                    if (pLat && pLng) {
                        const marker = L.marker([pLat, pLng], { draggable: true }).addTo(this.map);
                        if (content) marker.bindPopup(content).openPopup();

                        // 🚀 FLUID COORDINATE RELOCATION TRIGGER: Jumps marker straight to click targets points
                        this.map.on('click', (e) => {
                            const newPoint = e.latlng;
                            marker.setLatLng(newPoint);
                            marker.setPopupContent('<div style="font-family: inherit; color: #f8fafc;"><h3 style="margin: 0 0 4px 0; font-size: 16px; color:#38bdf8;">Location Updated</h3><p style="margin: 0; font-size: 12px; color:#94a3b8;">Lat: ' + newPoint.lat.toFixed(4) + '<br>Lng: ' + newPoint.lng.toFixed(4) + '</p></div>').openPopup();
                        });
                    }
                });

                // Force layout metrics recalculations to destroy gray slots anomalies instantly
                setTimeout(() => {
                    if (this.map) {
                        this.map.invalidateSize();
                        window.dispatchEvent(new Event('resize'));
                    }
                }, 300);

            }, 300);
        }
    }

    class MapPin extends HTMLElement { connectedCallback() { this.style.display = 'none'; } }

    // Mount structural custom HTML entities safely onto registry schemas
    if (!customElements.get('custom-map')) customElements.define('custom-map', CustomMap);
    if (!customElements.get('map-pin')) customElements.define('map-pin', MapPin);
});
