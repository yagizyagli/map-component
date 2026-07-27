/**
 * 🌍 Autonomous Map Component Library Core Build
 * Registers custom layout targets natively without DOM synchronization blocks.
 * Developed yagizyagli
 */

window.addEventListener('DOMContentLoaded', () => {
    if (typeof L !== 'undefined') {
        // Correct default icons retrieval paths safely across cloudflare domains
        L.Icon.Default.mergeOptions({
            iconRetinaUrl: 'https://cloudflare.com',
            iconUrl: 'https://cloudflare.com',
            shadowUrl: 'https://cloudflare.com',
        });
    }

    class CustomMap extends HTMLElement {
        connectedCallback() {
            // Secure explicit container dimensions mapping allocation delay sequence
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

                // 🌍 CURSHUN GECIRMEZ CARTO_DB VOYAGER IMMINENT IMAGERY LAYERS
                // This network endpoint bypasses all CORS/MIME blocks and renders gorgeous dark/light maps maps grids
                L.tileLayer('https://{s}://{z}/{x}/{y}{r}.png', {
                    maxZoom: 20,
                    crossOrigin: true,
                    attribution: '&copy; OpenStreetMap contributors &copy; CARTO'
                }).addTo(this.map);

                // Scan inner markup children tags for map-pin entities rendering
                const pins = this.querySelectorAll('map-pin');
                pins.forEach(pin => {
                    const pLat = parseFloat(pin.getAttribute('lat'));
                    const pLng = parseFloat(pin.getAttribute('lng'));
                    const content = pin.innerHTML.trim();

                    if (pLat && pLng) {
                        // Create a fluid draggable map marker instance anchor node point
                        const marker = L.marker([pLat, pLng], { draggable: true }).addTo(this.map);
                        if (content) marker.bindPopup(content).openPopup();

                        // 🚀 DYNAMIC CLICK RELOCATION PIPELINE: Moves marker fluidly to any new coordinate map target point
                        this.map.on('click', (e) => {
                            const targetCoords = e.latlng;
                            marker.setLatLng(targetCoords);
                            marker.setPopupContent('<div style="font-family: inherit;"><h3 style="margin: 0 0 4px 0; font-size: 16px; color:#0284c7;">Location Updated</h3><p style="margin: 0; font-size: 12px; color:#475569;">Lat: ' + targetCoords.lat.toFixed(4) + '<br>Lng: ' + targetCoords.lng.toFixed(4) + '</p></div>').openPopup();
                        });
                    }
                });

                // Secondary layout recalculation observer tracking logic to destroy gray layout bugs instantly
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

            }, 200);
        }
    }

    class MapPin extends HTMLElement { connectedCallback() { this.style.display = 'none'; } }

    // Mount entities structures back inside custom elements browser registries securely
    if (!customElements.get('custom-map')) customElements.define('custom-map', CustomMap);
    if (!customElements.get('map-pin')) customElements.define('map-pin', MapPin);
});
