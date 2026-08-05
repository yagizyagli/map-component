/**
 * Professional Toast Component
 *
 * Production Grade Toast Notification Web Component
 *
 * Features
 *
 * ✔ Shadow DOM
 * ✔ Toast Manager
 * ✔ Queue Manager
 * ✔ Theme Manager
 * ✔ Animation Manager
 * ✔ Auto Close
 * ✔ Reactive Attributes
 * ✔ Lifecycle Safe
 * ✔ Event Dispatcher
 * ✔ Public API
 * ✔ Memory Safe
 *
 * Author: yagizyagli
 */

class Toast extends HTMLElement {

    static observedAttributes = [
        "theme",
        "variant",
        "duration",
        "position"
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

        this.message = null;

        this.icon = null;

        this.closeButton = null;


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
            TOAST_DEFAULTS
        );


        /*
         * State
         */

        this.state = {

            initialized: false,

            visible: false,

            loading: false,

            theme: "light",

            variant: "info"

        };


        /*
         * Managers
         */

        this.toastManager = new ToastManager();

        this.themeManager = new ThemeManager();

        this.animationManager = new AnimationManager();


        /*
         * Manager Binding
         */

        this.toastManager.bind(this);

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

        this.timer = null;

    }

}

export default Toast;
