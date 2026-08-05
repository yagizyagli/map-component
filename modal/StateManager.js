/* ===========================================================
 *
 * STATE MANAGER
 *
 * Production Grade Modal State Manager
 *
 * ===========================================================
 */

export default class StateManager {

    constructor(component = null) {

        this.component = component;

        this.state = {

            open: false,

            loading: false,

            dragging: false,

            resizing: false,

            fullscreen: false

        };

    }

    bind(component) {

        this.component = component;

    }

    set(key, value) {

        if (!(key in this.state))
            return false;

        this.state[key] = Boolean(value);

        this.commit();

        return true;

    }

    get(key) {

        return this.state[key];

    }

    update(values = {}) {

        for (const [key, value] of Object.entries(values)) {

            if (key in this.state) {

                this.state[key] = Boolean(value);

            }

        }

        this.commit();

    }

    isOpen() {

        return this.state.open;

    }

    open() {

        this.state.open = true;

        this.commit();

    }

    close() {

        this.state.open = false;

        this.commit();

    }

    toggle() {

        this.state.open =
            !this.state.open;

        this.commit();

    }

    reset() {

        this.state = {

            open: false,

            loading: false,

            dragging: false,

            resizing: false,

            fullscreen: false

        };

        this.commit();

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

        this.component = null;

    }

}
