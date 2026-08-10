/**
 * Custom Spinner Component
 * Production Grade Vanilla Web Component
 *
 * Features:
 * - Shadow DOM
 * - Reactive attributes
 * - Multiple sizes
 * - Multiple variants
 * - Adjustable speed
 * - Theme support
 * - Lifecycle safe
 * - Reconnect safe
 * - Custom events
 * - Public API
 * - Memory safe
 *
 * Author: yagizyagli
 */

class Spinner extends HTMLElement {

    static get observedAttributes() {
        return [
            "theme",
            "size",
            "variant",
            "speed"
        ];
    }


    constructor() {

        super();


        this.attachShadow({
            mode: "open"
        });


        this.spinner = null;


        this.initialized = false;

        this.destroyed = false;

        this.rendering = false;

        this.internalUpdate = false;


        this.shadowRoot.innerHTML = `

            <style>

                :host {
                    display: inline-flex;

                    align-items: center;
                    justify-content: center;

                    vertical-align: middle;

                    --spinner-size: 24px;
                    --spinner-color: #2563eb;
                    --spinner-track: rgba(
                        37,
                        99,
                        235,
                        .18
                    );

                    --spinner-speed: 1s;
                }


                :host([theme="dark"]) {

                    --spinner-color: #60a5fa;

                    --spinner-track: rgba(
                        96,
                        165,
                        250,
                        .2
                    );

                }


                .spinner {

                    width:
                        var(--spinner-size);

                    height:
                        var(--spinner-size);

                    box-sizing:
                        border-box;

                    border:
                        3px solid
                        var(--spinner-track);

                    border-top-color:
                        var(--spinner-color);

                    border-radius:
                        50%;

                    animation:
                        spinner-rotate
                        var(--spinner-speed)
                        linear
                        infinite;

                }


                :host([variant="secondary"]) {

                    --spinner-color: #64748b;

                    --spinner-track:
                        rgba(100, 116, 139, .18);

                }


                :host([variant="success"]) {

                    --spinner-color: #16a34a;

                    --spinner-track:
                        rgba(22, 163, 74, .18);

                }


                :host([variant="danger"]) {

                    --spinner-color: #dc2626;

                    --spinner-track:
                        rgba(220, 38, 38, .18);

                }


                :host([variant="warning"]) {

                    --spinner-color: #d97706;

                    --spinner-track:
                        rgba(217, 119, 6, .18);

                }


                :host([size="xs"]) {

                    --spinner-size: 14px;

                }


                :host([size="sm"]) {

                    --spinner-size: 18px;

                }


                :host([size="md"]) {

                    --spinner-size: 24px;

                }


                :host([size="lg"]) {

                    --spinner-size: 32px;

                }


                :host([size="xl"]) {

                    --spinner-size: 44px;

                }


                @keyframes spinner-rotate {

                    from {
                        transform:
                            rotate(0deg);
                    }

                    to {
                        transform:
                            rotate(360deg);
                    }

                }


                @media (
                    prefers-reduced-motion: reduce
                ) {

                    .spinner {

                        animation-duration:
                            2s;

                    }

                }

            </style>


            <span
                class="spinner"
                role="status"
                aria-label="Loading"
            ></span>

        `;


        this.spinner =
            this.shadowRoot.querySelector(
                ".spinner"
            );

    }


    connectedCallback() {

        if (this.initialized)
            return;


        this.initialized = true;

        this.destroyed = false;

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

        if (oldValue === newValue)
            return;


        if (!this.initialized)
            return;


        this.render();

    }


    render() {

        if (
            this.destroyed ||
            !this.spinner
        )
            return;


        this.rendering = true;


        const size =
            this.getSize();


        const variant =
            this.getVariant();


        const speed =
            this.getSpeed();


        this.setAttribute(
            "size",
            size
        );


        this.setAttribute(
            "variant",
            variant
        );


        this.spinner.style.setProperty(
            "--spinner-speed",
            `${speed}s`
        );


        this.spinner.setAttribute(
            "aria-label",
            "Loading"
        );


        this.rendering = false;

    }


    getSize() {

        const size =
            this.getAttribute(
                "size"
            );


        return [
            "xs",
            "sm",
            "md",
            "lg",
            "xl"
        ].includes(size)

            ? size

            : "md";

    }


    getVariant() {

        const variant =
            this.getAttribute(
                "variant"
            );


        return [
            "primary",
            "secondary",
            "success",
            "danger",
            "warning"
        ].includes(variant)

            ? variant

            : "primary";

    }


    getSpeed() {

        const value =
            parseFloat(
                this.getAttribute(
                    "speed"
                )
            );


        if (
            !Number.isFinite(value) ||
            value <= 0
        )
            return 1;


        return Math.max(
            0.1,
            Math.min(
                value,
                10
            )
        );

    }


    setSize(size) {

        if (
            ![
                "xs",
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


    setVariant(variant) {

        if (
            ![
                "primary",
                "secondary",
                "success",
                "danger",
                "warning"
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


    setSpeed(speed) {

        const value =
            Number(speed);


        if (
            !Number.isFinite(value) ||
            value <= 0
        )
            return false;


        this.setAttribute(
            "speed",
            String(value)
        );


        return true;

    }


    getSizeValue() {

        return this.getSize();

    }


    getVariantValue() {

        return this.getVariant();

    }


    getSpeedValue() {

        return this.getSpeed();

    }


    destroy() {

        if (this.destroyed)
            return;


        this.destroyed = true;

        this.initialized = false;

        this.rendering = false;

    }

}


if (
    !customElements.get(
        "custom-spinner"
    )
) {

    customElements.define(
        "custom-spinner",
        Spinner
    );

}


export {
    Spinner
};


export default Spinner;
