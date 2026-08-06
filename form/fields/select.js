/**
 * Professional Select Field
 *
 * Production Grade Form Field
 *
 * Author: yagizyagli
 */

export default class Select {

    constructor(form = null) {

        this.form = form;

        this.element = null;

        this.name = "";

        this.value = "";

        this.options = [];

        this.required = false;

        this.disabled = false;

        this.valid = true;

    }

    bind(form) {

        this.form = form;

    }

    mount(element) {

        this.element = element;

    }

    setOptions(options = []) {

        this.options = [...options];

    }

    setValue(value) {

        this.value = value;

        if (this.element) {

            this.element.value = value;

        }

    }

    getValue() {

        return this.element
            ? this.element.value
            : this.value;

    }

    clear() {

        this.setValue("");

    }

    focus() {

        this.element?.focus();

    }

    blur() {

        this.element?.blur();

    }

    validate() {

        if (
            this.form?.validationManager
        ) {

            return this.form
                .validationManager
                .validateField(this);

        }

        return true;

    }

    destroy() {

        this.options = [];

        this.element = null;

        this.form = null;

    }

}
