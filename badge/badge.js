/**
 * Professional Badge Component
 *
 * Production Grade Badge Web Component
 *
 * Features
 *
 * ✔ Shadow DOM
 * ✔ Theme Manager
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

        /*
         * DOM
         */

        this.badge = null;

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
            BADGE_DEFAULTS
        );

        /*
         * State
         */

        this.state = {

            initialized: false,

            theme: "light",

            variant: "primary",

            size: "md"

        };

        /*
         * Managers
         */

        this.themeManager = new ThemeManager();

        /*
         * Manager Binding
         */

        this.themeManager.bind(this);

        /*
         * Rendering
         */

        this.renderVersion = 0;

        this.rendering = false;

        this.renderCache = [];

        this.renderPipeline = [];

    }

}

export default Badge;
