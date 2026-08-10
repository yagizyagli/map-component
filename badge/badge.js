/**
 * Professional Badge Component
 *
 * Production Grade Vanilla Web Component
 *
 * Features:
 * - Shadow DOM
 * - Theme support
 * - Variants
 * - Sizes
 * - Rounded mode
 * - Reactive attributes
 * - Custom events
 * - Public API
 * - Resize Observer
 * - Reconnect-safe lifecycle
 * - Memory-safe cleanup
 *
 * Author: yagizyagli
 */

class Badge extends HTMLElement {

    static observedAttributes = [
        "theme",
        "variant",
        "size",
        "rounded"
    ];

    constructor() {
        super();

        this.attachShadow({
            mode: "open"
        });

        this.badge = null;
        this.resizeObserver = null;

        this.pendingFrame = null;
        this.renderQueued = false;
        this.destroyed = false;

        this.state = {
            initialized: false,
            theme: "light",
            variant: "primary",
            size: "md",
            rounded: false
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
                    badge: this
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

        if (name === "theme") {
            this.state.theme =
                this.normalizeTheme(newValue);
        }

        if (name === "variant") {
            this.state.variant =
                this.normalizeVariant(newValue);
        }

        if (name === "size") {
            this.state.size =
                this.normalizeSize(newValue);
        }

        if (name === "rounded") {
            this.state.rounded =
                this.hasAttribute("rounded");
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

        this.state.variant =
            this.normalizeVariant(
                this.getAttribute("variant")
            );

        this.state.size =
            this.normalizeSize(
                this.getAttribute("size")
            );

        this.state.rounded =
            this.hasAttribute("rounded");
    }

    normalizeTheme(value) {
        return value === "dark"
            ? "dark"
            : "light";
    }

    normalizeVariant(value) {
        const allowed = [
            "primary",
            "secondary",
            "success",
            "warning",
            "danger",
            "info",
            "neutral"
        ];

        return allowed.includes(value)
            ? value
            : "primary";
    }

    normalizeSize(value) {
        const allowed = [
            "sm",
            "md",
            "lg"
        ];

        return allowed.includes(value)
            ? value
            : "md";
    }

    render() {
        const content =
            this.innerHTML.trim();

        this.shadowRoot.innerHTML = `
            <style>
                :host {
                    display: inline-block;
                    box-sizing: border-box;
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

                .badge {
                    display: inline-flex;
                    align-items: center;
                    justify-content: center;
                    gap: 6px;

                    white-space: nowrap;

                    border: 1px solid transparent;

                    font-weight: 600;
                    line-height: 1;
                    letter-spacing: .01em;

                    transition:
                        background-color .15s ease,
                        color .15s ease,
                        border-color .15s ease,
                        transform .15s ease;

                    user-select: none;
                }

                .badge.sm {
                    min-height: 24px;
                    padding: 4px 8px;
                    font-size: 11px;
                }

                .badge.md {
                    min-height: 30px;
                    padding: 6px 10px;
                    font-size: 13px;
                }

                .badge.lg {
                    min-height: 36px;
                    padding: 8px 14px;
                    font-size: 14px;
                }

                .badge.rounded {
                    border-radius: 999px;
                }

                .badge:not(.rounded) {
                    border-radius: 8px;
                }

                /* Light theme */

                .light.primary {
                    background: #dbeafe;
                    color: #1d4ed8;
                    border-color: #bfdbfe;
                }

                .light.secondary {
                    background: #e5e7eb;
                    color: #374151;
                    border-color: #d1d5db;
                }

                .light.success {
                    background: #dcfce7;
                    color: #15803d;
                    border-color: #bbf7d0;
                }

                .light.warning {
                    background: #fef3c7;
                    color: #b45309;
                    border-color: #fde68a;
                }

                .light.danger {
                    background: #fee2e2;
                    color: #b91c1c;
                    border-color: #fecaca;
                }

                .light.info {
                    background: #cffafe;
                    color: #0e7490;
                    border-color: #a5f3fc;
                }

                .light.neutral {
                    background: #f3f4f6;
                    color: #4b5563;
                    border-color: #e5e7eb;
                }

                /* Dark theme */

                .dark.primary {
                    background: #1e3a8a;
                    color: #dbeafe;
                    border-color: #2563eb;
                }

                .dark.secondary {
                    background: #374151;
                    color: #e5e7eb;
                    border-color: #4b5563;
                }

                .dark.success {
                    background: #14532d;
                    color: #bbf7d0;
                    border-color: #166534;
                }

                .dark.warning {
                    background: #78350f;
                    color: #fde68a;
                    border-color: #92400e;
                }

                .dark.danger {
                    background: #7f1d1d;
                    color: #fecaca;
                    border-color: #991b1b;
                }

                .dark.info {
                    background: #164e63;
                    color: #a5f3fc;
                    border-color: #155e75;
                }

                .dark.neutral {
                    background: #374151;
                    color: #d1d5db;
                    border-color: #4b5563;
                }
            </style>

            <span
                class="
                    badge
                    ${this.state.theme}
                    ${this.state.variant}
                    ${this.state.size}
                    ${this.state.rounded ? "rounded" : ""}
                "
                part="badge"
                role="status">
                ${content}
            </span>
        `;

        this.badge =
            this.shadowRoot.querySelector(
                ".badge"
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

    setVariant(variant) {
        const normalized =
            this.normalizeVariant(
                variant
            );

        if (normalized !== variant) {
            return false;
        }

        this.setAttribute(
            "variant",
            variant
        );

        return true;
    }

    getVariant() {
        return this.state.variant;
    }

    setSize(size) {
        const normalized =
            this.normalizeSize(size);

        if (normalized !== size) {
            return false;
        }

        this.setAttribute(
            "size",
            size
        );

        return true;
    }

    getSize() {
        return this.state.size;
    }

    setRounded(value = true) {
        if (value) {
            this.setAttribute(
                "rounded",
                ""
            );
        } else {
            this.removeAttribute(
                "rounded"
            );
        }
    }

    isRounded() {
        return this.state.rounded;
    }

    setText(text) {
        this.textContent =
            text == null
                ? ""
                : String(text);

        this.scheduleRender();
    }

    getText() {
        return this.textContent;
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
                    new CustomEvent(
                        "resize"
                    )
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

        this.badge = null;
        this.renderQueued = false;
        this.state.initialized = false;
    }
}

if (!customElements.get("custom-badge")) {
    customElements.define(
        "custom-badge",
        Badge
    );
}

export default Badge;
