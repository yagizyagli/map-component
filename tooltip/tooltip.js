/**
 * Custom Tooltip Component
 * Production Grade Vanilla Web Component
 *
 * Features:
 * - Shadow DOM
 * - Reactive attributes
 * - Position handling
 * - Theme support
 * - Animation support
 * - Keyboard support
 * - Hover / focus / click triggers
 * - Lifecycle safe
 * - Reconnect safe
 * - Custom events
 * - Public API
 * - Memory safe
 *
 * Author: yagizyagli
 */

class Tooltip extends HTMLElement {

    static get observedAttributes() {
        return [
            "theme",
            "position",
            "trigger",
            "open",
            "arrow"
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

        this.tooltip = null;

        this.content = null;

        this.arrow = null;


        /*
         * State
         */

        this.initialized = false;

        this.bound = false;

        this.internalUpdate = false;

        this.opened = false;

        this.hoveringTrigger = false;

        this.hoveringTooltip = false;


        /*
         * Async
         */

        this.hideTimer = null;

        this.positionFrame = null;


        /*
         * Event handlers
         */

        this.handleMouseEnter =
            this.handleMouseEnter.bind(this);

        this.handleMouseLeave =
            this.handleMouseLeave.bind(this);

        this.handleFocusIn =
            this.handleFocusIn.bind(this);

        this.handleFocusOut =
            this.handleFocusOut.bind(this);

        this.handleClick =
            this.handleClick.bind(this);

        this.handleKeydown =
            this.handleKeydown.bind(this);

        this.handleDocumentPointerDown =
            this.handleDocumentPointerDown.bind(this);

        this.handleResize =
            this.handleResize.bind(this);

        this.handleScroll =
            this.handleScroll.bind(this);

        this.handleTooltipEnter =
            this.handleTooltipEnter.bind(this);

        this.handleTooltipLeave =
            this.handleTooltipLeave.bind(this);


        /*
         * Shadow DOM
         */

        this.shadowRoot.innerHTML = `

            <style>

                :host {

                    --tooltip-bg: #0f172a;
                    --tooltip-color: #ffffff;

                    --tooltip-radius: 8px;
                    --tooltip-shadow:
                        0 8px 24px rgba(0, 0, 0, .18);

                    --tooltip-padding:
                        8px 12px;

                    --tooltip-font-size:
                        13px;

                    --tooltip-z-index:
                        11000;

                    display: inline-block;

                    position: relative;

                }


                :host([theme="light"]) {

                    --tooltip-bg: #ffffff;
                    --tooltip-color: #0f172a;

                    --tooltip-shadow:
                        0 8px 24px rgba(15, 23, 42, .16);

                }


                :host([theme="dark"]) {

                    --tooltip-bg: #0f172a;
                    --tooltip-color: #ffffff;

                }


                .wrapper {

                    display: inline-block;

                    position: relative;

                }


                .tooltip {

                    position: fixed;

                    z-index:
                        var(--tooltip-z-index);

                    width: max-content;

                    max-width:
                        min(320px, calc(100vw - 24px));

                    padding:
                        var(--tooltip-padding);

                    box-sizing: border-box;

                    border-radius:
                        var(--tooltip-radius);

                    background:
                        var(--tooltip-bg);

                    color:
                        var(--tooltip-color);

                    box-shadow:
                        var(--tooltip-shadow);

                    font-family:
                        inherit;

                    font-size:
                        var(--tooltip-font-size);

                    line-height: 1.4;

                    pointer-events: none;

                    opacity: 0;

                    visibility: hidden;

                    transform:
                        translateY(4px);

                    transition:
                        opacity .15s ease,
                        transform .15s ease,
                        visibility .15s ease;

                    white-space: normal;

                }


                .tooltip.open {

                    opacity: 1;

                    visibility: visible;

                    pointer-events: auto;

                    transform:
                        translateY(0);

                }


                .tooltip.arrow::after {

                    content: "";

                    position: absolute;

                    width: 8px;
                    height: 8px;

                    background:
                        var(--tooltip-bg);

                    transform:
                        rotate(45deg);

                }


                .tooltip[data-position="top"] {

                    transform:
                        translateY(4px);

                }


                .tooltip[data-position="top"].open {

                    transform:
                        translateY(0);

                }


                .tooltip[data-position="bottom"] {

                    transform:
                        translateY(-4px);

                }


                .tooltip[data-position="bottom"].open {

                    transform:
                        translateY(0);

                }


                .tooltip[data-position="left"] {

                    transform:
                        translateX(4px);

                }


                .tooltip[data-position="left"].open {

                    transform:
                        translateX(0);

                }


                .tooltip[data-position="right"] {

                    transform:
                        translateX(-4px);

                }


                .tooltip[data-position="right"].open {

                    transform:
                        translateX(0);

                }


                .tooltip[data-position="top"]::after {

                    left: 50%;
                    bottom: -4px;

                    margin-left: -4px;

                }


                .tooltip[data-position="bottom"]::after {

                    left: 50%;
                    top: -4px;

                    margin-left: -4px;

                }


                .tooltip[data-position="left"]::after {

                    right: -4px;
                    top: 50%;

                    margin-top: -4px;

                }


                .tooltip[data-position="right"]::after {

                    left: -4px;
                    top: 50%;

                    margin-top: -4px;

                }


                @media (
                    prefers-reduced-motion: reduce
                ) {

                    .tooltip {

                        transition: none;

                    }

                }

            </style>


            <div class="wrapper">

                <slot></slot>

                <div
                    class="tooltip"
                    part="tooltip"
                    role="tooltip"
                    aria-hidden="true"
                    data-position="top"
                >

                    <div
                        class="content"
                        part="content"
                    ></div>

                </div>

            </div>

        `;


        this.tooltip =
            this.shadowRoot.querySelector(
                ".tooltip"
            );


        this.content =
            this.shadowRoot.querySelector(
                ".content"
            );
    }


    connectedCallback() {

        if (this.initialized)
            return;


        this.initialized = true;


        this.render();

        this.bindEvents();

    }


    disconnectedCallback() {

        this.unbindEvents();

        this.clearTimers();

        this.cancelPositionFrame();

        this.initialized = false;

        this.opened = false;

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


        if (name === "open") {

            if (newValue !== null) {

                this.open();

            } else {

                this.close();

            }

            return;
        }


        this.render();

    }


    /*
     * Rendering
     */

    render() {

        if (!this.tooltip)
            return;


        const position =
            this.getPosition();


        this.tooltip.dataset.position =
            position;


        this.tooltip.classList.toggle(
            "arrow",
            this.hasArrow()
        );


        this.renderContent();


        if (this.isOpenAttribute()) {

            this.openInternal();

        } else {

            this.closeInternal();

        }

    }


    renderContent() {

        if (!this.content)
            return;


        const text =
            this.getAttribute("content");


        if (text !== null) {

            this.content.textContent =
                text;

            return;

        }


        /*
         * If no content attribute exists,
         * use the slotted text as tooltip content.
         */

        const slot =
            this.shadowRoot.querySelector(
                "slot"
            );


        if (!slot)
            return;


        const assigned =
            slot.assignedNodes({
                flatten: true
            });


        const textContent =
            assigned
                .filter(
                    node =>
                        node.nodeType ===
                        Node.TEXT_NODE
                )
                .map(
                    node =>
                        node.textContent
                )
                .join("")
                .trim();


        if (textContent) {

            this.content.textContent =
                textContent;

        }

    }


    /*
     * Events
     */

    bindEvents() {

        if (this.bound)
            return;


        this.bound = true;


        const trigger =
            this.getTrigger();


        if (
            trigger === "hover" ||
            trigger === "both"
        ) {

            this.addEventListener(
                "mouseenter",
                this.handleMouseEnter
            );

            this.addEventListener(
                "mouseleave",
                this.handleMouseLeave
            );

        }


        if (
            trigger === "focus" ||
            trigger === "both"
        ) {

            this.addEventListener(
                "focusin",
                this.handleFocusIn
            );

            this.addEventListener(
                "focusout",
                this.handleFocusOut
            );

        }


        if (
            trigger === "click"
        ) {

            this.addEventListener(
                "click",
                this.handleClick
            );

        }


        if (
            trigger === "both"
        ) {

            this.addEventListener(
                "click",
                this.handleClick
            );

        }


        document.addEventListener(
            "keydown",
            this.handleKeydown
        );


        document.addEventListener(
            "pointerdown",
            this.handleDocumentPointerDown
        );


        window.addEventListener(
            "resize",
            this.handleResize
        );


        window.addEventListener(
            "scroll",
            this.handleScroll,
            true
        );


        this.tooltip.addEventListener(
            "mouseenter",
            this.handleTooltipEnter
        );


        this.tooltip.addEventListener(
            "mouseleave",
            this.handleTooltipLeave
        );

    }


    unbindEvents() {

        if (!this.bound)
            return;


        this.bound = false;


        this.removeEventListener(
            "mouseenter",
            this.handleMouseEnter
        );

        this.removeEventListener(
            "mouseleave",
            this.handleMouseLeave
        );

        this.removeEventListener(
            "focusin",
            this.handleFocusIn
        );

        this.removeEventListener(
            "focusout",
            this.handleFocusOut
        );

        this.removeEventListener(
            "click",
            this.handleClick
        );


        document.removeEventListener(
            "keydown",
            this.handleKeydown
        );


        document.removeEventListener(
            "pointerdown",
            this.handleDocumentPointerDown
        );


        window.removeEventListener(
            "resize",
            this.handleResize
        );


        window.removeEventListener(
            "scroll",
            this.handleScroll,
            true
        );


        if (this.tooltip) {

            this.tooltip.removeEventListener(
                "mouseenter",
                this.handleTooltipEnter
            );

            this.tooltip.removeEventListener(
                "mouseleave",
                this.handleTooltipLeave
            );

        }

    }


    handleMouseEnter() {

        this.hoveringTrigger = true;

        this.clearHideTimer();

        this.open();

    }


    handleMouseLeave() {

        this.hoveringTrigger = false;

        this.scheduleClose();

    }


    handleFocusIn() {

        this.open();

    }


    handleFocusOut() {

        this.scheduleClose();

    }


    handleClick(event) {

        if (
            event.target === this.tooltip ||
            this.tooltip.contains(event.target)
        )
            return;


        this.toggle();

    }


    handleKeydown(event) {

        if (
            event.key !== "Escape"
        )
            return;


        if (!this.opened)
            return;


        this.close();

    }


    handleDocumentPointerDown(event) {

        if (!this.opened)
            return;


        if (
            this.contains(event.target) ||
            this.shadowRoot.contains(event.target)
        )
            return;


        if (
            this.getTrigger() === "click" ||
            this.getTrigger() === "both"
        ) {

            this.close();

        }

    }


    handleResize() {

        if (this.opened)
            this.position();

    }


    handleScroll() {

        if (this.opened)
            this.position();

    }


    handleTooltipEnter() {

        this.hoveringTooltip = true;

        this.clearHideTimer();

    }


    handleTooltipLeave() {

        this.hoveringTooltip = false;

        this.scheduleClose();

    }


    /*
     * Public API
     */

    open() {

        if (this.opened)
            return;


        this.setAttribute(
            "open",
            ""
        );


        this.dispatchEvent(
            new CustomEvent(
                "open-request",
                {
                    bubbles: true
                }
            )
        );

    }


    close() {

        if (!this.opened)
            return;


        this.removeAttribute(
            "open"
        );


        this.dispatchEvent(
            new CustomEvent(
                "close-request",
                {
                    bubbles: true
                }
            )
        );

    }


    toggle() {

        if (this.opened) {

            this.close();

        } else {

            this.open();

        }

    }


    isOpen() {

        return this.opened;

    }


    isOpened() {

        return this.opened;

    }


    setContent(content) {

        if (content === null ||
            content === undefined
        )
            return false;


        this.setAttribute(
            "content",
            String(content)
        );


        return true;

    }


    setPosition(position) {

        if (
            ![
                "top",
                "bottom",
                "left",
                "right"
            ].includes(position)
        )
            return false;


        this.setAttribute(
            "position",
            position
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


    setTrigger(trigger) {

        if (
            ![
                "hover",
                "focus",
                "click",
                "both"
            ].includes(trigger)
        )
            return false;


        const wasBound =
            this.bound;


        if (wasBound)
            this.unbindEvents();


        this.setAttribute(
            "trigger",
            trigger
        );


        if (
            this.initialized &&
            wasBound
        )
            this.bindEvents();


        return true;

    }


    setArrow(value) {

        this.toggleAttribute(
            "arrow",
            Boolean(value)
        );


        return true;

    }


    /*
     * Internal state
     */

    openInternal() {

        if (!this.tooltip)
            return;


        this.opened = true;


        this.tooltip.classList.add(
            "open"
        );


        this.tooltip.setAttribute(
            "aria-hidden",
            "false"
        );


        this.position();


        this.dispatchEvent(
            new CustomEvent(
                "open",
                {
                    bubbles: true
                }
            )
        );

    }


    closeInternal() {

        if (!this.tooltip)
            return;


        this.opened = false;


        this.tooltip.classList.remove(
            "open"
        );


        this.tooltip.setAttribute(
            "aria-hidden",
            "true"
        );


        this.dispatchEvent(
            new CustomEvent(
                "close",
                {
                    bubbles: true
                }
            )
        );

    }


    /*
     * Positioning
     */

    position() {

        if (
            !this.tooltip ||
            !this.opened
        )
            return;


        this.cancelPositionFrame();


        this.positionFrame =
            requestAnimationFrame(() => {

                const hostRect =
                    this.getBoundingClientRect();


                const tooltipRect =
                    this.tooltip.getBoundingClientRect();


                const gap = 8;


                let top =
                    hostRect.top -
                    tooltipRect.height -
                    gap;


                let left =
                    hostRect.left +
                    (
                        hostRect.width -
                        tooltipRect.width
                    ) / 2;


                const position =
                    this.getPosition();


                if (position === "bottom") {

                    top =
                        hostRect.bottom +
                        gap;

                }


                if (position === "left") {

                    top =
                        hostRect.top +
                        (
                            hostRect.height -
                            tooltipRect.height
                        ) / 2;

                    left =
                        hostRect.left -
                        tooltipRect.width -
                        gap;

                }


                if (position === "right") {

                    top =
                        hostRect.top +
                        (
                            hostRect.height -
                            tooltipRect.height
                        ) / 2;

                    left =
                        hostRect.right +
                        gap;

                }


                /*
                 * Viewport collision handling
                 */

                const padding = 8;


                if (
                    left < padding
                ) {

                    left = padding;

                }


                if (
                    left +
                    tooltipRect.width >
                    window.innerWidth -
                    padding
                ) {

                    left =
                        window.innerWidth -
                        tooltipRect.width -
                        padding;

                }


                if (
                    top < padding
                ) {

                    top = padding;

                }


                if (
                    top +
                    tooltipRect.height >
                    window.innerHeight -
                    padding
                ) {

                    top =
                        window.innerHeight -
                        tooltipRect.height -
                        padding;

                }


                this.tooltip.style.left =
                    `${Math.round(left)}px`;


                this.tooltip.style.top =
                    `${Math.round(top)}px`;

            });

    }


    cancelPositionFrame() {

        if (
            this.positionFrame !== null
        ) {

            cancelAnimationFrame(
                this.positionFrame
            );

            this.positionFrame = null;

        }

    }


    /*
     * Timers
     */

    scheduleClose() {

        this.clearHideTimer();


        this.hideTimer =
            setTimeout(() => {

                if (
                    !this.hoveringTrigger &&
                    !this.hoveringTooltip
                ) {

                    this.close();

                }

            }, 80);

    }


    clearHideTimer() {

        if (this.hideTimer !== null) {

            clearTimeout(
                this.hideTimer
            );

            this.hideTimer = null;

        }

    }


    clearTimers() {

        this.clearHideTimer();

    }


    /*
     * Helpers
     */

    isOpenAttribute() {

        return this.hasAttribute(
            "open"
        );

    }


    hasArrow() {

        const value =
            this.getAttribute(
                "arrow"
            );


        return (
            value === null ||
            value !== "false"
        );

    }


    getPosition() {

        const position =
            this.getAttribute(
                "position"
            );


        return [
            "top",
            "bottom",
            "left",
            "right"
        ].includes(position)

            ? position

            : "top";

    }


    getTrigger() {

        const trigger =
            this.getAttribute(
                "trigger"
            );


        return [
            "hover",
            "focus",
            "click",
            "both"
        ].includes(trigger)

            ? trigger

            : "hover";

    }


    destroy() {

        this.closeInternal();

        this.unbindEvents();

        this.clearTimers();

        this.cancelPositionFrame();

        this.initialized = false;

    }

}


if (
    !customElements.get(
        "custom-tooltip"
    )
) {

    customElements.define(
        "custom-tooltip",
        Tooltip
    );

}


export {
    Tooltip
};


export default Tooltip;
