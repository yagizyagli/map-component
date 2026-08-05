/* ===========================================================
 *
 * EVENT MANAGER
 *
 * Production Grade Event Registry
 *
 * ===========================================================
 */

export default class EventManager {

    constructor(component = null) {

        this.component = component;

        this.events = new Map();

        this.version = 0;

    }

    bind(component) {

        this.component = component;

    }

    createId() {

        return crypto.randomUUID();

    }

    add(event) {

        this.validate(event);

        const id =
            event.id ??
            this.createId();

        const clone =
            structuredClone(event);

        clone.id = id;

        this.events.set(
            id,
            clone
        );

        this.version++;

        this.commit();

        return id;

    }

    addMany(events = []) {

        for (const event of events) {

            this.add(event);

        }

    }

    update(id, data = {}) {

        const event =
            this.events.get(id);

        if (!event)
            return false;

        Object.assign(
            event,
            data
        );

        this.version++;

        this.commit();

        return true;

    }

    remove(id) {

        if (!this.events.has(id))
            return false;

        this.events.delete(id);

        this.version++;

        this.commit();

        return true;

    }

    clear() {

        this.events.clear();

        this.version++;

        this.commit();

    }

    get(id) {

        return this.events.get(id);

    }

    getAll() {

        return [...this.events.values()];

    }

    getByDate(date) {

        const target =
            new Date(date).toDateString();

        return this.getAll().filter(event =>

            new Date(event.date)
                .toDateString() === target

        );

    }

    has(id) {

        return this.events.has(id);

    }

    count() {

        return this.events.size;

    }

    validate(event) {

        if (
            typeof event !== "object"
        )
            throw new TypeError(
                "Event must be an object."
            );

        if (!event.date)
            throw new Error(
                "Event.date is required."
            );

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

        this.events.clear();

        this.component = null;

    }

}
