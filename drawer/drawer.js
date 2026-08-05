/**
 * Professional Drawer Component
 *
 * Production Grade Drawer Web Component
 *
 * Features
 *
 * ✔ Shadow DOM
 * ✔ State Manager
 * ✔ Theme Manager
 * ✔ Focus Manager
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

        /*
         * DOM
         */

        this.overlay = null;

        this.container = null;

        this.header = null;

        this.body = null;

        this.footer = null;

        this.closeButton = null;

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
            DRAWER_DEFAULTS
        );

        /*
         * State
         */

        this.state = {

            initialized: false,

            open: false,

            loading: false,

            theme: "light",

            position: "left",

            size: "md"

        };

        /*
         * Managers
         */

        this.stateManager = new StateManager();

        this.themeManager = new ThemeManager();

        this.focusManager = new FocusManager();

        /*
         * Manager Binding
         */

        this.stateManager.bind(this);

        this.themeManager.bind(this);

        this.focusManager.bind(this);

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

export default Drawer;
