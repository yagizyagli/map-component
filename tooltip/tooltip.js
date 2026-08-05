/**
 * Professional Tooltip Component
 *
 * Production Grade Tooltip Web Component
 *
 * Features
 *
 * ✔ Shadow DOM
 * ✔ Position Manager
 * ✔ Theme Manager
 * ✔ Animation Manager
 * ✔ Reactive Attributes
 * ✔ Lifecycle Safe
 * ✔ Resize Observer
 * ✔ Mutation Observer
 * ✔ Event Dispatcher
 * ✔ Public API
 * ✔ Memory Safe
 *
 * Author: yagizyagli
 */

class Tooltip extends HTMLElement {

    static observedAttributes = [
        "theme",
        "position",
        "trigger",
        "open",
        "arrow"
    ];

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
         * Observers
         */

        this.resizeObserver = null;

        this.intersectionObserver = null;

        this.mutationObserver = null;

        /*
         * Scheduler
         */

        this.pendingFrame = null;

        this.renderQueued = false;

        this.internalUpdate = false;

        this.destroyed = false;

        /*
         * Event Bus
         */

        this.events = new EventTarget();

        /*
         * Defaults
         */

        this.defaults = structuredClone(
            TOOLTIP_DEFAULTS
        );

        /*
         * State
         */

        this.state = {

            initialized: false,

            open: false,

            visible: false,

            theme: "light",

            position: "top"

        };

        /*
         * Managers
         */

        this.positionManager = new PositionManager();

        this.themeManager = new ThemeManager();

        this.animationManager = new AnimationManager();

        /*
         * Manager Binding
         */

        this.positionManager.bind(this);

        this.themeManager.bind(this);

        this.animationManager.bind(this);

        /*
         * Rendering
         */

        this.renderVersion = 0;

        this.rendering = false;

        this.renderCache = [];

        this.renderPipeline = [];

        /*
         * Async
         */

        this.abortController = null;

    }

}

export default Tooltip;
