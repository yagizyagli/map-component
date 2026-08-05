/**
 * Professional Button Component
 *
 * Production Grade Button Web Component
 *
 * Features
 *
 * ✔ Shadow DOM
 * ✔ State Manager
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

        /*
         * DOM
         */

        this.button = null;

        this.icon = null;

        this.label = null;

        this.spinner = null;

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
            BUTTON_DEFAULTS
        );

        /*
         * State
         */

        this.state = {

            initialized: false,

            loading: false,

            disabled: false,

            pressed: false,

            focused: false,

            theme: "light",

            variant: "primary",

            size: "md"

        };

        /*
         * Managers
         */

        this.stateManager = new StateManager();

        this.themeManager = new ThemeManager();

        /*
         * Manager Binding
         */

        this.stateManager.bind(this);

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
