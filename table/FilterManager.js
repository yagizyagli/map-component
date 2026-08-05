/* ===========================================================
 *
 * FILTER MANAGER
 *
 * Production Grade Filtering Engine
 *
 * ===========================================================
 */

export default class FilterManager {

    constructor(component = null) {

        this.component = component;

        this.filters = new Map();

        this.globalFilter = "";

    }

    bind(component) {

        this.component = component;

    }

    set(field, value) {

        this.filters.set(field, value);

        this.commit();

    }

    remove(field) {

        if (!this.filters.has(field))
            return false;

        this.filters.delete(field);

        this.commit();

        return true;

    }

    clear() {

        this.filters.clear();

        this.globalFilter = "";

        this.commit();

    }

    setGlobal(value = "") {

        this.globalFilter = String(value);

        this.commit();

    }

    get(field) {

        return this.filters.get(field);

    }

    has(field) {

        return this.filters.has(field);

    }

    getAll() {

        return new Map(this.filters);

    }

    apply(rows = []) {

        let result = structuredClone(rows);

        if (this.globalFilter) {

            const keyword =
                this.globalFilter.toLowerCase();

            result = result.filter(row =>

                Object.values(row).some(value =>

                    String(value ?? "")
                        .toLowerCase()
                        .includes(keyword)

                )

            );

        }

        for (const [field, value] of this.filters) {

            result = result.filter(row => {

                const current =
                    String(
                        row[field] ?? ""
                    ).toLowerCase();

                return current.includes(
                    String(value)
                        .toLowerCase()
                );

            });

        }

        return result;

    }

    commit() {

        if (
            !this.component
        )
            return;

        if (
            typeof this.component.render === "function"
        ) {

            this.component.render();

        }

    }

    destroy() {

        this.filters.clear();

        this.globalFilter = "";

        this.component = null;

    }

}
