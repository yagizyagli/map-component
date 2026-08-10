/**
 * Professional Button Component
 *
 * Production Grade Vanilla Web Component
 *
 * Features:
 * - Shadow DOM
 * - Reactive attributes
 * - Disabled state
 * - Loading state
 * - Theme support
 * - Variants
 * - Sizes
 * - Rounded mode
 * - Block mode
 * - Pressed state
 * - Keyboard accessible
 * - Custom events
 * - Public API
 * - Resize Observer
 * - Reconnect-safe lifecycle
 * - Memory-safe cleanup
 *
 * Author: yagizyagli
 */

class Button extends HTMLElement {

    static observedAttributes = [
        "theme",
        "variant",
        "size",
        "disabled",
        "loading",
        "rounded",
        "block"
    ];

    constructor() {
        super();

        this.attachShadow({
            mode: "open"
        });

        this.button = null;
        this.content = null;
        this.spinner = null;

        this.resizeObserver = null;

        this.pendingFrame = null;
        this.renderQueued = false;
        this.destroyed = false;

        this.state = {
            initialized: false,
            loading: false,
            disabled: false,
            pressed: false,
            focused: false,
            theme: "light",
            variant: "primary",
            size: "md",
            rounded: false,
            block: false
        };

        this.handleClick =
            this.handleClick.bind(this);

        this.handleKeyDown =
            this.handleKeyDown.bind(this);

        this.handleFocus =
            this.handleFocus.bind(this);

        this.handleBlur =
            this.handleBlur.bind(this);
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
                    button: this
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

        if (name === "disabled") {
            this.state.disabled =
                this.hasAttribute("disabled");
        }

        if (name === "loading") {
            this.state.loading =
                this.hasAttribute("loading");
        }

        if (name === "rounded") {
            this.state.rounded =
                this.hasAttribute("rounded");
        }

        if (name === "block") {
            this.state.block =
                this.hasAttribute("block");
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

        this.state.disabled =
            this.hasAttribute("disabled");

        this.state.loading =
            this.hasAttribute("loading");

        this.state.rounded =
            this.hasAttribute("rounded");

        this.state.block =
            this.hasAttribute("block");
    }

    normalizeTheme(value) {
        return value === "dark"
            ? "dark"
            : "light";
    }

    normalizeVariant(value) {
        const variants = [
            "primary",
            "secondary",
            "success",
            "danger",
            "warning",
            "info",
            "ghost"
        ];

        return variants.includes(value)
            ? value
            : "primary";
    }

    normalizeSize(value) {
        const sizes = [
            "sm",
            "md",
            "lg"
        ];

        return sizes.includes(value)
            ? value
            : "md";
    }

    render() {
        const label =
            this.innerHTML.trim();

        this.shadowRoot.innerHTML = `
            <style>
                :host {
                    display: ${
                        this.state.block
                            ? "block"
                            : "inline-block"
                    };
                    width: ${
                        this.state.block
                            ? "100%"
                            : "auto"
                    };
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

                button {
                    display: inline-flex;
                    align-items: center;
                    justify-content: center;
                    gap: 8px;

                    width: ${
                        this.state.block
                            ? "100%"
                            : "auto"
                    };

                    border: 1px solid transparent;

                    cursor: pointer;

                    font-family: inherit;
                    font-weight: 600;
                    line-height: 1;

                    transition:
                        background .15s ease,
                        border-color .15s ease,
                        color .15s ease,
                        opacity .15s ease,
                        transform .1s ease;

                    user-select: none;
                }

                button:active:not(:disabled) {
                    transform: scale(.98);
                }

                button:focus-visible {
                    outline: 3px solid
                        rgba(37, 99, 235, .3);
                    outline-offset: 2px;
                }

                button:disabled {
                    cursor: not-allowed;
                    opacity: .55;
                }

                .sm {
                    min-height: 32px;
                    padding: 7px 12px;
                    font-size: 12px;
                }

                .md {
                    min-height: 40px;
                    padding: 9px 16px;
                    font-size: 14px;
                }

                .lg {
                    min-height: 48px;
                    padding: 12px 20px;
                    font-size: 16px;
                }

                .rounded {
                    border-radius: 999px;
                }

                .normal {
                    border-radius: 9px;
                }

                /* LIGHT */

                .light.primary {
                    background: #2563eb;
                    color: white;
                    border-color: #2563eb;
                }

                .light.primary:hover:not(:disabled) {
                    background: #1d4ed8;
                    border-color: #1d4ed8;
                }

                .light.secondary {
                    background: #f3f4f6;
                    color: #111827;
                    border-color: #d1d5db;
                }

                .light.secondary:hover:not(:disabled) {
                    background: #e5e7eb;
                }

                .light.success {
                    background: #16a34a;
                    color: white;
                    border-color: #16a34a;
                }

                .light.success:hover:not(:disabled) {
                    background: #15803d;
                }

                .light.danger {
                    background: #dc2626;
                    color: white;
                    border-color: #dc2626;
                }

                .light.danger:hover:not(:disabled) {
                    background: #b91c1c;
                }

                .light.warning {
                    background: #f59e0b;
                    color: white;
                    border-color: #f59e0b;
                }

                .light.warning:hover:not(:disabled) {
                    background: #d97706;
                }

                .light.info {
                    background: #0891b2;
                    color: white;
                    border-color: #0891b2;
                }

                .light.info:hover:not(:disabled) {
                    background: #0e7490;
                }

                .light.ghost {
                    background: transparent;
                    color: #2563eb;
                    border-color: #dbeafe;
                }

                .light.ghost:hover:not(:disabled) {
                    background: #eff6ff;
                }

                /* DARK */

                .dark.primary {
                    background: #3b82f6;
                    color: white;
                    border-color: #3b82f6;
                }

                .dark.primary:hover:not(:disabled) {
                    background: #2563eb;
                }

                .dark.secondary {
                    background: #374151;
                    color: #f9fafb;
                    border-color: #4b5563;
                }

                .dark.secondary:hover:not(:disabled) {
                    background: #4b5563;
                }

                .dark.success {
                    background: #22c55e;
                    color: #052e16;
                    border-color: #22c55e;
                }

                .dark.danger {
                    background: #ef4444;
                    color: white;
                    border-color: #ef4444;
                }

                .dark.warning {
                    background: #f59e0b;
                    color: #111827;
                    border-color: #f59e0b;
                }

                .dark.info {
                    background: #06b6d4;
                    color: #083344;
                    border-color: #06b6d4;
                }

                .dark.ghost {
                    background: transparent;
                    color: #93c5fd;
                    border-color: #374151;
                }

                .spinner {
                    width: 16px;
                    height: 16px;

                    border: 2px solid
                        currentColor;

                    border-right-color:
                        transparent;

                    border-radius: 50%;

                    animation:
                        spin .7s linear infinite;
                }

                @keyframes spin {
                    to {
                        transform: rotate(360deg);
                    }
                }

                .loading-content {
                    opacity: .75;
                }
            </style>

            <button
                type="button"
                class="
                    ${this.state.theme}
                    ${this.state.variant}
                    ${this.state.size}
                    ${this.state.rounded
                        ? "rounded"
                        : "normal"}
                "
                ${this.state.disabled ||
                  this.state.loading
                    ? "disabled"
                    : ""}
                aria-busy="${
                    this.state.loading
                }">

                ${
                    this.state.loading
                        ? `
                            <span
                                class="spinner"
                                aria-hidden="true">
                            </span>
                        `
                        : ""
                }

                <span
                    class="${
                        this.state.loading
                            ? "loading-content"
                            : ""
                    }">
                    ${label}
                </span>
            </button>
        `;

        this.button =
            this.shadowRoot.querySelector(
                "button"
            );

        this.bindButtonEvents();
    }

    bindButtonEvents() {
        if (!this.button) {
            return;
        }

        this.button.addEventListener(
            "click",
            this.handleClick
        );

        this.button.addEventListener(
            "keydown",
            this.handleKeyDown
        );

        this.button.addEventListener(
            "focus",
            this.handleFocus
        );

        this.button.addEventListener(
            "blur",
            this.handleBlur
        );
    }

    handleClick(event) {
        if (
            this.state.disabled ||
            this.state.loading
        ) {
            event.preventDefault();
            event.stopPropagation();
            return;
        }

        this.state.pressed = true;

        this.dispatchEvent(
            new CustomEvent(
                "buttonclick",
                {
                    detail: {
                        button: this
                    }
                }
            )
        );

        requestAnimationFrame(() => {
            this.state.pressed = false;
        });
    }

    handleKeyDown(event) {
        if (
            event.key === "Enter" ||
            event.key === " "
        ) {
            this.dispatchEvent(
                new CustomEvent(
                    "buttonpress",
                    {
                        detail: {
                            key: event.key
                        }
                    }
                )
            );
        }
    }

    handleFocus() {
        this.state.focused = true;

        this.dispatchEvent(
            new CustomEvent("focus")
        );
    }

    handleBlur() {
        this.state.focused = false;

        this.dispatchEvent(
            new CustomEvent("blur")
        );
    }

    setLoading(value = true) {
        if (value) {
            this.setAttribute(
                "loading",
                ""
            );
        } else {
            this.removeAttribute(
                "loading"
            );
        }
    }

    isLoading() {
        return this.state.loading;
    }

    setDisabled(value = true) {
        if (value) {
            this.setAttribute(
                "disabled",
                ""
            );
        } else {
            this.removeAttribute(
                "disabled"
            );
        }
    }

    isDisabled() {
        return this.state.disabled;
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
            this.normalizeSize(size
            );

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

    setBlock(value = true) {
        if (value) {
            this.setAttribute(
                "block",
                ""
            );
        } else {
            this.removeAttribute(
                "block"
            );
        }
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

        this.button = null;

        this.renderQueued = false;
        this.state.initialized = false;
    }
}

if (!customElements.get("custom-button")) {
    customElements.define(
        "custom-button",
        Button
    );
}

export default Button;
