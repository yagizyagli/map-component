/* ===========================================================
 *
 * DATASET ENGINE
 *
 * Production Grade Dataset Manager
 *
 * ===========================================================
 */

export default class DatasetManager {

    constructor() {

        this.chart = null;

        this.registry = new Map();

        this.visibility = new Map();

        this.cache = new Map();

        this.version = 0;

        this.batchDepth = 0;

        this.pendingUpdate = false;

    }

    bind(chart) {

        this.chart = chart;

    }

    clone(value) {

        if (typeof structuredClone === "function") {
            return structuredClone(value);
        }

        return JSON.parse(JSON.stringify(value));

    }

    createId() {

        return crypto.randomUUID();

    }

    beginBatch() {

        this.batchDepth++;

    }

    endBatch(updateMode = "none") {

        if (this.batchDepth === 0)
            return;

        this.batchDepth--;

        if (
            this.batchDepth === 0 &&
            this.pendingUpdate
        ) {

            this.pendingUpdate = false;

            this.commit(updateMode);

        }

    }

    queueUpdate(mode = "none") {

        if (this.batchDepth > 0) {

            this.pendingUpdate = true;

            return;

        }

        this.commit(mode);

    }

    has(id) {

        return this.registry.has(id);

    }

    get(id) {

        return this.registry.get(id);

    }

    getAll() {

        return [...this.registry.values()];

    }

    add(dataset) {

        this.validate(dataset);

        const id = dataset.id ?? this.createId();

        const clone = this.clone(dataset);

        clone.id = id;

        this.registry.set(id, clone);

        this.visibility.set(id, true);

        this.cache.set(id, this.clone(clone));

        this.version++;

        this.queueUpdate();

        return id;

    }

    remove(id) {

        if (!this.registry.has(id))
            return false;

        this.registry.delete(id);

        this.visibility.delete(id);

        this.cache.delete(id);

        this.version++;

        this.queueUpdate();

        return true;

    }

    clear() {

        this.registry.clear();

        this.visibility.clear();

        this.cache.clear();

        this.version++;

        this.queueUpdate();

    }

    replace(id, dataset) {

        if (!this.registry.has(id))
            return false;

        this.validate(dataset);

        const clone = this.clone(dataset);

        clone.id = id;

        this.registry.set(id, clone);

        this.cache.set(id, this.clone(clone));

        this.version++;

        this.queueUpdate();

        return true;

    }

    update(id, values) {

        const dataset = this.registry.get(id);

        if (!dataset)
            return false;

        Object.assign(dataset, values);

        this.cache.set(id, this.clone(dataset));

        this.version++;

        this.queueUpdate();

        return true;

    }

    append(id, value) {

        const dataset = this.registry.get(id);

        if (!dataset)
            return false;

        if (!Array.isArray(dataset.data))
            dataset.data = [];

        dataset.data.push(value);

        this.version++;

        this.queueUpdate();

        return true;

    }

    appendMany(id, values = []) {

        const dataset = this.registry.get(id);

        if (!dataset)
            return false;

        if (!Array.isArray(dataset.data))
            dataset.data = [];

        dataset.data.push(...values);

        this.version++;

        this.queueUpdate();

        return true;

    }

    setVisible(id, visible = true) {

        if (!this.registry.has(id))
            return false;

        this.visibility.set(id, visible);

        this.queueUpdate();

        return true;

    }

    isVisible(id) {

        return this.visibility.get(id) !== false;

    }

    toggle(id) {

        return this.setVisible(
            id,
            !this.isVisible(id)
        );

    }

    validate(dataset) {

        if (
            dataset === null ||
            typeof dataset !== "object"
        ) {

            throw new TypeError(
                "Dataset must be an object."
            );

        }

        if (!Array.isArray(dataset.data)) {

            throw new TypeError(
                "Dataset.data must be an array."
            );

        }

    }

    build() {

        return [...this.registry.values()]
            .filter(dataset => this.isVisible(dataset.id))
            .map(dataset => this.clone(dataset));

    }

    commit(mode = "none") {

        if (!this.chart)
            return;

        this.chart.data.datasets = this.build();

        this.chart.update(mode);

    }

    destroy() {

        this.registry.clear();

        this.visibility.clear();

        this.cache.clear();

        this.chart = null;

        this.version = 0;

        this.batchDepth = 0;

        this.pendingUpdate = false;

    }

}
export default DatasetManager;
