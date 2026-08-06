/* ===========================================================
 *
 * FORM STATE
 *
 * Production Grade Form State Manager
 *
 * ===========================================================
 */

export default class FormState {

    constructor(component = null) {

        this.component = component;

        this.reset();

    }

    bind(component) {

        this.component = component;

    }

    set(key, value) {

        this.state[key] = value;

        this.commit();

    }

    get(key) {

        return this.state[key];

    }

    getState() {

        return structuredClone(
            this.state
        );

    }

    update(values = {}) {

        Object.assign(
            this.state,
            values
        );

        this.commit();

    }

    markDirty() {

        this.state.dirty = true;

        this.commit();

    }

    markTouched() {

        this.state.touched = true;

        this.commit();

    }

    markSubmitted() {

        this.state.submitted = true;

        this.commit();

    }

    setValid(valid = true) {

        this.state.valid = Boolean(valid);

        this.commit();

    }

    setLoading(loading = true) {

        this.state.loading = Boolean(loading);

        this.commit();

    }

    setDisabled(disabled = true) {

        this.state.disabled = Boolean(disabled);

        this.commit();

    }

    setReadonly(readonly = true) {

        this.state.readonly = Boolean(readonly);

        this.commit();

    }

    isDirty() {

        return this.state.dirty;

    }

    isTouched() {

        return this.state.touched;

    }

    isSubmitted() {

        return this.state.submitted;

    }

    isValid() {

        return this.state.valid;

    }

    isLoading() {

        return this.state.loading;

    }

    isDisabled() {

        return this.state.disabled;

    }

    isReadonly() {

        return this.state.readonly;

    }

    reset() {

        this.state = {

            dirty: false,

            touched: false,

            submitted: false,

            valid: true,

            loading: false,

            disabled: false,

            readonly: false

        };

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

        this.reset();

        this.component = null;

    }

}
