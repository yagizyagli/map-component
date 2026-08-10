/**
 * Professional Card Component
 *
 * Production Grade Vanilla Web Component
 *
 * Features:
 * - Shadow DOM
 * - Theme support
 * - Elevation levels
 * - Outlined mode
 * - Hoverable mode
 * - Reactive attributes
 * - Slot-based content
 * - Custom events
 * - Public API
 * - Resize Observer
 * - Reconnect-safe lifecycle
 * - Memory-safe cleanup
 *
 * Author: yagizyagli
 */

class Card extends HTMLElement {

    static observedAttributes = [
        "theme",
        "elevation",
        "outlined",
        "hoverable"
    ];

    constructor() {
        super();

        this.attachShadow({
            mode: "open"
        });

        this.container = null;
        this.resizeObserver = null;

        this.pendingFrame = null;
        this.renderQueued = false;
        this.destroyed = false;

        this.state = {
            initialized: false,
            theme: "light",
            elevation: 1,
            outlined: false,
            hoverable: false
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
                    card: this
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
            case "theme":
                this.state.theme =
                    this.normalizeTheme(newValue);
                break;

            case "elevation":
                this.state.elevation =
                    this.normalizeElevation(newValue);
                break;

            case "outlined":
                this.state.outlined =
                    this.hasAttribute("outlined");
                break;

            case "hoverable":
                this.state.hoverable =
                    this.hasAttribute("hoverable");
                break;
        }

        if (this.state.initialized) {
            this.scheduleRender();
        }
    }

    readAttributes() {
        this.state.theme =
            this.normalizeTheme(
                this.getAttribute("theme")
            );

        this.state.elevation =
            this.normalizeElevation(
                this.getAttribute("elevation")
            );

        this.state.outlined =
            this.hasAttribute("outlined");

        this.state.hoverable =
            this.hasAttribute("hoverable");
    }

    normalizeTheme(value) {
        return value === "dark"
            ? "dark"
            : "light";
    }

    normalizeElevation(value) {
        const number =
            Number.parseInt(value, 10);

        if (!Number.isFinite(number)) {
            return 1;
        }

        return Math.min(
            Math.max(number, 0),
            4
        );
    }

    render() {
        this.shadowRoot.innerHTML = `
            <style>
                :host {
                    display: block;
                    width: 100%;
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

                .card {
                    width: 100%;
                    position: relative;

                    overflow: hidden;

                    border-radius: 16px;

                    transition:
                        box-shadow .2s ease,
                        transform .2s ease,
                        border-color .2s ease,
                        background .2s ease;

                    color: inherit;
                }

                .card.light {
                    background: #ffffff;
                    color: #111827;
                    border-color: #e5e7eb;
                }

                .card.dark {
                    background: #111827;
                    color: #f9fafb;
                    border-color: #374151;
                }

                .card.outlined {
                    border: 1px solid;
                    box-shadow: none;
                }

                .card:not(.outlined) {
                    border: 1px solid transparent;
                }

                .elevation-0 {
                    box-shadow: none;
                }

                .elevation-1 {
                    box-shadow:
                        0 1px 3px
                        rgba(0, 0, 0, .08);
                }

                .elevation-2 {
                    box-shadow:
                        0 4px 12px
                        rgba(0, 0, 0, .10);
                }

                .elevation-3 {
                    box-shadow:
                        0 10px 25px
                        rgba(0, 0, 0, .12);
                }

                .elevation-4 {
                    box-shadow:
                        0 20px 40px
                        rgba(0, 0, 0, .16);
                }

                .card.hoverable:hover {
                    transform:
                        translateY(-2px);
                    box-shadow:
                        0 12px 30px
                        rgba(0, 0, 0, .14);
                }

                .header {
                    display: block;
                    padding: 20px 20px 0;
                }

                .body {
                    display: block;
                    padding: 20px;
                }

                .footer {
                    display: block;
                    padding: 0 20px 20px;
                }

                ::slotted([slot="header"]) {
                    display: block;
                }

                ::slotted([slot="footer"]) {
                    display: block;
                }
            </style>

            <article
                class="
                    card
                    ${this.state.theme}
                    elevation-${this.state.elevation}
                    ${this.state.outlined
                        ? "outlined"
                        : ""}
                    ${this.state.hoverable
                        ? "hoverable"
                        : ""}
                "
                part="card">

                <header class="header">
                    <slot name="header"></slot>
                </header>

                <section class="body">
                    <slot></slot>
                </section>

                <footer class="footer">
                    <slot name="footer"></slot>
                </footer>

            </article>
        `;

        this.container =
            this.shadowRoot.querySelector(
                ".card"
            );
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

    setElevation(value) {
        const elevation =
            this.normalizeElevation(value);

        this.setAttribute(
            "elevation",
            String(elevation)
        );

        return true;
    }

    getElevation() {
        return this.state.elevation;
    }

    setOutlined(value = true) {
        if (value) {
            this.setAttribute(
                "outlined",
                ""
            );
        } else {
            this.removeAttribute(
                "outlined"
            );
        }
    }

    isOutlined() {
        return this.state.outlined;
    }

    setHoverable(value = true) {
        if (value) {
            this.setAttribute(
                "hoverable",
                ""
            );
        } else {
            this.removeAttribute(
                "hoverable"
            );
        }
    }

    isHoverable() {
        return this.state.hoverable;
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
                this.dispatchEvent(
                    new CustomEvent("resize", {
                        detail: {
                            width:
                                this.offsetWidth,
                            height:
                                this.offsetHeight
                        }
                    })
                );
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

        this.container = null;
        this.renderQueued = false;
        this.state.initialized = false;
    }
}

if (!customElements.get("custom-card")) {
    customElements.define(
        "custom-card",
        Card
    );
}

export default Card;
