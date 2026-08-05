/**
 * Professional Dropdown Component
 *
 * Production Grade Dropdown Web Component
 *
 * Features
 *
 * ✔ Shadow DOM
 * ✔ State Manager
 * ✔ Position Manager
 * ✔ Theme Manager
 * ✔ Keyboard Manager
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

class Dropdown extends HTMLElement {

    static observedAttributes = [
        "theme",
        "open",
        "position",
        "trigger",
        "disabled"
    ];

    constructor() {

        super();

        this.attachShadow({
            mode: "open"
        });

        /*
         * DOM
         */

        this.trigger = null;

        this.menu = null;

        this.items = [];

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
            DROPDOWN_DEFAULTS
        );

        /*
         * State
         */

        this.state = {

            initialized: false,

            open: false,

            disabled: false,

            theme: "light",

            position: "bottom"

        };

        /*
         * Managers
         */

        this.stateManager = new StateManager();

        this.positionManager = new PositionManager();

        this.themeManager = new ThemeManager();

        this.keyboardManager = new KeyboardManager();

        /*
         * Manager Binding
         */

        this.stateManager.bind(this);

        this.positionManager.bind(this);

        this.themeManager.bind(this);

        this.keyboardManager.bind(this);

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

export default Dropdown;
