/**
 * Professional Calendar Component
 *
 * Production Grade Calendar Web Component
 *
 * Features
 *
 * ✔ Shadow DOM
 * ✔ Event Manager
 * ✔ Date Manager
 * ✔ Selection Manager
 * ✔ Navigation Manager
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

class Calendar extends HTMLElement {

    static observedAttributes = [
        "theme",
        "view",
        "locale",
        "first-day",
        "readonly"
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
            CALENDAR_DEFAULTS
        );

        /*
         * State
         */

        this.state = {

            initialized: false,

            loading: false,

            readonly: false,

            theme: "light",

            view: "month"

        };

        /*
         * Managers
         */

        this.eventManager = new EventManager();

        this.dateManager = new DateManager();

        this.selectionManager = new SelectionManager();

        this.navigationManager = new NavigationManager();

        this.themeManager = new ThemeManager();

        /*
         * Manager Binding
         */

        this.eventManager.bind(this);

        this.dateManager.bind(this);

        this.selectionManager.bind(this);

        this.navigationManager.bind(this);

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
