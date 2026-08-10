# 🗺️ Map.js

> A lightweight, production-ready **Leaflet Web Component** for building interactive maps using pure HTML.

Map.js wraps **Leaflet 1.9.x** inside a reusable `<custom-map>` Web Component, allowing you to create interactive maps with minimal setup and without manually initializing Leaflet.

---

## ✨ Features

* 🧩 Native Web Component
* 🌑 Shadow DOM encapsulation
* 🗺️ Powered by Leaflet 1.9.x
* 📍 Draggable primary marker
* 🖱️ Click anywhere to update location
* 📌 Multiple custom markers
* 🔄 Reactive attributes
* 📡 Custom DOM events
* 📐 Automatic resize handling
* ♻️ Safe lifecycle management
* 🚀 Public JavaScript API
* 🌐 Framework independent

---

# 🚀 Installation

## 1. Include Leaflet

```html
<link
    rel="stylesheet"
    href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css">

<script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
```

## 2. Include Map.js

### Local

```html
<script src="./map.js"></script>
```

### jsDelivr (GitHub)

```html
<script src="https://cdn.jsdelivr.net/gh/https://github.com/yagizyagli/<map-component>/map.js"></script>
```

---

# 📍 Basic Usage

```html
<custom-map
    lat="41.0082"
    lng="28.9784"
    zoom="12">
</custom-map>
```

---

# 📌 Multiple Markers

```html
<custom-map
    lat="41.0082"
    lng="28.9784"
    zoom="12">

    <map-pin
        lat="41.015"
        lng="28.980">
        Istanbul
    </map-pin>

    <map-pin
        lat="41.020"
        lng="28.985">
        Second Marker
    </map-pin>

</custom-map>
```

---

# 💻 JavaScript API

```javascript
const map =
    document.querySelector(
        "custom-map"
    );
```

### Set Location

```javascript
map.setLocation(
    40.7128,
    -74.0060,
    13
);
```

### Fly To

```javascript
map.flyTo(
    48.8566,
    2.3522,
    14
);
```

### Get Current Location

```javascript
const location =
    map.getLocation();

console.log(location);
```

Output:

```javascript
{
    lat: 41.0082,
    lng: 28.9784,
    zoom: 12
}
```

### Add Marker

```javascript
map.addPin(
    41.015,
    28.980,
    "Hello World"
);
```

### Fit All Markers

```javascript
map.fitPins();
```

---

# 📡 Events

```javascript
map.addEventListener(
    "locationchange",
    event => {

        console.log(
            event.detail
        );

    }
);
```

Available Events

| Event          | Description                       |
| -------------- | --------------------------------- |
| ready          | Fired when the map is initialized |
| locationchange | Fired when the location changes   |
| markeradd      | Fired after a marker is added     |
| markerremove   | Fired after a marker is removed   |
| tileerror      | Fired when a tile fails to load   |

---

# 📂 Project Structure

```text
map.js/
│
├── map.js
├── index.html
├── README.md
└── LICENSE
```

---

# 🌍 Browser Support

Works in all modern browsers supporting:

* Custom Elements
* Shadow DOM
* ES6+
* ResizeObserver

---

# 🤝 Contributing

Contributions, issues and feature requests are welcome.

If you find a bug or have an idea for improvement, feel free to open an issue or submit a pull request.

---

# 📄 License

MIT License

---

## ❤️ Author

**yagizyagli**

Built with **Leaflet** and **Web Components**.
