/**
 * 🌍 Autonomous Map Component Library Core Build
 * Registers custom layout targets natively without DOM synchronization blocks.
 * Developed yagizyagli
 */

window.addEventListener('DOMContentLoaded', () => {
    if (typeof L !== 'undefined') {
        // Correct default icons retrieval scopes safely
        L.Icon.Default.mergeOptions({
            iconRetinaUrl: 'https://cloudflare.com',
            iconUrl: 'https://cloudflare.com',
            shadowUrl: 'https://cloudflare.com',
        });
    }

    class CustomMap extends HTMLElement {
        connectedCallback() {
            // Build rigid delay sequence to ensure styles and canvas are safely mounted into memory
            setTimeout(() => {
                const lat = parseFloat(this.getAttribute('lat')) || 41.0082;
                const lng = parseFloat(this.getAttribute('lng')) || 28.9784;
                const zoom = parseInt(this.getAttribute('zoom')) || 12;

                // Render direct canvas safely inside the Custom Element viewport bounds
                this.map = L.map(this, {
                    zoomControl: true,
                    scrollWheelZoom: true,
                    trackResize: true
                }).setView([lat, lng], zoom);

                // Pure resilient cross-origin safe CartoDB imagery provider mapping
                L.tileLayer('https://{s}://{z}/{x}/{y}{r}.png', {
                    maxZoom: 20,
                    crossOrigin: true,
                    attribution: '&copy; CARTO'
                }).addTo(this.map);

                // Scan inner DOM elements nodes safely for layout pins rendering
                const pins = this.querySelectorAll('map-pin');
                pins.forEach(pin => {
                    const pLat = parseFloat(pin.getAttribute('lat'));
                    const pLng = parseFloat(pin.getAttribute('lng'));
                    const content = pin.innerHTML.trim();

                    if (pLat && pLng) {
                        const marker = L.marker([pLat, pLng]).addTo(this.map);
                        if (content) marker.bindPopup(content).openPopup();

                        // Enable responsive click mapping re-route on e targets coordinates click
                        this.map.on('click', (e) => {
                            const newPoint = e.latlng;
                            marker.setLatLng(newPoint);
                            marker.setPopupContent('<div style="font-family: inherit;"><h3 style="margin: 0 0 4px 0; font-size: 16px; color:#0284c7;">Location Updated</h3><p style="margin: 0; font-size: 12px; color:#475569;">Lat: ' + newPoint.lat.toFixed(4) + '<br>Lng: ' + newPoint.lng.toFixed(4) + '</p></div>').openPopup();
                        });
                    }
                });

                // Force layout recalculations to guarantee map tiles sizing updates instantly
                setTimeout(() => {
                    if (this.map) {
                        this.map.invalidateSize();
                        window.dispatchEvent(new Event('resize'));
                    }
                }, 300);

            }, 250);
        }
    }

    class MapPin extends HTMLElement { connectedCallback() { this.style.display = 'none'; } }

    // Register objects onto customElements schema layout matrix securely
    if (!customElements.get('custom-map')) customElements.define('custom-map', CustomMap);
    if (!customElements.get('map-pin')) customElements.define('map-pin', MapPin);
});
