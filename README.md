# 🗺️ Map Component

A lightweight, production-ready **Web Component** built with **Leaflet** that lets you add interactive maps to any HTML page using a single custom element.

No frameworks. No dependencies (except Leaflet). Just plain HTML, CSS, and JavaScript.

---

## ✨ Features

* 🌍 Custom HTML element (`<custom-map>`)
* 🗺️ Powered by Leaflet 1.9.x
* 📍 Draggable primary marker
* 🖱️ Click anywhere to move the marker
* 📌 Multiple custom markers using `<map-pin>`
* ⚡ Reactive attributes (`lat`, `lng`, `zoom`)
* 🔄 Automatically updates when attributes change
* 📦 Shadow DOM encapsulation
* 🧩 Framework independent
* 🚀 Lightweight and easy to integrate
* 🛡️ Memory-safe lifecycle
* 📱 Responsive with automatic resize handling

---

## 📦 Installation

### 1. Load Leaflet

```html
<link rel="stylesheet"
href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css">

<script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
```

### 2. Load Map Component

```html
<script src="https://cdn.jsdelivr.net/gh/yagizyagli/map-component/map.js"></script>
```

---

## 🚀 Quick Start

```html
<custom-map
    lat="41.0082"
    lng="28.9784"
    zoom="12"
    style="height:500px;">

    <map-pin
        lat="41.015"
        lng="28.990">
        Hello Istanbul 👋
    </map-pin>

</custom-map>
```

---

## 📍 Multiple Markers

```html
<custom-map lat="41.0082" lng="28.9784" zoom="12">

    <map-pin lat="41.015" lng="28.990">
        Marker A
    </map-pin>

    <map-pin lat="41.001" lng="28.970">
        Marker B
    </map-pin>

    <map-pin lat="41.020" lng="28.965">
        Marker C
    </map-pin>

</custom-map>
```

---

## ⚙️ Attributes

| Attribute | Description        | Default   |
| --------- | ------------------ | --------- |
| `lat`     | Latitude           | `41.0082` |
| `lng`     | Longitude          | `28.9784` |
| `zoom`    | Initial zoom level | `12`      |

---

## 📚 JavaScript API

```javascript
const map = document.querySelector("custom-map");

map.setLocation(lat, lng, zoom);

map.getLocation();

map.flyTo(lat, lng, zoom);

map.fitPins();

const id = map.addPin(lat, lng, "Popup");

map.removePin(id);
```

---

## 📡 Events

### Ready

```javascript
map.addEventListener("ready", e => {
    console.log(e.detail.map);
});
```

### Location Changed

```javascript
map.addEventListener("locationchange", e => {
    console.log(e.detail.lat, e.detail.lng);
});
```

### Marker Added

```javascript
map.addEventListener("markeradd", e => {
    console.log(e.detail);
});
```

### Marker Removed

```javascript
map.addEventListener("markerremove", e => {
    console.log(e.detail);
});
```

### Tile Error

```javascript
map.addEventListener("tileerror", () => {
    console.log("Tile loading failed.");
});
```

---

## 📁 Browser Support

* ✅ Chrome
* ✅ Edge
* ✅ Firefox
* ✅ Safari

Supports all modern browsers with **Web Components** and **ES6 Modules**.

---

## 📄 License

MIT License

---

## 👨‍💻 Author

[Yağız Yağlı]:(https://github.com/yagizyagli/)

[Repo]:(https://github.com/yagizyagli/map-component)
[Live Demo]:(https://yagizyagli.github.io/map-component/)


---

⭐ If you like this project, consider giving it a star on GitHub!
