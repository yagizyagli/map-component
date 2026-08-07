/* ===========================================================
 *
 * SELECTION MANAGER
 *
 * Production Grade Selection Engine
 *
 * ===========================================================
 */

export default class SelectionManager {

    constructor(component = null) {

        this.component = component;

        this.selection = new Set();

        this.mode = "single";

    }

    bind(component) {

        this.component = component;

    }

    setMode(mode = "single") {

        if (
            mode !== "single" &&
            mode !== "multiple"
        )
            return;

        this.mode = mode;

        if (
            mode === "single" &&
            this.selection.size > 1
        ) {

            const first =
                this.selection.values().next().value;

            this.selection.clear();

            this.selection.add(first);

        }

        this.commit();

    }

    select(date) {

        const value =
            new Date(date).toISOString();

        if (this.mode === "single") {

            this.selection.clear();

        }

        this.selection.add(value);

        this.commit();

    }

    deselect(date) {

        const value =
            new Date(date).toISOString();

        if (this.selection.delete(value)) {

            this.commit();

        }

    }

    toggle(date) {

        const value =
            new Date(date).toISOString();

        if (this.selection.has(value)) {

            this.selection.delete(value);

        } else {

            if (this.mode === "single") {

                this.selection.clear();

            }

            this.selection.add(value);

        }

        this.commit();

    }

    clear() {

        this.selection.clear();

        this.commit();

    }

    has(date) {

        return this.selection.has(
            new Date(date).toISOString()
        );

    }

    getAll() {

        return [...this.selection]
            .map(value => new Date(value));

    }

    count() {

        return this.selection.size;

    }

    isEmpty() {

        return this.selection.size === 0;

    }

    commit() {

        if (
            !this.component
        )
            return;

        if (
            typeof this.component.render ===
            "function"
        ) {

            this.component.render();

        }

    }

    destroy() {

        this.selection.clear();

        this.component = null;

    }

}
export default SelectionManager;
