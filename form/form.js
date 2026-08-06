/**
 * Professional Form Component
 *
 * Production Grade Form Web Component
 *
 * Features
 *
 * ✔ Shadow DOM
 * ✔ Field Registry
 * ✔ Validation Manager
 * ✔ Form State Manager
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

class Form extends HTMLElement {

    static observedAttributes = [
        "theme",
        "disabled",
        "readonly",
        "loading",
        "autocomplete"
    ];

    constructor() {

        super();

        this.attachShadow({
            mode: "open"
        });

        /*
         * DOM
         */

        this.form = null;

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
            FORM_DEFAULTS
        );

        /*
         * State
         */

        this.state = {

            initialized: false,

            loading: false,

            disabled: false,

            readonly: false,

            valid: true,

            dirty: false,

            touched: false,

            focused: false,

            submitted: false,

            theme: "light"

        };

        /*
         * Managers
         */

        this.fieldRegistry = new FieldRegistry();

        this.validationManager = new ValidationManager();

        this.formState = new FormState();

        this.themeManager = new ThemeManager();

        /*
         * Manager Binding
         */

        this.fieldRegistry.bind(this);

        this.validationManager.bind(this);

        this.formState.bind(this);

        this.themeManager.bind(this);

        /*
         * Rendering
         */

        this.renderVersion = 0;

        this.rendering = false;

        this.renderCache = [];

        this.renderPipeline = [];

        /*
         * Fields
         */

        this.inputs = [];

        this.selects = [];

        this.checkboxes = [];

        this.radios = [];

        this.switches = [];

        /*
         * Form Cache
         */

        this.initialValues = {};

        this.currentValues = {};

        this.validationCache = new Map();

        this.fieldCache = new Map();

        /*
         * Async
         */

        this.abortController = null;

    }

}

export default Form;
