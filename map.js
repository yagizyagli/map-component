/**
 * Custom Map Component
 * Production Grade Leaflet Web Component
 *
 * Version: 4.0
 *
 * Features:
 * - Shadow DOM
 * - Leaflet 1.9.x
 * - Reactive attributes
 * - Marker registry
 * - Memory safe lifecycle
 * - Reconnect safe
 * - Custom events
 * - Public API
 *
 * Author: yagizyagli
 */


class CustomMap extends HTMLElement {


    static get observedAttributes(){

        return [
            "lat",
            "lng",
            "zoom"
        ];

    }


    static leafletConfigured = false;



    constructor(){

        super();


        this.attachShadow({
            mode:"open"
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

        this.internalUpdate = false;



        this.shadowRoot.innerHTML = `

        <link
        rel="stylesheet"
        href="https://cdn.jsdelivr.net/npm/leaflet@1.9.4/dist/leaflet.css"
        >


        <style>

        :host{

            display:block;

            width:100%;

            height:var(--map-height,550px);

            position:relative;

            overflow:hidden;

            border-radius:16px;

            background:#1e293b;

        }


        #map{

            width:100%;

            height:100%;

        }


        .leaflet-container{

            width:100%;

            height:100%;

            font-family:inherit;

        }


        .leaflet-control-container{

            z-index:500;

        }


        </style>


        <div id="map"></div>

        `;



        this.mapContainer =
            this.shadowRoot.querySelector("#map");


    }





    connectedCallback(){


        if(this.initialized)
            return;



        if(typeof L === "undefined"){

            console.error(
                "CustomMap: Leaflet missing."
            );

            return;

        }


        this.waitForSize();


    }





    waitForSize(){


        let tries = 0;


        const check = ()=>{


            if(
                this.offsetWidth > 0 &&
                this.offsetHeight > 0
            ){

                this.initialize();

                return;

            }



            tries++;



            if(tries > 60){

                console.warn(
                    "CustomMap: No container size."
                );

                return;

            }



            requestAnimationFrame(check);


        };


        check();


    }





    initialize(){


        if(this.initialized)
            return;



        this.configureLeaflet();



        this.map =
            L.map(
                this.mapContainer,
                {

                    zoomControl:true,

                    scrollWheelZoom:true

                }

            )
            .setView(
                [
                    this.getLatitude(),
                    this.getLongitude()
                ],
                this.getZoom()
            );




        const tiles =
            L.tileLayer(

              https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png


            {

                attribution:
                "&copy; OpenStreetMap contributors &copy; OpenStreetMap",

                subdomains:[
                    "a",
                    "b",
                    "c",
                    "d"
                ],

                maxZoom:20

            });


        tiles.on(
            "tileerror",
            ()=>{
                this.dispatchEvent(
                    new CustomEvent(
                        "tileerror"
                    )
                );
            }
        );


        tiles.addTo(this.map);




        this.markerLayer =
            L.layerGroup()
            .addTo(this.map);



        this.initialized = true;



        this.createPrimaryMarker();


        this.renderPins();


        this.registerEvents();


        this.observeResize();


        this.observeChanges();



        this.dispatchEvent(
            new CustomEvent(
                "ready",
                {
                    detail:{
                        map:this.map
                    }
                }
            )
        );


    }





    configureLeaflet(){


        if(
            CustomMap.leafletConfigured
        )
            return;



        delete L.Icon.Default.prototype._getIconUrl;



        L.Icon.Default.mergeOptions({

            iconRetinaUrl:
            "https://cdn.jsdelivr.net/npm/leaflet@1.9.4/dist/images/marker-icon-2x.png",


            iconUrl:
            "https://cdn.jsdelivr.net/npm/leaflet@1.9.4/dist/images/marker-icon.png",


            shadowUrl:
            "https://cdn.jsdelivr.net/npm/leaflet@1.9.4/dist/images/marker-shadow.png"

        });



        CustomMap.leafletConfigured = true;


    }





    getLatitude(){

        const value =
            parseFloat(
                this.getAttribute("lat")
            );


        return Number.isFinite(value)
            ? value
            : 41.0082;

    }





    getLongitude(){

        const value =
            parseFloat(
                this.getAttribute("lng")
            );


        return Number.isFinite(value)
            ? value
            : 28.9784;

    }





    getZoom(){

        const value =
            parseInt(
                this.getAttribute("zoom"),
                10
            );


        return Number.isFinite(value)
            ? value
            : 12;

    }
      createPrimaryMarker(){


        if(
            !this.map ||
            !this.markerLayer ||
            this.primaryMarker
        )
            return;



        this.primaryMarker =
            L.marker(
                [
                    this.getLatitude(),
                    this.getLongitude()
                ],
                {
                    draggable:true
                }
            )
            .addTo(this.markerLayer);



        this.updatePrimaryPopup(
            this.getLatitude(),
            this.getLongitude(),
            false
        );


    }





    updatePrimaryPopup(
        lat,
        lng,
        updated=true
    ){


        if(!this.primaryMarker)
            return;



        this.primaryMarker.bindPopup(

            updated

            ?

            `
            <b>Location Updated</b><br>
            Lat: ${lat.toFixed(6)}<br>
            Lng: ${lng.toFixed(6)}
            `

            :

            `
            <b>Location</b><br>
            Lat: ${lat.toFixed(6)}<br>
            Lng: ${lng.toFixed(6)}
            `

        );


    }





    renderPins(){


        if(
            !this.markerLayer
        )
            return;



        this.clearSecondaryMarkers();



        const pins =
            this.querySelectorAll(
                "map-pin"
            );



        pins.forEach(pin=>{


            const lat =
                parseFloat(
                    pin.getAttribute("lat")
                );


            const lng =
                parseFloat(
                    pin.getAttribute("lng")
                );



            if(
                !Number.isFinite(lat) ||
                !Number.isFinite(lng)
            )
                return;



            const marker =
                L.marker(
                    [
                        lat,
                        lng
                    ]
                )
                .addTo(this.markerLayer);



            const html =
                pin.innerHTML.trim();



            if(html)
                marker.bindPopup(html);



            const id =
                crypto.randomUUID();



            this.markers.set(
                id,
                marker
            );



        });


    }





    clearSecondaryMarkers(){


        if(
            !this.markerLayer
        )
            return;



        this.markerLayer
        .getLayers()
        .forEach(layer=>{


            if(
                layer !== this.primaryMarker
            ){

                this.markerLayer.removeLayer(
                    layer
                );

            }


        });



        this.markers.clear();


    }





    registerEvents(){


        if(!this.map)
            return;



        this.map.on(
            "click",
            e=>{


                this.updatePosition(
                    e.latlng.lat,
                    e.latlng.lng
                );


            }
        );



        if(this.primaryMarker){


            this.primaryMarker.on(
                "dragend",
                e=>{


                    const pos =
                        e.target.getLatLng();



                    this.updatePosition(
                        pos.lat,
                        pos.lng
                    );


                }
            );


        }


    }





    updatePosition(
        lat,
        lng
    ){


        if(
            !this.primaryMarker
        )
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
                    detail:{
                        lat,
                        lng
                    }
                }
            )
        );


    }





    observeResize(){


        this.resizeObserver =
            new ResizeObserver(()=>{


                if(this.map){

                    this.map.invalidateSize({
                        animate:false
                    });

                }


            });



        this.resizeObserver.observe(
            this
        );


    }





    observeChanges(){


        this.mutationObserver =
            new MutationObserver(
                mutations=>{


                    let refresh=false;



                    for(
                        const mutation of mutations
                    ){


                        if(
                            mutation.type==="childList"
                        ){

                            refresh=true;

                        }



                        if(
                            mutation.type==="attributes" &&
                            mutation.target.tagName==="MAP-PIN"
                        ){

                            refresh=true;

                        }


                    }



                    if(!refresh)
                        return;



                    clearTimeout(
                        this.refreshTimer
                    );



                    this.refreshTimer =
                        setTimeout(()=>{


                            this.renderPins();


                        },100);



                }
            );




        this.mutationObserver.observe(
            this,
            {
                childList:true,

                subtree:true,

                attributes:true,

                attributeFilter:[
                    "lat",
                    "lng"
                ]
            }
        );


    }





    addPin(
        lat,
        lng,
        html=""
    ){


        if(!this.markerLayer)
            return null;



        const marker =
            L.marker(
                [
                    lat,
                    lng
                ]
            )
            .addTo(this.markerLayer);



        if(html){

            marker.bindPopup(
                html
            );

        }



        const id =
            crypto.randomUUID();



        this.markers.set(
            id,
            marker
        );



        this.dispatchEvent(
            new CustomEvent(
                "markeradd",
                {
                    detail:{
                        id,
                        marker,
                        lat,
                        lng
                    }
                }
            )
        );



        return id;


    }





    removePin(id){


        const marker =
            this.markers.get(id);



        if(
            !marker ||
            !this.markerLayer
        )
            return;



        this.markerLayer.removeLayer(
            marker
        );



        this.markers.delete(id);



        this.dispatchEvent(
            new CustomEvent(
                "markerremove",
                {
                    detail:{
                        id
                    }
                }
            )
        );


    }
      fitPins(
        includePrimary=true
    ){


        if(
            !this.map ||
            !this.markerLayer
        )
            return;



        let layers =
            this.markerLayer.getLayers();



        if(
            !includePrimary &&
            this.primaryMarker
        ){

            layers =
                layers.filter(
                    layer =>
                    layer !== this.primaryMarker
                );

        }



        if(!layers.length)
            return;



        const group =
            L.featureGroup(
                layers
            );



        this.map.fitBounds(
            group.getBounds(),
            {
                padding:[
                    40,
                    40
                ]
            }
        );


    }





    attributeChangedCallback(
        name,
        oldValue,
        newValue
    ){


        if(
            !this.map ||
            this.internalUpdate
        )
            return;



        if(
            oldValue === newValue
        )
            return;



        if(
            name === "zoom"
        ){

            this.map.setZoom(
                this.getZoom()
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
                animate:true
            }
        );



        if(this.primaryMarker){

            this.primaryMarker.setLatLng(
                [
                    lat,
                    lng
                ]
            );

        }


    }





    setLocation(
        lat,
        lng,
        zoom=null
    ){


        this.internalUpdate = true;



        this.setAttribute(
            "lat",
            String(lat)
        );


        this.setAttribute(
            "lng",
            String(lng)
        );



        if(
            zoom !== null
        ){

            this.setAttribute(
                "zoom",
                String(zoom)
            );

        }



        this.internalUpdate = false;



        this.dispatchEvent(
            new CustomEvent(
                "locationchange",
                {
                    detail:{
                        lat,
                        lng,
                        zoom
                    }
                }
            )
        );


    }





    getLocation(){


        return {

            lat:this.getLatitude(),

            lng:this.getLongitude(),

            zoom:this.getZoom()

        };


    }





    flyTo(
        lat,
        lng,
        zoom=this.getZoom()
    ){


        if(!this.map)
            return;



        this.map.flyTo(
            [
                lat,
                lng
            ],
            zoom,
            {
                animate:true,
                duration:1
            }
        );



        if(this.primaryMarker){

            this.primaryMarker.setLatLng(
                [
                    lat,
                    lng
                ]
            );

        }



        this.setLocation(
            lat,
            lng,
            zoom
        );


    }





    destroy(){


        if(this.resizeObserver){

            this.resizeObserver.disconnect();

            this.resizeObserver=null;

        }



        if(this.mutationObserver){

            this.mutationObserver.disconnect();

            this.mutationObserver=null;

        }



        if(this.refreshTimer){

            clearTimeout(
                this.refreshTimer
            );

            this.refreshTimer=null;

        }



        if(this.primaryMarker){

            this.primaryMarker.off();

        }



        if(this.markerLayer){

            this.markerLayer.clearLayers();

            this.markerLayer.remove();

        }



        if(this.map){

            this.map.off();

            this.map.remove();

        }



        this.markers.clear();



        this.primaryMarker=null;

        this.markerLayer=null;

        this.map=null;



        this.initialized=false;


    }





    disconnectedCallback(){

        this.destroy();

    }


}





class MapPin extends HTMLElement {


    connectedCallback(){

        this.style.display="none";

    }


}





if(
    !customElements.get(
        "custom-map"
    )
){

    customElements.define(
        "custom-map",
        CustomMap
    );

}





if(
    !customElements.get(
        "map-pin"
    )
){

    customElements.define(
        "map-pin",
        MapPin
    );

}
