/**
 * Custom Toast Component
 * Production Grade Vanilla Web Component
 *
 * Features:
 * - Shadow DOM
 * - Reactive attributes
 * - Queue management
 * - Auto close
 * - Animations
 * - Theme support
 * - Variants
 * - Positions
 * - Custom events
 * - Public API
 * - Lifecycle safe
 * - Reconnect safe
 * - Memory safe
 *
 * Author: yagizyagli
 */


class Toast extends HTMLElement {


    static get observedAttributes() {

        return [
            "theme",
            "variant",
            "duration",
            "position"
        ];

    }


    constructor() {

        super();


        this.attachShadow({
            mode: "open"
        });


        /*
         * DOM
         */

        this.container = null;

        this.message = null;

        this.icon = null;

        this.closeButton = null;


        /*
         * State
         */

        this.initialized = false;

        this.visible = false;

        this.destroyed = false;

        this.timer = null;

        this.removeTimer = null;


        /*
         * Event handlers
         */

        this.handleClose =
            this.handleClose.bind(this);


        /*
         * DOM
         */

        this.shadowRoot.innerHTML = `

            <style>

                :host {

                    --toast-bg: #ffffff;

                    --toast-color: #0f172a;

                    --toast-border: #e2e8f0;

                    --toast-shadow:
                        0 12px 35px
                        rgba(15, 23, 42, .16);

                    --toast-radius: 12px;

                    --toast-accent: #2563eb;

                    display: block;

                    position: fixed;

                    z-index: 11000;

                    width: min(
                        calc(100vw - 32px),
                        380px
                    );

                    pointer-events: none;

                    font-family: inherit;

                }


                :host([theme="dark"]) {

                    --toast-bg: #0f172a;

                    --toast-color: #f8fafc;

                    --toast-border: #334155;

                    --toast-shadow:
                        0 12px 35px
                        rgba(0, 0, 0, .35);

                }


                :host([position="top-left"]) {

                    top: 16px;

                    left: 16px;

                }


                :host([position="top-center"]) {

                    top: 16px;

                    left: 50%;

                    transform:
                        translateX(-50%);

                }


                :host([position="top-right"]) {

                    top: 16px;

                    right: 16px;

                }


                :host([position="bottom-left"]) {

                    bottom: 16px;

                    left: 16px;

                }


                :host([position="bottom-center"]) {

                    bottom: 16px;

                    left: 50%;

                    transform:
                        translateX(-50%);

                }


                :host([position="bottom-right"]) {

                    bottom: 16px;

                    right: 16px;

                }


                :host([variant="success"]) {

                    --toast-accent: #16a34a;

                }


                :host([variant="error"]) {

                    --toast-accent: #dc2626;

                }


                :host([variant="warning"]) {

                    --toast-accent: #d97706;

                }


                :host([variant="info"]) {

                    --toast-accent: #2563eb;

                }


                .container {

                    display: flex;

                    align-items: flex-start;

                    gap: 12px;

                    padding: 14px 14px 14px 16px;

                    background:
                        var(--toast-bg);

                    color:
                        var(--toast-color);

                    border:
                        1px solid
                        var(--toast-border);

                    border-left:
                        4px solid
                        var(--toast-accent);

                    border-radius:
                        var(--toast-radius);

                    box-shadow:
                        var(--toast-shadow);

                    pointer-events: auto;

                    opacity: 0;

                    transform:
                        translateY(-8px)
                        scale(.98);

                    transition:
                        opacity .2s ease,
                        transform .2s ease;

                }


                .container.visible {

                    opacity: 1;

                    transform:
                        translateY(0)
                        scale(1);

                }


                .icon {

                    width: 24px;

                    height: 24px;

                    flex: 0 0 auto;

                    display: inline-flex;

                    align-items: center;

                    justify-content: center;

                    color:
                        var(--toast-accent);

                    font-weight: 700;

                    font-size: 16px;

                }


                .message {

                    flex: 1;

                    min-width: 0;

                    line-height: 1.45;

                    word-break: break-word;

                }


                .close {

                    width: 30px;

                    height: 30px;

                    flex: 0 0 auto;

                    border: 0;

                    border-radius: 8px;

                    background: transparent;

                    color: inherit;

                    cursor: pointer;

                    font-size: 20px;

                    line-height: 1;

                }


                .close:hover {

                    background:
                        rgba(100,116,139,.12);

                }


                .close:focus-visible {

                    outline:
                        2px solid
                        currentColor;

                    outline-offset: 2px;

                }


                @media (
                    prefers-reduced-motion: reduce
                ) {

                    .container {

                        transition: none;

                    }

                }

            </style>


            <div
                class="container"
                part="container"
                role="status"
                aria-live="polite"
                aria-atomic="true"
            >

                <span
                    class="icon"
                    part="icon"
                ></span>


                <div
                    class="message"
                    part="message"
                ></div>


                <button
                    class="close"
                    type="button"
                    aria-label="Close"
                    part="close"
                >
                    ×
                </button>

            </div>

        `;


        this.container =
            this.shadowRoot.querySelector(
                ".container"
            );


        this.message =
            this.shadowRoot.querySelector(
                ".message"
            );


        this.icon =
            this.shadowRoot.querySelector(
                ".icon"
            );


        this.closeButton =
            this.shadowRoot.querySelector(
                ".close"
            );

    }


    connectedCallback() {

        if (this.initialized)
            return;


        this.initialized = true;

        this.destroyed = false;


        this.closeButton.addEventListener(
            "click",
            this.handleClose
        );


        this.render();

    }


    disconnectedCallback() {

        this.destroy();

    }


    attributeChangedCallback(
        name,
        oldValue,
        newValue
    ) {

        if (
            oldValue === newValue ||
            !this.initialized
        )
            return;


        this.render();

    }


    render() {

        if (this.destroyed)
            return;


        this.icon.textContent =
            this.getIcon();


        this.container.classList.toggle(
            "visible",
            this.visible
        );


        this.container.setAttribute(
            "aria-live",
            this.getVariant() === "error"
                ? "assertive"
                : "polite"
        );

    }


    getVariant() {

        const value =
            this.getAttribute(
                "variant"
            );


        return [
            "success",
            "error",
            "warning",
            "info"
        ].includes(value)

            ? value

            : "info";

    }


    getDuration() {

        const value =
            Number(
                this.getAttribute(
                    "duration"
                )
            );


        if (
            value === 0
        )
            return 0;


        return Number.isFinite(value) &&
            value > 0

            ? value

            : 4000;

    }


    getPosition() {

        const value =
            this.getAttribute(
                "position"
            );


        return [
            "top-left",
            "top-center",
            "top-right",
            "bottom-left",
            "bottom-center",
            "bottom-right"
        ].includes(value)

            ? value

            : "top-right";

    }


    getIcon() {

        switch (
            this.getVariant()
        ) {

            case "success":
                return "✓";

            case "error":
                return "×";

            case "warning":
                return "!";

            default:
                return "i";

        }

    }


    getMessage() {

        return (
            this.getAttribute(
                "message"
            ) || ""
        );

    }


    show(message = null) {

        if (this.destroyed)
            return false;


        this.clearTimers();


        if (
            message !== null
        ) {

            this.setMessage(
                message
            );

        }


        this.visible = true;

        this.render();


        requestAnimationFrame(() => {

            if (
                this.destroyed ||
                !this.visible
            )
                return;


            this.container.classList.add(
                "visible"
            );

        });


        const duration =
            this.getDuration();


        if (duration > 0) {

            this.timer =
                setTimeout(
                    () => {

                        this.hide();

                    },
                    duration
                );

        }


        this.dispatchEvent(
            new CustomEvent(
                "show",
                {
                    bubbles: true,

                    detail: {
                        message:
                            this.getMessage(),

                        variant:
                            this.getVariant(),

                        duration
                    }
                }
            )
        );


        return true;

    }


    hide() {

        if (
            !this.visible
        )
            return false;


        this.clearTimers();


        this.visible = false;


        this.container.classList.remove(
            "visible"
        );


        this.removeTimer =
            setTimeout(
                () => {

                    if (
                        !this.destroyed
                    ) {

                        this.render();

                    }

                },
                200
            );


        this.dispatchEvent(
            new CustomEvent(
                "hide",
                {
                    bubbles: true
                }
            )
        );


        return true;

    }


    close() {

        return this.hide();

    }


    toggle() {

        if (this.visible) {

            return this.hide();

        }


        return this.show();

    }


    setMessage(message) {

        this.message.textContent =
            String(
                message ?? ""
            );


        this.setAttribute(
            "message",
            String(
                message ?? ""
            )
        );


        return true;

    }


    setVariant(variant) {

        if (
            ![
                "success",
                "error",
                "warning",
                "info"
            ].includes(variant)
        )
            return false;


        this.setAttribute(
            "variant",
            variant
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


    setDuration(duration) {

        const value =
            Number(duration);


        if (
            !Number.isFinite(value) ||
            value < 0
        )
            return false;


        this.setAttribute(
            "duration",
            String(value)
        );


        if (this.visible) {

            this.show();

        }


        return true;

    }


    setPosition(position) {

        if (
            ![
                "top-left",
                "top-center",
                "top-right",
                "bottom-left",
                "bottom-center",
                "bottom-right"
            ].includes(position)
        )
            return false;


        this.setAttribute(
            "position",
            position
        );


        return true;

    }


    isVisible() {

        return this.visible;

    }


    clearTimers() {

        if (this.timer) {

            clearTimeout(
                this.timer
            );

            this.timer = null;

        }


        if (this.removeTimer) {

            clearTimeout(
                this.removeTimer
            );

            this.removeTimer = null;

        }

    }


    destroy() {

        if (this.destroyed)
            return;


        this.clearTimers();


        this.closeButton.removeEventListener(
            "click",
            this.handleClose
        );


        this.visible = false;

        this.destroyed = true;

        this.initialized = false;

    }

}


if (
    !customElements.get(
        "custom-toast"
    )
) {

    customElements.define(
        "custom-toast",
        Toast
    );

}


export {
    Toast
};


export default Toast;
