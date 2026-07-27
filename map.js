/**
 * 🌍 Autonomous Map Component Library Core Build
 * Registers custom layout targets natively without DOM synchronization blocks.
 * Developed yagizyagli
 */

window.addEventListener('DOMContentLoaded', () => {
    if (typeof L !== 'undefined') {
        // Resolve Leaflet default asset anchors securely via Cloudflare CDN standard endpoints
        L.Icon.Default.mergeOptions({
            iconRetinaUrl: 'https://cloudflare.com',
            iconUrl: 'https://cloudflare.com',
            shadowUrl: 'https://cloudflare.com',
        });
    }

    class CustomMap extends HTMLElement {
        connectedCallback() {
            // Build absolute container setup delay sequence to avoid early rendering canvas crashes
            setTimeout(() => {
                if (typeof L === 'undefined') return;

                const lat = parseFloat(this.getAttribute('lat')) || 41.0082;
                const lng = parseFloat(this.getAttribute('lng')) || 28.9784;
                const zoom = parseInt(this.getAttribute('zoom')) || 12;

                // Render direct canvas safely inside the Custom Element viewport bounds with ALL plugins enabled
                this.map = L.map(this, {
                    zoomControl: true,
                    scrollWheelZoom: true,
                    trackResize: true
                }).setView([lat, lng], zoom);

                // Cross-Origin safe, resilient global CartoDB Voyager infrastructure layers network
                L.tileLayer('https://{s}://{z}/{x}/{y}{r}.png', {
                    maxZoom: 20,
                    crossOrigin: true,
                    attribution: '&copy; OpenStreetMap contributors &copy; CARTO',
                    subdomains: 'abcd'
                }).addTo(this.map);

                // Track and mount child layout components markers tags
                const pins = this.querySelectorAll('map-pin');
                pins.forEach(pin => {
                    const pLat = parseFloat(pin.getAttribute('lat'));
                    const pLng = parseFloat(pin.getAttribute('lng'));
                    const content = pin.innerHTML.trim();

                    if (pLat && pLng) {
                        const marker = L.marker([pLat, pLng], { draggable: true }).addTo(this.map);
                        if (content) marker.bindPopup(content).openPopup();

                        // 🚀 THE DYNAMIC CLICK TRIGGER: Moves marker fluidly to any new clicked coordinate map point
                        this.map.on('click', (e) => {
                            const newPoint = e.latlng;
                            marker.setLatLng(newPoint);
                            marker.setPopupContent('<div style="font-family: inherit; color: #0f172a;"><h3 style="margin: 0 0 4px 0; font-size: 16px; color:#0284c7;">Location Updated</h3><p style="margin: 0; font-size: 12px; color:#475569;">Lat: ' + newPoint.lat.toFixed(4) + '<br>Lng: ' + newPoint.lng.toFixed(4) + '</p></div>').openPopup();
                        });
                    }
                });

                // Secondary canvas resize invalidation observer layout safety tracking loops
                const resizeObserver = new ResizeObserver(() => {
                    if (this.map) this.map.invalidateSize();
                });
                resizeObserver.observe(this);

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

    // Mount objects onto standard element matrices safely
    if (!customElements.get('custom-map')) customElements.define('custom-map', CustomMap);
    if (!customElements.get('map-pin')) customElements.define('map-pin', MapPin);
});
