/**
 * Custom Modal Component
 * Production-Grade Vanilla Web Component
 *
 * Features:
 * - Shadow DOM
 * - Reactive attributes
 * - Focus management
 * - Keyboard support
 * - Backdrop handling
 * - Body scroll locking
 * - Lifecycle-safe
 * - Reconnect-safe
 * - Custom events
 * - Public API
 * - Memory-safe
 *
 * Author: yagizyagli
 */

class Modal extends HTMLElement {

    static get observedAttributes() {
        return [
            "theme",
            "open",
            "size",
            "closable",
            "backdrop"
        ];
    }

    constructor() {
        super();

        this.attachShadow({
            mode: "open"
        });

        this.overlay = null;
        this.container = null;
        this.header = null;
        this.body = null;
        this.footer = null;
        this.closeButton = null;

        this.previousFocusedElement = null;

        this.initialized = false;
        this.bound = false;

        this.bodyOverflow = "";
        this.openState = false;

        this.handleCloseClick =
            this.handleCloseClick.bind(this);

        this.handleBackdropClick =
            this.handleBackdropClick.bind(this);

        this.handleKeydown =
            this.handleKeydown.bind(this);

        this.handleFocusIn =
            this.handleFocusIn.bind(this);

        this.shadowRoot.innerHTML = `
            <style>

                :host {
                    --modal-overlay: rgba(15, 23, 42, .58);
                    --modal-bg: #ffffff;
                    --modal-color: #0f172a;
                    --modal-border: #e2e8f0;
                    --modal-radius: 16px;
                    --modal-shadow:
                        0 24px 70px rgba(15, 23, 42, .22);

                    display: contents;
                }

                :host([theme="dark"]) {
                    --modal-bg: #0f172a;
                    --modal-color: #f8fafc;
                    --modal-border: #334155;
                    --modal-shadow:
                        0 24px 70px rgba(0, 0, 0, .45);
                }

                .overlay {
                    position: fixed;
                    inset: 0;
                    z-index: 10000;

                    display: flex;
                    align-items: center;
                    justify-content: center;

                    padding: 24px;

                    background: var(--modal-overlay);

                    opacity: 0;
                    visibility: hidden;
                    pointer-events: none;

                    transition:
                        opacity .2s ease,
                        visibility .2s ease;
                }

                .overlay.open {
                    opacity: 1;
                    visibility: visible;
                    pointer-events: auto;
                }

                .container {
                    width: min(
                        100%,
                        var(--modal-width, 560px)
                    );

                    max-height:
                        calc(100vh - 48px);

                    display: flex;
                    flex-direction: column;

                    overflow: hidden;

                    background: var(--modal-bg);
                    color: var(--modal-color);

                    border:
                        1px solid var(--modal-border);

                    border-radius:
                        var(--modal-radius);

                    box-shadow:
                        var(--modal-shadow);

                    transform:
                        translateY(8px) scale(.985);

                    transition:
                        transform .2s ease;
                }

                .overlay.open .container {
                    transform:
                        translateY(0) scale(1);
                }

                .container.size-sm {
                    --modal-width: 400px;
                }

                .container.size-md {
                    --modal-width: 560px;
                }

                .container.size-lg {
                    --modal-width: 760px;
                }

                .container.size-xl {
                    --modal-width: 1000px;
                }

                .header {
                    display: flex;
                    align-items: center;
                    justify-content: space-between;

                    gap: 16px;
                    padding: 18px 20px;

                    border-bottom:
                        1px solid var(--modal-border);
                }

                .body {
                    flex: 1;
                    overflow: auto;
                    padding: 20px;
                }

                .footer {
                    display: flex;
                    align-items: center;
                    justify-content: flex-end;

                    gap: 10px;
                    padding: 16px 20px;

                    border-top:
                        1px solid var(--modal-border);
                }

                .close {
                    width: 36px;
                    height: 36px;

                    flex: 0 0 auto;

                    display: inline-flex;
                    align-items: center;
                    justify-content: center;

                    border: 0;
                    border-radius: 10px;

                    background: transparent;
                    color: inherit;

                    cursor: pointer;

                    font-size: 22px;
                    line-height: 1;

                    transition:
                        background .15s ease;
                }

                .close:hover {
                    background:
                        rgba(100, 116, 139, .12);
                }

                .close:focus-visible {
                    outline:
                        2px solid currentColor;

                    outline-offset: 2px;
                }

                @media (max-width: 640px) {

                    .overlay {
                        padding: 12px;
                    }

                    .container {
                        max-height:
                            calc(100vh - 24px);

                        border-radius: 14px;
                    }
                }

                @media (prefers-reduced-motion: reduce) {

                    .overlay,
                    .container {
                        transition: none;
                    }
                }

            </style>

            <div
                class="overlay"
                part="overlay"
                aria-hidden="true"
            >

                <section
                    class="container size-md"
                    part="container"
                    role="dialog"
                    aria-modal="true"
                    tabindex="-1"
                >

                    <header
                        class="header"
                        part="header"
                    >

                        <slot name="header"></slot>

                        <button
                            class="close"
                            type="button"
                            aria-label="Close modal"
                            part="close"
                        >
                            ×
                        </button>

                    </header>

                    <div
                        class="body"
                        part="body"
                    >
                        <slot></slot>
                    </div>

                    <footer
                        class="footer"
                        part="footer"
                    >
                        <slot name="footer"></slot>
                    </footer>

                </section>

            </div>
        `;

        this.overlay =
            this.shadowRoot.querySelector(".overlay");

        this.container =
            this.shadowRoot.querySelector(".container");

        this.header =
            this.shadowRoot.querySelector(".header");

        this.body =
            this.shadowRoot.querySelector(".body");

        this.footer =
            this.shadowRoot.querySelector(".footer");

        this.closeButton =
            this.shadowRoot.querySelector(".close");
    }

    connectedCallback() {

        if (this.initialized)
            return;

        this.initialized = true;

        this.bindEvents();
        this.render();
    }

    disconnectedCallback() {

        this.unbindEvents();
        this.unlockBodyScroll();

        this.initialized = false;
    }

    attributeChangedCallback(
        name,
        oldValue,
        newValue
    ) {

        if (oldValue === newValue)
            return;

        if (!this.initialized)
            return;

        this.render();
    }

    bindEvents() {

        if (this.bound)
            return;

        this.bound = true;

        this.closeButton.addEventListener(
            "click",
            this.handleCloseClick
        );

        this.overlay.addEventListener(
            "click",
            this.handleBackdropClick
        );

        document.addEventListener(
            "keydown",
            this.handleKeydown
        );

        document.addEventListener(
            "focusin",
            this.handleFocusIn
        );
    }

    unbindEvents() {

        if (!this.bound)
            return;

        this.bound = false;

        this.closeButton.removeEventListener(
            "click",
            this.handleCloseClick
        );

        this.overlay.removeEventListener(
            "click",
            this.handleBackdropClick
        );

        document.removeEventListener(
            "keydown",
            this.handleKeydown
        );

        document.removeEventListener(
            "focusin",
            this.handleFocusIn
        );
    }

    render() {

        const open = this.isOpen();
        const size = this.getSize();

        this.container.classList.remove(
            "size-sm",
            "size-md",
            "size-lg",
            "size-xl"
        );

        this.container.classList.add(
            `size-${size}`
        );

        this.overlay.classList.toggle(
            "open",
            open
        );

        this.overlay.setAttribute(
            "aria-hidden",
            String(!open)
        );

        this.closeButton.hidden =
            !this.isClosable();

        this.container.setAttribute(
            "aria-hidden",
            String(!open)
        );

        if (open) {
            this.openInternal();
        } else {
            this.closeInternal();
        }
    }

    openInternal() {

        if (this.openState)
            return;

        this.openState = true;

        this.previousFocusedElement =
            document.activeElement;

        this.lockBodyScroll();

        requestAnimationFrame(() => {

            if (!this.isOpen())
                return;

            this.focusFirstElement();
        });

        this.dispatchEvent(
            new CustomEvent("open", {
                bubbles: true,
                composed: true
            })
        );
    }

    closeInternal() {

        if (!this.openState)
            return;

        this.openState = false;

        this.unlockBodyScroll();

        const previous =
            this.previousFocusedElement;

        this.previousFocusedElement = null;

        if (
            previous &&
            typeof previous.focus === "function"
        ) {

            requestAnimationFrame(() => {

                try {
                    previous.focus();
                } catch {}
            });
        }

        this.dispatchEvent(
            new CustomEvent("close", {
                bubbles: true,
                composed: true
            })
        );
    }

    lockBodyScroll() {

        this.bodyOverflow =
            document.body.style.overflow;

        document.body.style.overflow =
            "hidden";

        document.body.classList.add(
            "custom-modal-open"
        );
    }

    unlockBodyScroll() {

        document.body.classList.remove(
            "custom-modal-open"
        );

        document.body.style.overflow =
            this.bodyOverflow || "";

        this.bodyOverflow = "";
    }

    handleCloseClick() {

        this.close();
    }

    handleBackdropClick(event) {

        if (
            event.target !== this.overlay
        )
            return;

        const backdrop =
            this.getBackdrop();

        if (
            backdrop === "static" ||
            backdrop === "false"
        )
            return;

        this.close();
    }

    handleKeydown(event) {

        if (!this.isOpen())
            return;

        if (
            event.key === "Escape" &&
            this.isClosable()
        ) {

            event.preventDefault();

            this.close();

            return;
        }

        if (event.key === "Tab") {
            this.trapFocus(event);
        }
    }

    handleFocusIn(event) {

        if (!this.isOpen())
            return;

        if (
            this.contains(event.target) ||
            this.shadowRoot.contains(event.target)
        )
            return;

        this.focusFirstElement();
    }

    trapFocus(event) {

        const focusable =
            this.getFocusableElements();

        if (!focusable.length)
            return;

        const first =
            focusable[0];

        const last =
            focusable[focusable.length - 1];

        if (
            event.shiftKey &&
            document.activeElement === first
        ) {

            event.preventDefault();

            last.focus();

            return;
        }

        if (
            !event.shiftKey &&
            document.activeElement === last
        ) {

            event.preventDefault();

            first.focus();
        }
    }

    getFocusableElements() {

        const selectors = [
            "button:not([disabled])",
            "[href]",
            "input:not([disabled])",
            "select:not([disabled])",
            "textarea:not([disabled])",
            "[tabindex]:not([tabindex='-1'])"
        ];

        const elements = [
            ...this.querySelectorAll(
                selectors.join(",")
            ),
            ...this.shadowRoot.querySelectorAll(
                selectors.join(",")
            )
        ];

        return [
            ...new Set(elements)
        ].filter(
            element =>
                !element.hidden &&
                element.offsetParent !== null
        );
    }

    focusFirstElement() {

        const focusable =
            this.getFocusableElements();

        if (focusable.length) {

            focusable[0].focus();

        } else {

            this.container.focus();
        }
    }

    isOpen() {

        return this.hasAttribute("open");
    }

    isClosable() {

        return (
            !this.hasAttribute("closable") ||
            this.getAttribute("closable") !== "false"
        );
    }

    getBackdrop() {

        return (
            this.getAttribute("backdrop") ||
            "true"
        );
    }

    getSize() {

        const size =
            this.getAttribute("size");

        return [
            "sm",
            "md",
            "lg",
            "xl"
        ].includes(size)
            ? size
            : "md";
    }

    open() {

        if (this.isOpen())
            return false;

        this.setAttribute(
            "open",
            ""
        );

        return true;
    }

    close() {

        if (!this.isOpen())
            return false;

        this.removeAttribute(
            "open"
        );

        return true;
    }

    toggle() {

        return this.isOpen()
            ? this.close()
            : this.open();
    }

    isOpened() {

        return this.isOpen();
    }

    setSize(size) {

        if (
            ![
                "sm",
                "md",
                "lg",
                "xl"
            ].includes(size)
        )
            return false;

        this.setAttribute(
            "size",
            size
        );

        return true;
    }

    setTheme(theme) {

        if (
            theme !== "light" &&
            theme !== "dark"
        )
            return false;

        this.setAttribute(
            "theme",
            theme
        );

        return true;
    }

    setClosable(value) {

        this.setAttribute(
            "closable",
            String(Boolean(value))
        );

        return true;
    }

    setBackdrop(value) {

        if (
            value !== true &&
            value !== false &&
            value !== "static"
        )
            return false;

        this.setAttribute(
            "backdrop",
            String(value)
        );

        return true;
    }

    destroy() {

        this.closeInternal();
        this.unbindEvents();

        this.initialized = false;
    }
}

if (
    !customElements.get("custom-modal")
) {

    customElements.define(
        "custom-modal",
        Modal
    );
}

export {
    Modal
};

export default Modal;
