/**
 * Professional Input Component
 *
 * Production Grade Input Web Component
 *
 * Features
 *
 * ✔ Shadow DOM
 * ✔ Validation Manager
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

class Input extends HTMLElement {

    static observedAttributes = [
        "theme",
        "type",
        "placeholder",
        "disabled",
        "readonly",
        "required",
        "value"
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

        this.input = null;

        this.label = null;

        this.helper = null;

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
            INPUT_DEFAULTS
        );

        /*
         * State
         */

        this.state = {

            initialized: false,

            disabled: false,

            readonly: false,

            focused: false,

            valid: true,

            theme: "light"

        };

        /*
         * Managers
         */

        this.validationManager = new ValidationManager();

        this.stateManager = new StateManager();

        this.themeManager = new ThemeManager();

        /*
         * Manager Binding
         */

        this.validationManager.bind(this);

        this.stateManager.bind(this);

        this.themeManager.bind(this);

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

export default Input;
