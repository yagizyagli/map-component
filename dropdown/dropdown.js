/**
 * Professional Dropdown Component
 *
 * Production Grade Dropdown Web Component
 *
 * Features:
 * - Shadow DOM
 * - Reactive attributes
 * - Keyboard navigation
 * - Position support
 * - Theme support
 * - Disabled state
 * - Click outside handling
 * - Escape to close
 * - Public API
 * - Custom events
 * - Lifecycle safe
 * - Memory safe
 *
 * Author: yagizyagli
 */

class Dropdown extends HTMLElement {

    static observedAttributes = [
        "theme",
        "open",
        "position",
        "trigger",
        "disabled"
    ];

    constructor() {
        super();

        this.attachShadow({
            mode: "open"
        });

        this.trigger = null;
        this.menu = null;
        this.items = [];

        this.resizeObserver = null;

        this.previousActiveElement = null;
        this.activeIndex = -1;

        this.state = {
            initialized: false,
            open: false,
            disabled: false,
            theme: "light",
            position: "bottom",
            trigger: "click"
        };

        this.boundDocumentClick =
            this.handleDocumentClick.bind(this);

        this.boundKeydown =
            this.handleKeydown.bind(this);

        this.boundResize =
            this.handleResize.bind(this);
    }

    connectedCallback() {
        if (this.state.initialized) {
            this.render();
            return;
        }

        this.readAttributes();

        this.state.initialized = true;

        this.render();
        this.bindEvents();
        this.observeResize();

        this.dispatchEvent(
            new CustomEvent("ready", {
                detail: {
                    dropdown: this
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

        this.readAttributes();

        if (!this.state.initialized) {
            return;
        }

        if (name === "open") {
            if (this.hasAttribute("open")) {
                this.openDropdown(false);
            } else {
                this.closeDropdown(false);
            }

            return;
        }

        this.render();
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

        this.state.trigger =
            this.normalizeTrigger(
                this.getAttribute("trigger")
            );

        this.state.disabled =
            this.hasAttribute("disabled");

        this.state.open =
            this.hasAttribute("open");
    }

    normalizePosition(value) {
        const positions = [
            "bottom",
            "bottom-start",
            "bottom-end",
            "top",
            "top-start",
            "top-end",
            "left",
            "right"
        ];

        return positions.includes(value)
            ? value
            : "bottom";
    }

    normalizeTrigger(value) {
        return value === "hover"
            ? "hover"
            : "click";
    }

    render() {
        this.shadowRoot.innerHTML = `
            <style>

                :host {
                    position: relative;
                    display: inline-block;
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

                .wrapper {
                    position: relative;
                    display: inline-block;
                }

                .trigger {
                    display: inline-flex;
                    align-items: center;
                    justify-content: center;
                    gap: 8px;
                    min-height: 40px;
                    padding: 8px 14px;
                    border: 1px solid;
                    border-radius: 8px;
                    background: var(--background);
                    color: var(--foreground);
                    border-color: var(--border);
                    cursor: pointer;
                    font: inherit;
                    transition:
                        background 160ms ease,
                        border-color 160ms ease;
                }

                .trigger:hover:not(:disabled) {
                    background:
                        var(--hover-background);
                }

                .trigger:disabled {
                    opacity: 0.5;
                    cursor: not-allowed;
                }

                .light {
                    --background: #ffffff;
                    --foreground: #111827;
                    --border: #d1d5db;
                    --hover-background: #f3f4f6;
                    --menu-background: #ffffff;
                }

                .dark {
                    --background: #111827;
                    --foreground: #f9fafb;
                    --border: #374151;
                    --hover-background: #1f2937;
                    --menu-background: #111827;
                }

                .menu {
                    position: absolute;
                    z-index: 1000;
                    min-width: 180px;
                    max-height: 320px;
                    overflow: auto;
                    padding: 6px;
                    border: 1px solid var(--border);
                    border-radius: 10px;
                    background: var(--menu-background);
                    color: var(--foreground);
                    box-shadow:
                        0 12px 35px
                        rgba(0, 0, 0, 0.16);

                    opacity: 0;
                    visibility: hidden;
                    pointer-events: none;

                    transform: translateY(-4px);

                    transition:
                        opacity 140ms ease,
                        transform 140ms ease,
                        visibility 140ms ease;
                }

                .menu.open {
                    opacity: 1;
                    visibility: visible;
                    pointer-events: auto;
                    transform: translateY(0);
                }

                .menu.bottom {
                    top: calc(100% + 6px);
                    left: 0;
                }

                .menu.bottom-start {
                    top: calc(100% + 6px);
                    left: 0;
                }

                .menu.bottom-end {
                    top: calc(100% + 6px);
                    right: 0;
                }

                .menu.top {
                    bottom: calc(100% + 6px);
                    left: 0;
                    transform:
                        translateY(4px);
                }

                .menu.top.open {
                    transform:
                        translateY(0);
                }

                .menu.top-start {
                    bottom: calc(100% + 6px);
                    left: 0;
                    transform:
                        translateY(4px);
                }

                .menu.top-end {
                    bottom: calc(100% + 6px);
                    right: 0;
                    transform:
                        translateY(4px);
                }

                .menu.left {
                    right: calc(100% + 6px);
                    top: 0;
                }

                .menu.right {
                    left: calc(100% + 6px);
                    top: 0;
                }

                ::slotted([data-dropdown-item]) {
                    display: block;
                    width: 100%;
                    padding: 9px 10px;
                    border: 0;
                    border-radius: 7px;
                    background: transparent;
                    color: inherit;
                    text-align: left;
                    font: inherit;
                    cursor: pointer;
                }

                ::slotted(
                    [data-dropdown-item]:hover
                ) {
                    background:
                        rgba(127, 127, 127, 0.12);
                }

                ::slotted(
                    [data-dropdown-item][disabled]
                ) {
                    opacity: 0.45;
                    cursor: not-allowed;
                }

            </style>

            <div
                class="
                    wrapper
                    ${this.state.theme}
                ">

                <button
                    class="trigger"
                    type="button"
                    aria-haspopup="menu"
                    aria-expanded="${
                        this.state.open
                    }"
                    ${
                        this.state.disabled
                            ? "disabled"
                            : ""
                    }>

                    <slot name="trigger">
                        Menu
                    </slot>

                </button>

                <div
                    class="
                        menu
                        ${this.state.position}
                        ${this.state.open
                            ? "open"
                            : ""}
                    "
                    role="menu">

                    <slot></slot>

                </div>

            </div>
        `;

        this.trigger =
            this.shadowRoot.querySelector(
                ".trigger"
            );

        this.menu =
            this.shadowRoot.querySelector(
                ".menu"
            );

        this.updateItems();
        this.updateVisualState();
    }

    bindEvents() {
        this.trigger?.addEventListener(
            "click",
            () => {
                if (
                    this.state.trigger ===
                    "click"
                ) {
                    this.toggle();
                }
            }
        );

        if (
            this.state.trigger ===
            "hover"
        ) {
            this.addEventListener(
                "mouseenter",
                this.handleMouseEnter.bind(this)
            );

            this.addEventListener(
                "mouseleave",
                this.handleMouseLeave.bind(this)
            );
        }

        this.addEventListener(
            "keydown",
            this.boundKeydown
        );

        document.addEventListener(
            "click",
            this.boundDocumentClick
        );
    }

    handleMouseEnter() {
        if (!this.state.disabled) {
            this.open();
        }
    }

    handleMouseLeave() {
        if (
            this.state.trigger ===
            "hover"
        ) {
            this.close();
        }
    }

    handleDocumentClick(event) {
        if (!this.contains(event.target)) {
            this.close();
        }
    }

    handleKeydown(event) {
        if (
            this.state.disabled
        ) {
            return;
        }

        if (
            event.key === "Escape"
        ) {
            if (this.state.open) {
                event.preventDefault();
                this.close();
                this.trigger?.focus();
            }

            return;
        }

        if (
            event.key === "Enter" ||
            event.key === " "
        ) {
            if (
                event.target ===
                this.trigger
            ) {
                event.preventDefault();
                this.toggle();
            }

            return;
        }

        if (
            !this.state.open
        ) {
            return;
        }

        if (
            event.key === "ArrowDown"
        ) {
            event.preventDefault();
            this.focusNext();
        }

        if (
            event.key === "ArrowUp"
        ) {
            event.preventDefault();
            this.focusPrevious();
        }

        if (
            event.key === "Home"
        ) {
            event.preventDefault();
            this.focusFirst();
        }

        if (
            event.key === "End"
        ) {
            event.preventDefault();
            this.focusLast();
        }
    }

    updateItems() {
        const slot =
            this.shadowRoot.querySelector(
                "slot:not([name])"
            );

        if (!slot) {
            this.items = [];
            return;
        }

        this.items =
            slot.assignedElements({
                flatten: true
            }).filter(
                element =>
                    element.hasAttribute(
                        "data-dropdown-item"
                    ) &&
                    !element.hasAttribute(
                        "disabled"
                    )
            );

        this.items.forEach(
            (item, index) => {
                item.setAttribute(
                    "role",
                    "menuitem"
                );

                item.setAttribute(
                    "tabindex",
                    index === 0
                        ? "0"
                        : "-1"
                );
            }
        );
    }

    updateVisualState() {
        if (!this.trigger) {
            return;
        }

        this.trigger.setAttribute(
            "aria-expanded",
            String(this.state.open)
        );

        this.menu?.classList.toggle(
            "open",
            this.state.open
        );

        this.style.zIndex =
            this.state.open
                ? "1000"
                : "";
    }

    openDropdown(
        emit = true
    ) {
        if (
            this.state.disabled
        ) {
            return;
        }

        if (this.state.open) {
            this.updateVisualState();
            return;
        }

        this.state.open = true;

        this.setAttribute(
            "open",
            ""
        );

        this.updateItems();
        this.updateVisualState();

        if (emit) {
            this.dispatchEvent(
                new CustomEvent(
                    "open",
                    {
                        detail: {
                            dropdown: this
                        }
                    }
                )
            );
        }
    }

    closeDropdown(
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

        this.activeIndex = -1;

        if (emit) {
            this.dispatchEvent(
                new CustomEvent(
                    "close",
                    {
                        detail: {
                            dropdown: this
                        }
                    }
                )
            );
        }
    }

    open() {
        this.openDropdown(true);
    }

    close() {
        this.closeDropdown(true);
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

    setDisabled(value = true) {
        if (value) {
            this.setAttribute(
                "disabled",
                ""
            );

            this.close();
        } else {
            this.removeAttribute(
                "disabled"
            );
        }
    }

    isDisabled() {
        return this.state.disabled;
    }

    setPosition(position) {
        const normalized =
            this.normalizePosition(
                position
            );

        if (
            normalized !== position
        ) {
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

    focusFirst() {
        this.updateItems();

        if (!this.items.length) {
            return;
        }

        this.activeIndex = 0;
        this.items[0].focus();
    }

    focusLast() {
        this.updateItems();

        if (!this.items.length) {
            return;
        }

        this.activeIndex =
            this.items.length - 1;

        this.items[
            this.activeIndex
        ].focus();
    }

    focusNext() {
        this.updateItems();

        if (!this.items.length) {
            return;
        }

        this.activeIndex =
            (this.activeIndex + 1) %
            this.items.length;

        this.items[
            this.activeIndex
        ].focus();
    }

    focusPrevious() {
        this.updateItems();

        if (!this.items.length) {
            return;
        }

        this.activeIndex =
            this.activeIndex <= 0
                ? this.items.length - 1
                : this.activeIndex - 1;

        this.items[
            this.activeIndex
        ].focus();
    }

    handleResize() {
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

    destroy() {
        if (this.resizeObserver) {
            this.resizeObserver.disconnect();
            this.resizeObserver = null;
        }

        document.removeEventListener(
            "click",
            this.boundDocumentClick
        );

        this.removeEventListener(
            "keydown",
            this.boundKeydown
        );

        this.closeDropdown(false);

        this.trigger = null;
        this.menu = null;
        this.items = [];

        this.state.initialized = false;
    }
}

if (!customElements.get("custom-dropdown")) {
    customElements.define(
        "custom-dropdown",
        Dropdown
    );
}

export default Dropdown;
