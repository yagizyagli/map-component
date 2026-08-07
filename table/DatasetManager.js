/* ===========================================================
 *
 * DATA MANAGER
 *
 * Production Grade Table Data Manager
 *
 * ===========================================================
 */

export default class DataManager {

    constructor(component = null) {

        this.component = component;

        this.rows = [];

        this.cache = [];

        this.version = 0;

        this.batchDepth = 0;

        this.pendingUpdate = false;

    }

    bind(component) {

        this.component = component;

    }

    beginBatch() {

        this.batchDepth++;

    }

    endBatch() {

        if (this.batchDepth === 0)
            return;

        this.batchDepth--;

        if (
            this.batchDepth === 0 &&
            this.pendingUpdate
        ) {

            this.pendingUpdate = false;

            this.commit();

        }

    }

    queueUpdate() {

        if (this.batchDepth) {

            this.pendingUpdate = true;

            return;

        }

        this.commit();

    }

    validate(data) {

        if (!Array.isArray(data))
            throw new TypeError(
                "Table data must be an array."
            );

    }

    set(rows = []) {

        this.validate(rows);

        this.rows = structuredClone(rows);

        this.cache = structuredClone(rows);

        this.version++;

        this.queueUpdate();

    }

    append(row) {

        this.rows.push(
            structuredClone(row)
        );

        this.version++;

        this.queueUpdate();

    }

    appendMany(rows = []) {

        for (const row of rows) {

            this.rows.push(
                structuredClone(row)
            );

        }

        this.version++;

        this.queueUpdate();

    }

    update(index, data = {}) {

        if (!this.rows[index])
            return false;

        Object.assign(
            this.rows[index],
            data
        );

        this.version++;

        this.queueUpdate();

        return true;

    }

    remove(index) {

        if (!this.rows[index])
            return false;

        this.rows.splice(index, 1);

        this.version++;

        this.queueUpdate();

        return true;

    }

    clear() {

        this.rows.length = 0;

        this.cache.length = 0;

        this.version++;

        this.queueUpdate();

    }

    get(index) {

        return this.rows[index] ?? null;

    }

    getAll() {

        return structuredClone(
            this.rows
        );

    }

    count() {

        return this.rows.length;

    }

    isEmpty() {

        return this.rows.length === 0;

    }

    restore() {

        this.rows = structuredClone(
            this.cache
        );

        this.version++;

        this.queueUpdate();

    }

    commit() {

        if (!this.component)
            return;

        if (
            typeof this.component.render === "function"
        ) {

            this.component.render();

        }

    }

    destroy() {

        this.rows.length = 0;

        this.cache.length = 0;

        this.component = null;

    }

}
export default DatasetManager;
