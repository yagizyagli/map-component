const LEAFLET_CSS =
    "https://cdn.jsdelivr.net/npm/leaflet@1.9.4/dist/leaflet.css";

const LEAFLET_ICON_BASE =
    "https://cdn.jsdelivr.net/npm/leaflet@1.9.4/dist/images/";

const LEAFLET_TILE_URL =
    "https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png";


class CustomMap extends HTMLElement {

    static get observedAttributes() {
        return [
            "lat",
            "lng",
            "zoom"
        ];
    }


    static leafletConfigured = false;


    constructor() {

        super();

        this.attachShadow({
            mode: "open"
        });


        this.map = null;
        this.mapContainer = null;

        this.markerLayer = null;
        this.primaryMarker = null;

        this.markers = new Map();

        this.resizeObserver = null;
        this.mutationObserver = null;

        this.refreshTimer = null;

        this.initialized = false;
        this.initializing = false;
        this.internalUpdate = false;

        this.mapEventsRegistered = false;


        this.shadowRoot.innerHTML = `

            <link
                rel="stylesheet"
                href="${LEAFLET_CSS}"
            >

            <style>

                :host {
                    display: block;
                    width: 100%;
                    height: var(--map-height, 550px);
                    position: relative;
                    overflow: hidden;
                    border-radius: 16px;
                    background: #e2e8f0;
                }

                #map {
                    width: 100%;
                    height: 100%;
                }

                .leaflet-container {
                    width: 100%;
                    height: 100%;
                    font-family: inherit;
                }

                .leaflet-control-container {
                    z-index: 500;
                }

            </style>

            <div id="map"></div>
        `;


        this.mapContainer =
            this.shadowRoot.querySelector("#map");
    }


    connectedCallback() {

        if (this.initialized || this.initializing)
            return;

        this.initializing = true;

        this.loadLeaflet()
            .then(() => {

                if (!this.isConnected) {
                    this.initializing = false;
                    return;
                }

                this.waitForSize();

            })
            .catch(error => {

                this.initializing = false;

                console.error(
                    "CustomMap: Leaflet failed to load.",
                    error
                );

                this.dispatchEvent(
                    new CustomEvent(
                        "error",
                        {
                            detail: {
                                error
                            }
                        }
                    )
                );

            });
    }


    loadLeaflet() {

        if (window.L)
            return Promise.resolve(window.L);


        if (CustomMap.leafletPromise)
            return CustomMap.leafletPromise;


        CustomMap.leafletPromise =
            new Promise((resolve, reject) => {

                const existing =
                    document.querySelector(
                        'script[data-custom-map-leaflet]'
                    );


                if (existing) {

                    existing.addEventListener(
                        "load",
                        () => resolve(window.L),
                        { once: true }
                    );

                    existing.addEventListener(
                        "error",
                        reject,
                        { once: true }
                    );

                    return;
                }


                const script =
                    document.createElement("script");


                script.src =
                    "https://cdn.jsdelivr.net/npm/leaflet@1.9.4/dist/leaflet.js";

                script.async = true;

                script.dataset.customMapLeaflet = "";


                script.onload = () => {

                    if (window.L)
                        resolve(window.L);
                    else
                        reject(
                            new Error(
                                "Leaflet loaded but L is unavailable."
                            )
                        );

                };


                script.onerror = () => {

                    reject(
                        new Error(
                            "Unable to load Leaflet."
                        )
                    );

                };


                document.head.appendChild(script);

            });


        return CustomMap.leafletPromise;
    }


    waitForSize() {

        let tries = 0;


        const check = () => {

            if (!this.isConnected) {

                this.initializing = false;
                return;

            }


            if (
                this.offsetWidth > 0 &&
                this.offsetHeight > 0
            ) {

                this.initialize();
                return;

            }


            tries++;


            if (tries > 120) {

                this.initializing = false;

                console.warn(
                    "CustomMap: Container has no size."
                );

                return;

            }


            requestAnimationFrame(check);
        };


        check();
    }


    initialize() {

        if (
            this.initialized ||
            !window.L
        )
            return;


        this.configureLeaflet();


        const lat = this.getLatitude();
        const lng = this.getLongitude();
        const zoom = this.getZoom();


        this.map =
            window.L.map(
                this.mapContainer,
                {
                    zoomControl: true,
                    scrollWheelZoom: true
                }
            );


        this.map.setView(
            [
                lat,
                lng
            ],
            zoom
        );


        const tiles =
            window.L.tileLayer(
                LEAFLET_TILE_URL,
                {
                    attribution:
                        "&copy; OpenStreetMap contributors &copy; CARTO",

                    subdomains: [
                        "a",
                        "b",
                        "c",
                        "d"
                    ],

                    maxZoom: 20
                }
            );


        tiles.on(
            "tileerror",
            event => {

                this.dispatchEvent(
                    new CustomEvent(
                        "tileerror",
                        {
                            detail: {
                                event
                            }
                        }
                    )
                );

            }
        );


        tiles.addTo(this.map);


        this.markerLayer =
            window.L.layerGroup()
                .addTo(this.map);


        this.initialized = true;
        this.initializing = false;


        this.createPrimaryMarker();

        this.renderPins();

        this.registerEvents();

        this.observeResize();

        this.observeChanges();


        requestAnimationFrame(() => {

            if (this.map)
                this.map.invalidateSize({
                    animate: false
                });

        });


        this.dispatchEvent(
            new CustomEvent(
                "ready",
                {
                    detail: {
                        map: this.map,
                        component: this
                    }
                }
            )
        );
    }


    configureLeaflet() {

        if (
            CustomMap.leafletConfigured ||
            !window.L
        )
            return;


        delete window.L.Icon.Default.prototype._getIconUrl;


        window.L.Icon.Default.mergeOptions({

            iconRetinaUrl:
                `${LEAFLET_ICON_BASE}marker-icon-2x.png`,

            iconUrl:
                `${LEAFLET_ICON_BASE}marker-icon.png`,

            shadowUrl:
                `${LEAFLET_ICON_BASE}marker-shadow.png`

        });


        CustomMap.leafletConfigured = true;
    }


    getLatitude() {

        const value =
            parseFloat(
                this.getAttribute("lat")
            );


        return Number.isFinite(value)
            ? value
            : 41.0082;
    }


    getLongitude() {

        const value =
            parseFloat(
                this.getAttribute("lng")
            );


        return Number.isFinite(value)
            ? value
            : 28.9784;
    }


    getZoom() {

        const value =
            parseInt(
                this.getAttribute("zoom"),
                10
            );


        return Number.isFinite(value)
            ? value
            : 12;
    }


    createPrimaryMarker() {

        if (
            !this.map ||
            !this.markerLayer ||
            this.primaryMarker
        )
            return;


        this.primaryMarker =
            window.L.marker(
                [
                    this.getLatitude(),
                    this.getLongitude()
                ],
                {
                    draggable: true
                }
            );


        this.primaryMarker.addTo(
            this.markerLayer
        );


        this.updatePrimaryPopup(
            this.getLatitude(),
            this.getLongitude(),
            false
        );
    }


    updatePrimaryPopup(
        lat,
        lng,
        updated = true
    ) {

        if (!this.primaryMarker)
            return;


        this.primaryMarker.bindPopup(

            updated

                ? `
                    <b>Location Updated</b><br>
                    Lat: ${lat.toFixed(6)}<br>
                    Lng: ${lng.toFixed(6)}
                  `

                : `
                    <b>Location</b><br>
                    Lat: ${lat.toFixed(6)}<br>
                    Lng: ${lng.toFixed(6)}
                  `
        );
    }


    renderPins() {

        if (
            !this.markerLayer ||
            !window.L
        )
            return;


        this.clearSecondaryMarkers();


        const pins =
            this.querySelectorAll(
                "map-pin"
            );


        pins.forEach(pin => {

            const lat =
                parseFloat(
                    pin.getAttribute("lat")
                );


            const lng =
                parseFloat(
                    pin.getAttribute("lng")
                );


            if (
                !Number.isFinite(lat) ||
                !Number.isFinite(lng)
            )
                return;


            const marker =
                window.L.marker(
                    [
                        lat,
                        lng
                    ]
                );


            marker.addTo(
                this.markerLayer
            );


            const content =
                pin.innerHTML.trim();


            if (content)
                marker.bindPopup(content);


            const id =
                this.createId();


            this.markers.set(
                id,
                marker
            );

        });
    }


    clearSecondaryMarkers() {

        if (!this.markerLayer)
            return;


        this.markerLayer
            .getLayers()
            .forEach(layer => {

                if (
                    layer !== this.primaryMarker
                ) {

                    this.markerLayer.removeLayer(
                        layer
                    );

                }

            });


        this.markers.clear();
    }


    registerEvents() {

        if (
            !this.map ||
            this.mapEventsRegistered
        )
            return;


        this.mapEventsRegistered = true;


        this.map.on(
            "click",
            event => {

                this.updatePosition(
                    event.latlng.lat,
                    event.latlng.lng
                );

            }
        );


        if (this.primaryMarker) {

            this.primaryMarker.on(
                "dragend",
                event => {

                    const position =
                        event.target.getLatLng();


                    this.updatePosition(
                        position.lat,
                        position.lng
                    );

                }
            );

        }
    }


    updatePosition(
        lat,
        lng
    ) {

        if (!this.primaryMarker)
            return;


        this.primaryMarker.setLatLng(
            [
                lat,
                lng
            ]
        );


        this.updatePrimaryPopup(
            lat,
            lng,
            true
        );


        this.internalUpdate = true;


        this.setAttribute(
            "lat",
            String(lat)
        );


        this.setAttribute(
            "lng",
            String(lng)
        );


        this.internalUpdate = false;


        this.dispatchEvent(
            new CustomEvent(
                "locationchange",
                {
                    detail: {
                        lat,
                        lng
                    }
                }
            )
        );
    }


    observeResize() {

        if (this.resizeObserver)
            return;


        this.resizeObserver =
            new ResizeObserver(
                () => {

                    if (this.map) {

                        this.map.invalidateSize({
                            animate: false
                        });

                    }

                }
            );


        this.resizeObserver.observe(
            this
        );
    }


    observeChanges() {

        if (this.mutationObserver)
            return;


        this.mutationObserver =
            new MutationObserver(
                mutations => {

                    let refresh = false;


                    for (
                        const mutation of mutations
                    ) {

                        if (
                            mutation.type === "childList"
                        ) {

                            refresh = true;
                            break;

                        }


                        if (
                            mutation.type === "attributes" &&
                            mutation.target.tagName === "MAP-PIN"
                        ) {

                            refresh = true;
                            break;

                        }

                    }


                    if (!refresh)
                        return;


                    clearTimeout(
                        this.refreshTimer
                    );


                    this.refreshTimer =
                        setTimeout(
                            () => {

                                if (this.initialized)
                                    this.renderPins();

                            },
                            100
                        );

                }
            );


        this.mutationObserver.observe(
            this,
            {
                childList: true,
                subtree: true,
                attributes: true,
                attributeFilter: [
                    "lat",
                    "lng"
                ]
            }
        );
    }


    addPin(
        lat,
        lng,
        html = ""
    ) {

        if (
            !this.markerLayer ||
            !window.L
        )
            return null;


        if (
            !Number.isFinite(Number(lat)) ||
            !Number.isFinite(Number(lng))
        )
            return null;


        const marker =
            window.L.marker(
                [
                    Number(lat),
                    Number(lng)
                ]
            );


        marker.addTo(
            this.markerLayer
        );


        if (html)
            marker.bindPopup(html);


        const id =
            this.createId();


        this.markers.set(
            id,
            marker
        );


        this.dispatchEvent(
            new CustomEvent(
                "markeradd",
                {
                    detail: {
                        id,
                        marker,
                        lat: Number(lat),
                        lng: Number(lng)
                    }
                }
            )
        );


        return id;
    }


    removePin(id) {

        const marker =
            this.markers.get(id);


        if (
            !marker ||
            !this.markerLayer
        )
            return false;


        this.markerLayer.removeLayer(
            marker
        );


        this.markers.delete(
            id
        );


        this.dispatchEvent(
            new CustomEvent(
                "markerremove",
                {
                    detail: {
                        id
                    }
                }
            )
        );


        return true;
    }


    fitPins(
        includePrimary = true
    ) {

        if (
            !this.map ||
            !this.markerLayer ||
            !window.L
        )
            return false;


        let layers =
            this.markerLayer.getLayers();


        if (
            !includePrimary &&
            this.primaryMarker
        ) {

            layers =
                layers.filter(
                    layer =>
                        layer !== this.primaryMarker
                );

        }


        if (!layers.length)
            return false;


        const group =
            window.L.featureGroup(
                layers
            );


        const bounds =
            group.getBounds();


        if (!bounds.isValid())
            return false;


        this.map.fitBounds(
            bounds,
            {
                padding: [
                    40,
                    40
                ]
            }
        );


        return true;
    }


    setLocation(
        lat,
        lng,
        zoom = null
    ) {

        lat = Number(lat);
        lng = Number(lng);


        if (
            !Number.isFinite(lat) ||
            !Number.isFinite(lng)
        )
            return false;


        this.internalUpdate = true;


        this.setAttribute(
            "lat",
            String(lat)
        );


        this.setAttribute(
            "lng",
            String(lng)
        );


        if (zoom !== null) {

            zoom = Number(zoom);


            if (Number.isFinite(zoom)) {

                this.setAttribute(
                    "zoom",
                    String(zoom)
                );

            }

        }


        this.internalUpdate = false;


        if (this.map) {

            const targetZoom =
                zoom !== null &&
                Number.isFinite(Number(zoom))

                    ? Number(zoom)

                    : this.map.getZoom();


            this.map.setView(
                [
                    lat,
                    lng
                ],
                targetZoom,
                {
                    animate: true
                }
            );


            if (this.primaryMarker) {

                this.primaryMarker.setLatLng(
                    [
                        lat,
                        lng
                    ]
                );


                this.updatePrimaryPopup(
                    lat,
                    lng,
                    true
                );

            }

        }


        this.dispatchEvent(
            new CustomEvent(
                "locationchange",
                {
                    detail: {
                        lat,
                        lng,
                        zoom
                    }
                }
            )
        );


        return true;
    }


    getLocation() {

        return {
            lat: this.getLatitude(),
            lng: this.getLongitude(),
            zoom: this.getZoom()
        };
    }


    flyTo(
        lat,
        lng,
        zoom = this.getZoom()
    ) {

        lat = Number(lat);
        lng = Number(lng);
        zoom = Number(zoom);


        if (
            !this.map ||
            !Number.isFinite(lat) ||
            !Number.isFinite(lng) ||
            !Number.isFinite(zoom)
        )
            return false;


        this.map.flyTo(
            [
                lat,
                lng
            ],
            zoom,
            {
                animate: true,
                duration: 1
            }
        );


        if (this.primaryMarker) {

            this.primaryMarker.setLatLng(
                [
                    lat,
                    lng
                ]
            );


            this.updatePrimaryPopup(
                lat,
                lng,
                true
            );

        }


        this.setLocation(
            lat,
            lng,
            zoom
        );


        return true;
    }


    createId() {

        if (
            globalThis.crypto &&
            typeof globalThis.crypto.randomUUID === "function"
        ) {

            return globalThis.crypto.randomUUID();

        }


        return (
            "marker-" +
            Date.now() +
            "-" +
            Math.random()
                .toString(36)
                .slice(2)
        );
    }


    attributeChangedCallback(
        name,
        oldValue,
        newValue
    ) {

        if (
            oldValue === newValue ||
            !this.map ||
            this.internalUpdate
        )
            return;


        if (name === "zoom") {

            const zoom =
                this.getZoom();


            this.map.setZoom(
                zoom
            );


            return;
        }


        const lat =
            this.getLatitude();


        const lng =
            this.getLongitude();


        this.map.setView(
            [
                lat,
                lng
            ],
            this.map.getZoom(),
            {
                animate: true
            }
        );


        if (this.primaryMarker) {

            this.primaryMarker.setLatLng(
                [
                    lat,
                    lng
                ]
            );

        }
    }


    destroy() {

        clearTimeout(
            this.refreshTimer
        );


        this.refreshTimer = null;


        if (this.resizeObserver) {

            this.resizeObserver.disconnect();

            this.resizeObserver = null;

        }


        if (this.mutationObserver) {

            this.mutationObserver.disconnect();

            this.mutationObserver = null;

        }


        if (this.primaryMarker) {

            this.primaryMarker.off();

            this.primaryMarker = null;

        }


        this.markers.clear();


        if (this.markerLayer) {

            this.markerLayer.clearLayers();

            this.markerLayer.remove();

            this.markerLayer = null;

        }


        if (this.map) {

            this.map.off();

            this.map.remove();

            this.map = null;

        }


        this.mapEventsRegistered = false;

        this.initialized = false;
        this.initializing = false;
    }


    disconnectedCallback() {

        this.destroy();
    }
}


class MapPin extends HTMLElement {

    connectedCallback() {

        this.style.display = "none";

    }
}


if (
    !customElements.get("custom-map")
) {

    customElements.define(
        "custom-map",
        CustomMap
    );

}


if (
    !customElements.get("map-pin")
) {

    customElements.define(
        "map-pin",
        MapPin
    );

}


export {
    CustomMap,
    MapPin
};


export default CustomMap;
