# 🗺️ Map.js

### Production-ready Leaflet Web Component

A lightweight and reusable `<custom-map>` Web Component built on top of Leaflet 1.9.x.

Create interactive maps using pure HTML without writing complex JavaScript.

```html
<custom-map 
    lat="41.0082"
    lng="28.9784"
    zoom="12">
</custom-map>
✨ Features
⚡ Native Web Component architecture
🧱 Shadow DOM isolation
🗺️ Leaflet 1.9.x powered
📍 Draggable primary marker
🖱️ Click-to-move location
📌 Dynamic marker support
🔄 Reactive attributes
📡 Custom DOM events
📐 Automatic resize handling
🧹 Memory-safe lifecycle
♻️ Reconnect-safe component
🎯 Public JavaScript API

🚀 Quick Start
1. Include Leaflet
<link 
rel="stylesheet"
href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
/>

<script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
2. Include Map.js
<script src="./map.js"></script>
3. Create your map
<custom-map
    lat="41.0082"
    lng="28.9784"
    zoom="12">
</custom-map>

That's it. 🎉

📌 Adding Markers
<custom-map
    lat="41.0082"
    lng="28.9784"
    zoom="12">

    <map-pin
        lat="41.015"
        lng="28.979">
        Istanbul Marker
    </map-pin>

</custom-map>

🎮 JavaScript API

Get component:

const map = document.querySelector(
    "custom-map"
);
Move location
map.setLocation(
    40.7128,
    -74.0060,
    12
);
Fly animation
map.flyTo(
    48.8566,
    2.3522,
    13
);
Get current position
const location = map.getLocation();

console.log(location);

Output:

{
    lat: 41.0082,
    lng: 28.9784,
    zoom:12
}
📡 Events

Listen for location changes:

map.addEventListener(
    "locationchange",
    event => {

        console.log(
            event.detail
        );

    }
);

Available events:

Event	Description
ready	Map initialized
locationchange	Marker position changed
markeradd	Marker created
markerremove	Marker removed
tileerror	Tile loading error
🏗️ Architecture
Map.js
│
├── CustomMap Web Component
│
├── Shadow DOM
│
├── Leaflet Engine
│
├── Marker Layer Manager
│
└── Lifecycle Controller

🎯 Why Map.js?

Leaflet is powerful, but applications often need a reusable map component.

map.js provides:

✅ Simple HTML usage
✅ Framework independent architecture
✅ React / Vue / Angular compatible
✅ No build step required

📦 Browser Support

Works with modern browsers supporting:

Custom Elements
Shadow DOM
ES Modules
📄 License

MIT License

Made with ❤️ by yagizyagli
