/* ===========================================================
 *
 * FOCUS MANAGER
 *
 * Production Grade Focus Engine
 *
 * ===========================================================
 */

export default class FocusManager {

    constructor(component = null) {

        this.component = component;

        this.previousFocus = null;

        this.focusable = [];

    }

    bind(component) {

        this.component = component;

    }

    activate() {

        if (!this.component)
            return;

        this.previousFocus =
            document.activeElement;

        this.refresh();

        this.focusFirst();

    }

    deactivate() {

        if (
            this.previousFocus &&
            typeof this.previousFocus.focus === "function"
        ) {

            this.previousFocus.focus();

        }

    }

    refresh() {

        if (!this.component)
            return;

        const root =
            this.component.shadowRoot ??
            this.component;

        this.focusable = [

            ...root.querySelectorAll(

                `
                button,
                a[href],
                input,
                select,
                textarea,
                [tabindex]:not([tabindex="-1"])
                `

            )

        ].filter(element =>

            !element.disabled

        );

    }

    focusFirst() {

        this.focusable[0]?.focus();

    }

    focusLast() {

        this.focusable.at(-1)?.focus();

    }

    trap(event) {

        if (
            event.key !== "Tab" ||
            this.focusable.length === 0
        )
            return;

        const first = this.focusable[0];

        const last = this.focusable.at(-1);

        if (
            event.shiftKey &&
            document.activeElement === first
        ) {

            event.preventDefault();

            last.focus();

        } else if (

            !event.shiftKey &&
            document.activeElement === last

        ) {

            event.preventDefault();

            first.focus();

        }

    }

    destroy() {

        this.focusable = [];

        this.previousFocus = null;

        this.component = null;

    }

}
