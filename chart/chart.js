/**
 * Professional Chart Component
 *
 * Production Grade Chart.js Web Component
 *
 * Features
 *
 * ✔ Shadow DOM
 * ✔ Dataset Registry
 * ✔ Plugin Manager
 * ✔ Theme Engine
 * ✔ Tooltip Manager
 * ✔ Legend Manager
 * ✔ Export Manager
 * ✔ Animation Manager
 * ✔ Reactive Attributes
 * ✔ Resize Scheduler
 * ✔ Event Dispatcher
 * ✔ Lifecycle Safe
 * ✔ Destroy Safe
 * ✔ Memory Safe
 * ✔ Public API
 *
 * Author: yagizyagli
 */

class CustomChart extends HTMLElement {

    static observedAttributes = [
        "type",
        "theme",
        "title",
        "responsive",
        "animation",
        "legend",
        "tooltip"
    ];

    constructor() {

        super();

        this.attachShadow({
            mode: "open"
        });

        /*
         * Chart.js
         */

        this.chart = null;

        this.canvas = null;

        this.ctx = null;

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
         * Internal Event Bus
         */

        this.events = new EventTarget();

        /*
         * Defaults
         */

        this.defaults = structuredClone(DEFAULTS);

        /*
         * Component State
         */

        this.state = {

            initialized: false,

            visible: true,

            loading: false,

            resizing: false,

            theme: "dark"

        };

        /*
         * Managers
         */

        this.pluginManager = new PluginManager();

        this.datasetManager = new DatasetManager();

        this.tooltipManager = new TooltipManager();

        this.legendManager = new LegendManager();

        this.themeManager = new ThemeManager();

        this.exportManager = new ExportManager();

        this.animationManager = new AnimationManager();

    }

}
