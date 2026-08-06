/**
 * Professional Input Field
 *
 * Production Grade Form Field
 *
 * Author: yagizyagli
 */

export default class Input {

    constructor(form = null) {

        this.form = form;

        this.element = null;

        this.name = "";

        this.type = "text";

        this.value = "";

        this.defaultValue = "";

        this.required = false;

        this.disabled = false;

        this.readonly = false;

        this.valid = true;

    }

    bind(form) {

        this.form = form;

    }

    mount(element) {

        this.element = element;

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

        this.element = null;

        this.form = null;

    }

}
