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

        this.mode = "multiple";

    }

    bind(component) {

        this.component = component;

    }

    setMode(mode = "multiple") {

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

    select(id) {

        if (this.mode === "single") {

            this.selection.clear();

        }

        this.selection.add(id);

        this.commit();

    }

    deselect(id) {

        if (
            this.selection.delete(id)
        ) {

            this.commit();

        }

    }

    toggle(id) {

        if (
            this.selection.has(id)
        ) {

            this.selection.delete(id);

        } else {

            if (
                this.mode === "single"
            ) {

                this.selection.clear();

            }

            this.selection.add(id);

        }

        this.commit();

    }

    selectAll(rows = []) {

        if (
            this.mode === "single"
        )
            return;

        this.selection.clear();

        for (const row of rows) {

            const id =
                row.id ??
                row.key ??
                row.uuid;

            if (id != null) {

                this.selection.add(id);

            }

        }

        this.commit();

    }

    clear() {

        this.selection.clear();

        this.commit();

    }

    has(id) {

        return this.selection.has(id);

    }

    getAll() {

        return [...this.selection];

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
