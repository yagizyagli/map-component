/**
 * Custom Table Component
 * Production Grade Vanilla Web Component
 *
 * Features:
 * - Shadow DOM
 * - Reactive attributes
 * - Data rendering
 * - Column definitions
 * - Sorting
 * - Searching
 * - Pagination
 * - Row selection
 * - Striped rows
 * - Hover rows
 * - Bordered mode
 * - CSV export
 * - Responsive layout
 * - Lifecycle safe
 * - Reconnect safe
 * - Custom events
 * - Public API
 * - Memory safe
 *
 * Author: yagizyagli
 */

class CustomTable extends HTMLElement {

    static get observedAttributes() {
        return [
            "theme",
            "striped",
            "hover",
            "bordered",
            "pagination",
            "page-size",
            "search"
        ];
    }


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

        this.pagination = null;

        this.searchInput = null;


        /*
         * State
         */

        this.initialized = false;

        this.destroyed = false;

        this.currentPage = 1;

        this.sortKey = null;

        this.sortDirection = "asc";

        this.searchValue = "";

        this.selectedRows = new Set();


        /*
         * Data
         */

        this.data = [];

        this.columns = [];


        /*
         * Observers
         */

        this.resizeObserver = null;

        this.mutationObserver = null;


        /*
         * Event handlers
         */

        this.handleSearch =
            this.handleSearch.bind(this);

        this.handleTableClick =
            this.handleTableClick.bind(this);

        this.handleHeaderClick =
            this.handleHeaderClick.bind(this);


        /*
         * DOM
         */

        this.shadowRoot.innerHTML = `

            <style>

                :host {

                    display: block;

                    width: 100%;

                    --table-bg: #ffffff;

                    --table-color: #0f172a;

                    --table-border: #e2e8f0;

                    --table-header:
                        #f8fafc;

                    --table-hover:
                        #f8fafc;

                    --table-stripe:
                        #f8fafc;

                    --table-primary:
                        #2563eb;

                }


                :host([theme="dark"]) {

                    --table-bg: #0f172a;

                    --table-color: #f8fafc;

                    --table-border: #334155;

                    --table-header:
                        #1e293b;

                    --table-hover:
                        #1e293b;

                    --table-stripe:
                        #172033;

                }


                .container {

                    width: 100%;

                    overflow-x: auto;

                    border-radius: 12px;

                    background:
                        var(--table-bg);

                    color:
                        var(--table-color);

                }


                table {

                    width: 100%;

                    border-collapse:
                        collapse;

                    min-width: 500px;

                }


                th,
                td {

                    padding: 12px 14px;

                    text-align: left;

                    border-bottom:
                        1px solid
                        var(--table-border);

                }


                th {

                    background:
                        var(--table-header);

                    font-weight: 600;

                    cursor: pointer;

                    user-select: none;

                }


                tbody tr.hoverable:hover {

                    background:
                        var(--table-hover);

                }


                tbody tr.striped:nth-child(even) {

                    background:
                        var(--table-stripe);

                }


                :host([bordered])
                th,
                :host([bordered])
                td {

                    border:
                        1px solid
                        var(--table-border);

                }


                .toolbar {

                    display: flex;

                    align-items: center;

                    justify-content:
                        space-between;

                    gap: 12px;

                    margin-bottom: 12px;

                }


                .search {

                    width: min(
                        100%,
                        280px
                    );

                    padding: 9px 12px;

                    border:
                        1px solid
                        var(--table-border);

                    border-radius: 8px;

                    background:
                        var(--table-bg);

                    color:
                        var(--table-color);

                    font: inherit;

                    box-sizing: border-box;

                }


                .pagination {

                    display: flex;

                    align-items: center;

                    justify-content: center;

                    gap: 8px;

                    margin-top: 12px;

                }


                .pagination button {

                    padding: 7px 11px;

                    border:
                        1px solid
                        var(--table-border);

                    border-radius: 7px;

                    background:
                        var(--table-bg);

                    color:
                        var(--table-color);

                    cursor: pointer;

                }


                .pagination button:disabled {

                    opacity: .45;

                    cursor: not-allowed;

                }


                .empty {

                    text-align: center;

                    padding: 30px;

                    opacity: .65;

                }


                @media (
                    max-width: 640px
                ) {

                    .toolbar {

                        flex-direction:
                            column;

                        align-items:
                            stretch;

                    }

                    .search {

                        width: 100%;

                    }

                }

            </style>


            <div class="toolbar">

                <input
                    class="search"
                    type="search"
                    placeholder="Search..."
                    aria-label="Search table"
                >

            </div>


            <div class="container">

                <table>

                    <thead></thead>

                    <tbody></tbody>

                </table>

            </div>


            <div
                class="pagination"
                aria-label="Table pagination"
            ></div>

        `;


        this.container =
            this.shadowRoot.querySelector(
                ".container"
            );


        this.table =
            this.shadowRoot.querySelector(
                "table"
            );


        this.thead =
            this.shadowRoot.querySelector(
                "thead"
            );


        this.tbody =
            this.shadowRoot.querySelector(
                "tbody"
            );


        this.pagination =
            this.shadowRoot.querySelector(
                ".pagination"
            );


        this.searchInput =
            this.shadowRoot.querySelector(
                ".search"
            );

    }


    connectedCallback() {

        if (this.initialized)
            return;


        this.initialized = true;

        this.destroyed = false;


        this.bindEvents();

        this.observeResize();

        this.render();

    }


    disconnectedCallback() {

        this.destroy();

    }


    attributeChangedCallback(
        name,
        oldValue,
        newValue
    ) {

        if (
            oldValue === newValue ||
            !this.initialized
        )
            return;


        this.render();

    }


    bindEvents() {

        this.searchInput.addEventListener(
            "input",
            this.handleSearch
        );


        this.thead.addEventListener(
            "click",
            this.handleHeaderClick
        );


        this.tbody.addEventListener(
            "click",
            this.handleTableClick
        );

    }


    unbindEvents() {

        this.searchInput.removeEventListener(
            "input",
            this.handleSearch
        );


        this.thead.removeEventListener(
            "click",
            this.handleHeaderClick
        );


        this.tbody.removeEventListener(
            "click",
            this.handleTableClick
        );

    }


    render() {

        if (this.destroyed)
            return;


        this.renderHeader();

        this.renderBody();

        this.renderPagination();

        this.updateSearchVisibility();

    }


    renderHeader() {

        this.thead.innerHTML = "";


        const row =
            document.createElement("tr");


        this.columns.forEach(
            column => {

                const th =
                    document.createElement("th");


                th.textContent =
                    column.label ??
                    column.key;


                th.dataset.key =
                    column.key;


                if (
                    this.sortKey ===
                    column.key
                ) {

                    th.textContent +=
                        this.sortDirection === "asc"
                            ? " ↑"
                            : " ↓";

                }


                row.appendChild(th);

            }
        );


        if (this.columns.length) {

            const selectTh =
                document.createElement("th");

            selectTh.textContent =
                "Select";

            row.appendChild(selectTh);

        }


        this.thead.appendChild(row);

    }


    renderBody() {

        this.tbody.innerHTML = "";


        const rows =
            this.getProcessedData();


        if (!rows.length) {

            const tr =
                document.createElement("tr");


            const td =
                document.createElement("td");


            td.colSpan =
                this.columns.length + 1;


            td.className =
                "empty";


            td.textContent =
                "No data found.";


            tr.appendChild(td);

            this.tbody.appendChild(tr);

            return;

        }


        rows.forEach(
            (item, index) => {

                const tr =
                    document.createElement("tr");


                if (
                    this.hasAttribute("hover")
                ) {

                    tr.classList.add(
                        "hoverable"
                    );

                }


                if (
                    this.hasAttribute("striped")
                ) {

                    tr.classList.add(
                        "striped"
                    );

                }


                this.columns.forEach(
                    column => {

                        const td =
                            document.createElement(
                                "td"
                            );


                        const value =
                            typeof column.render ===
                            "function"

                                ? column.render(
                                    item,
                                    index
                                )

                                : item[
                                    column.key
                                ];


                        td.textContent =
                            value ?? "";


                        tr.appendChild(td);

                    }
                );


                const selectTd =
                    document.createElement(
                        "td"
                    );


                const checkbox =
                    document.createElement(
                        "input"
                    );


                checkbox.type =
                    "checkbox";


                checkbox.checked =
                    this.selectedRows.has(
                        item
                    );


                checkbox.dataset.index =
                    String(index);


                selectTd.appendChild(
                    checkbox
                );


                tr.appendChild(
                    selectTd
                );


                this.tbody.appendChild(
                    tr
                );

            }
        );

    }


    renderPagination() {

        this.pagination.innerHTML = "";


        if (
            !this.isPaginationEnabled()
        )
            return;


        const totalPages =
            this.getTotalPages();


        if (totalPages <= 1)
            return;


        const previous =
            document.createElement(
                "button"
            );


        previous.type =
            "button";


        previous.textContent =
            "Previous";


        previous.disabled =
            this.currentPage === 1;


        previous.addEventListener(
            "click",
            () => {

                this.currentPage--;

                this.render();

            }
        );


        const next =
            document.createElement(
                "button"
            );


        next.type =
            "button";


        next.textContent =
            "Next";


        next.disabled =
            this.currentPage ===
            totalPages;


        next.addEventListener(
            "click",
            () => {

                this.currentPage++;

                this.render();

            }
        );


        const label =
            document.createElement(
                "span"
            );


        label.textContent =
            `${this.currentPage} / ${totalPages}`;


        this.pagination.appendChild(
            previous
        );


        this.pagination.appendChild(
            label
        );


        this.pagination.appendChild(
            next
        );

    }


    handleSearch(event) {

        this.searchValue =
            event.target.value
                .trim()
                .toLowerCase();


        this.currentPage = 1;

        this.render();

    }


    handleHeaderClick(event) {

        const th =
            event.target.closest(
                "th"
            );


        if (!th)
            return;


        const key =
            th.dataset.key;


        if (!key)
            return;


        if (
            this.sortKey === key
        ) {

            this.sortDirection =
                this.sortDirection === "asc"
                    ? "desc"
                    : "asc";

        } else {

            this.sortKey = key;

            this.sortDirection =
                "asc";

        }


        this.render();

    }


    handleTableClick(event) {

        const checkbox =
            event.target.closest(
                "input[type='checkbox']"
            );


        if (!checkbox)
            return;


        const index =
            Number(
                checkbox.dataset.index
            );


        const rows =
            this.getProcessedData();


        const row =
            rows[index];


        if (!row)
            return;


        if (checkbox.checked) {

            this.selectedRows.add(
                row
            );

        } else {

            this.selectedRows.delete(
                row
            );

        }


        this.dispatchEvent(
            new CustomEvent(
                "selectionchange",
                {
                    detail: {
                        rows:
                            this.getSelectedRows()
                    }
                }
            )
        );

    }


    getProcessedData() {

        let result =
            [...this.data];


        if (this.searchValue) {

            result =
                result.filter(
                    row =>
                        this.columns.some(
                            column =>
                                String(
                                    row[
                                        column.key
                                    ] ?? ""
                                )
                                .toLowerCase()
                                .includes(
                                    this.searchValue
                                )
                        )
                );

        }


        if (this.sortKey) {

            const key =
                this.sortKey;


            result.sort(
                (a, b) => {

                    const av =
                        a[key];


                    const bv =
                        b[key];


                    if (av === bv)
                        return 0;


                    if (av == null)
                        return 1;


                    if (bv == null)
                        return -1;


                    const comparison =
                        String(av).localeCompare(
                            String(bv),
                            undefined,
                            {
                                numeric: true,
                                sensitivity:
                                    "base"
                            }
                        );


                    return this.sortDirection ===
                        "asc"

                        ? comparison
                        : -comparison;

                }
            );

        }


        if (
            !this.isPaginationEnabled()
        )
            return result;


        const pageSize =
            this.getPageSize();


        const start =
            (this.currentPage - 1) *
            pageSize;


        return result.slice(
            start,
            start + pageSize
        );

    }


    isPaginationEnabled() {

        return (
            this.getAttribute(
                "pagination"
            ) !== "false"
        );

    }


    getPageSize() {

        const value =
            Number(
                this.getAttribute(
                    "page-size"
                )
            );


        return Number.isInteger(value) &&
            value > 0

            ? value

            : 10;

    }


    getTotalPages() {

        let total =
            [...this.data];


        if (this.searchValue) {

            total =
                total.filter(
                    row =>
                        this.columns.some(
                            column =>
                                String(
                                    row[
                                        column.key
                                    ] ?? ""
                                )
                                .toLowerCase()
                                .includes(
                                    this.searchValue
                                )
                        )
                );

        }


        return Math.max(
            1,
            Math.ceil(
                total.length /
                this.getPageSize()
            )
        );

    }


    updateSearchVisibility() {

        this.searchInput.hidden =
            this.getAttribute(
                "search"
            ) === "false";

    }


    setData(data) {

        if (!Array.isArray(data))
            return false;


        this.data = [...data];

        this.currentPage = 1;

        this.render();

        this.dispatchEvent(
            new CustomEvent(
                "datachange",
                {
                    detail: {
                        data:
                            this.getData()
                    }
                }
            )
        );


        return true;

    }


    setColumns(columns) {

        if (!Array.isArray(columns))
            return false;


        this.columns =
            columns.filter(
                column =>
                    column &&
                    typeof column.key ===
                        "string"
            );


        this.currentPage = 1;

        this.render();

        return true;

    }


    getData() {

        return [...this.data];

    }


    getColumns() {

        return [...this.columns];

    }


    getSelectedRows() {

        return [
            ...this.selectedRows
        ];

    }


    clearSelection() {

        this.selectedRows.clear();

        this.render();

        this.dispatchEvent(
            new CustomEvent(
                "selectionchange",
                {
                    detail: {
                        rows: []
                    }
                }
            )
        );

    }


    selectAll() {

        this.getProcessedData()
            .forEach(
                row =>
                    this.selectedRows.add(
                        row
                    )
            );


        this.render();

    }


    sortBy(key, direction = "asc") {

        if (
            !this.columns.some(
                column =>
                    column.key === key
            )
        )
            return false;


        this.sortKey = key;

        this.sortDirection =
            direction === "desc"
                ? "desc"
                : "asc";


        this.render();

        return true;

    }


    search(value = "") {

        this.searchValue =
            String(value)
                .trim()
                .toLowerCase();


        this.currentPage = 1;

        this.render();

    }


    goToPage(page) {

        const total =
            this.getTotalPages();


        const value =
            Number(page);


        if (
            !Number.isInteger(value) ||
            value < 1 ||
            value > total
        )
            return false;


        this.currentPage = value;

        this.render();

        return true;

    }


    nextPage() {

        return this.goToPage(
            this.currentPage + 1
        );

    }


    previousPage() {

        return this.goToPage(
            this.currentPage - 1
        );

    }


    exportCSV(
        filename = "table.csv"
    ) {

        if (!this.columns.length)
            return false;


        const header =
            this.columns
                .map(
                    column =>
                        this.escapeCSV(
                            column.label ??
                            column.key
                        )
                )
                .join(",");


        const rows =
            this.data.map(
                row =>
                    this.columns
                        .map(
                            column =>
                                this.escapeCSV(
                                    row[
                                        column.key
                                    ]
                                )
                        )
                        .join(",")
            );


        const csv =
            [
                header,
                ...rows
            ].join("\n");


        const blob =
            new Blob(
                [csv],
                {
                    type:
                        "text/csv;charset=utf-8;"
                }
            );


        const url =
            URL.createObjectURL(
                blob
            );


        const link =
            document.createElement(
                "a"
            );


        link.href = url;

        link.download =
            filename;


        link.click();


        URL.revokeObjectURL(
            url
        );


        this.dispatchEvent(
            new CustomEvent(
                "export",
                {
                    detail: {
                        filename
                    }
                }
            )
        );


        return true;

    }


    escapeCSV(value) {

        const string =
            String(
                value ?? ""
            );


        if (
            /[",\n]/.test(
                string
            )
        ) {

            return `"${string.replace(
                /"/g,
                '""'
            )}"`;

        }


        return string;

    }


    observeResize() {

        if (
            typeof ResizeObserver ===
            "undefined"
        )
            return;


        this.resizeObserver =
            new ResizeObserver(
                () => {

                    this.dispatchEvent(
                        new CustomEvent(
                            "resize"
                        )
                    );

                }
            );


        this.resizeObserver.observe(
            this
        );

    }


    destroy() {

        if (this.destroyed)
            return;


        this.destroyed = true;

        this.unbindEvents();


        if (this.resizeObserver) {

            this.resizeObserver.disconnect();

            this.resizeObserver = null;

        }


        this.initialized = false;

    }

}


if (
    !customElements.get(
        "custom-table"
    )
) {

    customElements.define(
        "custom-table",
        CustomTable
    );

}


export {
    CustomTable
};


export default CustomTable;
