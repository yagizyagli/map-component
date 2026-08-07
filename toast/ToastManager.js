/* ===========================================================
 *
 * TOAST MANAGER
 *
 * Production Grade Toast Queue Manager
 *
 * ===========================================================
 */

export default class ToastManager {

    constructor(component = null) {

        this.component = component;

        this.queue = [];

        this.max = 5;

    }

    bind(component) {

        this.component = component;

    }

    add(toast = {}) {

        if (!toast.message)
            return false;

        this.queue.push({

            id: crypto.randomUUID(),

            message: toast.message,

            variant: toast.variant ?? "info",

            duration: toast.duration ?? 4000

        });

        this.limit();

        this.commit();

        return true;

    }

    remove(id) {

        this.queue =
            this.queue.filter(
                item => item.id !== id
            );

        this.commit();

    }

    clear() {

        this.queue = [];

        this.commit();

    }

    getAll() {

        return [
            ...this.queue
        ];

    }

    limit() {

        if (this.queue.length > this.max) {

            this.queue.shift();

        }

    }

    setMax(value) {

        this.max = Number(value) || 5;

        this.limit();

    }

    commit() {

        if (
            this.component &&
            typeof this.component.render === "function"
        ) {

            this.component.render();

        }

    }

    destroy() {

        this.queue = [];

        this.component = null;

    }

}
export default ToastManager;
