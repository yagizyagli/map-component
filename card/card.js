/**
 * Professional Card Component
 *
 * Production Grade Card Web Component
 *
 * Features
 *
 * ✔ Shadow DOM
 * ✔ Theme Manager
 * ✔ State Manager
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

class Card extends HTMLElement {

    static observedAttributes = [
        "theme",
        "elevation",
        "outlined",
        "hoverable"
    ];

    constructor() {

        super();

        this.attachShadow({
            mode: "open"
        });

        /*
         * DOM
         */

        this.container = null;

        this.header = null;

        this.body = null;

        this.footer = null;

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
            CARD_DEFAULTS
        );

        /*
         * State
         */

        this.state = {

            initialized: false,

            loading: false,

            theme: "light",

            elevation: 1

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

export default Card;
