# 🌍 Map Component (`<custom-map>`)

[![License: MIT](https://shields.io)](https://opensource.org)
[![CDN: jsDelivr](https://shields.io)](https://jsdelivr.com)

A highly professional, performance-optimized, zero-dependency Web Component that enables engineers to ship highly interactive geographic maps into layouts using **pure HTML tags**. 

Eliminates lines of declarative JavaScript boilerplate configurations, script orchestration, and CSS asset matching.

---

## 🎯 Production Infrastructure Links
* 🚀 **Enterprise Live Demo Page:** [https://github.com/yagizyagli.github.io/map-component/](https://yagizyagli.github.io/map-component/)
* 📦 **Production Global Cloud CDN:** `https://jsdelivr.net`

---

## ⚡ Core Architecture Features
* **Zero Runtime Dependencies:** Native custom elements spec execution pipeline.
* **Auto Injection:** Structural Leaflet engine scripts and styling modules inject safely at runtime.
* **Embedded UI Styles:** Premium modern UI design variables with fluid animation entry layers and sleek modern popovers out of the box.
* **Nested Node Tree Parsing:** Intuitive structural relationship between `<custom-map>` wrappers and infinite multi-pin `<map-pin>` parameters.

---

## 🛠️ Implementation Quickstart

### 1. Link Engine Script Pipeline
Place the global script target inside your document architecture:

```html
<script src="https://jsdelivr.net"></script>
```

### 2. Compose Declarative HTML UI Nodes
Write your map boundaries natively inside your layout structures:

```html
<custom-map lat="41.0082" lng="28.9784" zoom="12" width="100%" height="500px">
    <map-pin lat="41.0082" lng="28.9784"><b>Headquarters</b><br>Main Facility Outpost Location.</map-pin>
    <map-pin lat="41.0422" lng="29.0074">Logistics Core Hub</map-pin>
</custom-map>
```

---

## 📐 Enterprise API Properties & Configuration

### `<custom-map>` Elements

| Property Parameter | Value Blueprint | Default Baseline | Operational Function |
| :--- | :--- | :--- | :--- |
| `lat` | Floating Decimal | `41.0082` | Target central geographic latitude point |
| `lng` | Floating Decimal | `28.9784` | Target central geographic longitude point |
| `zoom` | Range Scale (1-18) | `13` | Default entry view focus amplification factor |
| `width` | Explicit CSS Metric | `100%` | Horizontal bounding structural container size |
| `height` | Explicit CSS Metric | `400px` | Vertical bounding structural container size |

### `<map-pin>` Elements

| Property Parameter | Value Blueprint | Operational Function |
| :--- | :--- | :--- |
| `lat` | Floating Decimal | **Mandatory Value.** Precision marker anchor latitude point |
| `lng` | Floating Decimal | **Mandatory Value.** Precision marker anchor longitude point |
| `innerHTML` | Valid HTML Strings | Inner structural element context to format modern popup wrappers on selection |


## ⭐ Support & Star

If you find this library useful, please consider giving it a **Star** on GitHub! It helps more developers discover the project and motivates further development.


## 📄 Project Governance & Licensing
This software codebase is open-source product infrastructure covered under the **MIT License**.

## 👨‍💻 Author & Maintainer

This project was envisioned, designed, and crafted with passion. Feel free to reach out for collaborations, feedback, or just to say hi!

GitHub:[@yagizyagli](https://github.com/yagizyagli)

