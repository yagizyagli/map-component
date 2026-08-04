/**
 * Professional Table Component
 *
 * Production Grade Data Grid Web Component
 *
 * Features
 *
 * ✔ Shadow DOM
 * ✔ Data Manager
 * ✔ Column Manager
 * ✔ Sort Manager
 * ✔ Filter Manager
 * ✔ Pagination Manager
 * ✔ Selection Manager
 * ✔ Export Manager
 * ✔ Theme Manager
 * ✔ Virtual Scroll
 * ✔ Resize Observer
 * ✔ Reactive Attributes
 * ✔ Lifecycle Safe
 * ✔ Memory Safe
 * ✔ Public API
 *
 * Author: yagizyagli
 */

class CustomTable extends HTMLElement {

    static observedAttributes = [
        "theme",
        "striped",
        "hover",
        "bordered",
        "pagination",
        "page-size",
        "search"
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

        this.table = null;

        this.thead = null;

        this.tbody = null;

        /*
         * Observers
         */

        this.resizeObserver = null;

        this.intersectionObserver = null;

        this.mutationObserver = null;

        /*
         * Internal
         */

        this.pendingFrame = null;

        this.renderQueued = false;

        this.internalUpdate = false;

        this.destroyed = false;

        this.events = new EventTarget();

        /*
         * Defaults
         */

        this.defaults = structuredClone(TABLE_DEFAULTS);

        /*
         * State
         */

        this.state = {

            initialized: false,

            loading: false,

            visible: true,

            theme: "light"

        };

        /*
         * Managers
         */

        this.dataManager = new DataManager();

        this.columnManager = new ColumnManager();

        this.sortManager = new SortManager();

        this.filterManager = new FilterManager();

        this.paginationManager = new PaginationManager();

        this.selectionManager = new SelectionManager();

        this.exportManager = new ExportManager();

        this.themeManager = new ThemeManager();

        this.virtualScrollManager = new VirtualScrollManager();

    }

}
