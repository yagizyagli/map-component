/* ===========================================================
 *
 * SORT MANAGER
 *
 * Production Grade Sorting Engine
 *
 * ===========================================================
 */

export default class SortManager {

    constructor(component = null) {

        this.component = component;

        this.sorts = [];

        this.collator = new Intl.Collator(
            undefined,
            {
                numeric: true,
                sensitivity: "base"
            }
        );

    }

    bind(component) {

        this.component = component;

    }

    set(field, direction = "asc") {

        this.sorts = [
            {
                field,
                direction
            }
        ];

        this.commit();

    }

    add(field, direction = "asc") {

        const index =
            this.sorts.findIndex(
                item => item.field === field
            );

        if (index !== -1) {

            this.sorts[index].direction =
                direction;

        } else {

            this.sorts.push({
                field,
                direction
            });

        }

        this.commit();

    }

    remove(field) {

        this.sorts =
            this.sorts.filter(
                item =>
                    item.field !== field
            );

        this.commit();

    }

    clear() {

        this.sorts.length = 0;

        this.commit();

    }

    toggle(field) {

        const current =
            this.sorts.find(
                item =>
                    item.field === field
            );

        if (!current) {

            this.set(field, "asc");

            return;

        }

        switch (current.direction) {

            case "asc":

                current.direction = "desc";

                break;

            case "desc":

                this.remove(field);

                return;

        }

        this.commit();

    }

    apply(rows = []) {

        if (!this.sorts.length)
            return rows;

        const clone =
            structuredClone(rows);

        clone.sort((a, b) => {

            for (const sort of this.sorts) {

                const av =
                    a[sort.field];

                const bv =
                    b[sort.field];

                let result = 0;

                if (
                    typeof av === "number" &&
                    typeof bv === "number"
                ) {

                    result = av - bv;

                } else {

                    result =
                        this.collator.compare(
                            String(av ?? ""),
                            String(bv ?? "")
                        );

                }

                if (result !== 0) {

                    return sort.direction === "asc"
                        ? result
                        : -result;

                }

            }

            return 0;

        });

        return clone;

    }

    getAll() {

        return structuredClone(
            this.sorts
        );

    }

    has(field) {

        return this.sorts.some(
            item =>
                item.field === field
        );

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

        this.sorts.length = 0;

        this.component = null;

    }

}
export default SortManager;
