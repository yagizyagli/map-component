/**
 * Professional Drawer Component
 *
 * Production Grade Drawer Web Component
 *
 * Features:
 * - Shadow DOM
 * - Reactive attributes
 * - Left / right / top / bottom positions
 * - Backdrop support
 * - Keyboard support
 * - Escape to close
 * - Focus management
 * - Public API
 * - Custom events
 * - Lifecycle safe
 * - Memory safe
 *
 * Author: yagizyagli
 */

class Drawer extends HTMLElement {

    static observedAttributes = [
        "theme",
        "open",
        "position",
        "size",
        "backdrop"
    ];

    constructor() {
        super();

        this.attachShadow({
            mode: "open"
        });

        this.overlay = null;
        this.container = null;
        this.closeButton = null;

        this.resizeObserver = null;

        this.previousActiveElement = null;

        this.state = {
            initialized: false,
            open: false,
            theme: "light",
            position: "left",
            size: "md",
            backdrop: true
        };

        this.boundKeydown = this.handleKeydown.bind(this);
        this.boundResize = this.handleResize.bind(this);
    }

    connectedCallback() {
        if (this.state.initialized) {
            this.render();
            return;
        }

        this.readAttributes();

        this.state.initialized = true;

        this.render();
        this.observeResize();
        this.bindEvents();

        if (this.state.open) {
            this.openDrawer(false);
        }

        this.dispatchEvent(
            new CustomEvent("ready", {
                detail: {
                    drawer: this
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

        if (name === "open") {
            const open =
                this.hasAttribute("open");

            if (open) {
                this.openDrawer(false);
            } else {
                this.closeDrawer(false);
            }

            return;
        }

        this.readAttributes();

        if (this.state.initialized) {
            this.render();
        }
    }

    readAttributes() {
        this.state.theme =
            this.getAttribute("theme") === "dark"
                ? "dark"
                : "light";

        this.state.position =
            this.normalizePosition(
                this.getAttribute("position")
            );

        this.state.size =
            this.normalizeSize(
                this.getAttribute("size")
            );

        this.state.backdrop =
            this.readBoolean(
                "backdrop",
                true
            );

        this.state.open =
            this.hasAttribute("open");
    }

    normalizePosition(value) {
        const positions = [
            "left",
            "right",
            "top",
            "bottom"
        ];

        return positions.includes(value)
            ? value
            : "left";
    }

    normalizeSize(value) {
        const sizes = [
            "sm",
            "md",
            "lg",
            "xl"
        ];

        return sizes.includes(value)
            ? value
            : "md";
    }

    readBoolean(
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

        if (value === "true") {
            return true;
        }

        if (value === "false") {
            return false;
        }

        return defaultValue;
    }

    render() {
        this.shadowRoot.innerHTML = `
            <style>

                :host {
                    position: fixed;
                    inset: 0;
                    display: block;
                    z-index: 9999;
                    pointer-events: none;
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

                .drawer-root {
                    position: fixed;
                    inset: 0;
                    pointer-events: none;
                }

                .overlay {
                    position: absolute;
                    inset: 0;
                    background: rgba(0, 0, 0, 0.45);
                    opacity: 0;
                    pointer-events: none;
                    transition:
                        opacity 220ms ease;
                }

                .overlay.visible {
                    opacity: 1;
                    pointer-events: auto;
                }

                .drawer {
                    position: absolute;
                    display: flex;
                    flex-direction: column;
                    background: var(--background);
                    color: var(--foreground);
                    box-shadow:
                        0 20px 60px
                        rgba(0, 0, 0, 0.25);
                    transition:
                        transform 240ms ease;
                    overflow: hidden;
                }

                .light {
                    --background: #ffffff;
                    --foreground: #111827;
                    --border: #e5e7eb;
                }

                .dark {
                    --background: #111827;
                    --foreground: #f9fafb;
                    --border: #374151;
                }

                .drawer.left {
                    top: 0;
                    left: 0;
                    bottom: 0;
                    width: var(--drawer-size);
                    border-right: 1px solid var(--border);
                    transform: translateX(-100%);
                }

                .drawer.right {
                    top: 0;
                    right: 0;
                    bottom: 0;
                    width: var(--drawer-size);
                    border-left: 1px solid var(--border);
                    transform: translateX(100%);
                }

                .drawer.top {
                    top: 0;
                    left: 0;
                    right: 0;
                    height: var(--drawer-size);
                    border-bottom: 1px solid var(--border);
                    transform: translateY(-100%);
                }

                .drawer.bottom {
                    left: 0;
                    right: 0;
                    bottom: 0;
                    height: var(--drawer-size);
                    border-top: 1px solid var(--border);
                    transform: translateY(100%);
                }

                .drawer.open {
                    transform: translate(0, 0);
                }

                .sm {
                    --drawer-size: 280px;
                }

                .md {
                    --drawer-size: 360px;
                }

                .lg {
                    --drawer-size: 480px;
                }

                .xl {
                    --drawer-size: 640px;
                }

                .header {
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    min-height: 60px;
                    padding: 0 20px;
                    border-bottom:
                        1px solid var(--border);
                    flex-shrink: 0;
                }

                .title {
                    font-size: 16px;
                    font-weight: 700;
                }

                .close {
                    width: 36px;
                    height: 36px;
                    border: 0;
                    border-radius: 8px;
                    background: transparent;
                    color: inherit;
                    cursor: pointer;
                    font-size: 22px;
                    line-height: 1;
                }

                .close:hover {
                    background:
                        rgba(127, 127, 127, 0.12);
                }

                .body {
                    flex: 1;
                    overflow: auto;
                    padding: 20px;
                }

                .footer {
                    padding: 16px 20px;
                    border-top:
                        1px solid var(--border);
                    flex-shrink: 0;
                }

            </style>

            <div class="drawer-root">

                <div
                    class="overlay"
                    aria-hidden="true">
                </div>

                <aside
                    class="
                        drawer
                        ${this.state.theme}
                        ${this.state.position}
                        ${this.state.size}
                    "
                    role="dialog"
                    aria-modal="true"
                    aria-hidden="${
                        !this.state.open
                    }">

                    <div class="header">

                        <div class="title">
                            ${
                                this.getAttribute(
                                    "title"
                                ) || ""
                            }
                        </div>

                        <button
                            class="close"
                            type="button"
                            aria-label="Close">
                            &times;
                        </button>

                    </div>

                    <div class="body">
                        <slot></slot>
                    </div>

                    <div class="footer">
                        <slot name="footer"></slot>
                    </div>

                </aside>

            </div>
        `;

        this.overlay =
            this.shadowRoot.querySelector(
                ".overlay"
            );

        this.container =
            this.shadowRoot.querySelector(
                ".drawer"
            );

        this.closeButton =
            this.shadowRoot.querySelector(
                ".close"
            );

        this.updateVisualState();
    }

    bindEvents() {
        this.closeButton?.addEventListener(
            "click",
            () => this.close()
        );

        this.overlay?.addEventListener(
            "click",
            () => this.close()
        );

        this.addEventListener(
            "keydown",
            this.boundKeydown
        );
    }

    handleKeydown(event) {
        if (
            event.key === "Escape" &&
            this.state.open
        ) {
            event.preventDefault();
            this.close();
        }
    }

    handleResize() {
        if (!this.state.open) {
            return;
        }

        this.dispatchEvent(
            new CustomEvent(
                "resize",
                {
                    detail: {
                        width:
                            this.offsetWidth,
                        height:
                            this.offsetHeight
                    }
                }
            )
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
            new ResizeObserver(
                this.boundResize
            );

        this.resizeObserver.observe(
            this
        );
    }

    updateVisualState() {
        if (!this.container) {
            return;
        }

        this.container.classList.toggle(
            "open",
            this.state.open
        );

        this.overlay?.classList.toggle(
            "visible",
            this.state.open &&
            this.state.backdrop
        );

        this.container.setAttribute(
            "aria-hidden",
            String(!this.state.open)
        );

        this.style.pointerEvents =
            this.state.open
                ? "auto"
                : "none";
    }

    openDrawer(
        emit = true
    ) {
        if (this.state.open) {
            this.updateVisualState();
            return;
        }

        this.previousActiveElement =
            document.activeElement;

        this.state.open = true;

        this.setAttribute(
            "open",
            ""
        );

        this.updateVisualState();

        requestAnimationFrame(() => {
            this.closeButton?.focus();
        });

        if (emit) {
            this.dispatchEvent(
                new CustomEvent(
                    "open",
                    {
                        detail: {
                            drawer: this
                        }
                    }
                )
            );
        }
    }

    closeDrawer(
        emit = true
    ) {
        if (!this.state.open) {
            this.updateVisualState();
            return;
        }

        this.state.open = false;

        this.removeAttribute(
            "open"
        );

        this.updateVisualState();

        if (
            this.previousActiveElement &&
            typeof
                this.previousActiveElement.focus ===
                "function"
        ) {
            this.previousActiveElement.focus();
        }

        if (emit) {
            this.dispatchEvent(
                new CustomEvent(
                    "close",
                    {
                        detail: {
                            drawer: this
                        }
                    }
                )
            );
        }
    }

    open() {
        this.openDrawer(true);
    }

    close() {
        this.closeDrawer(true);
    }

    toggle() {
        if (this.state.open) {
            this.close();
        } else {
            this.open();
        }
    }

    isOpen() {
        return this.state.open;
    }

    setPosition(position) {
        const normalized =
            this.normalizePosition(
                position
            );

        if (normalized !== position) {
            return false;
        }

        this.setAttribute(
            "position",
            normalized
        );

        return true;
    }

    getPosition() {
        return this.state.position;
    }

    setSize(size) {
        const normalized =
            this.normalizeSize(size);

        if (normalized !== size) {
            return false;
        }

        this.setAttribute(
            "size",
            normalized
        );

        return true;
    }

    getSize() {
        return this.state.size;
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

    setBackdrop(value = true) {
        if (value) {
            this.setAttribute(
                "backdrop",
                ""
            );
        } else {
            this.setAttribute(
                "backdrop",
                "false"
            );
        }
    }

    destroy() {
        this.destroyed = true;

        this.closeDrawer(false);

        if (this.resizeObserver) {
            this.resizeObserver.disconnect();
            this.resizeObserver = null;
        }

        this.removeEventListener(
            "keydown",
            this.boundKeydown
        );

        this.overlay = null;
        this.container = null;
        this.closeButton = null;

        this.state.initialized = false;
    }
}

if (!customElements.get("custom-drawer")) {
    customElements.define(
        "custom-drawer",
        Drawer
    );
}

export default Drawer;
