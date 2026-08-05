/* ===========================================================
 *
 * COLUMN MANAGER
 *
 * Production Grade Column Registry
 *
 * ===========================================================
 */

export default class ColumnManager {

    constructor(component = null) {

        this.component = component;

        this.columns = new Map();

        this.order = [];

        this.version = 0;

    }

    bind(component) {

        this.component = component;

    }

    register(column) {

        this.validate(column);

        const id =
            column.id ??
            column.field;

        const clone =
            structuredClone(column);

        clone.id = id;

        this.columns.set(
            id,
            clone
        );

        if (
            !this.order.includes(id)
        ) {

            this.order.push(id);

        }

        this.version++;

        this.commit();

        return id;

    }

    registerMany(columns = []) {

        for (const column of columns) {

            this.register(column);

        }

    }

    remove(id) {

        if (
            !this.columns.has(id)
        )
            return false;

        this.columns.delete(id);

        this.order =
            this.order.filter(
                item => item !== id
            );

        this.version++;

        this.commit();

        return true;

    }

    update(id, data = {}) {

        const column =
            this.columns.get(id);

        if (!column)
            return false;

        Object.assign(
            column,
            data
        );

        this.version++;

        this.commit();

        return true;

    }

    move(id, index) {

        const current =
            this.order.indexOf(id);

        if (current === -1)
            return;

        this.order.splice(
            current,
            1
        );

        this.order.splice(
            index,
            0,
            id
        );

        this.version++;

        this.commit();

    }

    hide(id) {

        return this.update(
            id,
            {
                hidden: true
            }
        );

    }

    show(id) {

        return this.update(
            id,
            {
                hidden: false
            }
        );

    }

    toggle(id) {

        const column =
            this.columns.get(id);

        if (!column)
            return;

        this.update(
            id,
            {
                hidden: !column.hidden
            }
        );

    }

    get(id) {

        return this.columns.get(id);

    }

    has(id) {

        return this.columns.has(id);

    }

    getAll() {

        return this.order
            .map(id =>
                this.columns.get(id)
            )
            .filter(Boolean);

    }

    getVisible() {

        return this.getAll()
            .filter(
                column => !column.hidden
            );

    }

    clear() {

        this.columns.clear();

        this.order.length = 0;

        this.version++;

        this.commit();

    }

    validate(column) {

        if (
            typeof column !== "object"
        )
            throw new TypeError(
                "Column must be an object."
            );

        if (
            !column.field
        )
            throw new Error(
                "Column.field is required."
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

        this.columns.clear();

        this.order.length = 0;

        this.component = null;

    }

}
