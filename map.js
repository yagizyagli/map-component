/**
 * 🌍 Autonomous Map Component Library Core Build
 * Registers custom layout targets natively without DOM synchronization blocks.
 */

window.addEventListener('DOMContentLoaded', () => {
    if (typeof L !== 'undefined') {
        // Resolve Leaflet default asset anchors securely via Cloudflare CDN
        L.Icon.Default.mergeOptions({
            iconRetinaUrl: 'https://cloudflare.com',
            iconUrl: 'https://cloudflare.com',
            shadowUrl: 'https://cloudflare.com',
        });
    }

    class CustomMap extends HTMLElement {
        connectedCallback() {
            setTimeout(() => {
                if (typeof L === 'undefined') return;

                const lat = parseFloat(this.getAttribute('lat')) || 41.0082;
                const lng = parseFloat(this.getAttribute('lng')) || 28.9784;
                const zoom = parseInt(this.getAttribute('zoom')) || 12;

                // Secure initialization directly bounded inside custom element canvas layout
                this.map = L.map(this, {
                    zoomControl: true,
                    scrollWheelZoom: true,
                    trackResize: true
                }).setView([lat, lng], zoom);

                // Cross-Origin safe, resilient global OpenTopoMap infrastructure network
                L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
                    maxZoom: 17,
                    crossOrigin: true,
                    attribution: '&copy; OpenStreetMap contributors, OpenTopoMap'
                }).addTo(this.map);

                // Track and mount child layout components markers
                const pins = this.querySelectorAll('map-pin');
                pins.forEach(pin => {
                    const pLat = parseFloat(pin.getAttribute('lat'));
                    const pLng = parseFloat(pin.getAttribute('lng'));
                    const content = pin.innerHTML.trim();

                    if (pLat && pLng) {
                        const marker = L.marker([pLat, pLng], { draggable: true }).addTo(this.map);
                        if (content) marker.bindPopup(content).openPopup();

                        // Relocation pipeline event trigger mapping tracking
                        this.map.on('click', (e) => {
                            const newPoint = e.latlng;
                            marker.setLatLng(newPoint);
                            marker.setPopupContent('<div style="font-family: inherit; color: #0f172a;"><h3 style="margin: 0 0 4px 0; font-size: 16px; color:#0284c7;">Location Updated</h3><p style="margin: 0; font-size: 12px; color:#475569;">Lat: ' + newPoint.lat.toFixed(4) + '<br>Lng: ' + newPoint.lng.toFixed(4) + '</p></div>').openPopup();
                        });
                    }
                });

                // Secondary canvas resize invalidation safety loop
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

    if (!customElements.get('custom-map')) customElements.define('custom-map', CustomMap);
    if (!customElements.get('map-pin')) customElements.define('map-pin', MapPin);
});
