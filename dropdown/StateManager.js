/* ===========================================================
 *
 * STATE MANAGER
 *
 * Production Grade Dropdown State Manager
 *
 * ===========================================================
 */

export default class StateManager {

    constructor(component = null) {

        this.component = component;

        this.state = {

            open: false,

            disabled: false,

            loading: false,

            selectedIndex: -1

        };

    }

    bind(component) {

        this.component = component;

    }

    set(key, value) {

        if (!(key in this.state))
            return false;

        this.state[key] = value;

        this.commit();

        return true;

    }

    get(key) {

        return this.state[key];

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

        this.state.open = !this.state.open;

        this.commit();

    }

    select(index) {

        this.state.selectedIndex = index;

        this.commit();

    }

    reset() {

        this.state = {

            open: false,

            disabled: false,

            loading: false,

            selectedIndex: -1

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
export default StateManager;
