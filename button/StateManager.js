/* ===========================================================
 *
 * STATE MANAGER
 *
 * Production Grade Button State Manager
 *
 * ===========================================================
 */

export default class StateManager {

    constructor(component = null) {

        this.component = component;

        this.state = {

            disabled: false,

            loading: false,

            pressed: false,

            focused: false,

            hovered: false,

            active: false

        };

    }

    bind(component) {

        this.component = component;

    }

    set(key, value) {

        if (!(key in this.state))
            return;

        this.state[key] = Boolean(value);

        this.commit();

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

    isDisabled() {

        return this.state.disabled;

    }

    isLoading() {

        return this.state.loading;

    }

    isPressed() {

        return this.state.pressed;

    }

    isFocused() {

        return this.state.focused;

    }

    isHovered() {

        return this.state.hovered;

    }

    isActive() {

        return this.state.active;

    }

    reset() {

        Object.keys(this.state).forEach(key => {

            this.state[key] = false;

        });

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
