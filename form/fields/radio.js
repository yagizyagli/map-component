/**
 * Professional Radio Field
 *
 * Production Grade Form Field
 *
 * Author: yagizyagli
 */

export default class Radio {

    constructor(form = null) {

        this.form = form;

        this.element = null;

        this.name = "";

        this.group = "";

        this.value = "";

        this.checked = false;

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

        if (
            this.checked &&
            this.form?.fieldRegistry
        ) {

            this.form.fieldRegistry.updateRadioGroup(
                this.group,
                this
            );

        }

    }

    isChecked() {

        return this.element
            ? this.element.checked
            : this.checked;

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
