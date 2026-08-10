/**
 * Professional Calendar Component
 *
 * Production Grade Vanilla Web Component
 *
 * Features:
 * - Shadow DOM
 * - Month calendar view
 * - Date selection
 * - Event registry
 * - Navigation
 * - Locale support
 * - First-day-of-week support
 * - Readonly mode
 * - Reactive attributes
 * - Custom events
 * - Public API
 * - Resize Observer
 * - Mutation-safe rendering
 * - Reconnect-safe lifecycle
 * - Memory-safe cleanup
 *
 * Author: yagizyagli
 */

class Calendar extends HTMLElement {

    static observedAttributes = [
        "theme",
        "view",
        "locale",
        "first-day",
        "readonly",
        "value"
    ];

    constructor() {
        super();

        this.attachShadow({
            mode: "open"
        });

        this.container = null;
        this.header = null;
        this.body = null;

        this.resizeObserver = null;

        this.events = new Map();

        this.state = {
            initialized: false,
            theme: "light",
            view: "month",
            locale: "en-US",
            firstDay: 0,
            readonly: false,
            currentDate: new Date(),
            selectedDate: null
        };

        this.renderQueued = false;
        this.pendingFrame = null;
        this.destroyed = false;

        this.render();
    }

    connectedCallback() {
        if (this.state.initialized) {
            this.scheduleRender();
            return;
        }

        this.state.theme =
            this.getAttribute("theme") || "light";

        this.state.view =
            this.getAttribute("view") || "month";

        this.state.locale =
            this.getAttribute("locale") || "en-US";

        this.state.firstDay =
            this.parseFirstDay();

        this.state.readonly =
            this.hasAttribute("readonly");

        this.readInitialValue();

        this.state.initialized = true;
        this.destroyed = false;

        this.observeResize();
        this.scheduleRender();

        this.dispatchEvent(
            new CustomEvent("ready", {
                detail: {
                    calendar: this
                }
            })
        );
    }

    disconnectedCallback() {
        this.destroy();
    }

    attributeChangedCallback(name, oldValue, newValue) {
        if (oldValue === newValue) {
            return;
        }

        if (name === "theme") {
            this.state.theme =
                newValue || "light";
        }

        if (name === "view") {
            this.state.view =
                newValue || "month";
        }

        if (name === "locale") {
            this.state.locale =
                newValue || "en-US";
        }

        if (name === "first-day") {
            this.state.firstDay =
                this.parseFirstDay();
        }

        if (name === "readonly") {
            this.state.readonly =
                this.hasAttribute("readonly");
        }

        if (name === "value") {
            this.readInitialValue();
        }

        if (this.state.initialized) {
            this.scheduleRender();
        }
    }

    parseFirstDay() {
        const value = parseInt(
            this.getAttribute("first-day"),
            10
        );

        return Number.isInteger(value) &&
            value >= 0 &&
            value <= 6
            ? value
            : 0;
    }

    readInitialValue() {
        const value = this.getAttribute("value");

        if (!value) {
            return;
        }

        const date = this.parseDate(value);

        if (date) {
            this.state.selectedDate = date;
            this.state.currentDate = new Date(
                date.getFullYear(),
                date.getMonth(),
                1
            );
        }
    }

    parseDate(value) {
        if (!value) {
            return null;
        }

        const date = new Date(`${value}T00:00:00`);

        return Number.isNaN(date.getTime())
            ? null
            : date;
    }

    formatDate(date) {
        const year =
            date.getFullYear();

        const month =
            String(date.getMonth() + 1)
                .padStart(2, "0");

        const day =
            String(date.getDate())
                .padStart(2, "0");

        return `${year}-${month}-${day}`;
    }

    getDateKey(date) {
        return this.formatDate(date);
    }

    getMonthName(date) {
        return new Intl.DateTimeFormat(
            this.state.locale,
            {
                month: "long",
                year: "numeric"
            }
        ).format(date);
    }

    getWeekdayNames() {
        const base = new Date(2024, 0, 7);

        const names = [];

        for (let i = 0; i < 7; i++) {
            const date = new Date(base);

            date.setDate(
                base.getDate() + i
            );

            names.push(
                new Intl.DateTimeFormat(
                    this.state.locale,
                    {
                        weekday: "short"
                    }
                ).format(date)
            );
        }

        return [
            ...names.slice(this.state.firstDay),
            ...names.slice(0, this.state.firstDay)
        ];
    }

    getCalendarDates() {
        const year =
            this.state.currentDate.getFullYear();

        const month =
            this.state.currentDate.getMonth();

        const first =
            new Date(year, month, 1);

        const last =
            new Date(year, month + 1, 0);

        let start =
            first.getDay() -
            this.state.firstDay;

        if (start < 0) {
            start += 7;
        }

        const total =
            Math.ceil(
                (start + last.getDate()) / 7
            ) * 7;

        const dates = [];

        for (let i = 0; i < total; i++) {
            const date =
                new Date(
                    year,
                    month,
                    1 - start + i
                );

            dates.push(date);
        }

        return dates;
    }

    render() {
        this.shadowRoot.innerHTML = `
            <style>
                :host {
                    display: block;
                    width: 100%;
                    box-sizing: border-box;
                    font-family:
                        Inter,
                        system-ui,
                        -apple-system,
                        BlinkMacSystemFont,
                        "Segoe UI",
                        sans-serif;
                }

                *,
                *::before,
                *::after {
                    box-sizing: border-box;
                }

                .calendar {
                    width: 100%;
                    max-width: 720px;
                    margin: 0 auto;
                    overflow: hidden;
                    border: 1px solid #e5e7eb;
                    border-radius: 16px;
                    background: #ffffff;
                    color: #111827;
                    box-shadow:
                        0 10px 30px
                        rgba(0, 0, 0, .06);
                }

                .calendar.dark {
                    border-color: #374151;
                    background: #111827;
                    color: #f9fafb;
                }

                .header {
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    gap: 12px;
                    padding: 16px;
                    border-bottom: 1px solid #e5e7eb;
                }

                .dark .header {
                    border-color: #374151;
                }

                .title {
                    flex: 1;
                    text-align: center;
                    font-size: 18px;
                    font-weight: 700;
                    text-transform: capitalize;
                }

                button {
                    appearance: none;
                    border: 0;
                    width: 36px;
                    height: 36px;
                    border-radius: 10px;
                    background: #f3f4f6;
                    color: #111827;
                    cursor: pointer;
                    font-size: 18px;
                    transition:
                        background .15s ease,
                        transform .15s ease;
                }

                button:hover {
                    background: #e5e7eb;
                }

                button:active {
                    transform: scale(.95);
                }

                .dark button {
                    background: #1f2937;
                    color: #f9fafb;
                }

                .weekdays,
                .grid {
                    display: grid;
                    grid-template-columns:
                        repeat(7, minmax(0, 1fr));
                }

                .weekdays {
                    padding: 10px 12px 4px;
                }

                .weekday {
                    padding: 6px;
                    text-align: center;
                    color: #6b7280;
                    font-size: 12px;
                    font-weight: 700;
                }

                .grid {
                    gap: 4px;
                    padding: 8px 12px 14px;
                }

                .day {
                    position: relative;
                    min-height: 64px;
                    width: 100%;
                    padding: 8px;
                    border-radius: 10px;
                    background: transparent;
                    text-align: left;
                    font-size: 14px;
                }

                .day.other-month {
                    opacity: .35;
                }

                .day.today {
                    outline: 2px solid #2563eb;
                    outline-offset: -2px;
                }

                .day.selected {
                    background: #2563eb;
                    color: #ffffff;
                }

                .day.has-event::after {
                    content: "";
                    position: absolute;
                    left: 50%;
                    bottom: 7px;
                    width: 5px;
                    height: 5px;
                    border-radius: 50%;
                    background: currentColor;
                    transform: translateX(-50%);
                }

                .dark .day {
                    color: #f9fafb;
                }

                .dark .weekday {
                    color: #9ca3af;
                }

                @media (max-width: 520px) {
                    .calendar {
                        border-radius: 12px;
                    }

                    .header {
                        padding: 12px;
                    }

                    .grid {
                        gap: 2px;
                        padding: 6px;
                    }

                    .day {
                        min-height: 48px;
                        padding: 6px;
                        font-size: 12px;
                    }

                    .weekday {
                        font-size: 10px;
                    }
                }
            </style>

            <section class="calendar">
                <header class="header">
                    <button
                        type="button"
                        data-action="previous"
                        aria-label="Previous month">
                        ‹
                    </button>

                    <div
                        class="title"
                        aria-live="polite">
                    </div>

                    <button
                        type="button"
                        data-action="next"
                        aria-label="Next month">
                        ›
                    </button>
                </header>

                <div class="weekdays"></div>

                <div
                    class="grid"
                    role="grid">
                </div>
            </section>
        `;

        this.container =
            this.shadowRoot.querySelector(".calendar");

        this.header =
            this.shadowRoot.querySelector(".header");

        this.body =
            this.shadowRoot.querySelector(".grid");

        this.bindEvents();
        this.renderCalendar();
    }

    bindEvents() {
        const previous =
            this.shadowRoot.querySelector(
                '[data-action="previous"]'
            );

        const next =
            this.shadowRoot.querySelector(
                '[data-action="next"]'
            );

        previous.addEventListener(
            "click",
            () => this.previousMonth()
        );

        next.addEventListener(
            "click",
            () => this.nextMonth()
        );
    }

    renderCalendar() {
        if (!this.body) {
            return;
        }

        this.container.classList.toggle(
            "dark",
            this.state.theme === "dark"
        );

        this.shadowRoot.querySelector(".title")
            .textContent =
            this.getMonthName(
                this.state.currentDate
            );

        const weekdays =
            this.shadowRoot.querySelector(".weekdays");

        weekdays.innerHTML = "";

        this.getWeekdayNames()
            .forEach(name => {
                const element =
                    document.createElement("div");

                element.className = "weekday";
                element.textContent = name;

                weekdays.appendChild(element);
            });

        this.body.innerHTML = "";

        this.getCalendarDates()
            .forEach(date => {
                this.renderDay(date);
            });
    }

    renderDay(date) {
        const button =
            document.createElement("button");

        const currentMonth =
            date.getMonth() ===
            this.state.currentDate.getMonth() &&
            date.getFullYear() ===
            this.state.currentDate.getFullYear();

        const today =
            this.isToday(date);

        const selected =
            this.isSelected(date);

        const hasEvent =
            this.events.has(
                this.getDateKey(date)
            );

        button.type = "button";
        button.className = "day";

        if (!currentMonth) {
            button.classList.add(
                "other-month"
            );
        }

        if (today) {
            button.classList.add("today");
        }

        if (selected) {
            button.classList.add("selected");
        }

        if (hasEvent) {
            button.classList.add("has-event");
        }

        button.textContent =
            String(date.getDate());

        button.setAttribute(
            "aria-label",
            this.formatDate(date)
        );

        button.setAttribute(
            "role",
            "gridcell"
        );

        button.addEventListener(
            "click",
            () => this.selectDate(date)
        );

        this.body.appendChild(button);
    }

    isToday(date) {
        const now = new Date();

        return (
            date.getFullYear() === now.getFullYear() &&
            date.getMonth() === now.getMonth() &&
            date.getDate() === now.getDate()
        );
    }

    isSelected(date) {
        if (!this.state.selectedDate) {
            return false;
        }

        return (
            this.state.selectedDate.getFullYear() ===
                date.getFullYear() &&
            this.state.selectedDate.getMonth() ===
                date.getMonth() &&
            this.state.selectedDate.getDate() ===
                date.getDate()
        );
    }

    selectDate(date) {
        if (this.state.readonly) {
            return;
        }

        this.state.selectedDate =
            new Date(date);

        this.setAttribute(
            "value",
            this.formatDate(date)
        );

        this.renderCalendar();

        this.dispatchEvent(
            new CustomEvent(
                "change",
                {
                    detail: {
                        date: new Date(date),
                        value: this.formatDate(date)
                    }
                }
            )
        );

        this.dispatchEvent(
            new CustomEvent(
                "dateselect",
                {
                    detail: {
                        date: new Date(date),
                        value: this.formatDate(date)
                    }
                }
            )
        );
    }

    previousMonth() {
        this.state.currentDate =
            new Date(
                this.state.currentDate.getFullYear(),
                this.state.currentDate.getMonth() - 1,
                1
            );

        this.renderCalendar();

        this.dispatchEvent(
            new CustomEvent("navigate", {
                detail: {
                    direction: "previous",
                    date: new Date(
                        this.state.currentDate
                    )
                }
            })
        );
    }

    nextMonth() {
        this.state.currentDate =
            new Date(
                this.state.currentDate.getFullYear(),
                this.state.currentDate.getMonth() + 1,
                1
            );

        this.renderCalendar();

        this.dispatchEvent(
            new CustomEvent("navigate", {
                detail: {
                    direction: "next",
                    date: new Date(
                        this.state.currentDate
                    )
                }
            })
        );
    }

    goToDate(date) {
        const parsed =
            date instanceof Date
                ? new Date(date)
                : this.parseDate(date);

        if (!parsed) {
            return false;
        }

        this.state.currentDate =
            new Date(
                parsed.getFullYear(),
                parsed.getMonth(),
                1
            );

        this.renderCalendar();

        return true;
    }

    setDate(date) {
        const parsed =
            date instanceof Date
                ? new Date(date)
                : this.parseDate(date);

        if (!parsed) {
            return false;
        }

        this.selectDate(parsed);

        return true;
    }

    getDate() {
        return this.state.selectedDate
            ? new Date(this.state.selectedDate)
            : null;
    }

    addEvent(date, data = {}) {
        const parsed =
            date instanceof Date
                ? date
                : this.parseDate(date);

        if (!parsed) {
            return null;
        }

        const key =
            this.getDateKey(parsed);

        const id =
            crypto.randomUUID();

        if (!this.events.has(key)) {
            this.events.set(key, []);
        }

        this.events.get(key).push({
            id,
            date: key,
            ...data
        });

        this.renderCalendar();

        this.dispatchEvent(
            new CustomEvent(
                "eventadd",
                {
                    detail: {
                        id,
                        date: key,
                        data
                    }
                }
            )
        );

        return id;
    }

    removeEvent(id) {
        for (const [date, events] of this.events) {
            const index =
                events.findIndex(
                    event => event.id === id
                );

            if (index === -1) {
                continue;
            }

            const removed =
                events.splice(index, 1)[0];

            if (!events.length) {
                this.events.delete(date);
            }

            this.renderCalendar();

            this.dispatchEvent(
                new CustomEvent(
                    "eventremove",
                    {
                        detail: removed
                    }
                )
            );

            return true;
        }

        return false;
    }

    getEvents(date) {
        const parsed =
            date instanceof Date
                ? date
                : this.parseDate(date);

        if (!parsed) {
            return [];
        }

        return [
            ...(this.events.get(
                this.getDateKey(parsed)
            ) || [])
        ];
    }

    clearEvents() {
        this.events.clear();
        this.renderCalendar();
    }

    setTheme(theme) {
        if (
            theme !== "light" &&
            theme !== "dark"
        ) {
            return false;
        }

        this.setAttribute(
            "theme",
            theme
        );

        return true;
    }

    setLocale(locale) {
        if (!locale) {
            return false;
        }

        this.setAttribute(
            "locale",
            locale
        );

        return true;
    }

    setReadonly(value = true) {
        if (value) {
            this.setAttribute(
                "readonly",
                ""
            );
        } else {
            this.removeAttribute(
                "readonly"
            );
        }
    }

    today() {
        const date = new Date();

        this.state.currentDate =
            new Date(
                date.getFullYear(),
                date.getMonth(),
                1
            );

        this.renderCalendar();

        return this.setDate(date);
    }

    observeResize() {
        if (
            typeof ResizeObserver ===
            "undefined"
        ) {
            return;
        }

        this.resizeObserver =
            new ResizeObserver(() => {
                this.dispatchEvent(
                    new CustomEvent(
                        "resize"
                    )
                );
            });

        this.resizeObserver.observe(
            this
        );
    }

    scheduleRender() {
        if (
            this.renderQueued ||
            this.destroyed
        ) {
            return;
        }

        this.renderQueued = true;

        this.pendingFrame =
            requestAnimationFrame(() => {
                this.renderQueued = false;

                if (!this.destroyed) {
                    this.render();
                }
            });
    }

    destroy() {
        this.destroyed = true;

        if (this.pendingFrame !== null) {
            cancelAnimationFrame(
                this.pendingFrame
            );

            this.pendingFrame = null;
        }

        if (this.resizeObserver) {
            this.resizeObserver.disconnect();
            this.resizeObserver = null;
        }

        this.events.clear();

        this.renderQueued = false;
        this.state.initialized = false;
    }
}

if (!customElements.get("custom-calendar")) {
    customElements.define(
        "custom-calendar",
        Calendar
    );
}

export default Calendar;
