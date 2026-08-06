/**
 * Professional Checkbox Field
 *
 * Production Grade Form Field
 *
 * Author: yagizyagli
 */

export default class Checkbox {

    constructor(form = null) {

        this.form = form;

        this.element = null;

        this.name = "";

        this.checked = false;

        this.value = true;

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

    setChecked(checked) {

        this.checked = Boolean(checked);

        if (this.element) {

            this.element.checked = this.checked;

        }

    }

    isChecked() {

        return this.element
            ? this.element.checked
            : this.checked;

    }

    toggle() {

        this.setChecked(
            !this.isChecked()
        );

    }

    getValue() {

        return this.isChecked()
            ? this.value
            : null;

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
