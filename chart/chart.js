/**
 * Professional Chart Component
 *
 * Production Grade Chart.js Web Component
 *
 * Features:
 * - Shadow DOM
 * - Chart.js integration
 * - Bar / line / pie / doughnut / radar / polarArea
 * - Reactive attributes
 * - Dataset support
 * - Legend support
 * - Tooltip support
 * - Responsive rendering
 * - Theme support
 * - Animation support
 * - Public API
 * - Resize Observer
 * - Lifecycle safe
 * - Destroy safe
 * - Memory safe
 *
 * Author: yagizyagli
 */

class Chart extends HTMLElement {

    static observedAttributes = [
        "type",
        "theme",
        "title",
        "responsive",
        "animation",
        "legend",
        "tooltip"
    ];

    constructor() {
        super();

        this.attachShadow({
            mode: "open"
        });

        this.chart = null;
        this.canvas = null;
        this.ctx = null;

        this.resizeObserver = null;

        this.pendingFrame = null;
        this.renderQueued = false;
        this.destroyed = false;

        this.state = {
            initialized: false,
            theme: "dark",
            type: "bar",
            responsive: true,
            animation: true,
            legend: true,
            tooltip: true
        };

        this.data = {
            labels: [],
            datasets: []
        };
    }

    connectedCallback() {
        if (this.state.initialized) {
            this.scheduleRender();
            return;
        }

        this.readAttributes();

        this.state.initialized = true;
        this.destroyed = false;

        this.render();
        this.observeResize();

        this.dispatchEvent(
            new CustomEvent("ready", {
                detail: {
                    chart: this
                }
            })
        );
    }

    disconnectedCallback() {
        this.destroy();
    }

    attributeChangedCallback(
        name,
        oldValue,
        newValue
    ) {
        if (oldValue === newValue) {
            return;
        }

        switch (name) {

            case "type":
                this.state.type =
                    this.normalizeType(newValue);
                break;

            case "theme":
                this.state.theme =
                    this.normalizeTheme(newValue);
                break;

            case "title":
                break;

            case "responsive":
                this.state.responsive =
                    this.readBooleanAttribute(
                        "responsive",
                        true
                    );
                break;

            case "animation":
                this.state.animation =
                    this.readBooleanAttribute(
                        "animation",
                        true
                    );
                break;

            case "legend":
                this.state.legend =
                    this.readBooleanAttribute(
                        "legend",
                        true
                    );
                break;

            case "tooltip":
                this.state.tooltip =
                    this.readBooleanAttribute(
                        "tooltip",
                        true
                    );
                break;
        }

        if (this.state.initialized) {
            this.scheduleRender();
        }
    }

    readAttributes() {
        this.state.type =
            this.normalizeType(
                this.getAttribute("type")
            );

        this.state.theme =
            this.normalizeTheme(
                this.getAttribute("theme")
            );

        this.state.responsive =
            this.readBooleanAttribute(
                "responsive",
                true
            );

        this.state.animation =
            this.readBooleanAttribute(
                "animation",
                true
            );

        this.state.legend =
            this.readBooleanAttribute(
                "legend",
                true
            );

        this.state.tooltip =
            this.readBooleanAttribute(
                "tooltip",
                true
            );
    }

    normalizeType(value) {
        const types = [
            "bar",
            "line",
            "pie",
            "doughnut",
            "radar",
            "polarArea",
            "bubble",
            "scatter"
        ];

        return types.includes(value)
            ? value
            : "bar";
    }

    normalizeTheme(value) {
        return value === "light"
            ? "light"
            : "dark";
    }

    readBooleanAttribute(
        name,
        defaultValue
    ) {
        if (!this.hasAttribute(name)) {
            return defaultValue;
        }

        const value =
            this.getAttribute(name);

        if (value === "") {
            return true;
        }

        if (value === "false") {
            return false;
        }

        if (value === "true") {
            return true;
        }

        return defaultValue;
    }

    render() {
        this.destroyChart();

        this.shadowRoot.innerHTML = `
            <style>
                :host {
                    display: block;
                    width: 100%;
                    min-height: 300px;
                    font-family:
                        Inter,
                        system-ui,
                        -apple-system,
                        BlinkMacSystemFont,
                        "Segoe UI",
                        sans-serif;
                }

                *,
                *::before,
                *::after {
                    box-sizing: border-box;
                }

                .container {
                    position: relative;
                    width: 100%;
                    height: 100%;
                    min-height: 300px;
                    padding: 20px;
                    border-radius: 16px;
                    overflow: hidden;
                    border: 1px solid;
                    background: var(--background);
                    color: var(--foreground);
                }

                .dark {
                    --background: #111827;
                    --foreground: #f9fafb;
                    --border: #374151;
                }

                .light {
                    --background: #ffffff;
                    --foreground: #111827;
                    --border: #e5e7eb;
                }

                .container {
                    border-color: var(--border);
                }

                .title {
                    margin-bottom: 14px;
                    font-size: 16px;
                    font-weight: 700;
                }

                .canvas-wrapper {
                    position: relative;
                    width: 100%;
                    height: 320px;
                }

                canvas {
                    display: block;
                    width: 100% !important;
                    height: 100% !important;
                }
            </style>

            <div
                class="
                    container
                    ${this.state.theme}
                "
                part="container">

                ${
                    this.getAttribute("title")
                        ? `
                            <div class="title">
                                ${this.escapeHTML(
                                    this.getAttribute(
                                        "title"
                                    )
                                )}
                            </div>
                        `
                        : ""
                }

                <div class="canvas-wrapper">
                    <canvas></canvas>
                </div>
            </div>
        `;

        this.canvas =
            this.shadowRoot.querySelector(
                "canvas"
            );

        if (!this.canvas) {
            return;
        }

        this.ctx =
            this.canvas.getContext("2d");

        if (
            typeof window.Chart ===
            "undefined"
        ) {
            console.error(
                "CustomChart: Chart.js is not loaded."
            );

            this.dispatchEvent(
                new CustomEvent(
                    "error",
                    {
                        detail: {
                            reason:
                                "Chart.js is missing."
                        }
                    }
                )
            );

            return;
        }

        this.createChart();
    }

    createChart() {
        if (!this.ctx) {
            return;
        }

        const config = {
            type: this.state.type,

            data: {
                labels: this.data.labels,
                datasets:
                    this.data.datasets
            },

            options: {
                responsive:
                    this.state.responsive,

                maintainAspectRatio: false,

                animation:
                    this.state.animation,

                plugins: {
                    legend: {
                        display:
                            this.state.legend,

                        labels: {
                            color:
                                this.state.theme ===
                                "dark"
                                    ? "#f9fafb"
                                    : "#111827"
                        }
                    },

                    tooltip: {
                        enabled:
                            this.state.tooltip
                    }
                }
            }
        };

        this.chart =
            new window.Chart(
                this.ctx,
                config
            );

        this.dispatchEvent(
            new CustomEvent(
                "render",
                {
                    detail: {
                        chart:
                            this.chart
                    }
                }
            )
        );
    }

    setData(data) {
        if (
            !data ||
            typeof data !== "object"
        ) {
            return false;
        }

        this.data = {
            labels:
                Array.isArray(data.labels)
                    ? data.labels
                    : [],

            datasets:
                Array.isArray(
                    data.datasets
                )
                    ? data.datasets
                    : []
        };

        if (this.chart) {
            this.chart.data =
                this.data;

            this.chart.update();

            return true;
        }

        this.scheduleRender();

        return true;
    }

    getData() {
        return {
            labels: [
                ...this.data.labels
            ],

            datasets:
                this.data.datasets.map(
                    dataset => ({
                        ...dataset,

                        data: Array.isArray(
                            dataset.data
                        )
                            ? [
                                ...dataset.data
                            ]
                            : []
                    })
                )
        };
    }

    addDataset(dataset) {
        if (
            !dataset ||
            typeof dataset !== "object"
        ) {
            return false;
        }

        this.data.datasets.push(
            dataset
        );

        if (this.chart) {
            this.chart.data.datasets =
                this.data.datasets;

            this.chart.update();

            return true;
        }

        this.scheduleRender();

        return true;
    }

    removeDataset(index) {
        if (
            index < 0 ||
            index >= this.data.datasets.length
        ) {
            return false;
        }

        this.data.datasets.splice(
            index,
            1
        );

        if (this.chart) {
            this.chart.data.datasets =
                this.data.datasets;

            this.chart.update();
        }

        return true;
    }

    clearData() {
        this.data = {
            labels: [],
            datasets: []
        };

        if (this.chart) {
            this.chart.data.labels = [];
            this.chart.data.datasets = [];

            this.chart.update();

            return;
        }

        this.scheduleRender();
    }

    update() {
        if (this.chart) {
            this.chart.update();
        }
    }

    resize() {
        if (this.chart) {
            this.chart.resize();
        }
    }

    setType(type) {
        const normalized =
            this.normalizeType(type);

        if (normalized !== type) {
            return false;
        }

        this.setAttribute(
            "type",
            type
        );

        return true;
    }

    getType() {
        return this.state.type;
    }

    setTheme(theme) {
        if (
            theme !== "light" &&
            theme !== "dark"
        ) {
            return false;
        }

        this.setAttribute(
            "theme",
            theme
        );

        return true;
    }

    getTheme() {
        return this.state.theme;
    }

    setLegend(value = true) {
        if (value) {
            this.setAttribute(
                "legend",
                ""
            );
        } else {
            this.setAttribute(
                "legend",
                "false"
            );
        }
    }

    setTooltip(value = true) {
        if (value) {
            this.setAttribute(
                "tooltip",
                ""
            );
        } else {
            this.setAttribute(
                "tooltip",
                "false"
            );
        }
    }

    setAnimation(value = true) {
        if (value) {
            this.setAttribute(
                "animation",
                ""
            );
        } else {
            this.setAttribute(
                "animation",
                "false"
            );
        }
    }

    escapeHTML(value) {
        return String(value)
            .replace(
                /&/g,
                "&amp;"
            )
            .replace(
                /</g,
                "&lt;"
            )
            .replace(
                />/g,
                "&gt;"
            )
            .replace(
                /"/g,
                "&quot;"
            )
            .replace(
                /'/g,
                "&#039;"
            );
    }

    observeResize() {
        if (
            typeof ResizeObserver ===
            "undefined"
        ) {
            return;
        }

        this.resizeObserver =
            new ResizeObserver(() => {
                this.resize();
            });

        this.resizeObserver.observe(
            this
        );
    }

    scheduleRender() {
        if (
            this.renderQueued ||
            this.destroyed
        ) {
            return;
        }

        this.renderQueued = true;

        this.pendingFrame =
            requestAnimationFrame(() => {
                this.renderQueued = false;
                this.pendingFrame = null;

                if (!this.destroyed) {
                    this.render();
                }
            });
    }

    destroyChart() {
        if (this.chart) {
            this.chart.destroy();
            this.chart = null;
        }

        this.canvas = null;
        this.ctx = null;
    }

    destroy() {
        this.destroyed = true;

        if (this.pendingFrame !== null) {
            cancelAnimationFrame(
                this.pendingFrame
            );

            this.pendingFrame = null;
        }

        if (this.resizeObserver) {
            this.resizeObserver.disconnect();
            this.resizeObserver = null;
        }

        this.destroyChart();

        this.renderQueued = false;
        this.state.initialized = false;
    }
}

if (!customElements.get("custom-chart")) {
    customElements.define(
        "custom-chart",
        Chart
    );
}

export default Chart;
